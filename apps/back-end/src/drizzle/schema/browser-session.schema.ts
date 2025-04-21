import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { relations } from 'drizzle-orm';

export const browserSessions = pgTable('browser_sessions', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  hashed_refresh_token: text('hashed_refresh_token'),
});

export const browserSessionsRelations = relations(
  browserSessions,
  ({ one }) => ({
    user: one(users, {
      fields: [browserSessions.user_id],
      references: [users.id],
    }),
  }),
);
