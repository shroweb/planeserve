CREATE TYPE "public"."message_sender_type" AS ENUM('subscriber', 'admin', 'system');--> statement-breakpoint
CREATE TYPE "public"."notification_category" AS ENUM('AOG', 'Intelligence', 'Billing');--> statement-breakpoint
CREATE TYPE "public"."rfq_status" AS ENUM('sent', 'responded', 'declined', 'expired');--> statement-breakpoint
CREATE TYPE "public"."supplier_condition" AS ENUM('Serviceable', 'Exchange', 'Overhauled', 'New', 'As Removed');--> statement-breakpoint
CREATE TABLE "case_failure_log" (
	"id" text PRIMARY KEY NOT NULL,
	"request_id" text NOT NULL,
	"failure_cause" text NOT NULL,
	"hours_at_failure" text DEFAULT '' NOT NULL,
	"co_failure_notes" text DEFAULT '' NOT NULL,
	"logged_by" text NOT NULL,
	"logged_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"request_id" text DEFAULT '' NOT NULL,
	"user_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"sender_type" "message_sender_type" DEFAULT 'subscriber' NOT NULL,
	"body" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"category" "notification_category" DEFAULT 'AOG' NOT NULL,
	"title" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"request_id" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier_companies" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"contact_name" text DEFAULT '' NOT NULL,
	"contact_email" text DEFAULT '' NOT NULL,
	"contact_phone" text DEFAULT '' NOT NULL,
	"loa_signed" boolean DEFAULT false NOT NULL,
	"specialisms" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier_quotes" (
	"id" text PRIMARY KEY NOT NULL,
	"request_id" text NOT NULL,
	"supplier_name" text NOT NULL,
	"condition" "supplier_condition" DEFAULT 'Serviceable' NOT NULL,
	"price_cents" integer DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'usd' NOT NULL,
	"lead_time" text DEFAULT '' NOT NULL,
	"paperwork" text DEFAULT '' NOT NULL,
	"freight_route" text DEFAULT '' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"valid_until" timestamp with time zone,
	"approved_at" timestamp with time zone,
	"approved_by_user_id" text,
	"created_by_user_id" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier_rfqs" (
	"id" text PRIMARY KEY NOT NULL,
	"request_id" text NOT NULL,
	"supplier_company_id" text NOT NULL,
	"part_description" text DEFAULT '' NOT NULL,
	"part_number" text DEFAULT '' NOT NULL,
	"aircraft_type" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"documentation_required" text DEFAULT '' NOT NULL,
	"status" "rfq_status" DEFAULT 'sent' NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"responded_at" timestamp with time zone,
	"quote_submitted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier_users" (
	"user_id" text PRIMARY KEY NOT NULL,
	"supplier_company_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usm_market_signals" (
	"id" text PRIMARY KEY NOT NULL,
	"part_number" text NOT NULL,
	"aircraft_type" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"availability_pct" integer DEFAULT 0 NOT NULL,
	"trend" text DEFAULT 'stable' NOT NULL,
	"supplier_count" integer DEFAULT 0 NOT NULL,
	"price_cents" integer DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'usd' NOT NULL,
	"risk_score" integer DEFAULT 0 NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"updated_by" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "aog_requests" ADD COLUMN "freight_courier" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "aog_requests" ADD COLUMN "freight_tracking_ref" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "aog_requests" ADD COLUMN "freight_expected_arrival" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "aog_requests" ADD COLUMN "freight_notes" text DEFAULT '';