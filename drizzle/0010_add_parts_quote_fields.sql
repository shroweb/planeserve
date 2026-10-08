ALTER TABLE "parts_requests" ADD COLUMN IF NOT EXISTS "quoted_price" text;
ALTER TABLE "parts_requests" ADD COLUMN IF NOT EXISTS "quoted_condition" text;
ALTER TABLE "parts_requests" ADD COLUMN IF NOT EXISTS "quoted_lead_time" text;
ALTER TABLE "parts_requests" ADD COLUMN IF NOT EXISTS "quoted_trace_docs" text;
ALTER TABLE "parts_requests" ADD COLUMN IF NOT EXISTS "quoted_handling_fee" text;
ALTER TABLE "parts_requests" ADD COLUMN IF NOT EXISTS "quoted_notes" text;
ALTER TABLE "parts_requests" ADD COLUMN IF NOT EXISTS "quoted_at" timestamp with time zone;
