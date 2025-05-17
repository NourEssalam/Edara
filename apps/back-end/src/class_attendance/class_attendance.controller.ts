import { ClassAttendanceService } from './class_attendance.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from '@repo/shared-types';
import { parse } from 'path';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateCourseDto } from './dto/create-course.dto';

@Controller('class-attendance')
export class ClassAttendanceController {
  constructor(
    private readonly classAttendanceService: ClassAttendanceService,
  ) {}

  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Post('create-class')
  @UseInterceptors(FileInterceptor('file'))
  async createClassWithStudents(
    @UploadedFile() file: Express.Multer.File,
    @Body('class_name') className: string,
  ) {
    return this.classAttendanceService.processClassCreation(file, className);
  }

  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Get('classes')
  async getAllClasses() {
    return this.classAttendanceService.getClasses();
  }

  // update class
  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Patch('classes/:classId')
  async updateClass(
    @Param('classId') classId: string,
    @Body('class_name') className: string,
  ) {
    const class_id = parseInt(classId, 10);
    return this.classAttendanceService.updateClass(class_id, className);
  }

  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Delete('classes/:classId')
  async deleteClass(@Param('classId') classId: string) {
    const class_id = parseInt(classId, 10);
    return this.classAttendanceService.deleteClass(class_id);
  }

  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Get('class/:classId')
  async getClass(@Param('classId') classId: string) {
    const class_id = parseInt(classId, 10);
    return this.classAttendanceService.getClass(class_id);
  }

  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN, UserRole.TEACHER)
  @Get('class/:classId/students')
  async getStudents(@Param('classId') classId: string) {
    const class_id = parseInt(classId, 10);
    return this.classAttendanceService.getClassStudents(class_id);
  }

  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Post('class/:classId/students')
  async addStudentsToClass(
    @Param('classId') classId: string,
    @Body() createStudentDto: CreateStudentDto,
  ) {
    const class_id = parseInt(classId, 10);
    console.log('createStudentDto', createStudentDto);
    return this.classAttendanceService.addStudentsToClass(
      class_id,
      createStudentDto,
    );
  }

  // UPDATE STUDENT
  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Patch('class/:studentId/students/')
  async updateStudent(
    @Param('studentId') studentId: string,
    @Body() createStudentDto: CreateStudentDto,
  ) {
    const student_id = parseInt(studentId, 10);
    return this.classAttendanceService.updateStudent(
      student_id,
      createStudentDto,
    );
  }

  // DELETE STUDENT
  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Delete('class/:studentId/students/')
  async deleteStudent(@Param('studentId') studentId: string) {
    const student_id = parseInt(studentId, 10);
    return this.classAttendanceService.deleteStudent(student_id);
  }

  // get courses list
  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Get('courses')
  async getCourses() {
    return this.classAttendanceService.getCourses();
  }

  // create course
  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Post('create-course')
  async createCourse(@Body() courseDto: CreateCourseDto) {
    return this.classAttendanceService.createCourse(courseDto);
  }

  // update course
  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Patch('update-course/:courseId')
  async updateCourse(
    @Param('courseId') courseId: string,
    @Body() courseDto: CreateCourseDto,
  ) {
    const course_id = parseInt(courseId, 10);
    return this.classAttendanceService.updateCourse(course_id, courseDto);
  }

  // get teachers list
  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Get('teachers')
  async getTeachers() {
    return this.classAttendanceService.getTeachers();
  }
  // get teachers of a course
  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Get('teachers/:courseId')
  async getTeachersOfCourse(@Param('courseId') courseId: string) {
    const course_id = parseInt(courseId, 10);
    return this.classAttendanceService.getTeachersOfCourse(course_id);
  }

  // delete course
  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Delete('delete-course/:courseId')
  async deleteCourse(@Param('courseId') courseId: string) {
    const course_id = parseInt(courseId, 10);
    return this.classAttendanceService.deleteCourse(course_id);
  }

  /******************************* */
  /* Courses classes */
  /***************************** */

  // get paginated courses
  // Get all courses with pagination and search
  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Get('paginated-courses')
  async getPaginatedCourses(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
    @Query('search') search = '',
    @Query('class_id') class_id: string,
  ) {
    const classId = parseInt(class_id, 10);
    return this.classAttendanceService.getPaginatedCourses(
      page,
      pageSize,
      search,
      classId,
    );
  }

  // get assigned courses of a class
  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Get('assigned-courses/:classId')
  async getAssignedCourses(@Param('classId') classId: string) {
    const class_id = parseInt(classId, 10);
    return this.classAttendanceService.getAssignedCourses(class_id);
  }

  // assign course to a class
  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Post('assignCourseToClass')
  async assignCourse(@Body() body: { classId: string; courseId: string }) {
    console.log('body', body);
    const class_id = parseInt(body.classId, 10);
    const course_id = parseInt(body.courseId, 10);
    return this.classAttendanceService.assignCourseToClass(class_id, course_id);
  }

  // remove course from a class
  @Roles(UserRole.CLASS_ATTENDANCE_ADMIN)
  @Delete('removeCourseFromClass')
  async removeCourse(@Body() body: { classId: string; courseId: string }) {
    console.log('body', body);
    const class_id = parseInt(body.classId, 10);
    const course_id = parseInt(body.courseId, 10);
    return this.classAttendanceService.removeCourseFromClass(
      class_id,
      course_id,
    );
  }
}
