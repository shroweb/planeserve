import "dotenv/config";

import { auth } from "../src/lib/auth";
import { db, pool, schema } from "../src/lib/db/index.server";

const supplierPassword = "planeserve-supplier";

const suppliers = [
  {
    id: "sup_seed_aviall",
    name: "Aviall Services Inc.",
    tradingName: "Aviall",
    country: "United States",
    address: "2750 Regent Blvd, Dallas, TX 75261",
    website: "https://www.aviall.com",
    vatRef: "US-75261-AV",
    contactName: "Rachel Greene",
    contactEmail: "rachel.greene@example-supplier.com",
    contactPhone: "+1 972 586 1000",
    specialisms: "Citation, King Air, wheels, brakes, hydraulic components",
    aircraftTypes: "Cessna Citation, Beechcraft King Air, Hawker, Learjet",
    ataSystems: "ATA 29 Hydraulic Power, ATA 32 Landing Gear, ATA 34 Navigation",
    inventoryPlatform: "ILS",
    stockType: "Own warehouse",
    typicalResponseTime: "<1hr",
    geographicCoverage: "North America, Europe urgent export",
    primaryAogContact: "Rachel Greene",
    primaryAogMobile: "+1 214 555 0134",
    secondaryAogContact: "Marcus Lee +1 214 555 0198",
    accountsContact: "accounts@example-supplier.com",
    paymentMethod: "SWIFT",
    paymentCurrency: "USD",
    paymentTerms: "Net 14",
    loaSigned: true,
    status: "approved",
  },
  {
    id: "sup_seed_globalparts",
    name: "GlobalParts Aero Services",
    tradingName: "GlobalParts",
    country: "United States",
    address: "7301 W McCormick St, Wichita, KS 67209",
    website: "https://www.globalparts.aero",
    vatRef: "US-KS-GPA",
    contactName: "Ethan Brooks",
    contactEmail: "ethan.brooks@example-supplier.com",
    contactPhone: "+1 316 733 9240",
    specialisms: "Citation, Learjet, avionics exchange, starter generators",
    aircraftTypes: "Citation CJ, Citation XLS, Learjet 35/45/60, Phenom 300",
    ataSystems: "ATA 24 Electrical Power, ATA 31 Indicating, ATA 34 Navigation",
    inventoryPlatform: "PartsBase",
    stockType: "Both",
    typicalResponseTime: "1-4hr",
    geographicCoverage: "North America, AOG export by next flight out",
    primaryAogContact: "Ethan Brooks",
    primaryAogMobile: "+1 316 555 0188",
    secondaryAogContact: "Olivia King +1 316 555 0190",
    accountsContact: "finance@example-supplier.com",
    paymentMethod: "Bank Transfer",
    paymentCurrency: "USD",
    paymentTerms: "Net 30",
    loaSigned: true,
    status: "approved",
  },
  {
    id: "sup_seed_luxaviaparts",
    name: "LuxAvia Parts Europe",
    tradingName: "LuxAvia Parts",
    country: "Luxembourg",
    address: "6 Rue de Trèves, L-2632 Luxembourg",
    website: "https://www.luxaviaparts.example",
    vatRef: "LU26324591",
    contactName: "Camille Weber",
    contactEmail: "camille.weber@example-supplier.com",
    contactPhone: "+352 26 55 01 40",
    specialisms: "Falcon, Challenger, Gulfstream rotables and exchange units",
    aircraftTypes: "Dassault Falcon 2000/7X/8X, Challenger 300/350, Gulfstream G280/G450",
    ataSystems: "ATA 21 Air Conditioning, ATA 27 Flight Controls, ATA 29 Hydraulic Power",
    inventoryPlatform: "ePlane",
    stockType: "Broker",
    typicalResponseTime: "1-4hr",
    geographicCoverage: "Europe, Middle East",
    primaryAogContact: "Camille Weber",
    primaryAogMobile: "+352 621 555 140",
    secondaryAogContact: "Nicolas Hoffmann +352 621 555 141",
    accountsContact: "billing@example-supplier.com",
    paymentMethod: "SWIFT",
    paymentCurrency: "EUR",
    paymentTerms: "Net 7",
    loaSigned: true,
    status: "approved",
  },
  {
    id: "sup_seed_rotorstock",
    name: "RotorStock UK Ltd",
    tradingName: "RotorStock",
    country: "United Kingdom",
    address: "Hangar 4, Oxford Airport, Kidlington OX5 1RA",
    website: "https://www.rotorstock.example",
    vatRef: "GB224611902",
    contactName: "Martin Shaw",
    contactEmail: "martin.shaw@example-supplier.com",
    contactPhone: "+44 1865 555 220",
    specialisms: "Airbus helicopter dynamic components and avionics",
    aircraftTypes: "Airbus H125, H135, H145, Leonardo AW109",
    ataSystems: "ATA 62 Main Rotor, ATA 63 Main Rotor Drive, ATA 67 Flight Controls",
    inventoryPlatform: "Own system",
    stockType: "Own warehouse",
    typicalResponseTime: "<1hr",
    geographicCoverage: "UK, Ireland, Western Europe",
    primaryAogContact: "Martin Shaw",
    primaryAogMobile: "+44 7700 910220",
    secondaryAogContact: "Claire Hughes +44 7700 910221",
    accountsContact: "accounts@example-supplier.com",
    paymentMethod: "Bank Transfer",
    paymentCurrency: "GBP",
    paymentTerms: "Net 14",
    loaSigned: true,
    status: "approved",
  },
  {
    id: "sup_seed_aeroline",
    name: "AeroLine Components GmbH",
    tradingName: "AeroLine",
    country: "Germany",
    address: "Münchener Str. 24, 85356 Freising",
    website: "https://www.aeroline-components.example",
    vatRef: "DE318820491",
    contactName: "Klara Vogel",
    contactEmail: "klara.vogel@example-supplier.com",
    contactPhone: "+49 8161 555 332",
    specialisms: "PT6, King Air, PC-12, oxygen and pneumatic systems",
    aircraftTypes: "Pilatus PC-12, King Air 200/350, Daher TBM",
    ataSystems: "ATA 35 Oxygen, ATA 36 Pneumatic, ATA 71 Power Plant",
    inventoryPlatform: "ILS",
    stockType: "Both",
    typicalResponseTime: "4-8hr",
    geographicCoverage: "DACH, Scandinavia",
    primaryAogContact: "Klara Vogel",
    primaryAogMobile: "+49 171 555 3320",
    secondaryAogContact: "Jonas Roth +49 171 555 3321",
    accountsContact: "rechnung@example-supplier.com",
    paymentMethod: "SWIFT",
    paymentCurrency: "EUR",
    paymentTerms: "Net 30",
    loaSigned: false,
    status: "pending",
  },
  {
    id: "sup_seed_atlas",
    name: "Atlas Avionics Exchange",
    tradingName: "Atlas Avionics",
    country: "United Kingdom",
    address: "Unit 9, Aviation Park West, Bournemouth BH23 6NW",
    website: "https://www.atlasavionics.example",
    vatRef: "GB982114002",
    contactName: "Priya Nair",
    contactEmail: "priya.nair@example-supplier.com",
    contactPhone: "+44 1202 555 914",
    specialisms: "Collins, Garmin, Honeywell avionics exchange",
    aircraftTypes: "Citation, Phenom, King Air, Gulfstream, Falcon",
    ataSystems: "ATA 23 Communications, ATA 31 Indicating, ATA 34 Navigation",
    inventoryPlatform: "PartsBase",
    stockType: "Broker",
    typicalResponseTime: "1-4hr",
    geographicCoverage: "UK, Europe, Middle East",
    primaryAogContact: "Priya Nair",
    primaryAogMobile: "+44 7700 910914",
    secondaryAogContact: "Daniel Price +44 7700 910915",
    accountsContact: "finance@example-supplier.com",
    paymentMethod: "Bank Transfer",
    paymentCurrency: "GBP",
    paymentTerms: "Net 14",
    loaSigned: false,
    status: "pending",
  },
] as const;

const complianceDocs = [
  ["FAA Part 145", "faa-part-145-certificate.pdf", "2027-02-28"],
  ["EASA Part 145", "easa-part-145-approval.pdf", "2026-12-31"],
  ["ASA-100", "asa-100-accreditation.pdf", "2026-10-15"],
  ["Quality Assurance Manual", "quality-manual-rev-8.pdf", ""],
  ["Export Licence", "export-licence-dual-use.pdf", "2026-08-30"],
  ["Insurance Certificate", "aviation-liability-insurance.pdf", "2027-01-31"],
] as const;

const rfqs = [
  {
    id: "rfq_seed_01",
    requestId: "AOG-SEED02",
    supplierCompanyId: "sup_seed_atlas",
    partDescription: "Collins GPS receiver exchange unit",
    partNumber: "822-2532-001",
    aircraftType: "Bombardier Challenger 350",
    location: "EGLF Farnborough",
    documentationRequired: "EASA Form 1 or FAA 8130-3",
    status: "sent",
    quoteSubmitted: false,
    hoursAgo: 6,
  },
  {
    id: "rfq_seed_02",
    requestId: "AOG-SEED04",
    supplierCompanyId: "sup_seed_luxaviaparts",
    partDescription: "Hydraulic pressure transducer",
    partNumber: "70221-03",
    aircraftType: "Dassault Falcon 2000LX",
    location: "LFMN Nice Côte d'Azur",
    documentationRequired: "EASA Form 1, trace to OEM",
    status: "responded",
    quoteSubmitted: true,
    hoursAgo: 20,
  },
  {
    id: "rfq_seed_03",
    requestId: "AOG-SEED06",
    supplierCompanyId: "sup_seed_globalparts",
    partDescription: "Starter generator exchange",
    partNumber: "23085-009",
    aircraftType: "Embraer Phenom 300E",
    location: "EGGW London Luton",
    documentationRequired: "FAA 8130-3, core return terms",
    status: "responded",
    quoteSubmitted: true,
    hoursAgo: 30,
  },
  {
    id: "rfq_seed_04",
    requestId: "AOG-SEED01",
    supplierCompanyId: "sup_seed_aviall",
    partDescription: "Nose gear squat switch",
    partNumber: "9912150-4",
    aircraftType: "Cessna Citation XLS+",
    location: "EGKB Biggin Hill",
    documentationRequired: "FAA 8130-3 acceptable",
    status: "sent",
    quoteSubmitted: false,
    hoursAgo: 3,
  },
] as const;

const quotes = [
  {
    id: "sq_seed_lux_01",
    requestId: "AOG-SEED04",
    supplierName: "LuxAvia Parts Europe",
    condition: "Serviceable",
    priceCents: 1840000,
    netPriceCents: 1700000,
    currency: "eur",
    leadTime: "Same day dispatch from Luxembourg",
    paperwork: "EASA Form 1",
    freightRoute: "LUX -> NCE dedicated courier",
    notes: "Subject to export review before release.",
    approved: false,
    hoursAgo: 18,
  },
  {
    id: "sq_seed_gp_01",
    requestId: "AOG-SEED06",
    supplierName: "GlobalParts Aero Services",
    condition: "Exchange",
    priceCents: 2650000,
    netPriceCents: 2450000,
    currency: "usd",
    leadTime: "In stock, NFO from ICT to LHR",
    paperwork: "FAA 8130-3",
    freightRoute: "ICT -> ORD -> LHR",
    notes: "Core return due within 21 days.",
    approved: true,
    hoursAgo: 28,
  },
] as const;

const usmSignals = [
  {
    id: "usm_seed_01",
    partNumber: "23085-009",
    aircraftType: "Embraer Phenom 300E",
    description: "Starter generator exchange unit",
    availabilityPct: 22,
    trend: "falling",
    supplierCount: 3,
    priceCents: 2450000,
    riskScore: 86,
    notes: "Low exchange pool depth; core return delays common.",
  },
  {
    id: "usm_seed_02",
    partNumber: "70221-03",
    aircraftType: "Dassault Falcon 2000LX",
    description: "Hydraulic pressure transducer",
    availabilityPct: 34,
    trend: "stable",
    supplierCount: 5,
    priceCents: 1700000,
    riskScore: 74,
    notes: "Europe stock limited, US export may add 24-48h.",
  },
  {
    id: "usm_seed_03",
    partNumber: "822-2532-001",
    aircraftType: "Bombardier Challenger 350",
    description: "Collins GPS receiver",
    availabilityPct: 41,
    trend: "rising",
    supplierCount: 8,
    priceCents: 3200000,
    riskScore: 68,
    notes: "Repair turn times lengthening; exchange recommended for AOG.",
  },
  {
    id: "usm_seed_04",
    partNumber: "9912150-4",
    aircraftType: "Cessna Citation XLS+",
    description: "Nose gear squat switch",
    availabilityPct: 58,
    trend: "stable",
    supplierCount: 11,
    priceCents: 185000,
    riskScore: 42,
    notes: "Good US stock, thinner EU coverage.",
  },
  {
    id: "usm_seed_05",
    partNumber: "103670-7",
    aircraftType: "Cessna Citation CJ4",
    description: "Cabin pressure controller",
    availabilityPct: 28,
    trend: "falling",
    supplierCount: 4,
    priceCents: 880000,
    riskScore: 81,
    notes: "Recommend pre-positioning for CJ-family subscribers.",
  },
] as const;

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

async function ensureSupplierUser(email: string, name: string, supplierCompanyId: string) {
  const existing = await pool.query<{ id: string }>(
    'select id from "user" where lower(email) = $1',
    [email.toLowerCase()],
  );
  const userId =
    existing.rows[0]?.id ??
    (
      await auth.api.signUpEmail({
        body: { email, password: supplierPassword, name },
      })
    ).user.id;

  await db.insert(schema.supplierUsers).values({ userId, supplierCompanyId }).onConflictDoUpdate({
    target: schema.supplierUsers.userId,
    set: { supplierCompanyId },
  });

  return userId;
}

async function main() {
  const admin = await pool.query<{ user_id: string; name: string }>(
    "select user_id, name from profiles where is_admin = true order by created_at asc limit 1",
  );
  const adminUserId = admin.rows[0]?.user_id ?? "system";
  const adminName = admin.rows[0]?.name ?? "Admin";

  for (const supplier of suppliers) {
    await db
      .insert(schema.supplierCompanies)
      .values({
        ...supplier,
        createdAt: hoursAgo(supplier.status === "pending" ? 18 : 72),
      })
      .onConflictDoUpdate({
        target: schema.supplierCompanies.id,
        set: {
          name: supplier.name,
          tradingName: supplier.tradingName,
          country: supplier.country,
          address: supplier.address,
          website: supplier.website,
          vatRef: supplier.vatRef,
          contactName: supplier.contactName,
          contactEmail: supplier.contactEmail,
          contactPhone: supplier.contactPhone,
          specialisms: supplier.specialisms,
          aircraftTypes: supplier.aircraftTypes,
          ataSystems: supplier.ataSystems,
          inventoryPlatform: supplier.inventoryPlatform,
          stockType: supplier.stockType,
          typicalResponseTime: supplier.typicalResponseTime,
          geographicCoverage: supplier.geographicCoverage,
          primaryAogContact: supplier.primaryAogContact,
          primaryAogMobile: supplier.primaryAogMobile,
          secondaryAogContact: supplier.secondaryAogContact,
          accountsContact: supplier.accountsContact,
          paymentMethod: supplier.paymentMethod,
          paymentCurrency: supplier.paymentCurrency,
          paymentTerms: supplier.paymentTerms,
          loaSigned: supplier.loaSigned,
          status: supplier.status,
        },
      });

    for (const [docType, fileName, expiryDate] of complianceDocs) {
      await db
        .insert(schema.supplierComplianceDocs)
        .values({
          id: `doc_${supplier.id}_${docType.toLowerCase().replaceAll(" ", "_").replaceAll("-", "")}`,
          supplierCompanyId: supplier.id,
          docType,
          fileName: `${supplier.tradingName.toLowerCase().replaceAll(" ", "-")}-${fileName}`,
          expiryDate,
        })
        .onConflictDoNothing();
    }

    if (supplier.status === "approved") {
      await ensureSupplierUser(supplier.contactEmail, supplier.contactName, supplier.id);
    }
  }

  for (const rfq of rfqs) {
    await db
      .insert(schema.supplierRfqs)
      .values({
        id: rfq.id,
        requestId: rfq.requestId,
        supplierCompanyId: rfq.supplierCompanyId,
        partDescription: rfq.partDescription,
        partNumber: rfq.partNumber,
        aircraftType: rfq.aircraftType,
        location: rfq.location,
        documentationRequired: rfq.documentationRequired,
        status: rfq.status,
        sentAt: hoursAgo(rfq.hoursAgo),
        respondedAt: rfq.quoteSubmitted ? hoursAgo(Math.max(rfq.hoursAgo - 2, 1)) : null,
        quoteSubmitted: rfq.quoteSubmitted,
      })
      .onConflictDoUpdate({
        target: schema.supplierRfqs.id,
        set: {
          requestId: rfq.requestId,
          supplierCompanyId: rfq.supplierCompanyId,
          partDescription: rfq.partDescription,
          partNumber: rfq.partNumber,
          aircraftType: rfq.aircraftType,
          location: rfq.location,
          documentationRequired: rfq.documentationRequired,
          status: rfq.status,
          quoteSubmitted: rfq.quoteSubmitted,
        },
      });
  }

  for (const quote of quotes) {
    await db
      .insert(schema.supplierQuotes)
      .values({
        id: quote.id,
        requestId: quote.requestId,
        supplierName: quote.supplierName,
        condition: quote.condition,
        priceCents: quote.priceCents,
        currency: quote.currency,
        leadTime: quote.leadTime,
        paperwork: quote.paperwork,
        freightRoute: quote.freightRoute,
        notes: quote.notes,
        validUntil: hoursAgo(-24),
        approvedAt: quote.approved ? hoursAgo(Math.max(quote.hoursAgo - 8, 1)) : null,
        approvedByUserId: quote.approved ? adminUserId : null,
        createdByUserId: adminUserId,
        awbNumber: quote.approved ? "DHL893774210" : "",
        netPriceCents: quote.netPriceCents,
        createdAt: hoursAgo(quote.hoursAgo),
      })
      .onConflictDoUpdate({
        target: schema.supplierQuotes.id,
        set: {
          requestId: quote.requestId,
          supplierName: quote.supplierName,
          condition: quote.condition,
          priceCents: quote.priceCents,
          currency: quote.currency,
          leadTime: quote.leadTime,
          paperwork: quote.paperwork,
          freightRoute: quote.freightRoute,
          notes: quote.notes,
          approvedAt: quote.approved ? hoursAgo(Math.max(quote.hoursAgo - 8, 1)) : null,
          approvedByUserId: quote.approved ? adminUserId : null,
          awbNumber: quote.approved ? "DHL893774210" : "",
          netPriceCents: quote.netPriceCents,
        },
      });
  }

  for (const signal of usmSignals) {
    await db
      .insert(schema.usmMarketSignals)
      .values({
        ...signal,
        currency: "usd",
        updatedBy: adminName,
        updatedAt: hoursAgo(2),
      })
      .onConflictDoUpdate({
        target: schema.usmMarketSignals.id,
        set: {
          partNumber: signal.partNumber,
          aircraftType: signal.aircraftType,
          description: signal.description,
          availabilityPct: signal.availabilityPct,
          trend: signal.trend,
          supplierCount: signal.supplierCount,
          priceCents: signal.priceCents,
          currency: "usd",
          riskScore: signal.riskScore,
          notes: signal.notes,
          updatedBy: adminName,
          updatedAt: new Date(),
        },
      });
  }

  const failureLogs = [
    {
      id: "cfl_seed_01",
      requestId: "AOG-SEED06",
      failureCause: "Starter generator brush wear beyond service limit",
      hoursAtFailure: "1,690",
      coFailureNotes: "Core charge outstanding; monitor opposite engine generator hours.",
    },
    {
      id: "cfl_seed_02",
      requestId: "AOG-SEED08",
      failureCause: "Cabin pressure controller intermittent internal fault",
      hoursAtFailure: "3,115",
      coFailureNotes: "Recommend pressure controller stock watch for Citation CJ family.",
    },
    {
      id: "cfl_seed_03",
      requestId: "AOG-SEED04",
      failureCause: "Hydraulic pressure transducer unstable output",
      hoursAtFailure: "4,870",
      coFailureNotes: "Potential fleet alert if repeated on Falcon 2000LX.",
    },
  ];

  for (const log of failureLogs) {
    await db
      .insert(schema.caseFailureLog)
      .values({
        ...log,
        loggedBy: adminName,
        loggedAt: hoursAgo(1),
      })
      .onConflictDoNothing();
  }

  const adminNotes = [
    {
      id: "note_seed_aog_04",
      subjectType: "aog_request",
      subjectId: "AOG-SEED04",
      note: "Check export restriction before sending options to CôteAzur. LuxAvia has EU stock but needs end-use confirmation.",
    },
    {
      id: "note_seed_aog_06",
      subjectType: "aog_request",
      subjectId: "AOG-SEED06",
      note: "GlobalParts exchange accepted; chase core return paperwork before dispatch release.",
    },
    {
      id: "note_seed_supplier_atlas",
      subjectType: "supplier",
      subjectId: "sup_seed_atlas",
      note: "Pending approval. Strong avionics coverage but confirm insurance certificate expiry and LOA status.",
    },
  ];

  for (const note of adminNotes) {
    await db
      .insert(schema.adminNotes)
      .values({
        ...note,
        createdByUserId: adminUserId,
        createdAt: hoursAgo(1),
      })
      .onConflictDoNothing();
  }

  console.log("Seeded supplier and admin operational data.");
  console.log(`Approved suppliers: ${suppliers.filter((s) => s.status === "approved").length}`);
  console.log(
    `Pending supplier applications: ${suppliers.filter((s) => s.status === "pending").length}`,
  );
  console.log(`Supplier portal password: ${supplierPassword}`);
  console.log("Example supplier login: rachel.greene@example-supplier.com / planeserve-supplier");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
