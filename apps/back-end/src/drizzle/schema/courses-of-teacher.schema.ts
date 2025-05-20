import {
  pgTable,
  serial,
  timestamp,
  integer,
  unique,
} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm/relations';
import { courses } from './courses.schema';
import { teachers } from './teachers.schema';

export const teacherCourses = pgTable(
  'teacher_courses',
  {
    id: serial('id').primaryKey(),
    teacher_id: integer('teacher_id')
      .references(() => teachers.id, { onDelete: 'cascade' })
      .notNull(),
    course_id: integer('course_id')
      .references(() => courses.id, { onDelete: 'cascade' })
      .notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [unique('teacher_course_unique').on(t.teacher_id, t.course_id)],
);

export const teacherCoursesRelations = relations(teacherCourses, ({ one }) => ({
  teachers: one(teachers, {
    fields: [teacherCourses.teacher_id],
    references: [teachers.id],
  }),
  courses: one(courses, {
    fields: [teacherCourses.course_id],
    references: [courses.id],
  }),
}));
