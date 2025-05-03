import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
import { students } from './students.schema';
import { relations } from 'drizzle-orm/relations';

export const classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const classesRelations = relations(classes, ({ many }) => ({
  students: many(students),
}));
