import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm/relations';
import { classCourses } from './courses-of-class.schema';
import { teacherCourses } from './courses-of-teacher.schema';

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
  classesToCourses: many(classCourses),
  teachersToCourses: many(teacherCourses),
}));
