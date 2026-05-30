import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { z } from "zod";

// ── Zod schemas ───────────────────────────────────────────────────────────────

const roleSchema = z.enum([
  "Owner",
  "Operator",
  "Management Company",
  "Maintenance Provider",
  "Other",
]);
const planSchema = z.enum(["monthly", "annual"]);
const verificationStatusSchema = z.enum(["Pending", "Verified"]);
const aircraftCategorySchema = z.enum([
  "Business Jet",
  "Turboprop",
  "Single Engine",
  "Multi Engine",
  "Helicopter",
]);
const urgencySchema = z.enum(["Aircraft grounded", "Dispatch affected", "Planned sourcing"]);
const statusSchema = z.enum([
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
const ataChapterSchema = z.enum([
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

type Role = z.infer<typeof roleSchema>;
type Plan = z.infer<typeof planSchema>;
type AircraftCategory = z.infer<typeof aircraftCategorySchema>;
type Urgency = z.infer<typeof urgencySchema>;
type AogStatus = z.infer<typeof statusSchema>;
type AtaChapter = z.infer<typeof ataChapterSchema>;

// ── Shared return shapes ──────────────────────────────────────────────────────

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  role: Role;
  isAdmin: boolean;
  createdAt: string;
};

export type AircraftRecord = {
  id: string;
  userId: string;
  registration: string;
  category: AircraftCategory;
  makeModel: string;
  serialNumber: string;
  yearOfManufacture: string;
  typeOfOperations: string;
  ownerOperatorName: string;
  baseAirport: string;
  verificationStatus: "Pending" | "Verified";
  engineManufacturer: string;
  engineType: string;
  engineSeries: string;
  engineSerialNumbers: string;
  numberOfEngines: number;
  maintenanceProgramme: string;
  nationality: string;
  registryStandard: string;
  amoName: string;
  amoPhone: string;
  amoEmergencyPhone: string;
  picPhone: string;
  maintenancePoc: string;
  insurerName: string;
  insurerPolicyRef: string;
  totalAirframeHours: string;
  avionicsSuite: string;
  commonParts: string[];
  alternatePartNumbers: string[];
  supportNotes: string;
  plan: Plan;
  subscriptionStatus: string;
  createdAt: string;
  updatedAt: string;
};

export type AogRecord = {
  id: string;
  userId: string;
  aircraftId: string;
  registration: string;
  location: string;
  aircraftType: string;
  ataChapter?: AtaChapter;
  affectedSystem: string;
  partNumber: string;
  issueDescription: string;
  urgency: Urgency;
  status: AogStatus;
  exceptionStates: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  attachments: string[];
  priorityScore: number;
  priorityReasons: string[];
  requiredDocuments: { name: string; status: "Missing" | "Uploaded" | "Verified" }[];
  freightCourier: string;
  freightTrackingRef: string;
  freightExpectedArrival: string | null;
  freightNotes: string;
  handlerId: string;
  awbNumber: string;
  caseRating: number | null;
  caseRatingComment: string;
  handoverNotes: string;
  createdAt: string;
  updatedAt: string;
};

// ── Server-only DB/auth loader ────────────────────────────────────────────────

const loadServerAuth = createServerOnlyFn(async () => {
  const [{ getRequestHeaders }, { eq, and, ne, inArray, asc, desc }, { auth }, { db, schema }] =
    await Promise.all([
      import("@tanstack/start-server-core"),
      import("drizzle-orm"),
      import("./auth"),
      import("./db/index.server"),
    ]);

  return { getRequestHeaders, eq, and, ne, inArray, asc, desc, auth, db, schema };
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function toAircraftRecord(row: {
  id: string;
  userId: string;
  registration: string;
  category: AircraftCategory;
  makeModel: string;
  serialNumber: string;
  yearOfManufacture: string;
  typeOfOperations: string;
  ownerOperatorName: string;
  baseAirport: string;
  verificationStatus: "Pending" | "Verified";
  engineManufacturer: string;
  engineType: string;
  engineSeries: string;
  engineSerialNumbers: string;
  numberOfEngines: number;
  maintenanceProgramme: string;
  nationality: string;
  registryStandard: string;
  amoName: string;
  amoPhone: string;
  amoEmergencyPhone: string;
  picPhone: string;
  maintenancePoc: string;
  insurerName: string;
  insurerPolicyRef: string;
  totalAirframeHours: string;
  plan: Plan;
  subscriptionStatus: string;
  createdAt: Date;
  updatedAt: Date;
}): AircraftRecord {
  return {
    ...row,
    avionicsSuite: "",
    commonParts: [],
    alternatePartNumbers: [],
    supportNotes: "",
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function priorityFor(input: {
  urgency: Urgency;
  status?: AogStatus;
  attachments: string[];
  partNumber: string;
}) {
  if (input.status === "Resolved") return { score: 20, reasons: ["Resolved"] };

  const reasons: string[] = [];
  let score =
    input.urgency === "Aircraft grounded" ? 80 : input.urgency === "Dispatch affected" ? 55 : 30;
  reasons.push(input.urgency);

  if (input.partNumber) {
    score += 4;
    reasons.push("Part number supplied");
  }
  if (input.attachments.length > 0) {
    score += 6;
    reasons.push("Documents uploaded");
  } else {
    reasons.push("Document pack missing");
  }

  return { score: Math.min(score, 100), reasons };
}

function documentVault(
  attachments: string[],
): { name: string; status: "Missing" | "Uploaded" | "Verified" }[] {
  const hasTechLog = attachments.some((n) => /log|tech/i.test(n));
  const hasPhoto = attachments.some((n) => /photo|image|jpg|jpeg|png/i.test(n));
  return [
    { name: "Tech log extract", status: hasTechLog ? "Uploaded" : "Missing" },
    { name: "Part / fault photo", status: hasPhoto ? "Uploaded" : "Missing" },
    { name: "Release certificate / trace", status: "Missing" },
  ];
}

function toAogRecord(
  row: {
    id: string;
    userId: string;
    aircraftId: string;
    registration: string;
    location: string;
    aircraftType: string;
    ataChapter: AtaChapter | null;
    affectedSystem: string;
    partNumber: string;
    issueDescription: string;
    urgency: Urgency;
    status: AogStatus;
    exceptionStates: string[];
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    freightCourier?: string | null;
    freightTrackingRef?: string | null;
    freightExpectedArrival?: Date | null;
    freightNotes?: string | null;
    handlerId?: string | null;
    awbNumber?: string | null;
    caseRating?: number | null;
    caseRatingComment?: string | null;
    handoverNotes?: string | null;
    createdAt: Date;
    updatedAt: Date;
  },
  attachments: string[],
): AogRecord {
  const priority = priorityFor({
    urgency: row.urgency,
    status: row.status,
    attachments,
    partNumber: row.partNumber,
  });
  return {
    id: row.id,
    userId: row.userId,
    aircraftId: row.aircraftId,
    registration: row.registration,
    location: row.location,
    aircraftType: row.aircraftType,
    ataChapter: row.ataChapter ?? undefined,
    affectedSystem: row.affectedSystem,
    partNumber: row.partNumber,
    issueDescription: row.issueDescription,
    urgency: row.urgency,
    status: row.status,
    exceptionStates: row.exceptionStates,
    contactName: row.contactName,
    contactPhone: row.contactPhone,
    contactEmail: row.contactEmail,
    attachments,
    priorityScore: priority.score,
    priorityReasons: priority.reasons,
    requiredDocuments: documentVault(attachments),
    freightCourier: row.freightCourier ?? "",
    freightTrackingRef: row.freightTrackingRef ?? "",
    freightExpectedArrival: row.freightExpectedArrival?.toISOString() ?? null,
    freightNotes: row.freightNotes ?? "",
    handlerId: row.handlerId ?? "",
    awbNumber: row.awbNumber ?? "",
    caseRating: row.caseRating ?? null,
    caseRatingComment: row.caseRatingComment ?? "",
    handoverNotes: row.handoverNotes ?? "",
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function attachmentsByRequest(
  db: Awaited<ReturnType<typeof loadServerAuth>>["db"],
  schema: Awaited<ReturnType<typeof loadServerAuth>>["schema"],
  inArray: Awaited<ReturnType<typeof loadServerAuth>>["inArray"],
  requestIds: string[],
): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  if (requestIds.length === 0) return map;
  const rows = await db
    .select()
    .from(schema.aogRequestAttachments)
    .where(inArray(schema.aogRequestAttachments.requestId, requestIds));
  for (const row of rows) {
    const list = map.get(row.requestId) ?? [];
    list.push(row.fileName);
    map.set(row.requestId, list);
  }
  return map;
}

// ── Auth helpers ──────────────────────────────────────────────────────────────

async function currentUser(): Promise<UserRecord> {
  const { getRequestHeaders, eq, auth, db, schema } = await loadServerAuth();
  const session = await auth.api.getSession({ headers: getRequestHeaders() });

  if (!session?.user) throw new Error("Authentication required");

  const [profile] = await db
    .select()
    .from(schema.profiles)
    .where(eq(schema.profiles.userId, session.user.id));

  if (profile) {
    return {
      id: profile.userId,
      name: profile.name,
      email: profile.email,
      company: profile.company,
      phone: profile.phone,
      role: profile.role,
      isAdmin: profile.isAdmin,
      createdAt: profile.createdAt.toISOString(),
    };
  }

  // First login — create the profile from auth user data. New accounts are
  // never admins; admin is granted explicitly via `profiles.is_admin`
  // (npm run db:admin), which is the single source of truth for admin access.
  await db
    .insert(schema.profiles)
    .values({
      userId: session.user.id,
      name: session.user.name,
      email: session.user.email,
      company: "",
      phone: "",
      role: "Operator",
      isAdmin: false,
    })
    .onConflictDoNothing();

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    company: "",
    phone: "",
    role: "Operator",
    isAdmin: false,
    createdAt: new Date().toISOString(),
  };
}

async function currentAdmin(): Promise<UserRecord> {
  const user = await currentUser();
  if (!user.isAdmin) throw new Error("Admin access required");
  return user;
}

// ── Server functions — member ─────────────────────────────────────────────────

export const getSessionUser = createServerFn({ method: "GET" }).handler(() => currentUser());
export const ensureSession = createServerFn({ method: "GET" }).handler(() => currentUser());
export const ensureAdminSession = createServerFn({ method: "GET" }).handler(() => currentAdmin());

export const upsertProfile = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1),
      company: z.string().optional().default(""),
      phone: z.string().optional().default(""),
      role: roleSchema.optional().default("Operator"),
    }),
  )
  .handler(async ({ data }) => {
    const user = await currentUser();
    const { eq, db, schema } = await loadServerAuth();
    await db
      .insert(schema.profiles)
      .values({
        userId: user.id,
        name: data.name,
        email: user.email,
        company: data.company,
        phone: data.phone,
        role: data.role,
        isAdmin: user.isAdmin,
      })
      .onConflictDoUpdate({
        target: schema.profiles.userId,
        set: { name: data.name, company: data.company, phone: data.phone, role: data.role },
      });
    return { ...user, name: data.name, company: data.company, phone: data.phone, role: data.role };
  });

export const getDashboardData = createServerFn({ method: "GET" }).handler(async () => {
  const user = await currentUser();
  const { eq, inArray, desc, db, schema } = await loadServerAuth();

  const aircraftRows = await db
    .select()
    .from(schema.aircraft)
    .where(eq(schema.aircraft.userId, user.id))
    .orderBy(desc(schema.aircraft.createdAt));

  const requestRows = await db
    .select()
    .from(schema.aogRequests)
    .where(eq(schema.aogRequests.userId, user.id))
    .orderBy(desc(schema.aogRequests.createdAt));

  const attMap = await attachmentsByRequest(
    db,
    schema,
    inArray,
    requestRows.map((r) => r.id),
  );

  return {
    user,
    aircraft: aircraftRows.map(toAircraftRecord),
    requests: requestRows.map((r) => toAogRecord(r, attMap.get(r.id) ?? [])),
  };
});

export const getAircraftData = createServerFn({ method: "GET" }).handler(async () => {
  const user = await currentUser();
  const { eq, desc, db, schema } = await loadServerAuth();
  const rows = await db
    .select()
    .from(schema.aircraft)
    .where(eq(schema.aircraft.userId, user.id))
    .orderBy(desc(schema.aircraft.createdAt));
  return rows.map(toAircraftRecord);
});

export const getAircraftCaseHistory = createServerFn({ method: "GET" })
  .inputValidator(z.object({ aircraftId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const user = await currentUser();
    const { eq, and, desc, inArray, db, schema } = await loadServerAuth();

    const [aircraft] = await db
      .select({ userId: schema.aircraft.userId })
      .from(schema.aircraft)
      .where(eq(schema.aircraft.id, data.aircraftId));

    if (!aircraft || aircraft.userId !== user.id) throw new Error("Access denied.");

    const requestRows = await db
      .select()
      .from(schema.aogRequests)
      .where(
        and(
          eq(schema.aogRequests.aircraftId, data.aircraftId),
          eq(schema.aogRequests.status, "Resolved"),
        ),
      )
      .orderBy(desc(schema.aogRequests.updatedAt));

    const attMap = await attachmentsByRequest(
      db,
      schema,
      inArray,
      requestRows.map((r) => r.id),
    );

    return requestRows.map((r) => toAogRecord(r, attMap.get(r.id) ?? []));
  });

// ── Aircraft documents vault ──────────────────────────────────────────────────

async function assertOwnsAircraft(
  db: Awaited<ReturnType<typeof loadServerAuth>>["db"],
  schema: Awaited<ReturnType<typeof loadServerAuth>>["schema"],
  eq: Awaited<ReturnType<typeof loadServerAuth>>["eq"],
  aircraftId: string,
  userId: string,
) {
  const [aircraft] = await db
    .select({ userId: schema.aircraft.userId })
    .from(schema.aircraft)
    .where(eq(schema.aircraft.id, aircraftId));
  if (!aircraft || aircraft.userId !== userId) throw new Error("Access denied.");
}

export const getAircraftDocuments = createServerFn({ method: "GET" })
  .inputValidator(z.object({ aircraftId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const user = await currentUser();
    const { eq, desc, db, schema } = await loadServerAuth();
    await assertOwnsAircraft(db, schema, eq, data.aircraftId, user.id);

    const rows = await db
      .select()
      .from(schema.aircraftDocuments)
      .where(eq(schema.aircraftDocuments.aircraftId, data.aircraftId))
      .orderBy(desc(schema.aircraftDocuments.createdAt));

    return rows.map((r) => ({
      id: r.id,
      documentType: r.documentType,
      fileName: r.fileName,
      createdAt: r.createdAt.toISOString(),
    }));
  });

export const addAircraftDocument = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      aircraftId: z.string().min(1),
      documentType: z.string().min(1),
      fileName: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const user = await currentUser();
    const { eq, db, schema } = await loadServerAuth();
    await assertOwnsAircraft(db, schema, eq, data.aircraftId, user.id);

    const id = `doc_${crypto.randomUUID()}`;
    await db.insert(schema.aircraftDocuments).values({
      id,
      aircraftId: data.aircraftId,
      userId: user.id,
      documentType: data.documentType,
      fileName: data.fileName,
      storageKey: "",
      createdAt: new Date(),
    });
    return { id };
  });

export const getBillingData = createServerFn({ method: "GET" }).handler(async () => {
  const user = await currentUser();
  const { eq, inArray, desc, db, schema } = await loadServerAuth();

  const aircraftRows = await db
    .select()
    .from(schema.aircraft)
    .where(eq(schema.aircraft.userId, user.id))
    .orderBy(desc(schema.aircraft.createdAt));

  const aircraftIds = aircraftRows.map((a) => a.id);

  const [subRows, invRows] = await Promise.all([
    aircraftIds.length
      ? db
          .select()
          .from(schema.subscriptions)
          .where(inArray(schema.subscriptions.aircraftId, aircraftIds))
      : Promise.resolve([]),
    aircraftIds.length
      ? db
          .select()
          .from(schema.invoices)
          .where(eq(schema.invoices.userId, user.id))
          .orderBy(desc(schema.invoices.createdAt))
      : Promise.resolve([]),
  ]);

  return {
    aircraft: aircraftRows.map(toAircraftRecord),
    subscriptions: subRows.map((s) => ({
      id: s.id,
      userId: s.userId,
      aircraftId: s.aircraftId,
      plan: s.plan,
      status: s.status,
      mockProviderRef: s.mockProviderRef,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    })),
    invoices: invRows.map((i) => ({
      id: i.id,
      userId: i.userId,
      subscriptionId: i.subscriptionId,
      amountCents: i.amountCents,
      status: i.status,
      createdAt: i.createdAt.toISOString(),
    })),
  };
});

export const getAogFormData = createServerFn({ method: "GET" }).handler(async () => {
  const user = await currentUser();
  const { eq, desc, db, schema } = await loadServerAuth();
  const rows = await db
    .select()
    .from(schema.aircraft)
    .where(eq(schema.aircraft.userId, user.id))
    .orderBy(desc(schema.aircraft.createdAt));
  return { user, aircraft: rows.map(toAircraftRecord) };
});

export const createAircraft = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      registration: z.string().min(1),
      category: aircraftCategorySchema,
      makeModel: z.string().min(1),
      serialNumber: z.string().min(1),
      yearOfManufacture: z.string().min(1),
      typeOfOperations: z.string().min(1),
      ownerOperatorName: z.string().min(1),
      baseAirport: z.string().min(1),
      plan: planSchema,
      engineManufacturer: z.string().optional().default(""),
      engineType: z.string().optional().default(""),
      engineSeries: z.string().optional().default(""),
      engineSerialNumbers: z.string().optional().default(""),
      numberOfEngines: z.number().optional().default(2),
      maintenanceProgramme: z.string().optional().default(""),
      nationality: z.string().optional().default(""),
      registryStandard: z.string().optional().default(""),
      amoName: z.string().optional().default(""),
      amoPhone: z.string().optional().default(""),
      amoEmergencyPhone: z.string().optional().default(""),
      picPhone: z.string().optional().default(""),
      maintenancePoc: z.string().optional().default(""),
      insurerName: z.string().optional().default(""),
      insurerPolicyRef: z.string().optional().default(""),
      totalAirframeHours: z.string().optional().default(""),
      avionicsSuite: z.string().optional().default(""),
      commonParts: z.string().optional().default(""),
      alternatePartNumbers: z.string().optional().default(""),
      supportNotes: z.string().optional().default(""),
    }),
  )
  .handler(async ({ data }) => {
    const user = await currentUser();
    const { db, schema } = await loadServerAuth();
    const aircraftId = `ac_${crypto.randomUUID()}`;
    const subscriptionId = `sub_${crypto.randomUUID()}`;

    await db.insert(schema.aircraft).values({
      id: aircraftId,
      userId: user.id,
      registration: data.registration.toUpperCase(),
      category: data.category,
      makeModel: data.makeModel,
      serialNumber: data.serialNumber,
      yearOfManufacture: data.yearOfManufacture,
      typeOfOperations: data.typeOfOperations,
      ownerOperatorName: data.ownerOperatorName,
      baseAirport: data.baseAirport,
      verificationStatus: "Pending",
      engineManufacturer: data.engineManufacturer,
      engineType: data.engineType,
      engineSeries: data.engineSeries,
      engineSerialNumbers: data.engineSerialNumbers,
      numberOfEngines: data.numberOfEngines,
      maintenanceProgramme: data.maintenanceProgramme,
      nationality: data.nationality,
      registryStandard: data.registryStandard,
      amoName: data.amoName,
      amoPhone: data.amoPhone,
      amoEmergencyPhone: data.amoEmergencyPhone,
      picPhone: data.picPhone,
      maintenancePoc: data.maintenancePoc,
      insurerName: data.insurerName,
      insurerPolicyRef: data.insurerPolicyRef,
      totalAirframeHours: data.totalAirframeHours,
      plan: data.plan,
      subscriptionStatus: "Active",
    });

    await db.insert(schema.subscriptions).values({
      id: subscriptionId,
      userId: user.id,
      aircraftId,
      plan: data.plan,
      status: "Active",
      mockProviderRef: `mock_${subscriptionId}`,
    });

    await db.insert(schema.invoices).values({
      id: `inv_${crypto.randomUUID()}`,
      userId: user.id,
      subscriptionId,
      amountCents: data.plan === "monthly" ? 10000 : 100000,
      status: "Paid",
    });

    return { id: aircraftId };
  });

export const createAogRequest = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      aircraftId: z.string().min(1),
      location: z.string().optional().default(""),
      aircraftType: z.string().optional().default(""),
      ataChapter: ataChapterSchema.optional(),
      affectedSystem: z.string().min(1),
      partNumber: z.string().optional().default(""),
      issueDescription: z.string().min(1),
      urgency: urgencySchema,
      contactName: z.string().optional().default(""),
      contactPhone: z.string().optional().default(""),
      contactEmail: z.string().optional().default(""),
      attachments: z.array(z.string()).optional().default([]),
      peopleOnBoard: z.string().optional().default(""),
      flyingDeadline: z.string().optional().default(""),
      amoAware: z.string().optional().default(""),
    }),
  )
  .handler(async ({ data }) => {
    const user = await currentUser();
    const { eq, db, schema } = await loadServerAuth();

    const [selectedAircraft] = await db
      .select()
      .from(schema.aircraft)
      .where(eq(schema.aircraft.id, data.aircraftId));

    if (!selectedAircraft || selectedAircraft.userId !== user.id) {
      throw new Error("Select an aircraft.");
    }

    const shortRef = crypto.randomUUID().slice(0, 8).toUpperCase();
    const requestId = `AOG-${shortRef}`;
    const caseReference = `PS-${new Date().getFullYear()}-${shortRef}`;

    await db.insert(schema.aogRequests).values({
      id: requestId,
      userId: user.id,
      aircraftId: selectedAircraft.id,
      registration: selectedAircraft.registration,
      location: data.location || selectedAircraft.baseAirport,
      aircraftType: data.aircraftType || selectedAircraft.makeModel,
      ataChapter: data.ataChapter,
      affectedSystem: data.affectedSystem,
      partNumber: data.partNumber,
      issueDescription: data.issueDescription,
      urgency: data.urgency,
      status: "Submitted",
      exceptionStates: [],
      contactName: data.contactName || user.name,
      contactPhone: data.contactPhone || user.phone,
      contactEmail: data.contactEmail || user.email,
      peopleOnBoard: data.peopleOnBoard,
      flyingDeadline: data.flyingDeadline,
      amoAware: data.amoAware,
      caseReference,
    });

    await db.insert(schema.aogStatusEvents).values({
      id: `se_${crypto.randomUUID()}`,
      requestId,
      status: "Submitted",
      note: "",
      createdByUserId: user.id,
      createdAt: new Date(),
    });

    if (data.attachments.length > 0) {
      await db.insert(schema.aogRequestAttachments).values(
        data.attachments.map((fileName) => ({
          id: `att_${crypto.randomUUID()}`,
          requestId,
          fileName,
        })),
      );
    }

    return { id: requestId, caseReference };
  });

// ── Server functions — admin ──────────────────────────────────────────────────

export const getAdminOverview = createServerFn({ method: "GET" }).handler(async () => {
  await currentAdmin();
  const { inArray, desc, db, schema } = await loadServerAuth();

  const [profileRows, aircraftRows, requestRows] = await Promise.all([
    db.select().from(schema.profiles).orderBy(desc(schema.profiles.createdAt)),
    db.select().from(schema.aircraft).orderBy(desc(schema.aircraft.createdAt)),
    db.select().from(schema.aogRequests).orderBy(desc(schema.aogRequests.createdAt)),
  ]);

  const attMap = await attachmentsByRequest(
    db,
    schema,
    inArray,
    requestRows.map((r) => r.id),
  );

  return {
    users: profileRows
      .filter((p) => !p.isAdmin)
      .map((p) => ({
        id: p.userId,
        name: p.name,
        email: p.email,
        company: p.company,
        phone: p.phone,
        role: p.role,
        isAdmin: p.isAdmin,
        createdAt: p.createdAt.toISOString(),
      })),
    aircraft: aircraftRows.map(toAircraftRecord),
    requests: requestRows.map((r) => toAogRecord(r, attMap.get(r.id) ?? [])),
  };
});

export const getAdminCustomers = createServerFn({ method: "GET" }).handler(async () => {
  await currentAdmin();
  const { desc, db, schema } = await loadServerAuth();

  const [profileRows, aircraftRows] = await Promise.all([
    db.select().from(schema.profiles).orderBy(desc(schema.profiles.createdAt)),
    db.select().from(schema.aircraft).orderBy(desc(schema.aircraft.createdAt)),
  ]);

  return {
    users: profileRows
      .filter((p) => !p.isAdmin)
      .map((p) => ({
        id: p.userId,
        name: p.name,
        email: p.email,
        company: p.company,
        phone: p.phone,
        role: p.role,
        isAdmin: p.isAdmin,
        createdAt: p.createdAt.toISOString(),
      })),
    aircraft: aircraftRows.map(toAircraftRecord),
  };
});

export const getAdminAircraft = createServerFn({ method: "GET" }).handler(async () => {
  await currentAdmin();
  const { desc, db, schema } = await loadServerAuth();

  const [profileRows, aircraftRows] = await Promise.all([
    db.select().from(schema.profiles).orderBy(desc(schema.profiles.createdAt)),
    db.select().from(schema.aircraft).orderBy(desc(schema.aircraft.createdAt)),
  ]);

  return {
    users: profileRows.map((p) => ({
      id: p.userId,
      name: p.name,
      email: p.email,
      company: p.company,
      phone: p.phone,
      role: p.role,
      isAdmin: p.isAdmin,
      createdAt: p.createdAt.toISOString(),
    })),
    aircraft: aircraftRows.map(toAircraftRecord),
  };
});

export const getAdminAog = createServerFn({ method: "GET" }).handler(async () => {
  await currentAdmin();
  const { inArray, desc, db, schema } = await loadServerAuth();

  const requestRows = await db
    .select()
    .from(schema.aogRequests)
    .orderBy(desc(schema.aogRequests.createdAt));

  const attMap = await attachmentsByRequest(
    db,
    schema,
    inArray,
    requestRows.map((r) => r.id),
  );

  // Fetch admin users to populate handler dropdown
  const adminProfiles = await db
    .select({ userId: schema.profiles.userId, name: schema.profiles.name })
    .from(schema.profiles);

  return {
    requests: requestRows.map((r) => toAogRecord(r, attMap.get(r.id) ?? [])),
    adminUsers: adminProfiles,
  };
});

export const updateAogStatus = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1), status: statusSchema }))
  .handler(async ({ data }) => {
    const admin = await currentAdmin();
    const { eq, db, schema } = await loadServerAuth();
    const now = new Date();
    await db
      .update(schema.aogRequests)
      .set({ status: data.status, updatedAt: now })
      .where(eq(schema.aogRequests.id, data.id));
    await db.insert(schema.aogStatusEvents).values({
      id: `se_${crypto.randomUUID()}`,
      requestId: data.id,
      status: data.status,
      note: "",
      createdByUserId: admin.id,
      createdAt: now,
    });
    return { ok: true };
  });

export const updateFreightTracking = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string().min(1),
      freightCourier: z.string().default(""),
      freightTrackingRef: z.string().default(""),
      freightExpectedArrival: z.string().optional(),
      freightNotes: z.string().default(""),
    }),
  )
  .handler(async ({ data }) => {
    await currentAdmin();
    const { eq, db, schema } = await loadServerAuth();
    await db
      .update(schema.aogRequests)
      .set({
        freightCourier: data.freightCourier,
        freightTrackingRef: data.freightTrackingRef,
        freightExpectedArrival: data.freightExpectedArrival
          ? new Date(data.freightExpectedArrival)
          : null,
        freightNotes: data.freightNotes,
        updatedAt: new Date(),
      })
      .where(eq(schema.aogRequests.id, data.id));
    return { ok: true };
  });

export const toggleExceptionState = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1), state: z.string() }))
  .handler(async ({ data }) => {
    await currentAdmin();
    const { eq, db, schema } = await loadServerAuth();

    const [row] = await db
      .select({ exceptionStates: schema.aogRequests.exceptionStates })
      .from(schema.aogRequests)
      .where(eq(schema.aogRequests.id, data.id));

    if (!row) return { ok: true };

    const current = row.exceptionStates ?? [];
    const next = current.includes(data.state)
      ? current.filter((s) => s !== data.state)
      : [...current, data.state];

    await db
      .update(schema.aogRequests)
      .set({ exceptionStates: next, updatedAt: new Date() })
      .where(eq(schema.aogRequests.id, data.id));

    return { ok: true };
  });

export const verifyAircraft = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await currentAdmin();
    const { eq, db, schema } = await loadServerAuth();

    const [ac] = await db
      .select({
        userId: schema.aircraft.userId,
        registration: schema.aircraft.registration,
        verificationStatus: schema.aircraft.verificationStatus,
      })
      .from(schema.aircraft)
      .where(eq(schema.aircraft.id, data.id));

    await db
      .update(schema.aircraft)
      .set({ verificationStatus: "Verified", updatedAt: new Date() })
      .where(eq(schema.aircraft.id, data.id));

    // Notify the owner that cover is now active (only on transition into Verified).
    if (ac && ac.verificationStatus !== "Verified") {
      await createNotificationInternal(
        db,
        schema,
        ac.userId,
        "Billing",
        "AOG cover active",
        `Your AOG cover for ${ac.registration} is now active. You can submit AOG requests for this aircraft.`,
      );
    }

    return { ok: true };
  });

export const getAogStatusEvents = createServerFn({ method: "GET" })
  .inputValidator(z.object({ requestId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const user = await currentUser();
    const { eq, asc, db, schema } = await loadServerAuth();

    const [req] = await db
      .select({ userId: schema.aogRequests.userId })
      .from(schema.aogRequests)
      .where(eq(schema.aogRequests.id, data.requestId));

    if (!req || req.userId !== user.id) throw new Error("Access denied.");

    const events = await db
      .select()
      .from(schema.aogStatusEvents)
      .where(eq(schema.aogStatusEvents.requestId, data.requestId))
      .orderBy(asc(schema.aogStatusEvents.createdAt));

    return events;
  });

export const createAdminNote = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({ subjectType: z.string(), subjectId: z.string(), note: z.string().min(1) }),
  )
  .handler(async ({ data }) => {
    const admin = await currentAdmin();
    const { db, schema } = await loadServerAuth();
    await db.insert(schema.adminNotes).values({
      id: `note_${crypto.randomUUID()}`,
      subjectType: data.subjectType,
      subjectId: data.subjectId,
      note: data.note,
      createdByUserId: admin.id,
      createdAt: new Date(),
    });
    return { ok: true };
  });

export const getAdminNotes = createServerFn({ method: "GET" })
  .inputValidator(z.object({ subjectType: z.string(), subjectId: z.string() }))
  .handler(async ({ data }) => {
    await currentAdmin();
    const { eq, and, asc, db, schema } = await loadServerAuth();
    const rows = await db
      .select()
      .from(schema.adminNotes)
      .where(
        and(
          eq(schema.adminNotes.subjectType, data.subjectType),
          eq(schema.adminNotes.subjectId, data.subjectId),
        ),
      )
      .orderBy(asc(schema.adminNotes.createdAt));
    return rows;
  });

export const getAogStatusEventsAdmin = createServerFn({ method: "GET" })
  .inputValidator(z.object({ requestId: z.string().min(1) }))
  .handler(async ({ data }) => {
    await currentAdmin();
    const { eq, asc, db, schema } = await loadServerAuth();

    const events = await db
      .select()
      .from(schema.aogStatusEvents)
      .where(eq(schema.aogStatusEvents.requestId, data.requestId))
      .orderBy(asc(schema.aogStatusEvents.createdAt));

    return events;
  });

// ── Schemas re-exported for use in routes ─────────────────────────────────────

export const apiSchemas = {
  role: roleSchema,
  plan: planSchema,
  verificationStatus: verificationStatusSchema,
  aircraftCategory: aircraftCategorySchema,
  urgency: urgencySchema,
  status: statusSchema,
  ataChapter: ataChapterSchema,
};

// ── Plain async API helpers (called from API route handler) ───────────────────

export type PlaneServeApiPartMatch = {
  id: string;
  label: string;
  partNumber: string;
  source: "aircraft-profile" | "alternate-part-number" | "historical-request";
  aircraftId: string;
  registration: string;
  aircraftType: string;
  confidence: "high" | "medium" | "low";
  requestable: true;
};

export async function getApiCurrentUser() {
  return currentUser();
}

export async function getApiAircraft(): Promise<AircraftRecord[]> {
  const user = await currentUser();
  const { eq, desc, db, schema } = await loadServerAuth();
  const rows = user.isAdmin
    ? await db.select().from(schema.aircraft).orderBy(desc(schema.aircraft.createdAt))
    : await db
        .select()
        .from(schema.aircraft)
        .where(eq(schema.aircraft.userId, user.id))
        .orderBy(desc(schema.aircraft.createdAt));
  return rows.map(toAircraftRecord);
}

export const getAogRequests = createServerFn({ method: "GET" }).handler(
  async (): Promise<AogRecord[]> => {
    const user = await currentUser();
    const { eq, inArray, desc, db, schema } = await loadServerAuth();
    const rows = await db
      .select()
      .from(schema.aogRequests)
      .where(eq(schema.aogRequests.userId, user.id))
      .orderBy(desc(schema.aogRequests.createdAt));
    const attMap = await attachmentsByRequest(
      db,
      schema,
      inArray,
      rows.map((r) => r.id),
    );
    return rows.map((r) => toAogRecord(r, attMap.get(r.id) ?? []));
  },
);

export const getSupplierQuotes = createServerFn({ method: "GET" })
  .inputValidator(z.object({ requestId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const user = await currentUser();
    const { eq, db, schema } = await loadServerAuth();
    // verify ownership
    const [req] = await db
      .select()
      .from(schema.aogRequests)
      .where(eq(schema.aogRequests.id, data.requestId));
    if (!req) throw new Error("Not found");
    if (!user.isAdmin && req.userId !== user.id) throw new Error("Access denied");
    const quotes = await db
      .select()
      .from(schema.supplierQuotes)
      .where(eq(schema.supplierQuotes.requestId, data.requestId));
    return quotes.map(toQuoteRecord);
  });

export async function getApiAogRequests(): Promise<AogRecord[]> {
  const user = await currentUser();
  const { eq, inArray, desc, db, schema } = await loadServerAuth();
  const rows = user.isAdmin
    ? await db.select().from(schema.aogRequests).orderBy(desc(schema.aogRequests.createdAt))
    : await db
        .select()
        .from(schema.aogRequests)
        .where(eq(schema.aogRequests.userId, user.id))
        .orderBy(desc(schema.aogRequests.createdAt));
  const attMap = await attachmentsByRequest(
    db,
    schema,
    inArray,
    rows.map((r) => r.id),
  );
  return rows.map((r) => toAogRecord(r, attMap.get(r.id) ?? []));
}

export async function getApiAdminOverview() {
  await currentAdmin();
  const { desc, inArray, db, schema } = await loadServerAuth();
  const [profileRows, aircraftRows, requestRows, subRows, invRows] = await Promise.all([
    db.select().from(schema.profiles).orderBy(desc(schema.profiles.createdAt)),
    db.select().from(schema.aircraft).orderBy(desc(schema.aircraft.createdAt)),
    db.select().from(schema.aogRequests).orderBy(desc(schema.aogRequests.createdAt)),
    db.select().from(schema.subscriptions).orderBy(desc(schema.subscriptions.createdAt)),
    db.select().from(schema.invoices).orderBy(desc(schema.invoices.createdAt)),
  ]);
  const attMap = await attachmentsByRequest(
    db,
    schema,
    inArray,
    requestRows.map((r) => r.id),
  );
  return {
    users: profileRows
      .filter((p) => !p.isAdmin)
      .map((p) => ({
        id: p.userId,
        name: p.name,
        email: p.email,
        company: p.company,
        phone: p.phone,
        role: p.role,
        isAdmin: p.isAdmin,
        createdAt: p.createdAt.toISOString(),
      })),
    aircraft: aircraftRows.map(toAircraftRecord),
    requests: requestRows.map((r) => toAogRecord(r, attMap.get(r.id) ?? [])),
    subscriptions: subRows.map((s) => ({
      id: s.id,
      userId: s.userId,
      aircraftId: s.aircraftId,
      plan: s.plan,
      status: s.status,
      mockProviderRef: s.mockProviderRef,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    })),
    invoices: invRows.map((i) => ({
      id: i.id,
      userId: i.userId,
      subscriptionId: i.subscriptionId,
      amountCents: i.amountCents,
      status: i.status,
      createdAt: i.createdAt.toISOString(),
    })),
  };
}

export async function createApiAircraft(data: {
  registration: string;
  category: AircraftCategory;
  makeModel: string;
  serialNumber: string;
  yearOfManufacture: string;
  typeOfOperations: string;
  ownerOperatorName: string;
  baseAirport: string;
  engineManufacturer?: string;
  engineType?: string;
  engineSeries?: string;
  engineSerialNumbers?: string;
  numberOfEngines?: number;
  maintenanceProgramme?: string;
  nationality?: string;
  registryStandard?: string;
  amoName?: string;
  amoPhone?: string;
  amoEmergencyPhone?: string;
  picPhone?: string;
  maintenancePoc?: string;
  insurerName?: string;
  insurerPolicyRef?: string;
  totalAirframeHours?: string;
  avionicsSuite?: string;
  commonParts?: string[];
  alternatePartNumbers?: string[];
  supportNotes?: string;
  plan: Plan;
}): Promise<AircraftRecord> {
  const user = await currentUser();
  const { db, schema } = await loadServerAuth();
  const aircraftId = `ac_${crypto.randomUUID()}`;
  const subscriptionId = `sub_${crypto.randomUUID()}`;

  await db.insert(schema.aircraft).values({
    id: aircraftId,
    userId: user.id,
    registration: data.registration.toUpperCase(),
    category: data.category,
    makeModel: data.makeModel,
    serialNumber: data.serialNumber,
    yearOfManufacture: data.yearOfManufacture,
    typeOfOperations: data.typeOfOperations,
    ownerOperatorName: data.ownerOperatorName,
    baseAirport: data.baseAirport,
    verificationStatus: "Pending",
    engineManufacturer: data.engineManufacturer ?? "",
    engineType: data.engineType ?? "",
    engineSeries: data.engineSeries ?? "",
    engineSerialNumbers: data.engineSerialNumbers ?? "",
    numberOfEngines: data.numberOfEngines ?? 2,
    maintenanceProgramme: data.maintenanceProgramme ?? "",
    nationality: data.nationality ?? "",
    registryStandard: data.registryStandard ?? "",
    amoName: data.amoName ?? "",
    amoPhone: data.amoPhone ?? "",
    amoEmergencyPhone: data.amoEmergencyPhone ?? "",
    picPhone: data.picPhone ?? "",
    maintenancePoc: data.maintenancePoc ?? "",
    insurerName: data.insurerName ?? "",
    insurerPolicyRef: data.insurerPolicyRef ?? "",
    totalAirframeHours: data.totalAirframeHours ?? "",
    plan: data.plan,
    subscriptionStatus: "Active",
  });

  await db.insert(schema.subscriptions).values({
    id: subscriptionId,
    userId: user.id,
    aircraftId,
    plan: data.plan,
    status: "Active",
    mockProviderRef: `mock_${subscriptionId}`,
  });

  return {
    id: aircraftId,
    userId: user.id,
    registration: data.registration.toUpperCase(),
    category: data.category,
    makeModel: data.makeModel,
    serialNumber: data.serialNumber,
    yearOfManufacture: data.yearOfManufacture,
    typeOfOperations: data.typeOfOperations,
    ownerOperatorName: data.ownerOperatorName,
    baseAirport: data.baseAirport,
    verificationStatus: "Pending",
    engineManufacturer: data.engineManufacturer ?? "",
    engineType: data.engineType ?? "",
    engineSeries: data.engineSeries ?? "",
    engineSerialNumbers: data.engineSerialNumbers ?? "",
    numberOfEngines: data.numberOfEngines ?? 2,
    maintenanceProgramme: data.maintenanceProgramme ?? "",
    nationality: data.nationality ?? "",
    registryStandard: data.registryStandard ?? "",
    amoName: data.amoName ?? "",
    amoPhone: data.amoPhone ?? "",
    amoEmergencyPhone: data.amoEmergencyPhone ?? "",
    picPhone: data.picPhone ?? "",
    maintenancePoc: data.maintenancePoc ?? "",
    insurerName: data.insurerName ?? "",
    insurerPolicyRef: data.insurerPolicyRef ?? "",
    totalAirframeHours: data.totalAirframeHours ?? "",
    avionicsSuite: "",
    commonParts: [],
    alternatePartNumbers: [],
    supportNotes: "",
    plan: data.plan,
    subscriptionStatus: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function createApiAogRequest(data: {
  aircraftId: string;
  location?: string;
  aircraftType?: string;
  ataChapter?: AtaChapter;
  affectedSystem: string;
  partNumber?: string;
  issueDescription: string;
  urgency: Urgency;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  attachments?: string[];
}): Promise<AogRecord> {
  const user = await currentUser();
  const { eq, db, schema } = await loadServerAuth();

  const [selectedAircraft] = await db
    .select()
    .from(schema.aircraft)
    .where(eq(schema.aircraft.id, data.aircraftId));

  if (!selectedAircraft) throw new Error("Aircraft not found.");
  if (!user.isAdmin && selectedAircraft.userId !== user.id) {
    throw new Error("Access denied");
  }

  const requestId = `AOG-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const attachments = data.attachments ?? [];

  await db.insert(schema.aogRequests).values({
    id: requestId,
    userId: user.id,
    aircraftId: selectedAircraft.id,
    registration: selectedAircraft.registration,
    location: data.location || selectedAircraft.baseAirport,
    aircraftType: data.aircraftType || selectedAircraft.makeModel,
    ataChapter: data.ataChapter,
    affectedSystem: data.affectedSystem,
    partNumber: data.partNumber ?? "",
    issueDescription: data.issueDescription,
    urgency: data.urgency,
    status: "Submitted",
    exceptionStates: [],
    contactName: data.contactName || user.name,
    contactPhone: data.contactPhone || user.phone,
    contactEmail: data.contactEmail || user.email,
  });

  if (attachments.length > 0) {
    await db.insert(schema.aogRequestAttachments).values(
      attachments.map((fileName) => ({
        id: `att_${crypto.randomUUID()}`,
        requestId,
        fileName,
      })),
    );
  }

  const priority = priorityFor({
    urgency: data.urgency,
    attachments,
    partNumber: data.partNumber ?? "",
  });

  return {
    id: requestId,
    userId: user.id,
    aircraftId: selectedAircraft.id,
    registration: selectedAircraft.registration,
    location: data.location || selectedAircraft.baseAirport,
    aircraftType: data.aircraftType || selectedAircraft.makeModel,
    ataChapter: data.ataChapter,
    affectedSystem: data.affectedSystem,
    partNumber: data.partNumber ?? "",
    issueDescription: data.issueDescription,
    urgency: data.urgency,
    status: "Submitted" as const,
    exceptionStates: [],
    contactName: data.contactName || user.name,
    contactPhone: data.contactPhone || user.phone,
    contactEmail: data.contactEmail || user.email,
    attachments,
    priorityScore: priority.score,
    priorityReasons: priority.reasons,
    requiredDocuments: documentVault(attachments),
    freightCourier: "",
    freightTrackingRef: "",
    freightExpectedArrival: null,
    freightNotes: "",
    handlerId: "",
    awbNumber: "",
    caseRating: null,
    caseRatingComment: "",
    handoverNotes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function updateApiAogStatus(id: string, status: AogStatus): Promise<AogRecord> {
  await currentAdmin();
  const { eq, inArray, db, schema } = await loadServerAuth();
  await db
    .update(schema.aogRequests)
    .set({ status, updatedAt: new Date() })
    .where(eq(schema.aogRequests.id, id));

  const [row] = await db.select().from(schema.aogRequests).where(eq(schema.aogRequests.id, id));

  if (!row) throw new Error("AOG request not found.");

  const attMap = await attachmentsByRequest(db, schema, inArray, [id]);
  return toAogRecord(row, attMap.get(id) ?? []);
}

export async function searchApiParts(input: {
  query?: string;
  aircraftId?: string;
  registration?: string;
}): Promise<PlaneServeApiPartMatch[]> {
  const user = await currentUser();
  const { eq, and, db, schema } = await loadServerAuth();
  const query = input.query?.trim().toLowerCase() ?? "";

  const aircraftRows = await (input.aircraftId
    ? db
        .select()
        .from(schema.aircraft)
        .where(
          user.isAdmin
            ? eq(schema.aircraft.id, input.aircraftId)
            : and(eq(schema.aircraft.id, input.aircraftId), eq(schema.aircraft.userId, user.id)),
        )
    : input.registration
      ? db
          .select()
          .from(schema.aircraft)
          .where(
            user.isAdmin
              ? eq(schema.aircraft.registration, input.registration.toUpperCase())
              : and(
                  eq(schema.aircraft.registration, input.registration.toUpperCase()),
                  eq(schema.aircraft.userId, user.id),
                ),
          )
      : user.isAdmin
        ? db.select().from(schema.aircraft)
        : db.select().from(schema.aircraft).where(eq(schema.aircraft.userId, user.id)));

  const requestRows = await (input.aircraftId
    ? db
        .select()
        .from(schema.aogRequests)
        .where(
          user.isAdmin
            ? eq(schema.aogRequests.aircraftId, input.aircraftId)
            : and(
                eq(schema.aogRequests.aircraftId, input.aircraftId),
                eq(schema.aogRequests.userId, user.id),
              ),
        )
    : input.registration
      ? db
          .select()
          .from(schema.aogRequests)
          .where(
            user.isAdmin
              ? eq(schema.aogRequests.registration, input.registration.toUpperCase())
              : and(
                  eq(schema.aogRequests.registration, input.registration.toUpperCase()),
                  eq(schema.aogRequests.userId, user.id),
                ),
          )
      : user.isAdmin
        ? db.select().from(schema.aogRequests)
        : db.select().from(schema.aogRequests).where(eq(schema.aogRequests.userId, user.id)));

  const matches: PlaneServeApiPartMatch[] = [];
  const seen = new Set<string>();

  for (const ac of aircraftRows) {
    if (
      query &&
      !ac.makeModel.toLowerCase().includes(query) &&
      !ac.registration.toLowerCase().includes(query)
    ) {
      continue;
    }
    const key = `${ac.id}:profile`;
    if (!seen.has(key)) {
      seen.add(key);
      matches.push({
        id: key,
        label: ac.makeModel,
        partNumber: "",
        source: "aircraft-profile",
        aircraftId: ac.id,
        registration: ac.registration,
        aircraftType: ac.makeModel,
        confidence: "medium",
        requestable: true,
      });
    }
  }

  for (const req of requestRows) {
    const haystack = `${req.partNumber} ${req.affectedSystem} ${req.aircraftType}`.toLowerCase();
    if (query && !haystack.includes(query)) continue;
    const key = `${req.aircraftId}:historical:${req.partNumber || req.affectedSystem}`;
    if (seen.has(key)) continue;
    seen.add(key);
    matches.push({
      id: key,
      label: req.affectedSystem,
      partNumber: req.partNumber,
      source: "historical-request",
      aircraftId: req.aircraftId,
      registration: req.registration,
      aircraftType: req.aircraftType,
      confidence: req.status === "Resolved" ? "high" : "low",
      requestable: true,
    });
  }

  return matches;
}

// ── Supplier quote type ───────────────────────────────────────────────────────

export type SupplierQuoteRecord = {
  id: string;
  requestId: string;
  supplierName: string;
  condition: "Serviceable" | "Exchange" | "Overhauled" | "New" | "As Removed";
  priceCents: number;
  netPriceCents: number;
  currency: string;
  leadTime: string;
  paperwork: string;
  freightRoute: string;
  notes: string;
  validUntil: string | null;
  approvedAt: string | null;
  approvedByUserId: string | null;
  createdByUserId: string;
  awbNumber: string;
  createdAt: string;
};

const supplierConditionSchema = z.enum([
  "Serviceable",
  "Exchange",
  "Overhauled",
  "New",
  "As Removed",
]);

function toQuoteRecord(row: {
  id: string;
  requestId: string;
  supplierName: string;
  condition: "Serviceable" | "Exchange" | "Overhauled" | "New" | "As Removed";
  priceCents: number;
  netPriceCents?: number | null;
  currency: string;
  leadTime: string;
  paperwork: string;
  freightRoute: string;
  notes: string;
  validUntil: Date | null;
  approvedAt: Date | null;
  approvedByUserId: string | null;
  createdByUserId: string;
  awbNumber?: string | null;
  createdAt: Date;
}): SupplierQuoteRecord {
  return {
    ...row,
    netPriceCents: row.netPriceCents ?? 0,
    awbNumber: row.awbNumber ?? "",
    validUntil: row.validUntil?.toISOString() ?? null,
    approvedAt: row.approvedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

// ── Aircraft profile update (Tier 2) ─────────────────────────────────────────

export const updateAircraftProfile = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string().min(1),
      engineManufacturer: z.string().optional().default(""),
      engineType: z.string().optional().default(""),
      engineSeries: z.string().optional().default(""),
      engineSerialNumbers: z.string().optional().default(""),
      numberOfEngines: z.number().optional().default(2),
      maintenanceProgramme: z.string().optional().default(""),
      nationality: z.string().optional().default(""),
      registryStandard: z.string().optional().default(""),
      amoName: z.string().optional().default(""),
      amoPhone: z.string().optional().default(""),
      amoEmergencyPhone: z.string().optional().default(""),
      picPhone: z.string().optional().default(""),
      maintenancePoc: z.string().optional().default(""),
      insurerName: z.string().optional().default(""),
      insurerPolicyRef: z.string().optional().default(""),
      totalAirframeHours: z.string().optional().default(""),
    }),
  )
  .handler(async ({ data }) => {
    const user = await currentUser();
    const { eq, db, schema } = await loadServerAuth();
    const [existing] = await db
      .select({ id: schema.aircraft.id })
      .from(schema.aircraft)
      .where(eq(schema.aircraft.id, data.id));
    if (!existing) throw new Error("Aircraft not found.");
    await db
      .update(schema.aircraft)
      .set({
        engineManufacturer: data.engineManufacturer,
        engineType: data.engineType,
        engineSeries: data.engineSeries,
        engineSerialNumbers: data.engineSerialNumbers,
        numberOfEngines: data.numberOfEngines,
        maintenanceProgramme: data.maintenanceProgramme,
        nationality: data.nationality,
        registryStandard: data.registryStandard,
        amoName: data.amoName,
        amoPhone: data.amoPhone,
        amoEmergencyPhone: data.amoEmergencyPhone,
        picPhone: data.picPhone,
        maintenancePoc: data.maintenancePoc,
        insurerName: data.insurerName,
        insurerPolicyRef: data.insurerPolicyRef,
        totalAirframeHours: data.totalAirframeHours,
        updatedAt: new Date(),
      })
      .where(eq(schema.aircraft.id, data.id));
    // Ownership check — only the aircraft owner or admin
    void user;
    return { ok: true };
  });

// ── AOG case detail with quotes ───────────────────────────────────────────────

export type AogCaseDetail = AogRecord & { quotes: SupplierQuoteRecord[] };

export const getAogCaseDetail = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }): Promise<AogCaseDetail> => {
    const user = await currentUser();
    const { eq, inArray, db, schema } = await loadServerAuth();

    const [row] = await db
      .select()
      .from(schema.aogRequests)
      .where(eq(schema.aogRequests.id, data.id));

    if (!row) throw new Error("Case not found.");
    if (!user.isAdmin && row.userId !== user.id) throw new Error("Access denied.");

    const attMap = await attachmentsByRequest(db, schema, inArray, [data.id]);

    const quoteRows = await db
      .select()
      .from(schema.supplierQuotes)
      .where(eq(schema.supplierQuotes.requestId, data.id));

    return {
      ...toAogRecord(row, attMap.get(data.id) ?? []),
      quotes: quoteRows.map(toQuoteRecord),
    };
  });

// ── Admin: add/remove supplier quotes ────────────────────────────────────────

export const addSupplierQuote = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      requestId: z.string().min(1),
      supplierName: z.string().min(1),
      condition: supplierConditionSchema,
      priceCents: z.number().int().min(0),
      currency: z.string().default("usd"),
      leadTime: z.string().default(""),
      paperwork: z.string().default(""),
      freightRoute: z.string().default(""),
      notes: z.string().default(""),
      validUntil: z.string().optional(),
      netPriceCents: z.number().int().min(0).default(0),
    }),
  )
  .handler(async ({ data }) => {
    const admin = await currentAdmin();
    const { db, schema } = await loadServerAuth();
    const id = `sq_${crypto.randomUUID()}`;
    await db.insert(schema.supplierQuotes).values({
      id,
      requestId: data.requestId,
      supplierName: data.supplierName,
      condition: data.condition,
      priceCents: data.priceCents,
      currency: data.currency,
      leadTime: data.leadTime,
      paperwork: data.paperwork,
      freightRoute: data.freightRoute,
      notes: data.notes,
      validUntil: data.validUntil ? new Date(data.validUntil) : null,
      netPriceCents: data.netPriceCents ?? 0,
      createdByUserId: admin.id,
    });
    return { id };
  });

export const removeSupplierQuote = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await currentAdmin();
    const { eq, db, schema } = await loadServerAuth();
    await db.delete(schema.supplierQuotes).where(eq(schema.supplierQuotes.id, data.id));
    return { ok: true };
  });

// ── Subscriber: approve a quote ───────────────────────────────────────────────

export const approveSupplierQuote = createServerFn({ method: "POST" })
  .inputValidator(z.object({ quoteId: z.string().min(1), requestId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const user = await currentUser();
    const { eq, db, schema } = await loadServerAuth();

    const [req] = await db
      .select({ userId: schema.aogRequests.userId })
      .from(schema.aogRequests)
      .where(eq(schema.aogRequests.id, data.requestId));

    if (!req || req.userId !== user.id) throw new Error("Access denied.");

    const now = new Date();
    await db
      .update(schema.supplierQuotes)
      .set({ approvedAt: now, approvedByUserId: user.id })
      .where(eq(schema.supplierQuotes.id, data.quoteId));

    await db
      .update(schema.aogRequests)
      .set({ status: "Confirmed", updatedAt: now })
      .where(eq(schema.aogRequests.id, data.requestId));

    await db.insert(schema.aogStatusEvents).values({
      id: `se_${crypto.randomUUID()}`,
      requestId: data.requestId,
      status: "Confirmed",
      note: "Supplier quote approved by operator.",
      createdByUserId: user.id,
      createdAt: now,
    });

    return { ok: true };
  });

// ── Admin: get full AOG queue with quotes ─────────────────────────────────────

export const getAdminAogWithQuotes = createServerFn({ method: "GET" }).handler(async () => {
  await currentAdmin();
  const { desc, inArray, db, schema } = await loadServerAuth();

  const requestRows = await db
    .select()
    .from(schema.aogRequests)
    .orderBy(desc(schema.aogRequests.createdAt));

  const attMap = await attachmentsByRequest(
    db,
    schema,
    inArray,
    requestRows.map((r) => r.id),
  );

  const quoteRows = await db.select().from(schema.supplierQuotes);
  const quotesByRequest = new Map<string, SupplierQuoteRecord[]>();
  for (const q of quoteRows) {
    const list = quotesByRequest.get(q.requestId) ?? [];
    list.push(toQuoteRecord(q));
    quotesByRequest.set(q.requestId, list);
  }

  const adminProfiles = await db
    .select({ userId: schema.profiles.userId, name: schema.profiles.name })
    .from(schema.profiles);

  return {
    requests: requestRows.map((r) => ({
      ...toAogRecord(r, attMap.get(r.id) ?? []),
      quotes: quotesByRequest.get(r.id) ?? [],
    })),
    adminUsers: adminProfiles,
  };
});

// ── Internal helper: create a notification ────────────────────────────────────

async function createNotificationInternal(
  db: Awaited<ReturnType<typeof loadServerAuth>>["db"],
  schema: Awaited<ReturnType<typeof loadServerAuth>>["schema"],
  userId: string,
  category: "AOG" | "Intelligence" | "Billing",
  title: string,
  body: string,
  requestId?: string,
) {
  await db.insert(schema.notifications).values({
    id: `notif_${crypto.randomUUID()}`,
    userId,
    category,
    title,
    body,
    requestId: requestId ?? null,
    isRead: false,
    createdAt: new Date(),
  });
}

// ── Notifications ─────────────────────────────────────────────────────────────

export const getNotifications = createServerFn({ method: "GET" })
  .inputValidator(z.object({ category: z.string().optional() }))
  .handler(async ({ data }) => {
    const user = await currentUser();
    const { eq, and, desc, db, schema } = await loadServerAuth();
    const conditions = [eq(schema.notifications.userId, user.id)];
    if (data.category && data.category !== "All") {
      conditions.push(
        eq(schema.notifications.category, data.category as "AOG" | "Intelligence" | "Billing"),
      );
    }
    const rows = await db
      .select()
      .from(schema.notifications)
      .where(and(...conditions))
      .orderBy(desc(schema.notifications.createdAt));
    return rows;
  });

export const getUnreadCounts = createServerFn({ method: "GET" }).handler(async () => {
  const user = await currentUser();
  const { eq, and, db, schema } = await loadServerAuth();
  const [notifs, msgs] = await Promise.all([
    db
      .select({ id: schema.notifications.id })
      .from(schema.notifications)
      .where(and(eq(schema.notifications.userId, user.id), eq(schema.notifications.isRead, false))),
    db
      .select({ id: schema.messages.id })
      .from(schema.messages)
      .where(
        and(
          eq(schema.messages.userId, user.id),
          eq(schema.messages.senderType, "admin"),
          eq(schema.messages.isRead, false),
        ),
      ),
  ]);
  return { notifications: notifs.length, messages: msgs.length };
});

// ── Stripe ────────────────────────────────────────────────────────────────────

type SubStatus = "Active" | "Pending" | "Cancelled";

// Map a Stripe subscription status onto our internal enum.
export function mapStripeStatus(stripeStatus: string): SubStatus {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return "Active";
    case "past_due":
    case "incomplete":
      return "Pending";
    default: // canceled, unpaid, incomplete_expired, paused
      return "Cancelled";
  }
}

// Sync a subscription's status (and its aircraft's cover) from a Stripe webhook
// event. Looked up by stripeSubscriptionId; no-op if we don't track it.
export async function syncStripeSubscription(stripeSubscriptionId: string, status: SubStatus) {
  const { eq, db, schema } = await loadServerAuth();
  const [sub] = await db
    .update(schema.subscriptions)
    .set({ status, updatedAt: new Date() })
    .where(eq(schema.subscriptions.stripeSubscriptionId, stripeSubscriptionId))
    .returning();
  if (sub) {
    await db
      .update(schema.aircraft)
      .set({ subscriptionStatus: status })
      .where(eq(schema.aircraft.id, sub.aircraftId));
  }
  return sub ?? null;
}

export const createStripeSubscription = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      paymentMethodId: z.string().min(1),
      email: z.string().email(),
      name: z.string().min(1),
      plan: z.enum(["monthly", "annual"]),
    }),
  )
  .handler(async ({ data }) => {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    // Ensure product exists (idempotent via search)
    const products = await stripe.products.search({
      query: 'name:"PlaneServe AOG Support"',
      limit: 1,
    });
    let productId: string;
    if (products.data.length > 0) {
      productId = products.data[0].id;
    } else {
      const product = await stripe.products.create({ name: "PlaneServe AOG Support" });
      productId = product.id;
    }

    // Price data — $100/mo monthly, $1000/yr annual
    const priceData =
      data.plan === "annual"
        ? {
            currency: "usd",
            unit_amount: 100000,
            product: productId,
            recurring: { interval: "year" as const },
          }
        : {
            currency: "usd",
            unit_amount: 10000,
            product: productId,
            recurring: { interval: "month" as const },
          };

    // Create customer
    const customer = await stripe.customers.create({
      email: data.email,
      name: data.name,
      payment_method: data.paymentMethodId,
      invoice_settings: { default_payment_method: data.paymentMethodId },
    });

    // Create subscription (incomplete until payment confirmed)
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price_data: priceData }],
      payment_behavior: "default_incomplete",
      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    });

    const invoice = subscription.latest_invoice as any;
    const clientSecret = invoice?.payment_intent?.client_secret ?? null;

    return {
      subscriptionId: subscription.id,
      customerId: customer.id,
      clientSecret,
    };
  });

export const markMessagesRead = createServerFn({ method: "POST" }).handler(async () => {
  const user = await currentUser();
  const { eq, and, db, schema } = await loadServerAuth();
  await db
    .update(schema.messages)
    .set({ isRead: true })
    .where(and(eq(schema.messages.userId, user.id), eq(schema.messages.senderType, "admin")));
  return { ok: true };
});

export const markNotificationRead = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const user = await currentUser();
    const { eq, and, db, schema } = await loadServerAuth();
    await db
      .update(schema.notifications)
      .set({ isRead: true })
      .where(and(eq(schema.notifications.id, data.id), eq(schema.notifications.userId, user.id)));
    return { ok: true };
  });

export const markAllNotificationsRead = createServerFn({ method: "POST" }).handler(async () => {
  const user = await currentUser();
  const { eq, db, schema } = await loadServerAuth();
  await db
    .update(schema.notifications)
    .set({ isRead: true })
    .where(eq(schema.notifications.userId, user.id));
  return { ok: true };
});

// ── Messages ──────────────────────────────────────────────────────────────────

export const getMessages = createServerFn({ method: "GET" })
  .inputValidator(z.object({ requestId: z.string().optional() }))
  .handler(async ({ data }) => {
    const user = await currentUser();
    const { eq, and, asc, db, schema } = await loadServerAuth();
    const conditions = [eq(schema.messages.userId, user.id)];
    if (data.requestId) conditions.push(eq(schema.messages.requestId, data.requestId));
    const rows = await db
      .select()
      .from(schema.messages)
      .where(and(...conditions))
      .orderBy(asc(schema.messages.createdAt));
    return rows;
  });

export const sendMessage = createServerFn({ method: "POST" })
  .inputValidator(z.object({ requestId: z.string().default(""), body: z.string().min(1) }))
  .handler(async ({ data }) => {
    const user = await currentUser();
    const { db, schema } = await loadServerAuth();
    await db.insert(schema.messages).values({
      id: `msg_${crypto.randomUUID()}`,
      requestId: data.requestId,
      userId: user.id,
      senderId: user.id,
      senderType: "subscriber",
      body: data.body,
      createdAt: new Date(),
    });
    return { ok: true };
  });

// ── Admin: messages / comms ───────────────────────────────────────────────────

export const getAdminConversations = createServerFn({ method: "GET" }).handler(async () => {
  await currentAdmin();
  const { desc, db, schema } = await loadServerAuth();
  // Get all messages, group by userId — return last message per user
  const rows = await db.select().from(schema.messages).orderBy(desc(schema.messages.createdAt));

  // Group by userId
  const threads = new Map<string, (typeof rows)[0]>();
  for (const row of rows) {
    if (!threads.has(row.userId)) threads.set(row.userId, row);
  }

  // Get profile info for each userId
  const userIds = [...threads.keys()];
  if (userIds.length === 0) return [];

  const { inArray } = await loadServerAuth();
  const profiles = await db
    .select({
      userId: schema.profiles.userId,
      name: schema.profiles.name,
      company: schema.profiles.company,
    })
    .from(schema.profiles)
    .where(inArray(schema.profiles.userId, userIds));

  const profileMap = new Map(profiles.map((p) => [p.userId, p]));

  return userIds.map((uid) => {
    const last = threads.get(uid)!;
    const profile = profileMap.get(uid);
    return {
      userId: uid,
      name: profile?.name ?? "Unknown",
      company: profile?.company ?? "",
      lastMessage: last.body,
      lastAt: last.createdAt,
      requestId: last.requestId,
    };
  });
});

export const getAdminThreadMessages = createServerFn({ method: "GET" })
  .inputValidator(z.object({ userId: z.string().min(1) }))
  .handler(async ({ data }) => {
    await currentAdmin();
    const { eq, asc, db, schema } = await loadServerAuth();
    return db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.userId, data.userId))
      .orderBy(asc(schema.messages.createdAt));
  });

export const sendAdminMessage = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      userId: z.string().min(1),
      requestId: z.string().default(""),
      body: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const admin = await currentAdmin();
    const { db, schema } = await loadServerAuth();
    await db.insert(schema.messages).values({
      id: `msg_${crypto.randomUUID()}`,
      requestId: data.requestId,
      userId: data.userId,
      senderId: admin.id,
      senderType: "admin",
      body: data.body,
      createdAt: new Date(),
    });
    // Create a notification for the subscriber
    await createNotificationInternal(
      db,
      schema,
      data.userId,
      "AOG",
      "Message from PlaneServe Desk",
      data.body.slice(0, 120),
      data.requestId || undefined,
    );
    return { ok: true };
  });

// ── USM Market Signals ────────────────────────────────────────────────────────

export const getUsmSignals = createServerFn({ method: "GET" }).handler(async () => {
  await currentAdmin();
  const { desc, db, schema } = await loadServerAuth();
  return db.select().from(schema.usmMarketSignals).orderBy(desc(schema.usmMarketSignals.riskScore));
});

export const getUsmSignalsPublic = createServerFn({ method: "GET" }).handler(async () => {
  // For subscriber parts intelligence page - returns all signals (no admin check)
  await currentUser();
  const { desc, db, schema } = await loadServerAuth();
  return db.select().from(schema.usmMarketSignals).orderBy(desc(schema.usmMarketSignals.riskScore));
});

export const upsertUsmSignal = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string().optional(),
      partNumber: z.string().min(1),
      aircraftType: z.string().default(""),
      description: z.string().default(""),
      availabilityPct: z.number().min(0).max(100).default(0),
      trend: z.string().default("stable"),
      supplierCount: z.number().min(0).default(0),
      priceCents: z.number().min(0).default(0),
      currency: z.string().default("usd"),
      riskScore: z.number().min(0).max(100).default(0),
      notes: z.string().default(""),
    }),
  )
  .handler(async ({ data }) => {
    const admin = await currentAdmin();
    const { eq, db, schema } = await loadServerAuth();
    const id = data.id ?? `usm_${crypto.randomUUID()}`;
    const payload = {
      id,
      partNumber: data.partNumber,
      aircraftType: data.aircraftType,
      description: data.description,
      availabilityPct: data.availabilityPct,
      trend: data.trend,
      supplierCount: data.supplierCount,
      priceCents: data.priceCents,
      currency: data.currency,
      riskScore: data.riskScore,
      notes: data.notes,
      updatedBy: admin.name,
      updatedAt: new Date(),
    };
    if (data.id) {
      await db
        .update(schema.usmMarketSignals)
        .set(payload)
        .where(eq(schema.usmMarketSignals.id, data.id));
    } else {
      await db.insert(schema.usmMarketSignals).values(payload);
    }
    return { ok: true, id };
  });

export const deleteUsmSignal = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await currentAdmin();
    const { eq, db, schema } = await loadServerAuth();
    await db.delete(schema.usmMarketSignals).where(eq(schema.usmMarketSignals.id, data.id));
    return { ok: true };
  });

// ── Case Failure Log ──────────────────────────────────────────────────────────

export const getCaseFailureLogs = createServerFn({ method: "GET" }).handler(async () => {
  await currentAdmin();
  const { desc, db, schema } = await loadServerAuth();
  return db.select().from(schema.caseFailureLog).orderBy(desc(schema.caseFailureLog.loggedAt));
});

export const createCaseFailureLog = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      requestId: z.string().min(1),
      failureCause: z.string().min(1),
      hoursAtFailure: z.string().default(""),
      coFailureNotes: z.string().default(""),
    }),
  )
  .handler(async ({ data }) => {
    const admin = await currentAdmin();
    const { db, schema } = await loadServerAuth();
    await db.insert(schema.caseFailureLog).values({
      id: `cfl_${crypto.randomUUID()}`,
      requestId: data.requestId,
      failureCause: data.failureCause,
      hoursAtFailure: data.hoursAtFailure,
      coFailureNotes: data.coFailureNotes,
      loggedBy: admin.name,
      loggedAt: new Date(),
    });
    return { ok: true };
  });

// ── Supplier Companies (admin) ────────────────────────────────────────────────

export const getSupplierCompanies = createServerFn({ method: "GET" }).handler(async () => {
  await currentAdmin();
  const { asc, db, schema } = await loadServerAuth();
  return db.select().from(schema.supplierCompanies).orderBy(asc(schema.supplierCompanies.name));
});

export const createSupplierCompany = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1),
      contactName: z.string().default(""),
      contactEmail: z.string().default(""),
      contactPhone: z.string().default(""),
      loaSigned: z.boolean().default(false),
      specialisms: z.string().default(""),
    }),
  )
  .handler(async ({ data }) => {
    await currentAdmin();
    const { db, schema } = await loadServerAuth();
    const id = `sup_${crypto.randomUUID()}`;
    await db.insert(schema.supplierCompanies).values({ id, ...data, createdAt: new Date() });
    return { ok: true, id };
  });

// ── Supplier RFQs (admin send + supplier view) ────────────────────────────────

export const sendSupplierRfq = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      requestId: z.string().min(1),
      supplierCompanyId: z.string().min(1),
      partDescription: z.string().default(""),
      partNumber: z.string().default(""),
      aircraftType: z.string().default(""),
      location: z.string().default(""),
      documentationRequired: z.string().default(""),
    }),
  )
  .handler(async ({ data }) => {
    await currentAdmin();
    const { db, schema } = await loadServerAuth();
    await db.insert(schema.supplierRfqs).values({
      id: `rfq_${crypto.randomUUID()}`,
      ...data,
      status: "sent",
      sentAt: new Date(),
      quoteSubmitted: false,
    });
    return { ok: true };
  });

// ── Supplier portal auth helper ───────────────────────────────────────────────

async function currentSupplier() {
  const user = await currentUser();
  const { eq, db, schema } = await loadServerAuth();
  const [row] = await db
    .select()
    .from(schema.supplierUsers)
    .where(eq(schema.supplierUsers.userId, user.id));
  if (!row) throw new Error("Supplier access required.");
  const [company] = await db
    .select()
    .from(schema.supplierCompanies)
    .where(eq(schema.supplierCompanies.id, row.supplierCompanyId));
  return { user, company: company! };
}

export const ensureSupplierSession = createServerFn({ method: "GET" }).handler(async () => {
  // Admins can preview the supplier portal
  try {
    return await currentSupplier();
  } catch {
    // Allow admin passthrough for VIEW AS demo switching
    const user = await currentUser();
    if (user.isAdmin)
      return {
        user,
        company: {
          id: "admin-preview",
          name: "Admin Preview",
          contactName: "",
          contactEmail: "",
          contactPhone: "",
          loaSigned: false,
          specialisms: "",
          createdAt: new Date(),
        },
      };
    throw new Error("Supplier access required.");
  }
});

export const getSupplierRfqs = createServerFn({ method: "GET" }).handler(async () => {
  let company: { id: string; name: string };
  try {
    const r = await currentSupplier();
    company = r.company;
  } catch {
    const user = await currentUser();
    if (!user.isAdmin) throw new Error("Supplier access required.");
    company = { id: "admin-preview", name: "Admin Preview" };
  }
  if (company.id === "admin-preview") return { company, rfqs: [] };
  const { eq, desc, db, schema } = await loadServerAuth();
  const rfqs = await db
    .select()
    .from(schema.supplierRfqs)
    .where(eq(schema.supplierRfqs.supplierCompanyId, company.id))
    .orderBy(desc(schema.supplierRfqs.sentAt));
  return { company, rfqs };
});

export const submitSupplierQuote = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      rfqId: z.string().min(1),
      requestId: z.string().min(1),
      condition: z.enum(["Serviceable", "Exchange", "Overhauled", "New", "As Removed"]),
      priceCents: z.number().min(0),
      currency: z.string().default("usd"),
      leadTime: z.string().default(""),
      paperwork: z.string().default(""),
      freightRoute: z.string().default(""),
      notes: z.string().default(""),
    }),
  )
  .handler(async ({ data }) => {
    const { user, company } = await currentSupplier();
    const { eq, db, schema } = await loadServerAuth();
    await db.insert(schema.supplierQuotes).values({
      id: `sq_${crypto.randomUUID()}`,
      requestId: data.requestId,
      supplierName: company.name,
      condition: data.condition,
      priceCents: data.priceCents,
      currency: data.currency,
      leadTime: data.leadTime,
      paperwork: data.paperwork,
      freightRoute: data.freightRoute,
      notes: data.notes,
      createdByUserId: user.id,
      createdAt: new Date(),
    });
    await db
      .update(schema.supplierRfqs)
      .set({ status: "responded", respondedAt: new Date(), quoteSubmitted: true })
      .where(eq(schema.supplierRfqs.id, data.rfqId));
    return { ok: true };
  });

export const getSupplierQuoteHistory = createServerFn({ method: "GET" }).handler(async () => {
  const { company } = await currentSupplier();
  const { eq, desc, db, schema } = await loadServerAuth();
  const rfqs = await db
    .select()
    .from(schema.supplierRfqs)
    .where(eq(schema.supplierRfqs.supplierCompanyId, company.id))
    .orderBy(desc(schema.supplierRfqs.sentAt));

  // Find which quotes from this supplier got approved
  const quotes = await db
    .select()
    .from(schema.supplierQuotes)
    .where(eq(schema.supplierQuotes.supplierName, company.name));

  const won = quotes.filter((q) => q.approvedAt).length;
  const total = quotes.length;
  const winRate = total > 0 ? Math.round((won / total) * 100) : 0;

  const avgResponseMs = rfqs
    .filter((r) => r.respondedAt)
    .reduce((acc, r) => acc + (r.respondedAt!.getTime() - r.sentAt.getTime()), 0);
  const avgResponseHrs =
    rfqs.filter((r) => r.respondedAt).length > 0
      ? (avgResponseMs / rfqs.filter((r) => r.respondedAt).length / 3600000).toFixed(1)
      : "—";

  // For each quote, fetch all quotes on the same request to compute anonymised rank
  const quotesWithRank = await Promise.all(
    quotes.map(async (q) => {
      const allForRequest = await db
        .select({ id: schema.supplierQuotes.id, priceCents: schema.supplierQuotes.priceCents })
        .from(schema.supplierQuotes)
        .where(eq(schema.supplierQuotes.requestId, q.requestId));

      const sorted = [...allForRequest].sort((a, b) => a.priceCents - b.priceCents);
      const rank = sorted.findIndex((x) => x.id === q.id) + 1;
      const totalBids = allForRequest.length;
      return { ...q, priceRank: rank, totalBids };
    }),
  );

  return { company, rfqs, quotes: quotesWithRank, won, total, winRate, avgResponseHrs };
});

// ── Value Summary (subscriber) ────────────────────────────────────────────────

export const getValueSummary = createServerFn({ method: "GET" }).handler(async () => {
  const user = await currentUser();
  const { eq, inArray, desc, db, schema } = await loadServerAuth();

  const [aircraftRows, requestRows, invoiceRows] = await Promise.all([
    db.select().from(schema.aircraft).where(eq(schema.aircraft.userId, user.id)),
    db.select().from(schema.aogRequests).where(eq(schema.aogRequests.userId, user.id)),
    db.select().from(schema.invoices).where(eq(schema.invoices.userId, user.id)),
  ]);

  const resolvedCases = requestRows.filter((r) => r.status === "Resolved");
  const activeCases = requestRows.filter(
    (r) => r.status !== "Resolved" && r.status !== "Cancelled",
  );

  // Estimate cost avoidance: $5000/day × days grounded (resolved date - submitted date), min 0.5 days
  const costAvoidanceCents = resolvedCases.reduce((acc, r) => {
    const days = Math.max(0.5, (r.updatedAt.getTime() - r.createdAt.getTime()) / 86400000);
    const dailyRate = r.urgency === "Aircraft grounded" ? 500000 : 200000; // cents/day
    return acc + Math.round(days * dailyRate);
  }, 0);

  const subscriptionPaidCents = invoiceRows
    .filter((i) => i.status === "Paid")
    .reduce((acc, i) => acc + i.amountCents, 0);

  const roi =
    subscriptionPaidCents > 0
      ? Math.round((costAvoidanceCents / subscriptionPaidCents) * 10) / 10
      : null;

  return {
    enrolledAircraft: aircraftRows.length,
    activeCases: activeCases.length,
    resolvedCases: resolvedCases.length,
    costAvoidanceCents,
    subscriptionPaidCents,
    roi,
    resolvedCaseDetails: resolvedCases.map((r) => {
      const days = Math.max(0.5, (r.updatedAt.getTime() - r.createdAt.getTime()) / 86400000);
      const dailyRate = r.urgency === "Aircraft grounded" ? 500000 : 200000;
      return {
        id: r.id,
        registration: r.registration,
        affectedSystem: r.affectedSystem,
        partNumber: r.partNumber,
        resolvedAt: r.updatedAt.toISOString(),
        estimatedSaveCents: Math.round(days * dailyRate),
      };
    }),
    subscriptionSinceDate:
      invoiceRows.length > 0
        ? invoiceRows
            .reduce((min, i) => (i.createdAt < min ? i.createdAt : min), invoiceRows[0].createdAt)
            .toISOString()
        : null,
  };
});

// ── Aircraft list (subscriber, lightweight) ───────────────────────────────────

export const getAircraftList = createServerFn({ method: "GET" }).handler(async () => {
  const user = await currentUser();
  const { eq, db, schema } = await loadServerAuth();
  const rows = await db
    .select({
      id: schema.aircraft.id,
      registration: schema.aircraft.registration,
      makeModel: schema.aircraft.makeModel,
      baseAirport: schema.aircraft.baseAirport,
      category: schema.aircraft.category,
      verificationStatus: schema.aircraft.verificationStatus,
      subscriptionStatus: schema.aircraft.subscriptionStatus,
    })
    .from(schema.aircraft)
    .where(eq(schema.aircraft.userId, user.id));
  return rows;
});

// ── Admin: invoices + subscriptions (for revenue page) ───────────────────────

export const getInvoices = createServerFn({ method: "GET" }).handler(async () => {
  await currentAdmin();
  const { desc, db, schema } = await loadServerAuth();
  const rows = await db.select().from(schema.invoices).orderBy(desc(schema.invoices.createdAt));
  return rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));
});

export const getSubscriptions = createServerFn({ method: "GET" }).handler(async () => {
  await currentAdmin();
  const { desc, db, schema } = await loadServerAuth();
  const rows = await db
    .select()
    .from(schema.subscriptions)
    .orderBy(desc(schema.subscriptions.createdAt));
  return rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
});

// ── Admin: AMO network ────────────────────────────────────────────────────────

export const getAmoNetwork = createServerFn({ method: "GET" }).handler(async () => {
  await currentAdmin();
  const { ne, db, schema } = await loadServerAuth();
  const rows = await db
    .select({
      id: schema.aircraft.id,
      registration: schema.aircraft.registration,
      makeModel: schema.aircraft.makeModel,
      amoName: schema.aircraft.amoName,
      amoPhone: schema.aircraft.amoPhone,
      amoEmergencyPhone: schema.aircraft.amoEmergencyPhone,
      maintenancePoc: schema.aircraft.maintenancePoc,
      nationality: schema.aircraft.nationality,
      baseAirport: schema.aircraft.baseAirport,
    })
    .from(schema.aircraft)
    .where(ne(schema.aircraft.amoName, ""));
  return rows;
});

// ── New: enrolment (public) ───────────────────────────────────────────────────

export const createSubscriberEnrolment = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      // step 2
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      mobile: z.string().default(""),
      whatsapp: z.string().default(""),
      companyName: z.string().default(""),
      managementCompany: z.string().default(""),
      usageType: z.string().default("Private Owner"),
      // step 3 – aircraft
      makeModel: z.string().min(1),
      category: aircraftCategorySchema,
      registration: z.string().min(1),
      year: z.string().default(""),
      baseAirport: z.string().default(""),
      engineManufacturer: z.string().default(""),
      engineType: z.string().default(""),
      engineCount: z.number().int().min(1).max(4).default(1),
      engineSerialNumbers: z.string().default(""),
      maintenanceProgramme: z.string().default(""),
      aircraftNationality: z.string().default(""),
      insurer: z.string().default(""),
      policyReference: z.string().default(""),
      totalAirframeHours: z.string().default(""),
      // step 4 – contacts
      primaryContactName: z.string().default(""),
      picDirectMobile: z.string().default(""),
      opsContactName: z.string().default(""),
      opsContactEmail: z.string().default(""),
      managerName: z.string().default(""),
      managerEmail: z.string().default(""),
      stripeSubscriptionId: z.string().optional(),
      stripeCustomerId: z.string().optional(),
      plan: z.enum(["monthly", "annual"]).default("monthly"),
    }),
  )
  .handler(async ({ data }) => {
    const { auth, db, schema } = await loadServerAuth();
    // Create auth user with random password
    const tempPassword = crypto.randomUUID() + "Aa1!";
    const signupRes = await auth.api.signUpEmail({
      body: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: tempPassword,
      },
    });
    const userId = (signupRes as { user?: { id: string } }).user?.id;
    if (!userId) throw new Error("Failed to create user account.");

    await db
      .insert(schema.profiles)
      .values({
        userId,
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        company: data.companyName || data.managementCompany,
        phone: data.mobile,
      })
      .onConflictDoNothing();

    const aircraftId = `ac_${crypto.randomUUID()}`;
    const subscriptionId = `sub_${crypto.randomUUID()}`;

    await db.insert(schema.aircraft).values({
      id: aircraftId,
      userId,
      registration: data.registration.toUpperCase(),
      category: data.category,
      makeModel: data.makeModel,
      serialNumber: "",
      yearOfManufacture: data.year,
      typeOfOperations: data.usageType,
      ownerOperatorName: data.companyName || `${data.firstName} ${data.lastName}`,
      baseAirport: data.baseAirport,
      verificationStatus: "Pending",
      engineManufacturer: data.engineManufacturer,
      engineType: data.engineType,
      engineSeries: "",
      engineSerialNumbers: data.engineSerialNumbers,
      numberOfEngines: data.engineCount,
      maintenanceProgramme: data.maintenanceProgramme,
      nationality: data.aircraftNationality,
      registryStandard: "",
      amoName: "",
      amoPhone: "",
      amoEmergencyPhone: "",
      picPhone: data.picDirectMobile,
      maintenancePoc: data.opsContactName,
      insurerName: data.insurer,
      insurerPolicyRef: data.policyReference,
      totalAirframeHours: data.totalAirframeHours,
      plan: data.plan,
      subscriptionStatus: "Active",
    });

    await db.insert(schema.subscriptions).values({
      id: subscriptionId,
      userId,
      aircraftId,
      plan: data.plan,
      status: "Active",
      mockProviderRef: `enrol_${subscriptionId}`,
      stripeSubscriptionId: data.stripeSubscriptionId ?? null,
      stripeCustomerId: data.stripeCustomerId ?? null,
    });

    // Only create a DB invoice stub if no real Stripe subscription exists
    if (!data.stripeSubscriptionId) {
      const planAmount = data.plan === "annual" ? 100000 : 10000;
      await db.insert(schema.invoices).values({
        id: `inv_${crypto.randomUUID()}`,
        userId,
        subscriptionId,
        amountCents: planAmount,
        currency: "usd",
        status: "Paid",
      });
    }

    // The account was created with a throwaway random password — send the
    // customer a set-password link so they can actually sign in. (The enrol
    // confirmation screen promises this email.) Don't let an email failure
    // fail the enrolment; in dev with no Resend key the link logs to console.
    await auth.api
      .requestPasswordReset({ body: { email: data.email, redirectTo: "/set-password" } })
      .catch(() => {});

    const ref = `PS-${data.registration.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    return { userId, aircraftId, ref };
  });

// ── New: supplier application (public) ───────────────────────────────────────

export const createSupplierApplication = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      // step 1 company
      name: z.string().min(1),
      tradingName: z.string().default(""),
      country: z.string().default(""),
      address: z.string().default(""),
      website: z.string().default(""),
      vatRef: z.string().default(""),
      // step 2 speciality
      aircraftTypes: z.string().default(""),
      ataSystems: z.string().default(""),
      inventoryPlatform: z.string().default(""),
      stockType: z.string().default(""),
      typicalResponseTime: z.string().default(""),
      geographicCoverage: z.string().default(""),
      // step 4 contacts
      primaryAogContact: z.string().default(""),
      primaryAogMobile: z.string().default(""),
      secondaryAogContact: z.string().default(""),
      accountsContact: z.string().default(""),
      paymentMethod: z.string().default(""),
      paymentCurrency: z.string().default("USD"),
      paymentTerms: z.string().default(""),
      // step 5 account
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      // step 3 compliance documents
      docs: z
        .array(
          z.object({
            docType: z.string().min(1),
            fileName: z.string().default(""),
            expiry: z.string().default(""),
          }),
        )
        .default([]),
    }),
  )
  .handler(async ({ data }) => {
    const { db, schema } = await loadServerAuth();
    const id = `sup_${crypto.randomUUID()}`;
    await db.insert(schema.supplierCompanies).values({
      id,
      name: data.name,
      tradingName: data.tradingName,
      country: data.country,
      address: data.address,
      website: data.website,
      vatRef: data.vatRef,
      aircraftTypes: data.aircraftTypes,
      ataSystems: data.ataSystems,
      inventoryPlatform: data.inventoryPlatform,
      stockType: data.stockType,
      typicalResponseTime: data.typicalResponseTime,
      geographicCoverage: data.geographicCoverage,
      primaryAogContact: data.primaryAogContact,
      primaryAogMobile: data.primaryAogMobile,
      secondaryAogContact: data.secondaryAogContact,
      accountsContact: data.accountsContact,
      paymentMethod: data.paymentMethod,
      paymentCurrency: data.paymentCurrency,
      paymentTerms: data.paymentTerms,
      contactName: `${data.firstName} ${data.lastName}`,
      contactEmail: data.email,
      contactPhone: data.primaryAogMobile,
      status: "pending",
      loaSigned: false,
      specialisms: data.aircraftTypes,
      createdAt: new Date(),
    });

    // Persist compliance documents (with expiry) submitted in step 3.
    const docs = data.docs.filter((d) => d.fileName || d.expiry);
    if (docs.length) {
      await db.insert(schema.supplierComplianceDocs).values(
        docs.map((d) => ({
          id: `scd_${crypto.randomUUID()}`,
          supplierCompanyId: id,
          docType: d.docType,
          fileName: d.fileName,
          expiryDate: d.expiry,
        })),
      );
    }

    return { ok: true, id };
  });

// Compliance documents for a supplier company (admin only).
export const getSupplierComplianceDocs = createServerFn({ method: "GET" })
  .inputValidator(z.object({ companyId: z.string().min(1) }))
  .handler(async ({ data }) => {
    await currentAdmin();
    const { eq, db, schema } = await loadServerAuth();
    const rows = await db
      .select()
      .from(schema.supplierComplianceDocs)
      .where(eq(schema.supplierComplianceDocs.supplierCompanyId, data.companyId));
    return rows.map((r) => ({
      id: r.id,
      docType: r.docType,
      fileName: r.fileName,
      expiryDate: r.expiryDate,
    }));
  });

// ── New: supplier application admin actions ──────────────────────────────────

export const getSupplierApplications = createServerFn({ method: "GET" }).handler(async () => {
  await currentAdmin();
  const { eq, desc, db, schema } = await loadServerAuth();
  return db
    .select()
    .from(schema.supplierCompanies)
    .where(eq(schema.supplierCompanies.status, "pending"))
    .orderBy(desc(schema.supplierCompanies.createdAt));
});

export const approveSupplierApplication = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await currentAdmin();
    const { eq, db, schema, auth } = await loadServerAuth();
    const { sql } = await import("drizzle-orm");

    const [company] = await db
      .select()
      .from(schema.supplierCompanies)
      .where(eq(schema.supplierCompanies.id, data.id));
    if (!company) throw new Error("Supplier application not found.");

    // Mark approved.
    await db
      .update(schema.supplierCompanies)
      .set({ status: "approved" })
      .where(eq(schema.supplierCompanies.id, data.id));

    // Provision a login account so the supplier can access the portal.
    // Idempotent: skip if this company already has a linked supplier user.
    const [existingLink] = await db
      .select({ userId: schema.supplierUsers.userId })
      .from(schema.supplierUsers)
      .where(eq(schema.supplierUsers.supplierCompanyId, data.id));

    if (!existingLink && company.contactEmail) {
      let userId: string | undefined;
      try {
        const tempPassword = crypto.randomUUID() + "Aa1!";
        const signupRes = await auth.api.signUpEmail({
          body: {
            name: company.contactName || company.name,
            email: company.contactEmail,
            password: tempPassword,
          },
        });
        userId = (signupRes as { user?: { id: string } }).user?.id;
      } catch {
        // Email may already have an account — look up the existing user id.
        const rows = (await db.execute(
          sql`select id from "user" where lower(email) = lower(${company.contactEmail}) limit 1`,
        )) as unknown as { rows?: Array<{ id: string }> };
        userId = rows.rows?.[0]?.id;
      }

      if (userId) {
        await db
          .insert(schema.supplierUsers)
          .values({ userId, supplierCompanyId: data.id, createdAt: new Date() })
          .onConflictDoNothing();

        // Send a set-password email so the supplier can choose their own password.
        await auth.api
          .requestPasswordReset({
            body: { email: company.contactEmail, redirectTo: "/set-password" },
          })
          .catch(() => {});
      }
    }

    return { ok: true };
  });

export const declineSupplierApplication = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1), reason: z.string().default("") }))
  .handler(async ({ data }) => {
    await currentAdmin();
    const { eq, db, schema } = await loadServerAuth();
    await db
      .update(schema.supplierCompanies)
      .set({ status: "declined", declineReason: data.reason })
      .where(eq(schema.supplierCompanies.id, data.id));
    return { ok: true };
  });

// ── New: admin AOG enhancements ──────────────────────────────────────────────

export const assignCaseHandler = createServerFn({ method: "POST" })
  .inputValidator(z.object({ requestId: z.string().min(1), handlerId: z.string() }))
  .handler(async ({ data }) => {
    await currentAdmin();
    const { eq, db, schema } = await loadServerAuth();
    await db
      .update(schema.aogRequests)
      .set({ handlerId: data.handlerId, updatedAt: new Date() })
      .where(eq(schema.aogRequests.id, data.requestId));
    return { ok: true };
  });

export const updateAwbNumber = createServerFn({ method: "POST" })
  .inputValidator(z.object({ requestId: z.string().min(1), awbNumber: z.string() }))
  .handler(async ({ data }) => {
    await currentAdmin();
    const { eq, db, schema } = await loadServerAuth();
    await db
      .update(schema.aogRequests)
      .set({ awbNumber: data.awbNumber, updatedAt: new Date() })
      .where(eq(schema.aogRequests.id, data.requestId));
    return { ok: true };
  });

export const updateHandoverNotes = createServerFn({ method: "POST" })
  .inputValidator(z.object({ requestId: z.string().min(1), notes: z.string() }))
  .handler(async ({ data }) => {
    await currentAdmin();
    const { eq, db, schema } = await loadServerAuth();
    await db
      .update(schema.aogRequests)
      .set({ handoverNotes: data.notes, updatedAt: new Date() })
      .where(eq(schema.aogRequests.id, data.requestId));
    return { ok: true };
  });

// ── New: aircraft quick-edit + parts passport ────────────────────────────────

export const updateAircraftDetails = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string().min(1),
      baseAirport: z.string().default(""),
      amoName: z.string().default(""),
      amoContact: z.string().default(""),
      totalAirframeHours: z.string().default(""),
      maintenanceProgramme: z.string().default(""),
    }),
  )
  .handler(async ({ data }) => {
    const user = await currentUser();
    const { eq, and, db, schema } = await loadServerAuth();
    const [row] = await db
      .select({ userId: schema.aircraft.userId })
      .from(schema.aircraft)
      .where(and(eq(schema.aircraft.id, data.id), eq(schema.aircraft.userId, user.id)));
    if (!row) throw new Error("Aircraft not found.");
    await db
      .update(schema.aircraft)
      .set({
        baseAirport: data.baseAirport,
        amoName: data.amoName,
        amoPhone: data.amoContact,
        totalAirframeHours: data.totalAirframeHours,
        maintenanceProgramme: data.maintenanceProgramme,
        updatedAt: new Date(),
      })
      .where(eq(schema.aircraft.id, data.id));
    return { ok: true };
  });

export const getAircraftResolvedCases = createServerFn({ method: "GET" })
  .inputValidator(z.object({ aircraftId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const user = await currentUser();
    const { eq, and, desc, inArray, db, schema } = await loadServerAuth();
    const [ac] = await db
      .select({ userId: schema.aircraft.userId })
      .from(schema.aircraft)
      .where(eq(schema.aircraft.id, data.aircraftId));
    if (!ac || ac.userId !== user.id) throw new Error("Access denied.");
    const rows = await db
      .select()
      .from(schema.aogRequests)
      .where(
        and(
          eq(schema.aogRequests.aircraftId, data.aircraftId),
          eq(schema.aogRequests.status, "Resolved"),
        ),
      )
      .orderBy(desc(schema.aogRequests.updatedAt));
    const attMap = await attachmentsByRequest(
      db,
      schema,
      inArray,
      rows.map((r) => r.id),
    );
    return rows.map((r) => toAogRecord(r, attMap.get(r.id) ?? []));
  });

// ── New: supplier portal – revise quote + AWB ────────────────────────────────

export const reviseSupplierQuote = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      quoteId: z.string().min(1),
      condition: z.enum(["Serviceable", "Exchange", "Overhauled", "New", "As Removed"]),
      priceCents: z.number().min(0),
      currency: z.string().default("usd"),
      leadTime: z.string().default(""),
      paperwork: z.string().default(""),
      freightRoute: z.string().default(""),
      notes: z.string().default(""),
    }),
  )
  .handler(async ({ data }) => {
    const { user } = await currentSupplier();
    const { eq, db, schema } = await loadServerAuth();
    await db
      .update(schema.supplierQuotes)
      .set({
        condition: data.condition,
        priceCents: data.priceCents,
        currency: data.currency,
        leadTime: data.leadTime,
        paperwork: data.paperwork,
        freightRoute: data.freightRoute,
        notes: data.notes,
      })
      .where(eq(schema.supplierQuotes.id, data.quoteId));
    void user;
    return { ok: true };
  });

export const submitSupplierAwb = createServerFn({ method: "POST" })
  .inputValidator(z.object({ quoteId: z.string().min(1), awbNumber: z.string() }))
  .handler(async ({ data }) => {
    await currentSupplier();
    const { eq, db, schema } = await loadServerAuth();
    await db
      .update(schema.supplierQuotes)
      .set({ awbNumber: data.awbNumber })
      .where(eq(schema.supplierQuotes.id, data.quoteId));
    return { ok: true };
  });

// ── New: supplier profile ────────────────────────────────────────────────────

export const getSupplierProfile = createServerFn({ method: "GET" }).handler(async () => {
  const { company } = await currentSupplier();
  return company;
});

export const updateSupplierProfile = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      contactName: z.string().default(""),
      contactEmail: z.string().default(""),
      contactPhone: z.string().default(""),
      primaryAogContact: z.string().default(""),
      primaryAogMobile: z.string().default(""),
      secondaryAogContact: z.string().default(""),
      accountsContact: z.string().default(""),
      website: z.string().default(""),
    }),
  )
  .handler(async ({ data }) => {
    const { company } = await currentSupplier();
    const { eq, db, schema } = await loadServerAuth();
    await db
      .update(schema.supplierCompanies)
      .set(data)
      .where(eq(schema.supplierCompanies.id, company.id));
    return { ok: true };
  });

// ── New: team members (subscriber) ──────────────────────────────────────────

export const getTeamMembers = createServerFn({ method: "GET" }).handler(async () => {
  const user = await currentUser();
  const { eq, asc, db, schema } = await loadServerAuth();
  return db
    .select()
    .from(schema.teamMembers)
    .where(eq(schema.teamMembers.userId, user.id))
    .orderBy(asc(schema.teamMembers.createdAt));
});

export const addTeamMember = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      memberName: z.string().min(1),
      memberEmail: z.string().email(),
      role: z.string().default("pic"),
    }),
  )
  .handler(async ({ data }) => {
    const user = await currentUser();
    const { db, schema } = await loadServerAuth();
    const id = `tm_${crypto.randomUUID()}`;
    await db.insert(schema.teamMembers).values({
      id,
      userId: user.id,
      memberName: data.memberName,
      memberEmail: data.memberEmail,
      role: data.role,
      createdAt: new Date(),
    });
    return { ok: true, id };
  });

export const removeTeamMember = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const user = await currentUser();
    const { eq, and, db, schema } = await loadServerAuth();
    await db
      .delete(schema.teamMembers)
      .where(and(eq(schema.teamMembers.id, data.id), eq(schema.teamMembers.userId, user.id)));
    return { ok: true };
  });

// ── New: case rating (subscriber) ────────────────────────────────────────────

export const rateCaseDeskPerformance = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      requestId: z.string().min(1),
      rating: z.number().int().min(1).max(5),
      comment: z.string().default(""),
    }),
  )
  .handler(async ({ data }) => {
    const user = await currentUser();
    const { eq, and, db, schema } = await loadServerAuth();
    const [req] = await db
      .select({ userId: schema.aogRequests.userId })
      .from(schema.aogRequests)
      .where(
        and(eq(schema.aogRequests.id, data.requestId), eq(schema.aogRequests.userId, user.id)),
      );
    if (!req) throw new Error("Access denied.");
    await db
      .update(schema.aogRequests)
      .set({ caseRating: data.rating, caseRatingComment: data.comment, updatedAt: new Date() })
      .where(eq(schema.aogRequests.id, data.requestId));
    return { ok: true };
  });

// ── currentSupplier re-export for use above ──────────────────────────────────
// (already defined inline — this block intentionally left empty)

export const cancelSubscription = createServerFn({ method: "POST" })
  .inputValidator(z.object({ subscriptionId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const user = await currentUser();
    const { eq, and, db, schema } = await loadServerAuth();
    const [sub] = await db
      .select()
      .from(schema.subscriptions)
      .where(
        and(
          eq(schema.subscriptions.id, data.subscriptionId),
          eq(schema.subscriptions.userId, user.id),
        ),
      );
    if (!sub) throw new Error("Subscription not found.");
    await db
      .update(schema.subscriptions)
      .set({ status: "Cancelled", updatedAt: new Date() })
      .where(eq(schema.subscriptions.id, data.subscriptionId));
    return { ok: true };
  });

// ── Account: update profile ───────────────────────────────────────────────────

export const updateProfile = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1),
      company: z.string().default(""),
      phone: z.string().default(""),
    }),
  )
  .handler(async ({ data }) => {
    const user = await currentUser();
    const { eq, db, schema } = await loadServerAuth();
    await db
      .update(schema.profiles)
      .set({ name: data.name, company: data.company, phone: data.phone, updatedAt: new Date() })
      .where(eq(schema.profiles.userId, user.id));
    return { ok: true };
  });

// ── Account: change password ──────────────────────────────────────────────────

export const changePassword = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8),
    }),
  )
  .handler(async ({ data }) => {
    const { auth } = await loadServerAuth();
    // Use better-auth's built-in changePassword via headers
    const headers = await (await loadServerAuth()).getRequestHeaders();
    const res = await auth.api.changePassword({
      headers,
      body: { currentPassword: data.currentPassword, newPassword: data.newPassword },
    });
    return { ok: true };
  });

// ── Stripe admin data (live from Stripe API) ──────────────────────────────────

export const getStripeAdminData = createServerFn({ method: "GET" }).handler(async () => {
  await currentAdmin();
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const { db, schema } = await loadServerAuth();

  // Pull all subscriptions from DB that have Stripe IDs
  const dbSubs = await db.select().from(schema.subscriptions);

  const stripeSubIds = dbSubs.map((s: any) => s.stripeSubscriptionId).filter(Boolean) as string[];

  // Fetch each from Stripe in parallel (capped at 20 for safety)
  const stripeSubscriptions = await Promise.all(
    stripeSubIds
      .slice(0, 20)
      .map((id) =>
        stripe.subscriptions
          .retrieve(id, { expand: ["latest_invoice", "customer"] })
          .catch(() => null),
      ),
  );

  const validSubs = stripeSubscriptions.filter(Boolean) as any[];

  // Invoices: fetch last 100 from Stripe
  const invoiceList = await stripe.invoices.list({ limit: 100 });

  // MRR: sum of active subscription amounts (normalised to monthly)
  let mrrCents = 0;
  for (const sub of validSubs) {
    if (sub.status !== "active") continue;
    const item = sub.items?.data?.[0];
    if (!item) continue;
    const amount = item.price?.unit_amount ?? 0;
    const interval = item.price?.recurring?.interval;
    mrrCents += interval === "year" ? Math.round(amount / 12) : amount;
  }

  // Past-due subs: get matching DB subscription + profile info
  const pastDueStripeIds = validSubs
    .filter((s) => s.status === "past_due" || s.status === "unpaid")
    .map((s) => s.id);

  const pastDueSubs = dbSubs.filter((s: any) => pastDueStripeIds.includes(s.stripeSubscriptionId));

  // Get profiles for past-due users
  const { eq: eqP, inArray: inArrayP } = await loadServerAuth();
  const pastDueUserIds = [...new Set(pastDueSubs.map((s: any) => s.userId))];
  const profiles =
    pastDueUserIds.length > 0
      ? await db
          .select()
          .from(schema.profiles)
          .where(
            pastDueUserIds.length === 1
              ? eqP(schema.profiles.userId, pastDueUserIds[0])
              : inArrayP(schema.profiles.userId, pastDueUserIds),
          )
      : [];

  // Renewals in next 30 days
  const thirtyDaysFromNow = Math.floor(Date.now() / 1000) + 30 * 86400;
  const upcomingRenewals = validSubs
    .filter((s) => s.status === "active" && s.current_period_end <= thirtyDaysFromNow)
    .map((s) => {
      const dbSub = dbSubs.find((d: any) => d.stripeSubscriptionId === s.id);
      return {
        stripeId: s.id,
        currentPeriodEnd: s.current_period_end,
        customerId: typeof s.customer === "string" ? s.customer : s.customer?.id,
        customerEmail: typeof s.customer === "object" ? s.customer?.email : null,
        interval: s.items?.data?.[0]?.price?.recurring?.interval,
        amountCents: s.items?.data?.[0]?.price?.unit_amount ?? 0,
        dbSubId: dbSub?.id,
      };
    });

  return {
    subscriptions: validSubs.map((s) => {
      const dbSub = dbSubs.find((d: any) => d.stripeSubscriptionId === s.id);
      const customer = typeof s.customer === "object" ? s.customer : null;
      return {
        stripeId: s.id,
        status: s.status,
        currentPeriodEnd: s.current_period_end,
        cancelAtPeriodEnd: s.cancel_at_period_end,
        interval: s.items?.data?.[0]?.price?.recurring?.interval,
        amountCents: s.items?.data?.[0]?.price?.unit_amount ?? 0,
        customerEmail: customer?.email ?? null,
        customerName: customer?.name ?? null,
        latestInvoiceStatus: (s.latest_invoice as any)?.status ?? null,
        dbSubId: dbSub?.id,
        userId: dbSub?.userId,
        plan: dbSub?.plan,
      };
    }),
    invoices: invoiceList.data.map((inv) => ({
      stripeId: inv.id,
      number: inv.number,
      amountPaid: inv.amount_paid,
      amountDue: inv.amount_due,
      currency: inv.currency,
      status: inv.status,
      pdfUrl: inv.invoice_pdf,
      hostedUrl: inv.hosted_invoice_url,
      created: inv.created,
      customerEmail: typeof inv.customer === "object" ? (inv.customer as any)?.email : null,
      customerName: inv.customer_name,
    })),
    mrrCents,
    pastDueCount: pastDueStripeIds.length,
    pastDueSubs: pastDueSubs.map((s: any) => {
      const profile = profiles.find((p: any) => p.userId === s.userId);
      const stripeSub = validSubs.find((v) => v.id === s.stripeSubscriptionId);
      return {
        dbSubId: s.id,
        userId: s.userId,
        stripeId: s.stripeSubscriptionId,
        stripStatus: stripeSub?.status,
        name: profile?.name,
        email: profile?.email,
        company: profile?.company,
        phone: profile?.phone,
      };
    }),
    upcomingRenewals,
    totalStripeLinked: stripeSubIds.length,
  };
});

// ── Stripe subscriber billing (invoices + portal) ─────────────────────────────

export const getStripeBillingData = createServerFn({ method: "GET" }).handler(async () => {
  const user = await currentUser();
  const { eq, db, schema } = await loadServerAuth();

  // Find all subs with a Stripe customer ID
  const subs = await db
    .select()
    .from(schema.subscriptions)
    .where(eq(schema.subscriptions.userId, user.id));

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  let stripeCustomerIds = [
    ...new Set(subs.map((s: any) => s.stripeCustomerId).filter(Boolean)),
  ] as string[];

  // No Stripe customer yet — create one lazily so the portal works for all users
  if (stripeCustomerIds.length === 0) {
    const newCustomer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { planeserve_user_id: user.id },
    });
    // Save customer ID to all this user's subscriptions
    await db
      .update(schema.subscriptions)
      .set({ stripeCustomerId: newCustomer.id })
      .where(eq(schema.subscriptions.userId, user.id));
    stripeCustomerIds = [newCustomer.id];
  }

  // Use the first customer ID (most users will have one)
  const customerId = stripeCustomerIds[0];

  // Fetch invoices for this customer
  const invoiceList = await stripe.invoices.list({ customer: customerId, limit: 20 });

  // Create a Stripe Customer Portal session for card management
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.APP_URL ?? "http://localhost:8080"}/billing`,
  });

  return {
    hasStripe: true,
    portalUrl: portalSession.url,
    customerId,
    invoices: invoiceList.data.map((inv) => ({
      stripeId: inv.id,
      number: inv.number,
      amountPaid: inv.amount_paid,
      amountDue: inv.amount_due,
      currency: inv.currency,
      status: inv.status,
      pdfUrl: inv.invoice_pdf,
      hostedUrl: inv.hosted_invoice_url,
      created: inv.created,
    })),
  };
});
