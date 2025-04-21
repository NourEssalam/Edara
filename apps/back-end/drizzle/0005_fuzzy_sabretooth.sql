CREATE TABLE "browser_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"hashed_refresh_token" text
);
--> statement-breakpoint
ALTER TABLE "browser_sessions" ADD CONSTRAINT "browser_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;