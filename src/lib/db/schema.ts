import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("profile_role", [
  "Owner",
  "Operator",
  "Management Company",
  "Maintenance Provider",
  "Other",
]);

export const planEnum = pgEnum("plan", ["monthly", "annual"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "Active",
  "Pending",
  "Cancelled",
]);
export const verificationStatusEnum = pgEnum("verification_status", [
  "Pending",
  "Verified",
  "Declined",
]);
export const aircraftCategoryEnum = pgEnum("aircraft_category", [
  "Business Jet",
  "Turboprop",
  "Single Engine",
  "Multi Engine",
  "Helicopter",
]);

export const urgencyEnum = pgEnum("urgency", [
  "Aircraft grounded",
  "Dispatch affected",
  "Planned sourcing",
]);

export const aogStatusEnum = pgEnum("aog_status", [
  "Submitted",
  "Acknowledged",
  "Sourcing",
  "Options ready",
  "Awaiting approval",
  "Confirmed",
  "Order placed",
  "In transit",
  "Arrived",
  "Resolved",
  "Cancelled",
]);

export const ataChapterEnum = pgEnum("ata_chapter", [
  "Air Conditioning",
  "Auto Flight",
  "Communications",
  "Electrical Power",
  "Equipment / Furnishings",
  "Fire Protection",
  "Flight Controls",
  "Fuel",
  "Hydraulic Power",
  "Ice and Rain Protection",
  "Indicating / Recording",
  "Landing Gear",
  "Lights",
  "Navigation",
  "Oxygen",
  "Pneumatic",
  "Vacuum",
  "Water / Waste",
  "Airborne Auxiliary Power",
  "Structures",
  "Doors",
  "Fuselage",
  "Nacelles / Pylons",
  "Stabilizers",
  "Windows",
  "Wings",
  "Propellers",
  "Power Plant",
  "Engine",
  "Engine Fuel and Control",
  "Ignition",
  "Engine Controls",
  "Engine Indicating",
  "Exhaust",
  "Oil",
  "Starting",
]);
export const invoiceStatusEnum = pgEnum("invoice_status", ["Draft", "Paid", "Void", "Refunded"]);
export const supplierConditionEnum = pgEnum("supplier_condition", [
  "Serviceable",
  "Exchange",
  "Overhauled",
  "New",
  "As Removed",
]);

export const profiles = pgTable("profiles", {
  userId: text("user_id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull().default(""),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  addressLine1: text("address_line_1").notNull().default(""),
  addressLine2: text("address_line_2").notNull().default(""),
  city: text("city").notNull().default(""),
  region: text("region").notNull().default(""),
  postalCode: text("postal_code").notNull().default(""),
  country: text("country").notNull().default(""),
  role: roleEnum("role").notNull().default("Operator"),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const aircraft = pgTable(
  "aircraft",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    registration: text("registration").notNull(),
    category: aircraftCategoryEnum("category").notNull().default("Business Jet"),
    makeModel: text("make_model").notNull(),
    serialNumber: text("serial_number").notNull().default(""),
    yearOfManufacture: text("year_of_manufacture").notNull().default(""),
    typeOfOperations: text("type_of_operations").notNull().default(""),
    ownerOperatorName: text("owner_operator_name").notNull().default(""),
    baseAirport: text("base_airport").notNull().default(""),
    verificationStatus: verificationStatusEnum("verification_status").notNull().default("Pending"),
    declineReason: text("decline_reason").notNull().default(""),

    // Tier 2 fields (required for full cover)
    engineManufacturer: text("engine_manufacturer").notNull().default(""),
    engineType: text("engine_type").notNull().default(""),
    engineSeries: text("engine_series").notNull().default(""),
    engineSerialNumbers: text("engine_serial_numbers").notNull().default(""),
    numberOfEngines: integer("number_of_engines").notNull().default(2),
    propellerManufacturer: text("propeller_manufacturer").notNull().default(""),
    propellerType: text("propeller_type").notNull().default(""),
    propellerSerialNumbers: text("propeller_serial_numbers").notNull().default(""),
    maintenanceProgramme: text("maintenance_programme").notNull().default(""),
    nationality: text("nationality").notNull().default(""),
    registryStandard: text("registry_standard").notNull().default(""),
    amoName: text("amo_name").notNull().default(""),
    amoPhone: text("amo_phone").notNull().default(""),
    amoEmergencyPhone: text("amo_emergency_phone").notNull().default(""),
    picPhone: text("pic_phone").notNull().default(""),
    maintenancePoc: text("maintenance_poc").notNull().default(""),
    insurerName: text("insurer_name").notNull().default(""),
    insurerPolicyRef: text("insurer_policy_ref").notNull().default(""),
    totalAirframeHours: text("total_airframe_hours").notNull().default(""),

    plan: planEnum("plan").notNull(),
    subscriptionStatus: subscriptionStatusEnum("subscription_status").notNull().default("Active"),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    archiveReason: text("archive_reason").notNull().default(""),
    archiveNotes: text("archive_notes").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("aircraft_registration_idx").on(table.registration),
    index("aircraft_user_id_idx").on(table.userId),
  ],
);

export const aogRequests = pgTable("aog_requests", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  aircraftId: text("aircraft_id").notNull(),
  registration: text("registration").notNull(),
  location: text("location").notNull().default(""),
  aircraftType: text("aircraft_type").notNull().default(""),
  ataChapter: ataChapterEnum("ata_chapter"),
  affectedSystem: text("affected_system").notNull(),
  partNumber: text("part_number").notNull().default(""),
  issueDescription: text("issue_description").notNull(),
  urgency: urgencyEnum("urgency").notNull(),
  contactName: text("contact_name").notNull().default(""),
  contactPhone: text("contact_phone").notNull().default(""),
  contactEmail: text("contact_email").notNull().default(""),
  // Operational context fields (from submit form)
  peopleOnBoard: text("people_on_board").notNull().default(""),
  flyingDeadline: text("flying_deadline").notNull().default(""),
  amoAware: text("amo_aware").notNull().default(""),
  caseReference: text("case_reference").notNull().default(""),
  status: aogStatusEnum("status").notNull().default("Submitted"),
  exceptionStates: text("exception_states").array().notNull().default([]),
  // Freight tracking (populated by admin)
  freightCourier: text("freight_courier").default(""),
  freightTrackingRef: text("freight_tracking_ref").default(""),
  freightExpectedArrival: timestamp("freight_expected_arrival", { withTimezone: true }),
  freightNotes: text("freight_notes").default(""),
  // Handler / ops fields
  handlerId: text("handler_id").notNull().default(""),
  awbNumber: text("awb_number").notNull().default(""),
  caseRating: integer("case_rating"),
  caseRatingComment: text("case_rating_comment").notNull().default(""),
  handoverNotes: text("handover_notes").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("aog_requests_user_id_idx").on(table.userId),
  index("aog_requests_aircraft_id_idx").on(table.aircraftId),
  index("aog_requests_status_idx").on(table.status),
]);

export const aogRequestAttachments = pgTable("aog_request_attachments", {
  id: text("id").primaryKey(),
  requestId: text("request_id").notNull(),
  fileName: text("file_name").notNull(),
  storageKey: text("storage_key").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const aircraftDocuments = pgTable("aircraft_documents", {
  id: text("id").primaryKey(),
  aircraftId: text("aircraft_id").notNull(),
  userId: text("user_id").notNull(),
  documentType: text("document_type").notNull(), // e.g., 'Insurance', 'Registration'
  fileName: text("file_name").notNull(),
  storageKey: text("storage_key").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("aircraft_documents_aircraft_id_idx").on(table.aircraftId)]);

export const aogStatusEvents = pgTable("aog_status_events", {
  id: text("id").primaryKey(),
  requestId: text("request_id").notNull(),
  status: aogStatusEnum("status").notNull(),
  note: text("note").notNull().default(""),
  createdByUserId: text("created_by_user_id").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("aog_status_events_request_id_idx").on(table.requestId)]);

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  aircraftId: text("aircraft_id").notNull(),
  plan: planEnum("plan").notNull(),
  status: subscriptionStatusEnum("status").notNull().default("Active"),
  mockProviderRef: text("mock_provider_ref").notNull().default("mock-payment"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("subscriptions_user_id_idx").on(table.userId),
  index("subscriptions_aircraft_id_idx").on(table.aircraftId),
  index("subscriptions_stripe_subscription_id_idx").on(table.stripeSubscriptionId),
]);

export const invoices = pgTable("invoices", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  subscriptionId: text("subscription_id").notNull(),
  requestId: text("request_id").notNull().default(""),
  quoteId: text("quote_id").notNull().default(""),
  description: text("description").notNull().default(""),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull().default("usd"),
  status: invoiceStatusEnum("status").notNull().default("Paid"),
  emailedAt: timestamp("emailed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("invoices_user_id_idx").on(table.userId),
  index("invoices_subscription_id_idx").on(table.subscriptionId),
  index("invoices_request_id_idx").on(table.requestId),
  index("invoices_quote_id_idx").on(table.quoteId),
]);

export const adminNotes = pgTable("admin_notes", {
  id: text("id").primaryKey(),
  subjectType: text("subject_type").notNull(),
  subjectId: text("subject_id").notNull(),
  note: text("note").notNull(),
  createdByUserId: text("created_by_user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const supplierQuotes = pgTable("supplier_quotes", {
  id: text("id").primaryKey(),
  requestId: text("request_id").notNull(),
  supplierName: text("supplier_name").notNull(),
  condition: supplierConditionEnum("condition").notNull().default("Serviceable"),
  priceCents: integer("price_cents").notNull().default(0),
  currency: text("currency").notNull().default("usd"),
  leadTime: text("lead_time").notNull().default(""),
  paperwork: text("paperwork").notNull().default(""),
  freightRoute: text("freight_route").notNull().default(""),
  notes: text("notes").notNull().default(""),
  validUntil: timestamp("valid_until", { withTimezone: true }),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  approvedByUserId: text("approved_by_user_id"),
  createdByUserId: text("created_by_user_id").notNull().default(""),
  awbNumber: text("awb_number").notNull().default(""),
  netPriceCents: integer("net_price_cents").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("supplier_quotes_request_id_idx").on(table.requestId)]);

// ── New enums (v2) ────────────────────────────────────────────────────────────

export const notificationCategoryEnum = pgEnum("notification_category", [
  "AOG",
  "Intelligence",
  "Billing",
]);

export const messageSenderTypeEnum = pgEnum("message_sender_type", [
  "subscriber",
  "admin",
  "system",
]);

export const rfqStatusEnum = pgEnum("rfq_status", ["sent", "responded", "declined", "expired"]);

// ── New tables (v2) ───────────────────────────────────────────────────────────

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  requestId: text("request_id").notNull().default(""),
  userId: text("user_id").notNull(),
  senderId: text("sender_id").notNull(),
  senderType: messageSenderTypeEnum("sender_type").notNull().default("subscriber"),
  body: text("body").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("messages_request_id_idx").on(table.requestId),
  index("messages_user_id_idx").on(table.userId),
]);

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  category: notificationCategoryEnum("category").notNull().default("AOG"),
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  requestId: text("request_id"),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("notifications_user_id_idx").on(table.userId)]);

export const usmMarketSignals = pgTable("usm_market_signals", {
  id: text("id").primaryKey(),
  partNumber: text("part_number").notNull(),
  aircraftType: text("aircraft_type").notNull().default(""),
  description: text("description").notNull().default(""),
  availabilityPct: integer("availability_pct").notNull().default(0),
  trend: text("trend").notNull().default("stable"),
  supplierCount: integer("supplier_count").notNull().default(0),
  priceCents: integer("price_cents").notNull().default(0),
  currency: text("currency").notNull().default("usd"),
  riskScore: integer("risk_score").notNull().default(0),
  notes: text("notes").notNull().default(""),
  updatedBy: text("updated_by").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const caseFailureLog = pgTable("case_failure_log", {
  id: text("id").primaryKey(),
  requestId: text("request_id").notNull(),
  failureCause: text("failure_cause").notNull(),
  hoursAtFailure: text("hours_at_failure").notNull().default(""),
  coFailureNotes: text("co_failure_notes").notNull().default(""),
  loggedBy: text("logged_by").notNull(),
  loggedAt: timestamp("logged_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("case_failure_log_request_id_idx").on(table.requestId)]);

export const supplierCompanies = pgTable("supplier_companies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  contactName: text("contact_name").notNull().default(""),
  contactEmail: text("contact_email").notNull().default(""),
  contactPhone: text("contact_phone").notNull().default(""),
  loaSigned: boolean("loa_signed").notNull().default(false),
  specialisms: text("specialisms").notNull().default(""),
  status: text("status").notNull().default("pending"),
  declineReason: text("decline_reason").notNull().default(""),
  tradingName: text("trading_name").notNull().default(""),
  country: text("country").notNull().default(""),
  address: text("address").notNull().default(""),
  website: text("website").notNull().default(""),
  vatRef: text("vat_ref").notNull().default(""),
  inventoryPlatform: text("inventory_platform").notNull().default(""),
  stockType: text("stock_type").notNull().default(""),
  typicalResponseTime: text("typical_response_time").notNull().default(""),
  geographicCoverage: text("geographic_coverage").notNull().default(""),
  aircraftTypes: text("aircraft_types").notNull().default(""),
  ataSystems: text("ata_systems").notNull().default(""),
  primaryAogContact: text("primary_aog_contact").notNull().default(""),
  primaryAogMobile: text("primary_aog_mobile").notNull().default(""),
  secondaryAogContact: text("secondary_aog_contact").notNull().default(""),
  accountsContact: text("accounts_contact").notNull().default(""),
  paymentMethod: text("payment_method").notNull().default(""),
  paymentCurrency: text("payment_currency").notNull().default("USD"),
  paymentTerms: text("payment_terms").notNull().default(""),
  releaseCapabilities: text("release_capabilities").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const supplierComplianceDocs = pgTable(
  "supplier_compliance_docs",
  {
    id: text("id").primaryKey(),
    supplierCompanyId: text("supplier_company_id").notNull(),
    docType: text("doc_type").notNull(), // e.g. 'FAA Part 145', 'Insurance Certificate'
    fileName: text("file_name").notNull().default(""),
    storageKey: text("storage_key").notNull().default(""), // file_blobs id, may be empty
    expiryDate: text("expiry_date").notNull().default(""), // ISO date string, may be empty
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("supplier_compliance_docs_company_id_idx").on(table.supplierCompanyId)],
);

export const supplierUsers = pgTable("supplier_users", {
  userId: text("user_id").primaryKey(),
  supplierCompanyId: text("supplier_company_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("supplier_users_company_id_idx").on(table.supplierCompanyId)]);

export const supplierTeamMembers = pgTable("supplier_team_members", {
  id: text("id").primaryKey(),
  supplierCompanyId: text("supplier_company_id").notNull(),
  name: text("name").notNull().default(""),
  email: text("email").notNull().default(""),
  role: text("role").notNull().default("AOG contact"),
  phone: text("phone").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("supplier_team_members_company_id_idx").on(table.supplierCompanyId)]);

export const supplierRfqs = pgTable("supplier_rfqs", {
  id: text("id").primaryKey(),
  requestId: text("request_id").notNull(),
  supplierCompanyId: text("supplier_company_id").notNull(),
  partDescription: text("part_description").notNull().default(""),
  partNumber: text("part_number").notNull().default(""),
  aircraftType: text("aircraft_type").notNull().default(""),
  location: text("location").notNull().default(""),
  documentationRequired: text("documentation_required").notNull().default(""),
  status: rfqStatusEnum("status").notNull().default("sent"),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
  respondedAt: timestamp("responded_at", { withTimezone: true }),
  quoteSubmitted: boolean("quote_submitted").notNull().default(false),
}, (table) => [
  index("supplier_rfqs_request_id_idx").on(table.requestId),
  index("supplier_rfqs_company_id_idx").on(table.supplierCompanyId),
]);

export const teamMembers = pgTable("team_members", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  memberEmail: text("member_email").notNull().default(""),
  memberName: text("member_name").notNull().default(""),
  role: text("role").notNull().default("pic"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Stored file bytes (base64). Backs document/attachment uploads. Postgres-backed
// so it works locally and on serverless with no extra infra; can move behind
// S3/R2 later via the same storage helpers. Suited to document-sized files.
export const fileBlobs = pgTable(
  "file_blobs",
  {
    id: text("id").primaryKey(),
    fileName: text("file_name").notNull(),
    contentType: text("content_type").notNull().default("application/octet-stream"),
    sizeBytes: integer("size_bytes").notNull().default(0),
    ownerUserId: text("owner_user_id").notNull(),
    data: text("data").notNull(), // base64-encoded bytes
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("file_blobs_owner_idx").on(table.ownerUserId)],
);

// ── Type exports ──────────────────────────────────────────────────────────────

export type Role = (typeof roleEnum.enumValues)[number];
export type Plan = (typeof planEnum.enumValues)[number];
export type SubStatus = (typeof subscriptionStatusEnum.enumValues)[number];
export type VerificationStatus = (typeof verificationStatusEnum.enumValues)[number];
export type AircraftCategory = (typeof aircraftCategoryEnum.enumValues)[number];
export type Urgency = (typeof urgencyEnum.enumValues)[number];
export type AogStatus = (typeof aogStatusEnum.enumValues)[number];
export type AtaChapter = (typeof ataChapterEnum.enumValues)[number];
export type SupplierCondition = (typeof supplierConditionEnum.enumValues)[number];
export type NotificationCategory = (typeof notificationCategoryEnum.enumValues)[number];
export type MessageSenderType = (typeof messageSenderTypeEnum.enumValues)[number];
export type RfqStatus = (typeof rfqStatusEnum.enumValues)[number];
