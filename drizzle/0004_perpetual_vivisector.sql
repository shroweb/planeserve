CREATE TABLE "supplier_team_members" (
	"id" text PRIMARY KEY NOT NULL,
	"supplier_company_id" text NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"role" text DEFAULT 'AOG contact' NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "aircraft" ADD COLUMN "propeller_manufacturer" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "aircraft" ADD COLUMN "propeller_type" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "aircraft" ADD COLUMN "archived_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "aircraft" ADD COLUMN "archive_reason" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "aircraft" ADD COLUMN "archive_notes" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_companies" ADD COLUMN "release_capabilities" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
CREATE INDEX "supplier_team_members_company_id_idx" ON "supplier_team_members" USING btree ("supplier_company_id");