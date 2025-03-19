CREATE TYPE "public"."role" AS ENUM('SUPER_ADMIN', 'LEAVE_ADMIN', 'WORK_CERTIFICATION_ADMIN', 'CLASS_ATTENDANCE_ADMIN', 'TEACHER', 'GENERAL_STAFF');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"role" "role" NOT NULL,
	"status" "status" DEFAULT 'ACTIVE' NOT NULL,
	"last_login" timestamp,
	"profile_picture_url" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "users" USING btree ("email");