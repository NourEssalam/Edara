import {
  pgTable,
  uuid,
  text,
  varchar,
  date,
  integer,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { relations } from 'drizzle-orm';
import { LeaveType, RequestStatus } from '@repo/shared-types';

export const leaveTypeEnum = pgEnum(
  'leave_type',
  Object.values(LeaveType) as [string, ...string[]],
);

export const statusEnum = pgEnum(
  'status',
  Object.values(RequestStatus) as [string, ...string[]],
);

// 2. Define schema
export const leaveRequests = pgTable('leave_requests', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  leaveType: leaveTypeEnum('leave_type').notNull(),
  matricule: varchar('matricule', { length: 10 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),

  grade: varchar('grade', { length: 50 }).notNull(),
  jobPlan: varchar('job_plan', { length: 100 }).notNull(), // only for super admin
  benefitText: text('benefit_text'),
  durationFrom: date('duration_from').notNull(),
  durationTo: date('duration_to').notNull(),
  leaveYear: integer('leave_year').notNull(),
  leaveAddress: text('leave_address'),
  postalCode: varchar('postal_code', { length: 10 }),
  phone: varchar('phone', { length: 20 }),
  attachedDocs: text('attached_docs'),
  status: statusEnum('status').default('PENDING'),
  // adminComment: text('admin_comment'),

  createdAt: timestamp('created_at').defaultNow(),
});

export const leaveRequestsRelations = relations(leaveRequests, ({ one }) => ({
  user: one(users, {
    fields: [leaveRequests.userId],
    references: [users.id],
  }),
}));
