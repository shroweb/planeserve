ALTER TABLE "invoices" ADD COLUMN "request_id" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "quote_id" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "description" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "emailed_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "invoices_request_id_idx" ON "invoices" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "invoices_quote_id_idx" ON "invoices" USING btree ("quote_id");