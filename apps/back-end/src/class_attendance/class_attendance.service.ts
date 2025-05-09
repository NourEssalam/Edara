import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { classes } from 'src/drizzle/schema/classes.schema';
import { students } from 'src/drizzle/schema/students.schema';
import type { Database } from 'src/drizzle/types/drizzle';
import csv from 'csv-parser';

import * as XLSX from 'xlsx';
import { Readable } from 'stream';
import { eq, inArray } from 'drizzle-orm';
import { validateStudent } from './lib/students-data-validator';
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
}
