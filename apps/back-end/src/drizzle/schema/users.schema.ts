import {
  pgTable,
  serial,
  varchar,
  timestamp,
  pgEnum,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

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
    email: varchar('email', { length: 255 }).notNull().unique(), // Unique email
    password: varchar('password', { length: 255 }).notNull(), // Hashed password
    full_name: varchar('full_name', { length: 255 }).notNull(), // User's full name
    role: UserRoleEnum().notNull(), // User role
    status: UserStatusEnum().default('ACTIVE').notNull(), // Account status
    last_login: timestamp('last_login'), // Timestamp for last login
    profile_picture_url: varchar('profile_picture_url', {
      length: 255,
    }), // URL for profile picture
    created_at: timestamp('created_at').defaultNow().notNull(), // Timestamp for account creation
    updated_at: timestamp('updated_at').defaultNow().notNull(), // Timestamp for last update
  },
  (table) => [uniqueIndex('email_idx').on(table.email)],
);
