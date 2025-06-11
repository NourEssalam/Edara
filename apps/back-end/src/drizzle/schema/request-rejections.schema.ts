import { pgTable, uuid, integer, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { leaveRequests } from './leave-request.schema';

export const requestRejections = pgTable('request_rejections', {
  id: uuid('id').primaryKey().defaultRandom(),
  requestId: uuid('request_id').notNull(),
  userId: integer('user_id').notNull(),
  adminId: integer('admin_id').notNull(),
  reason: text('reason').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const requestRejectionsRelations = relations(
  requestRejections,
  ({ one }) => ({
    leaveRequest: one(leaveRequests, {
      fields: [requestRejections.requestId],
      references: [leaveRequests.id],
    }),
  }),
);
