ALTER TABLE "aircraft" RENAME COLUMN "engine_series" TO "engine_program";
ALTER TABLE "aircraft" ADD COLUMN "amo_email" text DEFAULT '' NOT NULL;
ALTER TABLE "aircraft" ADD COLUMN "amo_location" text DEFAULT '' NOT NULL;