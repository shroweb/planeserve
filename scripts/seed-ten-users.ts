import "dotenv/config";

import { auth } from "../src/lib/auth";
import { db, pool, schema } from "../src/lib/db/index.server";

type SeedUser = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  role: "Owner" | "Operator" | "Management Company";
  aircraft: {
    id: string;
    registration: string;
    category: "Business Jet" | "Turboprop" | "Single Engine" | "Multi Engine" | "Helicopter";
    makeModel: string;
    serialNumber: string;
    year: string;
    operations: string;
    ownerOperator: string;
    base: string;
    verified: boolean;
    engineManufacturer: string;
    engineType: string;
    engineSeries: string;
    engineSerials: string;
    engines: number;
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
    plan: "monthly" | "annual";
  };
  case?: {
    id: string;
    ataChapter: (typeof schema.ataChapterEnum.enumValues)[number];
    affectedSystem: string;
    partNumber: string;
    issueDescription: string;
    urgency: (typeof schema.urgencyEnum.enumValues)[number];
    status: (typeof schema.aogStatusEnum.enumValues)[number];
    exceptionStates?: string[];
    hoursAgo: number;
    resolved?: boolean;
  };
};

const password = "planeserve-demo";

const users: SeedUser[] = [
  {
    id: "s001",
    name: "Oliver Bancroft",
    company: "Bancroft Aviation Ltd",
    email: "oliver.bancroft@example.com",
    phone: "+44 7700 900101",
    role: "Owner",
    aircraft: {
      id: "ac_s001",
      registration: "G-OBAN",
      category: "Business Jet",
      makeModel: "Cessna Citation XLS+",
      serialNumber: "560-6234",
      year: "2016",
      operations: "Private",
      ownerOperator: "Bancroft Aviation Ltd",
      base: "EGKB Biggin Hill",
      verified: true,
      engineManufacturer: "Pratt & Whitney Canada",
      engineType: "PW545C",
      engineSeries: "PW500",
      engineSerials: "PCE-DD1121, PCE-DD1122",
      engines: 2,
      maintenanceProgramme: "CAMP",
      nationality: "United Kingdom",
      registryStandard: "CAA",
      amoName: "Jet Maintenance International",
      amoPhone: "+44 1959 540 210",
      amoEmergencyPhone: "+44 7700 900201",
      picPhone: "+44 7700 900301",
      maintenancePoc: "Sarah Holt",
      insurerName: "Global Aerospace",
      insurerPolicyRef: "GA-UK-88214",
      totalAirframeHours: "3,420",
      plan: "monthly",
    },
    case: {
      id: "AOG-SEED01",
      ataChapter: "Landing Gear",
      affectedSystem: "Nose gear squat switch",
      partNumber: "9912150-4",
      issueDescription: "Intermittent WOW indication after landing. Aircraft dispatch affected.",
      urgency: "Dispatch affected",
      status: "Acknowledged",
      hoursAgo: 5,
    },
  },
  {
    id: "s002",
    name: "Amelia Reeves",
    company: "Northmere Flight Operations",
    email: "amelia.reeves@example.com",
    phone: "+44 7700 900102",
    role: "Operator",
    aircraft: {
      id: "ac_s002",
      registration: "G-NMFO",
      category: "Business Jet",
      makeModel: "Bombardier Challenger 350",
      serialNumber: "20785",
      year: "2018",
      operations: "Managed charter",
      ownerOperator: "Northmere Flight Operations",
      base: "EGLF Farnborough",
      verified: true,
      engineManufacturer: "Honeywell",
      engineType: "HTF7350",
      engineSeries: "AS907",
      engineSerials: "P-118221, P-118222",
      engines: 2,
      maintenanceProgramme: "Flightdocs",
      nationality: "United Kingdom",
      registryStandard: "CAA",
      amoName: "Bombardier Service Centre London",
      amoPhone: "+44 1252 526 000",
      amoEmergencyPhone: "+44 7700 900202",
      picPhone: "+44 7700 900302",
      maintenancePoc: "Daniel Carter",
      insurerName: "HDI Global Specialty",
      insurerPolicyRef: "HDI-CH350-4401",
      totalAirframeHours: "2,180",
      plan: "annual",
    },
    case: {
      id: "AOG-SEED02",
      ataChapter: "Navigation",
      affectedSystem: "GPS receiver fault",
      partNumber: "822-2532-001",
      issueDescription: "Dual FMS flags GPS 1 unreliable. MEL review required before next sector.",
      urgency: "Dispatch affected",
      status: "Options ready",
      exceptionStates: ["MEL review required"],
      hoursAgo: 14,
    },
  },
  {
    id: "s003",
    name: "Thomas Ellison",
    company: "Ellison Air Services",
    email: "thomas.ellison@example.com",
    phone: "+44 7700 900103",
    role: "Management Company",
    aircraft: {
      id: "ac_s003",
      registration: "G-EASN",
      category: "Turboprop",
      makeModel: "Pilatus PC-12 NGX",
      serialNumber: "PC12-2094",
      year: "2021",
      operations: "Private managed",
      ownerOperator: "Ellison Air Services",
      base: "EGTK Oxford",
      verified: false,
      engineManufacturer: "Pratt & Whitney Canada",
      engineType: "PT6E-67XP",
      engineSeries: "PT6E",
      engineSerials: "PCE-RY0481",
      engines: 1,
      maintenanceProgramme: "CAMP",
      nationality: "United Kingdom",
      registryStandard: "CAA",
      amoName: "Oriens Aviation",
      amoPhone: "+44 1280 703 784",
      amoEmergencyPhone: "+44 7700 900203",
      picPhone: "+44 7700 900303",
      maintenancePoc: "Mark Wilson",
      insurerName: "AIG Aerospace",
      insurerPolicyRef: "AIG-PC12-1180",
      totalAirframeHours: "760",
      plan: "monthly",
    },
  },
  {
    id: "s004",
    name: "Sofia Laurent",
    company: "CôteAzur Executive Aviation",
    email: "sofia.laurent@example.com",
    phone: "+33 6 12 34 56 10",
    role: "Operator",
    aircraft: {
      id: "ac_s004",
      registration: "F-HCZA",
      category: "Business Jet",
      makeModel: "Dassault Falcon 2000LX",
      serialNumber: "244",
      year: "2012",
      operations: "Commercial charter",
      ownerOperator: "CôteAzur Executive Aviation",
      base: "LFMN Nice Côte d'Azur",
      verified: true,
      engineManufacturer: "Pratt & Whitney Canada",
      engineType: "PW308C",
      engineSeries: "PW300",
      engineSerials: "PCE-CF0732, PCE-CF0733",
      engines: 2,
      maintenanceProgramme: "FalconCare",
      nationality: "France",
      registryStandard: "EASA",
      amoName: "Dassault Falcon Service",
      amoPhone: "+33 1 49 34 20 20",
      amoEmergencyPhone: "+33 6 12 34 56 11",
      picPhone: "+33 6 12 34 56 12",
      maintenancePoc: "Luc Martin",
      insurerName: "Allianz Aviation",
      insurerPolicyRef: "AA-F2K-55290",
      totalAirframeHours: "4,870",
      plan: "annual",
    },
    case: {
      id: "AOG-SEED04",
      ataChapter: "Hydraulic Power",
      affectedSystem: "Hydraulic pressure transducer",
      partNumber: "70221-03",
      issueDescription: "Hydraulic system B pressure indication fluctuating on taxi-out.",
      urgency: "Aircraft grounded",
      status: "Sourcing",
      exceptionStates: ["Export restriction"],
      hoursAgo: 29,
    },
  },
  {
    id: "s005",
    name: "Henry Wallace",
    company: "Wallace Family Office",
    email: "henry.wallace@example.com",
    phone: "+44 7700 900105",
    role: "Owner",
    aircraft: {
      id: "ac_s005",
      registration: "G-WLCE",
      category: "Helicopter",
      makeModel: "Airbus H145",
      serialNumber: "20467",
      year: "2019",
      operations: "Private",
      ownerOperator: "Wallace Family Office",
      base: "EGLK Blackbushe",
      verified: true,
      engineManufacturer: "Safran",
      engineType: "Arriel 2E",
      engineSeries: "Arriel",
      engineSerials: "49821, 49822",
      engines: 2,
      maintenanceProgramme: "Airbus HCare",
      nationality: "United Kingdom",
      registryStandard: "CAA",
      amoName: "Airbus Helicopters UK",
      amoPhone: "+44 1865 852 400",
      amoEmergencyPhone: "+44 7700 900205",
      picPhone: "+44 7700 900305",
      maintenancePoc: "Rachel Moore",
      insurerName: "Hayward Aviation",
      insurerPolicyRef: "HA-H145-7781",
      totalAirframeHours: "1,240",
      plan: "monthly",
    },
  },
  {
    id: "s006",
    name: "Maya Desai",
    company: "Astra Charter Group",
    email: "maya.desai@example.com",
    phone: "+44 7700 900106",
    role: "Operator",
    aircraft: {
      id: "ac_s006",
      registration: "G-ASTX",
      category: "Business Jet",
      makeModel: "Embraer Phenom 300E",
      serialNumber: "50500621",
      year: "2020",
      operations: "Commercial charter",
      ownerOperator: "Astra Charter Group",
      base: "EGGW London Luton",
      verified: true,
      engineManufacturer: "Pratt & Whitney Canada",
      engineType: "PW535E1",
      engineSeries: "PW500",
      engineSerials: "PCE-DG0921, PCE-DG0922",
      engines: 2,
      maintenanceProgramme: "Embraer Ahead",
      nationality: "United Kingdom",
      registryStandard: "CAA",
      amoName: "Embraer Executive Jets UK",
      amoPhone: "+44 1582 390 000",
      amoEmergencyPhone: "+44 7700 900206",
      picPhone: "+44 7700 900306",
      maintenancePoc: "Alex Grant",
      insurerName: "Marsh Aviation",
      insurerPolicyRef: "MAR-PE300-9240",
      totalAirframeHours: "1,690",
      plan: "monthly",
    },
    case: {
      id: "AOG-SEED06",
      ataChapter: "Electrical Power",
      affectedSystem: "Starter generator",
      partNumber: "23085-009",
      issueDescription: "No. 2 starter generator failed post-flight check. Aircraft grounded.",
      urgency: "Aircraft grounded",
      status: "Order placed",
      exceptionStates: ["Core charge outstanding"],
      hoursAgo: 42,
    },
  },
  {
    id: "s007",
    name: "Luca Bianchi",
    company: "Milano Aero Gestioni",
    email: "luca.bianchi@example.com",
    phone: "+39 02 5550 7710",
    role: "Management Company",
    aircraft: {
      id: "ac_s007",
      registration: "I-MAGB",
      category: "Business Jet",
      makeModel: "Gulfstream G280",
      serialNumber: "2147",
      year: "2017",
      operations: "Private managed",
      ownerOperator: "Milano Aero Gestioni",
      base: "LIML Milano Linate",
      verified: true,
      engineManufacturer: "Honeywell",
      engineType: "HTF7250G",
      engineSeries: "AS907",
      engineSerials: "P-116874, P-116875",
      engines: 2,
      maintenanceProgramme: "CMP",
      nationality: "Italy",
      registryStandard: "EASA",
      amoName: "Gulfstream Field and Airborne Support",
      amoPhone: "+39 02 5550 7711",
      amoEmergencyPhone: "+39 335 555 7712",
      picPhone: "+39 335 555 7713",
      maintenancePoc: "Giulia Romano",
      insurerName: "Generali Aviation",
      insurerPolicyRef: "GEN-G280-3109",
      totalAirframeHours: "2,930",
      plan: "annual",
    },
  },
  {
    id: "s008",
    name: "Grace Kim",
    company: "Pacific Meridian Aviation",
    email: "grace.kim@example.com",
    phone: "+1 310 555 0180",
    role: "Operator",
    aircraft: {
      id: "ac_s008",
      registration: "N818PM",
      category: "Business Jet",
      makeModel: "Cessna Citation CJ4",
      serialNumber: "525C-0318",
      year: "2015",
      operations: "Part 91",
      ownerOperator: "Pacific Meridian Aviation",
      base: "KVNY Van Nuys",
      verified: true,
      engineManufacturer: "Williams International",
      engineType: "FJ44-4A",
      engineSeries: "FJ44",
      engineSerials: "211912, 211913",
      engines: 2,
      maintenanceProgramme: "Cescom",
      nationality: "United States",
      registryStandard: "FAA",
      amoName: "Textron Aviation Service",
      amoPhone: "+1 316 517 6000",
      amoEmergencyPhone: "+1 310 555 0181",
      picPhone: "+1 310 555 0182",
      maintenancePoc: "Chris Miller",
      insurerName: "Starr Aviation",
      insurerPolicyRef: "STA-CJ4-00818",
      totalAirframeHours: "3,115",
      plan: "monthly",
    },
    case: {
      id: "AOG-SEED08",
      ataChapter: "Air Conditioning",
      affectedSystem: "Cabin pressure controller",
      partNumber: "103670-7",
      issueDescription: "Cabin would not pressurise above FL180 during climb.",
      urgency: "Aircraft grounded",
      status: "Resolved",
      hoursAgo: 96,
      resolved: true,
    },
  },
  {
    id: "s009",
    name: "Noah Stein",
    company: "RheinJet Operations GmbH",
    email: "noah.stein@example.com",
    phone: "+49 69 5550 9010",
    role: "Operator",
    aircraft: {
      id: "ac_s009",
      registration: "D-CRJO",
      category: "Turboprop",
      makeModel: "Beechcraft King Air 350i",
      serialNumber: "FL-1092",
      year: "2014",
      operations: "Air ambulance standby",
      ownerOperator: "RheinJet Operations GmbH",
      base: "EDDF Frankfurt",
      verified: false,
      engineManufacturer: "Pratt & Whitney Canada",
      engineType: "PT6A-60A",
      engineSeries: "PT6A",
      engineSerials: "PCE-PK2134, PCE-PK2135",
      engines: 2,
      maintenanceProgramme: "CAMP",
      nationality: "Germany",
      registryStandard: "EASA",
      amoName: "Aero-Dienst GmbH",
      amoPhone: "+49 911 9356 0",
      amoEmergencyPhone: "+49 171 555 9011",
      picPhone: "+49 171 555 9012",
      maintenancePoc: "Eva Kruger",
      insurerName: "Allianz Global Corporate",
      insurerPolicyRef: "AGC-KA350-5591",
      totalAirframeHours: "5,600",
      plan: "monthly",
    },
  },
  {
    id: "s010",
    name: "Isabella Morgan",
    company: "Morgan Aero Holdings",
    email: "isabella.morgan@example.com",
    phone: "+44 7700 900110",
    role: "Owner",
    aircraft: {
      id: "ac_s010",
      registration: "G-MRGN",
      category: "Multi Engine",
      makeModel: "Beechcraft Baron G58",
      serialNumber: "TH-2451",
      year: "2011",
      operations: "Private",
      ownerOperator: "Morgan Aero Holdings",
      base: "EGHH Bournemouth",
      verified: true,
      engineManufacturer: "Continental",
      engineType: "IO-550-C",
      engineSeries: "IO-550",
      engineSerials: "1009821, 1009822",
      engines: 2,
      maintenanceProgramme: "Manufacturer schedule",
      nationality: "United Kingdom",
      registryStandard: "CAA",
      amoName: "Bournemouth Aviation Services",
      amoPhone: "+44 1202 555 010",
      amoEmergencyPhone: "+44 7700 900210",
      picPhone: "+44 7700 900310",
      maintenancePoc: "Peter Evans",
      insurerName: "Visicover",
      insurerPolicyRef: "VIS-B58-7710",
      totalAirframeHours: "2,890",
      plan: "annual",
    },
  },
];

async function ensureAuthUser(email: string, name: string) {
  const existing = await pool.query<{ id: string }>(
    'select id from "user" where lower(email) = $1',
    [email.toLowerCase()],
  );
  if (existing.rows[0]) return existing.rows[0].id;

  const result = await auth.api.signUpEmail({
    body: { email, password, name },
  });

  return result.user.id;
}

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

async function main() {
  const admin = await pool.query<{ user_id: string }>(
    "select user_id from profiles where is_admin = true order by created_at asc limit 1",
  );
  const adminUserId = admin.rows[0]?.user_id ?? "system";

  for (const item of users) {
    const userId = await ensureAuthUser(item.email, item.name);
    const aircraft = item.aircraft;
    const subscriptionId = `sub_${item.id}`;
    const invoiceId = `inv_${item.id}`;

    await db
      .insert(schema.profiles)
      .values({
        userId,
        name: item.name,
        company: item.company,
        email: item.email,
        phone: item.phone,
        role: item.role,
        isAdmin: false,
      })
      .onConflictDoUpdate({
        target: schema.profiles.userId,
        set: {
          name: item.name,
          company: item.company,
          email: item.email,
          phone: item.phone,
          role: item.role,
          isAdmin: false,
          updatedAt: new Date(),
        },
      });

    await db
      .insert(schema.aircraft)
      .values({
        id: aircraft.id,
        userId,
        registration: aircraft.registration,
        category: aircraft.category,
        makeModel: aircraft.makeModel,
        serialNumber: aircraft.serialNumber,
        yearOfManufacture: aircraft.year,
        typeOfOperations: aircraft.operations,
        ownerOperatorName: aircraft.ownerOperator,
        baseAirport: aircraft.base,
        verificationStatus: aircraft.verified ? "Verified" : "Pending",
        engineManufacturer: aircraft.engineManufacturer,
        engineType: aircraft.engineType,
        engineProgram: aircraft.engineSeries,
        engineSerialNumbers: aircraft.engineSerials,
        numberOfEngines: aircraft.engines,
        maintenanceProgramme: aircraft.maintenanceProgramme,
        nationality: aircraft.nationality,
        registryStandard: aircraft.registryStandard,
        amoName: aircraft.amoName,
        amoPhone: aircraft.amoPhone,
        amoEmergencyPhone: aircraft.amoEmergencyPhone,
        picPhone: aircraft.picPhone,
        picName: "Captain " + (user.name || "Oliver Bancroft"),
        picEmail: user.email ? "pic@" + user.email.split("@")[1] : "pic@bancroftaviation.com",
        apuMakeModel: aircraft.category === "Business Jet" ? "Honeywell GTCP36-150" : "",
        maintenancePoc: aircraft.maintenancePoc,
        insurerName: aircraft.insurerName,
        insurerPolicyRef: aircraft.insurerPolicyRef,
        totalAirframeHours: aircraft.totalAirframeHours,
        plan: aircraft.plan,
        subscriptionStatus: "Active",
      })
      .onConflictDoUpdate({
        target: schema.aircraft.id,
        set: {
          userId,
          registration: aircraft.registration,
          category: aircraft.category,
          makeModel: aircraft.makeModel,
          serialNumber: aircraft.serialNumber,
          yearOfManufacture: aircraft.year,
          typeOfOperations: aircraft.operations,
          ownerOperatorName: aircraft.ownerOperator,
          baseAirport: aircraft.base,
          verificationStatus: aircraft.verified ? "Verified" : "Pending",
          engineManufacturer: aircraft.engineManufacturer,
          engineType: aircraft.engineType,
          engineProgram: aircraft.engineSeries,
          engineSerialNumbers: aircraft.engineSerials,
          numberOfEngines: aircraft.engines,
          maintenanceProgramme: aircraft.maintenanceProgramme,
          nationality: aircraft.nationality,
          registryStandard: aircraft.registryStandard,
          amoName: aircraft.amoName,
          amoPhone: aircraft.amoPhone,
          amoEmergencyPhone: aircraft.amoEmergencyPhone,
          picPhone: aircraft.picPhone,
          picName: "Captain " + (user.name || "Oliver Bancroft"),
          picEmail: user.email ? "pic@" + user.email.split("@")[1] : "pic@bancroftaviation.com",
          apuMakeModel: aircraft.category === "Business Jet" ? "Honeywell GTCP36-150" : "",
          maintenancePoc: aircraft.maintenancePoc,
          insurerName: aircraft.insurerName,
          insurerPolicyRef: aircraft.insurerPolicyRef,
          totalAirframeHours: aircraft.totalAirframeHours,
          plan: aircraft.plan,
          subscriptionStatus: "Active",
          updatedAt: new Date(),
        },
      });

    await db
      .insert(schema.subscriptions)
      .values({
        id: subscriptionId,
        userId,
        aircraftId: aircraft.id,
        plan: aircraft.plan,
        status: "Active",
        mockProviderRef: `seed_${subscriptionId}`,
        stripeCustomerId: `cus_seed_${item.id}`,
        stripeSubscriptionId: `sub_seed_${item.id}`,
      })
      .onConflictDoUpdate({
        target: schema.subscriptions.id,
        set: {
          userId,
          aircraftId: aircraft.id,
          plan: aircraft.plan,
          status: "Active",
          updatedAt: new Date(),
        },
      });

    await db
      .insert(schema.invoices)
      .values({
        id: invoiceId,
        userId,
        subscriptionId,
        amountCents: aircraft.plan === "annual" ? 100000 : 10000,
        currency: "usd",
        status: "Paid",
        createdAt: hoursAgo(24 * (users.indexOf(item) + 1)),
      })
      .onConflictDoNothing();

    await db
      .insert(schema.aircraftDocuments)
      .values([
        {
          id: `doc_reg_${item.id}`,
          aircraftId: aircraft.id,
          userId,
          documentType: "Certificate of Registration",
          fileName: `${aircraft.registration}-registration.pdf`,
          storageKey: "",
        },
        {
          id: `doc_ins_${item.id}`,
          aircraftId: aircraft.id,
          userId,
          documentType: "Insurance Certificate",
          fileName: `${aircraft.registration}-insurance.pdf`,
          storageKey: "",
        },
      ])
      .onConflictDoNothing();

    await db
      .insert(schema.teamMembers)
      .values({
        id: `team_pic_${item.id}`,
        userId,
        memberName: `${item.name.split(" ")[0]} PIC`,
        memberEmail: `pic.${item.id}@example.com`,
        role: "pic",
      })
      .onConflictDoNothing();

    await db
      .insert(schema.notifications)
      .values({
        id: `notif_cover_${item.id}`,
        userId,
        category: "AOG",
        title: aircraft.verified ? "Cover active" : "Cover activation pending",
        body: aircraft.verified
          ? `${aircraft.registration} has been verified for AOG cover.`
          : `${aircraft.registration} is pending PlaneServe verification.`,
        isRead: aircraft.verified,
        createdAt: hoursAgo(12),
      })
      .onConflictDoNothing();

    await db
      .insert(schema.messages)
      .values({
        id: `msg_welcome_${item.id}`,
        userId,
        senderId: adminUserId,
        senderType: "admin",
        body: `Welcome to PlaneServe. ${aircraft.registration} is on file and our desk has your operating contacts.`,
        isRead: false,
        createdAt: hoursAgo(10),
      })
      .onConflictDoNothing();

    if (item.case) {
      const request = item.case;
      const createdAt = hoursAgo(request.hoursAgo);

      await db
        .insert(schema.aogRequests)
        .values({
          id: request.id,
          userId,
          aircraftId: aircraft.id,
          registration: aircraft.registration,
          location: aircraft.base,
          aircraftType: aircraft.makeModel,
          ataChapter: request.ataChapter,
          affectedSystem: request.affectedSystem,
          partNumber: request.partNumber,
          issueDescription: request.issueDescription,
          urgency: request.urgency,
          contactName: item.name,
          contactPhone: item.phone,
          contactEmail: item.email,
          peopleOnBoard: request.urgency === "Aircraft grounded" ? "4" : "",
          flyingDeadline:
            request.urgency === "Aircraft grounded" ? "ASAP / next sector" : "Next 24h",
          amoAware: "Yes",
          caseReference: request.id,
          status: request.status,
          exceptionStates: request.exceptionStates ?? [],
          handlerId: adminUserId,
          awbNumber: request.status === "Order placed" ? "DHL893774210" : "",
          freightCourier: request.status === "Order placed" ? "DHL Express" : "",
          freightTrackingRef: request.status === "Order placed" ? "893774210" : "",
          caseRating: request.resolved ? 5 : null,
          caseRatingComment: request.resolved ? "Fast sourcing and clear updates." : "",
          createdAt,
          updatedAt: createdAt,
        })
        .onConflictDoUpdate({
          target: schema.aogRequests.id,
          set: {
            userId,
            aircraftId: aircraft.id,
            status: request.status,
            exceptionStates: request.exceptionStates ?? [],
            handlerId: adminUserId,
            updatedAt: new Date(),
          },
        });

      await db
        .insert(schema.aogStatusEvents)
        .values({
          id: `evt_${request.id}_submitted`,
          requestId: request.id,
          status: "Submitted",
          note: "Seeded subscriber request",
          createdByUserId: userId,
          createdAt,
        })
        .onConflictDoNothing();

      if (request.status !== "Submitted") {
        await db
          .insert(schema.aogStatusEvents)
          .values({
            id: `evt_${request.id}_${request.status.toLowerCase().replaceAll(" ", "_")}`,
            requestId: request.id,
            status: request.status,
            note: `Case moved to ${request.status}`,
            createdByUserId: adminUserId,
            createdAt: hoursAgo(Math.max(request.hoursAgo - 2, 1)),
          })
          .onConflictDoNothing();
      }

      await db
        .insert(schema.aogRequestAttachments)
        .values({
          id: `att_${request.id}`,
          requestId: request.id,
          fileName: `${request.id.toLowerCase()}-tech-log.pdf`,
          storageKey: "",
        })
        .onConflictDoNothing();

      await db
        .insert(schema.notifications)
        .values({
          id: `notif_${request.id}`,
          userId,
          category: "AOG",
          title: `AOG case ${request.status}`,
          body: `${request.affectedSystem} for ${aircraft.registration} is currently ${request.status}.`,
          requestId: request.id,
          isRead: false,
          createdAt: hoursAgo(Math.max(request.hoursAgo - 1, 1)),
        })
        .onConflictDoNothing();
    }
  }

  console.log(`Seeded ${users.length} realistic subscriber users.`);
  console.log(`Password for seeded users: ${password}`);
  console.log(`Example login: ${users[0].email} / ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
