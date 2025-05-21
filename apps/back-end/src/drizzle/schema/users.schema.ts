import {
  pgTable,
  serial,
  varchar,
  timestamp,
  pgEnum,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { passwordResetTokens } from './reset-password.schema';
import { browserSessions } from './browser-session.schema';
import { teachers } from './teachers.schema';
import { UserRole, UserStatus } from '@repo/shared-types';

// Define the user roles as an enum
export const UserRoleEnum = pgEnum(
  'role',
  Object.values(UserRole) as [string, ...string[]],
);

// Define the user status as an enum
export const UserStatusEnum = pgEnum(
  'status',
  Object.values(UserStatus) as [string, ...string[]],
);

// Define the users table schema
export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(), // Auto-incrementing primary key
    // 🔐 Identity fields
    matricule: varchar('matricule', { length: 10 }).notNull().unique(),
    cin: varchar('cin', { length: 8 }).notNull().unique(), // 8-digit Tunisian ID
    email: varchar('email', { length: 255 }).notNull().unique(), // Unique email
    full_name: varchar('full_name', { length: 255 }).notNull(), // User's full name
    profile_picture_url: varchar('profile_picture_url', {
      length: 255,
    }), // URL of the user's profile picture
    // 🔑 Authentication fields
    status: UserStatusEnum().default('ACTIVE').notNull(), // Account status
    password: varchar('password', { length: 255 }).notNull(), // Hashed password
    role: UserRoleEnum().notNull().default('GENERAL_STAFF'), // User role
    last_login: timestamp('last_login'), // Timestamp for last login
    // 📅 Timestamps
    created_at: timestamp('created_at').defaultNow().notNull(), // Timestamp for account creation
    updated_at: timestamp('updated_at').defaultNow().notNull(), // Timestamp for last update
  },
  (table) => [
    uniqueIndex('email_idx').on(table.email),
    uniqueIndex('matricule_idx').on(table.matricule),
    uniqueIndex('cin_idx').on(table.cin),
  ],
);

export const usersRelations = relations(users, ({ one, many }) => ({
  passwordResetTokens: one(passwordResetTokens),
  browserSessions: many(browserSessions),
  teacher: one(teachers, {
    fields: [users.id],
    references: [teachers.user_id],
  }),
}));
