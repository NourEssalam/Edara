import {
  pgTable,
  timestamp,
  integer,
  serial,
  unique,
} from 'drizzle-orm/pg-core';
import { classes } from './classes.schema';
import { relations } from 'drizzle-orm/relations';
import { courses } from './courses.schema';

export const classCourses = pgTable(
  'class_courses',
  {
    id: serial('id').primaryKey(), // Add a single primary key
    class_id: integer('class_id')
      .references(() => classes.id, { onDelete: 'cascade' })
      .notNull(),
    course_id: integer('course_id')
      .references(() => courses.id, { onDelete: 'cascade' })
      .notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    // Change from primaryKey to unique constraint
    unique('class_course_unique').on(t.class_id, t.course_id),
  ],
);

export const classCoursesRelations = relations(classCourses, ({ one }) => ({
  class: one(classes, {
    fields: [classCourses.class_id],
    references: [classes.id],
  }),
  course: one(courses, {
    fields: [classCourses.course_id],
    references: [courses.id],
  }),
}));
