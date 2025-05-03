import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';
import { classes } from './classes.schema';
import { relations } from 'drizzle-orm/relations';

export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  class_id: integer('class_id')
    .references(() => classes.id)
    .notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const studentsRelations = relations(students, ({ one }) => ({
  class: one(classes, {
    fields: [students.class_id],
    references: [classes.id],
  }),
}));
