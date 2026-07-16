DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'invoice_status' AND e.enumlabel = 'Refunded') THEN
    ALTER TYPE "public"."invoice_status" ADD VALUE 'Refunded';
  END IF;
END
$$;--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'verification_status' AND e.enumlabel = 'Declined') THEN
    ALTER TYPE "public"."verification_status" ADD VALUE 'Declined';
  END IF;
END
$$;--> statement-breakpoint
CREATE TABLE "file_blobs" (
	"id" text PRIMARY KEY NOT NULL,
	"file_name" text NOT NULL,
	"content_type" text DEFAULT 'application/octet-stream' NOT NULL,
	"size_bytes" integer DEFAULT 0 NOT NULL,
	"owner_user_id" text NOT NULL,
	"data" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier_compliance_docs" (
	"id" text PRIMARY KEY NOT NULL,
	"supplier_company_id" text NOT NULL,
	"doc_type" text NOT NULL,
	"file_name" text DEFAULT '' NOT NULL,
	"storage_key" text DEFAULT '' NOT NULL,
	"expiry_date" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"member_email" text DEFAULT '' NOT NULL,
	"member_name" text DEFAULT '' NOT NULL,
	"role" text DEFAULT 'pic' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "aircraft" ADD COLUMN "decline_reason" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "aog_requests" ADD COLUMN "people_on_board" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "aog_requests" ADD COLUMN "flying_deadline" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "aog_requests" ADD COLUMN "amo_aware" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "aog_requests" ADD COLUMN "case_reference" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "aog_requests" ADD COLUMN "handler_id" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "aog_requests" ADD COLUMN "awb_number" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "aog_requests" ADD COLUMN "case_rating" integer;--> statement-breakpoint
ALTER TABLE "aog_requests" ADD COLUMN "case_rating_comment" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "aog_requests" ADD COLUMN "handover_notes" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "stripe_customer_id" text;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "stripe_subscription_id" text;--> statement-breakpoint
ALTER TABLE "supplier_companies" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_companies" ADD COLUMN "decline_reason" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_companies" ADD COLUMN "trading_name" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_companies" ADD COLUMN "country" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_companies" ADD COLUMN "address" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_companies" ADD COLUMN "website" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_companies" ADD COLUMN "vat_ref" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_companies" ADD COLUMN "inventory_platform" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_companies" ADD COLUMN "stock_type" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_companies" ADD COLUMN "typical_response_time" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_companies" ADD COLUMN "geographic_coverage" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_companies" ADD COLUMN "aircraft_types" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_companies" ADD COLUMN "ata_systems" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_companies" ADD COLUMN "primary_aog_contact" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_companies" ADD COLUMN "primary_aog_mobile" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_companies" ADD COLUMN "secondary_aog_contact" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_companies" ADD COLUMN "accounts_contact" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_companies" ADD COLUMN "payment_method" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_companies" ADD COLUMN "payment_currency" text DEFAULT 'USD' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_companies" ADD COLUMN "payment_terms" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_quotes" ADD COLUMN "awb_number" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "supplier_quotes" ADD COLUMN "net_price_cents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE INDEX "file_blobs_owner_idx" ON "file_blobs" USING btree ("owner_user_id");--> statement-breakpoint
CREATE INDEX "supplier_compliance_docs_company_id_idx" ON "supplier_compliance_docs" USING btree ("supplier_company_id");--> statement-breakpoint
CREATE INDEX "aircraft_user_id_idx" ON "aircraft" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "aircraft_documents_aircraft_id_idx" ON "aircraft_documents" USING btree ("aircraft_id");--> statement-breakpoint
CREATE INDEX "aog_requests_user_id_idx" ON "aog_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "aog_requests_aircraft_id_idx" ON "aog_requests" USING btree ("aircraft_id");--> statement-breakpoint
CREATE INDEX "aog_requests_status_idx" ON "aog_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "aog_status_events_request_id_idx" ON "aog_status_events" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "case_failure_log_request_id_idx" ON "case_failure_log" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "invoices_user_id_idx" ON "invoices" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "invoices_subscription_id_idx" ON "invoices" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX "messages_request_id_idx" ON "messages" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "messages_user_id_idx" ON "messages" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notifications_user_id_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "subscriptions_aircraft_id_idx" ON "subscriptions" USING btree ("aircraft_id");--> statement-breakpoint
CREATE INDEX "subscriptions_stripe_subscription_id_idx" ON "subscriptions" USING btree ("stripe_subscription_id");--> statement-breakpoint
CREATE INDEX "supplier_quotes_request_id_idx" ON "supplier_quotes" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "supplier_rfqs_request_id_idx" ON "supplier_rfqs" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "supplier_rfqs_company_id_idx" ON "supplier_rfqs" USING btree ("supplier_company_id");--> statement-breakpoint
CREATE INDEX "supplier_users_company_id_idx" ON "supplier_users" USING btree ("supplier_company_id");