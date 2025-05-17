import {
  pgTable,
  serial,
  timestamp,
  integer,
  index,
} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm/relations';
import { teacherCourses } from './courses-of-teacher.schema';
import { users } from './users.schema';

export const teachers = pgTable(
  'teachers',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull()
      .unique(), // One user -> One teacher row max
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [index('user_id_idx').on(t.user_id)],
);

export const teachersRelations = relations(teachers, ({ many, one }) => ({
  teacherCourses: many(teacherCourses),
  user: one(users, {
    fields: [teachers.user_id],
    references: [users.id],
  }),
}));
