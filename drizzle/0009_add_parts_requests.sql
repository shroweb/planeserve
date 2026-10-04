CREATE TABLE IF NOT EXISTS "parts_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"company" text,
	"aircraft_type" text NOT NULL,
	"aircraft_reg" text,
	"part_number" text NOT NULL,
	"part_description" text,
	"condition" text DEFAULT 'Any Certified (Fastest)' NOT NULL,
	"urgency" text DEFAULT 'AOG Grounded' NOT NULL,
	"delivery_location" text NOT NULL,
	"additional_notes" text,
	"status" text DEFAULT 'New' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "parts_requests_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "parts_requests_email_idx" ON "parts_requests" USING btree ("email");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "parts_requests_status_idx" ON "parts_requests" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "parts_requests_created_at_idx" ON "parts_requests" USING btree ("created_at");
