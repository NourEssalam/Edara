import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { classes } from 'src/drizzle/schema/classes.schema';
import { students } from 'src/drizzle/schema/students.schema';
import type { Database } from 'src/drizzle/types/drizzle';
import csv from 'csv-parser';

import * as XLSX from 'xlsx';
import { Readable } from 'stream';
import { eq, ilike, inArray, and, notInArray } from 'drizzle-orm';
import { validateStudent } from './lib/students-data-validator';
import { CreateStudentDto } from './dto/create-student.dto';
import { courses } from 'src/drizzle/schema/courses.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { teacherCourses } from 'src/drizzle/schema/courses-of-teacher.schema';
import { teachers } from 'src/drizzle/schema/teachers.schema';
import { users } from 'src/drizzle/schema/users.schema';
import { classCourses } from 'src/drizzle/schema/courses-of-class.schema';

@Injectable()
export class ClassAttendanceService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  // Clases crud operations
  async processClassCreation(file: Express.Multer.File, className: string) {
    // Step 1: Check if class already exists
    const existingClass = await this.db
      .select()
      .from(classes)
      .where(eq(classes.name, className));

    if (existingClass.length > 0) {
      throw new UnauthorizedException('القسم موجود بالفعل');
    }

    // Step 2: Parse student data from file
    const studentsBulk = await this.parseStudents(file);

    console.log(studentsBulk[2]?.cin);
    console.log(typeof studentsBulk[2]?.cin);

    // Step 3: Check for invalid student entries before creating the class
    const invalidStudents = studentsBulk
      .map((student, index) => ({ student, index }))
      .filter(({ student }) => !validateStudent(student));

    if (invalidStudents.length > 0) {
      const errorMessages = invalidStudents.map(
        ({ index }) => `الطالب رقم ${index + 1}`,
      );
      throw new UnauthorizedException(
        `البيانات غير صالحة في: ${errorMessages.join(', ')}`,
      );
    }

    // 🔍 Step 2.2: Check for duplicate CINs in uploaded file
    const seen = new Set<string>();
    const duplicates = studentsBulk.filter(({ cin }) => {
      const normalized = String(cin).trim();
      if (seen.has(normalized)) return true;
      seen.add(normalized);
      return false;
    });

    if (duplicates.length > 0) {
      throw new UnauthorizedException('يوجد تكرار في بيانات الطلاب داخل الملف');
    }

    // Step 4: Check for duplicate students by CIN
    const cins = studentsBulk.map((student) => student.cin);

    if (cins.length > 0) {
      const existingStudents = await this.db
        .select()
        .from(students)
        .where(inArray(students.cin, cins));

      if (existingStudents.length > 0) {
        throw new UnauthorizedException('بعض الطلاب موجودون بالفعل');
      }
    }

    // Step 5: Create the new class
    const newClass = await this.db
      .insert(classes)
      .values({ name: className })
      .returning({ classId: classes.id });

    if (!newClass[0]) {
      throw new Error('No class ID was found');
    }

    // Step 6: Format student data with class ID
    const formatted = studentsBulk.map((student) => {
      if (!newClass[0]?.classId) {
        throw new UnauthorizedException('No class ID was found');
      }
      return {
        cin: student.cin,
        first_name: student.first_name,
        last_name: student.last_name,
        class_id: newClass[0].classId,
      };
    });

    // Step 7: Insert students into the database
    await this.db.insert(students).values(formatted);

    return { message: 'Success' };
  }

  // Parse student data from file
  private async parseStudents(file: Express.Multer.File) {
    const ext = file.originalname.split('.').pop();

    if (ext === 'csv') {
      return await this.parseCSV(file.buffer);
    } else if (ext === 'xlsx' || ext === 'xls') {
      return this.parseExcel(file.buffer);
    }

    throw new Error('Unsupported file type');
  }
  // Parse student data from Excel file
  private parseExcel(buffer: Buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];

    if (!sheetName || !workbook.Sheets[sheetName]) {
      throw new Error('No valid sheet found in Excel file');
    }

    const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Normalize and cast all fields to string
    const cleanedData = rawData.map((row: any) => ({
      cin: String(row.cin || '').trim(),
      first_name: String(row.first_name || '').trim(),
      last_name: String(row.last_name || '').trim(),
    }));

    return cleanedData;
  }

  // Parse student data from CSV
  private async parseCSV(buffer: Buffer): Promise<
    Array<{
      cin: string;
      first_name: string;
      last_name: string;
    }>
  > {
    const rows: any[] = [];

    const detectHeader = async (): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        let firstLine: any = null;
        Readable.from(buffer)
          .pipe(csv({ headers: false }))
          .on('data', (row) => {
            firstLine = Object.values(row);
            // Check if it contains likely headers
            const isHeader =
              firstLine.includes('cin') ||
              firstLine.includes('first_name') ||
              firstLine.includes('last_name');
            resolve(isHeader);
          })
          .on('error', reject);
      });
    };

    const hasHeader = await detectHeader();

    return new Promise((resolve, reject) => {
      Readable.from(buffer)
        .pipe(csv({ headers: hasHeader ? undefined : false }))
        .on('data', (row) => {
          let record: any;
          if (hasHeader) {
            // row is { cin: ..., first_name: ..., last_name: ... }
            record = {
              cin: row['cin'],
              first_name: row['first_name'],
              last_name: row['last_name'],
            };
          } else {
            const entries = Object.values(row);
            if (entries.length >= 2) {
              record = {
                cin: entries[0],
                first_name: entries[1],
                last_name: entries[2],
              };
            }
          }

          if (record) {
            rows.push(record);
          }
        })
        .on('end', () => resolve(rows))
        .on('error', reject);
    });
  }

  async getClasses() {
    return await this.db.select().from(classes);
  }

  async updateClass(classId: number, className: string) {
    return await this.db
      .update(classes)
      .set({ name: className })
      .where(eq(classes.id, classId));
  }

  async deleteClass(classId: number) {
    return await this.db.delete(classes).where(eq(classes.id, classId));
  }

  async getClass(classId: number) {
    const classe = await this.db
      .select()
      .from(classes)
      .where(eq(classes.id, classId));
    return classe[0];
  }

  // get class students
  async getClassStudents(classId: number) {
    const studentsData = await this.db
      .select()
      .from(students)
      .where(eq(students.class_id, classId));
    return studentsData;
  }

  async addStudentsToClass(classId: number, studentData: CreateStudentDto) {
    const student = await this.db
      .select()
      .from(students)
      .where(eq(students.cin, studentData.cin));
    if (student.length > 0) {
      throw new UnauthorizedException('الطالب موجود بالفعل');
    }
    return await this.db
      .insert(students)
      .values({ ...studentData, class_id: classId });
  }

  // update student
  async updateStudent(studentId: number, studentData: CreateStudentDto) {
    return await this.db
      .update(students)
      .set({ ...studentData })
      .where(eq(students.id, studentId));
  }

  async deleteStudent(studentId: number) {
    return await this.db.delete(students).where(eq(students.id, studentId));
  }

  // get courses
  async getCourses() {
    return await this.db.select().from(courses);
  }

  // get teachers
  async getTeachers() {
    // const teacherList = await this.db.query.teachers.findMany({
    //   columns: {
    //     id: true,
    //   },
    //   with: {
    //     user: {
    //       columns: {
    //         full_name: true,
    //       },
    //     },
    //   },
    // });
    const teachersList = await this.db
      .select({
        id: teachers.id,
        name: users.full_name,
      })
      .from(teachers)
      .leftJoin(users, eq(teachers.user_id, users.id));

    return teachersList;
  }

  // get all teacher'snameand id  of a course [{id:1,name:'ali'},...]
  async getTeachersOfCourse(courseId: number) {
    const teachersList = await this.db
      .select({
        id: teachers.id,
      })
      .from(teachers)
      .leftJoin(users, eq(teachers.user_id, users.id))
      .leftJoin(teacherCourses, eq(teachers.id, teacherCourses.teacher_id))
      .where(eq(teacherCourses.course_id, courseId));

    // make it and array of string ['1','2','3']
    const teacherIds = teachersList.map((teacher) => String(teacher.id));
    return teacherIds;
  }

  // create course
  async createCourse(courseDto: CreateCourseDto) {
    // find the course name
    const existingCourse = await this.db
      .select()
      .from(courses)
      .where(eq(courses.name, courseDto.course_name));

    if (existingCourse.length > 0) {
      throw new BadRequestException('اسم الدرس موجود بالفعل');
    }
    // Step 1: Insert the course
    const createdCourse = await this.db
      .insert(courses)
      .values({ name: courseDto.course_name })
      .returning({ id: courses.id }); // To get the inserted course's ID

    if (!createdCourse || !createdCourse[0] || !createdCourse[0].id) {
      throw new NotFoundException('Course not found');
    }

    // Step 2: Insert into teacherCourses
    const teacherCourseEntries = courseDto.teacher_ids.map((teacherId) => ({
      course_id: createdCourse[0]!.id,
      teacher_id: parseInt(teacherId), // Ensure the ID is a number
    }));

    await this.db.insert(teacherCourses).values(teacherCourseEntries);

    return createdCourse;
  }

  async updateCourse(courseId: number, courseDto: CreateCourseDto) {
    // // Step 1: Check if course exists
    // const existingCourse = await this.db
    //   .select()
    //   .from(courses)
    //   .where(eq(courses.id, courseId));

    // if (existingCourse.length === 0) {
    //   throw new NotFoundException('Course not found');
    // }

    // Step 2: Update the course name
    await this.db
      .update(courses)
      .set({ name: courseDto.course_name })
      .where(eq(courses.id, courseId));

    // Step 3: Delete old teacher-course relations
    await this.db
      .delete(teacherCourses)
      .where(eq(teacherCourses.course_id, courseId));

    // Step 4: Insert new teacher-course relations
    const newTeacherCourses = courseDto.teacher_ids.map((teacherId) => ({
      course_id: courseId,
      teacher_id: parseInt(teacherId),
    }));

    await this.db.insert(teacherCourses).values(newTeacherCourses);

    return { message: 'Course updated successfully' };
  }

  // delete course
  async deleteCourse(courseId: number) {
    return await this.db.delete(courses).where(eq(courses.id, courseId));
  }

  /******************************* */
  /* Courses classes */
  /***************************** */

  async getPaginatedCourses(page, pageSize, search, classId: number) {
    const offset = (page - 1) * pageSize;

    // Subquery: get course IDs already assigned to this class
    const assignedCoursesSubquery = this.db
      .select({ course_id: classCourses.course_id })
      .from(classCourses)
      .where(eq(classCourses.class_id, classId));

    // Main query: fetch only unassigned courses (with optional search)
    const searchQuery = this.db
      .select({ id: courses.id, name: courses.name })
      .from(courses)
      .where(
        and(
          notInArray(courses.id, assignedCoursesSubquery),
          search ? ilike(courses.name, `%${search}%`) : undefined,
        ),
      )
      .as('searchQuery');

    const total = await this.db.$count(searchQuery);

    const getCourses = await this.db
      .select()
      .from(searchQuery)
      .limit(pageSize * 1)
      .offset(offset);

    const totalPages = Math.ceil(total / pageSize);

    return {
      getCourses,
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  async getAssignedCourses(class_id: number) {
    const assignedCourses = await this.db
      .select({
        id: courses.id,
        name: courses.name,
      })
      .from(classCourses)
      .innerJoin(courses, eq(classCourses.course_id, courses.id))
      .where(eq(classCourses.class_id, class_id));

    return assignedCourses;
  }

  // assign course to class
  async assignCourseToClass(class_id: number, course_id: number) {
    // Prevent duplicates
    const exists = await this.db
      .select()
      .from(classCourses)
      .where(
        and(
          eq(classCourses.class_id, class_id),
          eq(classCourses.course_id, course_id),
        ),
      )
      .limit(1);

    if (exists.length > 0) {
      throw new BadRequestException('Course already assigned to this class.');
    }

    // Insert assignment
    await this.db.insert(classCourses).values({
      class_id,
      course_id,
    });

    return { message: 'Course assigned to class successfully' };
  }

  // remove course from class
  async removeCourseFromClass(class_id: number, course_id: number) {
    return await this.db
      .delete(classCourses)
      .where(
        and(
          eq(classCourses.class_id, class_id),
          eq(classCourses.course_id, course_id),
        ),
      );
  }
}
