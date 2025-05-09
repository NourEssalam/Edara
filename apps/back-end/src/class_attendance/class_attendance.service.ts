import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { classes } from 'src/drizzle/schema/classes.schema';
import { students } from 'src/drizzle/schema/students.schema';
import type { Database } from 'src/drizzle/types/drizzle';
import csv from 'csv-parser';

import * as XLSX from 'xlsx';
import { Readable } from 'stream';
import { eq, inArray } from 'drizzle-orm';
@Injectable()
export class ClassAttendanceService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  // Clases crud operations
  async processClassCreation(file: Express.Multer.File, className: string) {
    // step  0 : check  class existence
    const existingClass = await this.db
      .select()
      .from(classes)
      .where(eq(classes.name, className));

    if (existingClass.length > 0) {
      throw new UnauthorizedException('القسم  موجود بالفعل');
    }

    // Step 2: Parse file
    const studentsBulk = await this.parseStudents(file);

    // get cins from studentsBulk
    const cins = studentsBulk.map((student) => student.cin);

    // If there are CINs to check
    if (cins.length > 0) {
      const existingStudents = await this.db
        .select()
        .from(students)
        .where(inArray(students.cin, cins));

      if (existingStudents.length > 0) {
        // Optional: Create a more detailed error message showing which CINs exist
        // const existingCins = existingStudents.map((student) => student.cin);
        throw new UnauthorizedException('بعض الطلاب موجودون بالفعل');
        // Or simply: throw new UnauthorizedException('بعض الطلاب موجودون بالفعل');
      }
    }
    // Save data in the database after checking
    const newClass = await this.db
      .insert(classes)
      .values({ name: className })
      .returning({ classId: classes.id });

    // Step 3: Insert students with class_id
    const formatted = studentsBulk.map((student) => {
      if (!newClass[0]) {
        throw new Error('No class ID was found');
      }
      return {
        cin: student.cin,
        first_name: student.first_name,
        last_name: student.last_name,
        class_id: newClass[0].classId,
      };
    });

    await this.db.insert(students).values(formatted);

    return { message: 'Success' };
  }

  private async parseStudents(file: Express.Multer.File) {
    const ext = file.originalname.split('.').pop();

    if (ext === 'csv') {
      return await this.parseCSV(file.buffer);
    } else if (ext === 'xlsx' || ext === 'xls') {
      return this.parseExcel(file.buffer);
    }

    throw new Error('Unsupported file type');
  }

  private parseExcel(buffer: Buffer) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];

    if (!sheetName || !workbook.Sheets[sheetName]) {
      throw new Error('No valid sheet found in Excel file');
    }

    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    return data as Array<{
      cin: string;
      first_name: string;
      last_name: string;
    }>;
  }

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
}
