import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { courseSessions } from './course-session.schema';
// import { relations } from 'drizzle-orm/relations';
import { students } from './students.schema';
import { AttendanceStatus } from '@repo/shared-types';
import { relations } from 'drizzle-orm';

export const AttendanceStatusEnum = pgEnum(
  'attendance_status',
  Object.values(AttendanceStatus) as [string, ...string[]],
);

export const attendanceRecords = pgTable('attendance_records', {
  id: serial('id').primaryKey(),
  course_session_id: integer('course_session_id')
    .references(() => courseSessions.id, { onDelete: 'cascade' })
    .notNull(),
  student_id: integer('student_id')
    .references(() => students.id, { onDelete: 'cascade' })
    .notNull(),
  attendance_status: AttendanceStatusEnum().notNull(),
  // note: text('note'), // Optional note about the attendance
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const attendanceRecordsRelations = relations(
  attendanceRecords,
  ({ one }) => ({
    courseSession: one(courseSessions, {
      fields: [attendanceRecords.course_session_id],
      references: [courseSessions.id],
    }),
    student: one(students, {
      fields: [attendanceRecords.student_id],
      references: [students.id],
    }),
  }),
);
