import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';
import { classes } from './classes.schema';
import { relations } from 'drizzle-orm/relations';
import { attendanceRecords } from './attendance-record.schema';

export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  cin: varchar('cin', { length: 8 }).notNull().unique(),
  first_name: varchar('first_name', { length: 255 }).notNull(),
  last_name: varchar('last_name', { length: 255 }).notNull(),
  class_id: integer('class_id')
    .references(() => classes.id, { onDelete: 'cascade' })
    .notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const studentsRelations = relations(students, ({ one, many }) => ({
  class: one(classes, {
    fields: [students.class_id],
    references: [classes.id],
  }),
  attendanceRecords: many(attendanceRecords),
}));
