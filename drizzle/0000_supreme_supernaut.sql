CREATE TYPE "public"."aircraft_category" AS ENUM('Business Jet', 'Turboprop', 'Single Engine', 'Multi Engine', 'Helicopter');--> statement-breakpoint
CREATE TYPE "public"."aog_status" AS ENUM('Submitted', 'Acknowledged', 'Sourcing', 'Options ready', 'Awaiting approval', 'Confirmed', 'Order placed', 'In transit', 'Arrived', 'Resolved', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."ata_chapter" AS ENUM('Air Conditioning', 'Auto Flight', 'Communications', 'Electrical Power', 'Equipment / Furnishings', 'Fire Protection', 'Flight Controls', 'Fuel', 'Hydraulic Power', 'Ice and Rain Protection', 'Indicating / Recording', 'Landing Gear', 'Lights', 'Navigation', 'Oxygen', 'Pneumatic', 'Vacuum', 'Water / Waste', 'Airborne Auxiliary Power', 'Structures', 'Doors', 'Fuselage', 'Nacelles / Pylons', 'Stabilizers', 'Windows', 'Wings', 'Propellers', 'Power Plant', 'Engine', 'Engine Fuel and Control', 'Ignition', 'Engine Controls', 'Engine Indicating', 'Exhaust', 'Oil', 'Starting');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('Draft', 'Paid', 'Void');--> statement-breakpoint
CREATE TYPE "public"."plan" AS ENUM('monthly', 'annual');--> statement-breakpoint
CREATE TYPE "public"."profile_role" AS ENUM('Owner', 'Operator', 'Management Company', 'Maintenance Provider', 'Other');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('Active', 'Pending', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."urgency" AS ENUM('Aircraft grounded', 'Dispatch affected', 'Planned sourcing');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('Pending', 'Verified');--> statement-breakpoint
CREATE TABLE "admin_notes" (
	"id" text PRIMARY KEY NOT NULL,
	"subject_type" text NOT NULL,
	"subject_id" text NOT NULL,
	"note" text NOT NULL,
	"created_by_user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "aircraft" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"registration" text NOT NULL,
	"category" "aircraft_category" DEFAULT 'Business Jet' NOT NULL,
	"make_model" text NOT NULL,
	"serial_number" text DEFAULT '' NOT NULL,
	"year_of_manufacture" text DEFAULT '' NOT NULL,
	"type_of_operations" text DEFAULT '' NOT NULL,
	"owner_operator_name" text DEFAULT '' NOT NULL,
	"base_airport" text DEFAULT '' NOT NULL,
	"verification_status" "verification_status" DEFAULT 'Pending' NOT NULL,
	"engine_manufacturer" text DEFAULT '' NOT NULL,
	"engine_type" text DEFAULT '' NOT NULL,
	"engine_series" text DEFAULT '' NOT NULL,
	"engine_serial_numbers" text DEFAULT '' NOT NULL,
	"number_of_engines" integer DEFAULT 2 NOT NULL,
	"maintenance_programme" text DEFAULT '' NOT NULL,
	"nationality" text DEFAULT '' NOT NULL,
	"registry_standard" text DEFAULT '' NOT NULL,
	"amo_name" text DEFAULT '' NOT NULL,
	"amo_phone" text DEFAULT '' NOT NULL,
	"amo_emergency_phone" text DEFAULT '' NOT NULL,
	"pic_phone" text DEFAULT '' NOT NULL,
	"maintenance_poc" text DEFAULT '' NOT NULL,
	"insurer_name" text DEFAULT '' NOT NULL,
	"insurer_policy_ref" text DEFAULT '' NOT NULL,
	"total_airframe_hours" text DEFAULT '' NOT NULL,
	"plan" "plan" NOT NULL,
	"subscription_status" "subscription_status" DEFAULT 'Active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "aircraft_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"aircraft_id" text NOT NULL,
	"user_id" text NOT NULL,
	"document_type" text NOT NULL,
	"file_name" text NOT NULL,
	"storage_key" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "aog_request_attachments" (
	"id" text PRIMARY KEY NOT NULL,
	"request_id" text NOT NULL,
	"file_name" text NOT NULL,
	"storage_key" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "aog_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"aircraft_id" text NOT NULL,
	"registration" text NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"aircraft_type" text DEFAULT '' NOT NULL,
	"ata_chapter" "ata_chapter",
	"affected_system" text NOT NULL,
	"part_number" text DEFAULT '' NOT NULL,
	"issue_description" text NOT NULL,
	"urgency" "urgency" NOT NULL,
	"contact_name" text DEFAULT '' NOT NULL,
	"contact_phone" text DEFAULT '' NOT NULL,
	"contact_email" text DEFAULT '' NOT NULL,
	"status" "aog_status" DEFAULT 'Submitted' NOT NULL,
	"exception_states" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "aog_status_events" (
	"id" text PRIMARY KEY NOT NULL,
	"request_id" text NOT NULL,
	"status" "aog_status" NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"created_by_user_id" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"subscription_id" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" text DEFAULT 'usd' NOT NULL,
	"status" "invoice_status" DEFAULT 'Paid' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"company" text DEFAULT '' NOT NULL,
	"email" text NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"role" "profile_role" DEFAULT 'Operator' NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"aircraft_id" text NOT NULL,
	"plan" "plan" NOT NULL,
	"status" "subscription_status" DEFAULT 'Active' NOT NULL,
	"mock_provider_ref" text DEFAULT 'mock-payment' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "aircraft_registration_idx" ON "aircraft" USING btree ("registration");