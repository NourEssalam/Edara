import {
  pgTable,
  serial,
  timestamp,
  integer,
  date,
  text,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm/relations';
import { classCourses } from './courses-of-class.schema';
import { attendanceRecords } from './attendance-record.schema';

export const courseSessions = pgTable('course_sessions', {
  id: serial('id').primaryKey(),
  class_course_id: integer('class_course_id')
    .references(() => classCourses.id, { onDelete: 'cascade' })
    .notNull(),
  date: date('date').notNull(),
  topic: text('topic'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const courseSessionsRelations = relations(
  courseSessions,
  ({ one, many }) => ({
    classCourse: one(classCourses, {
      fields: [courseSessions.class_course_id],
      references: [classCourses.id],
    }),
    attendanceRecords: many(attendanceRecords),
  }),
);
