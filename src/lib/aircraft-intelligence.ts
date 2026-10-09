export interface AirframeIntelligence {
  airframeFamily: string;
  frequentlyRequired: { component: string; ata: string; notes: string }[];
  difficultToSource: { component: string; typicalLeadTime: string; bottleneck: string }[];
  knownAlternatives: { primary: string; alternative: string; notes: string }[];
  supplierAvailability: { region: string; facilities: string[]; rotablePools: string }[];
  deskRecommendations: string[];
}

export function getAirframeIntelligence(makeModel: string, category: string = "Business Jet"): AirframeIntelligence {
  const model = (makeModel || "").toLowerCase();

  // 1. Gulfstream Family
  if (model.includes("gulfstream") || model.includes("g450") || model.includes("g550") || model.includes("g650") || model.includes("g280") || model.includes("g200") || model.includes("giv") || model.includes("gv") || model.includes("g500") || model.includes("g600")) {
    return {
      airframeFamily: "Gulfstream Aerospace",
      frequentlyRequired: [
        { component: "Starter-Generator (Safran / Thales 28V)", ata: "ATA 24 Electrical", notes: "High duty cycle; exchange units usually kept in pre-vetted London/Teterboro pool" },
        { component: "Bleed Air PRSOV / Shutoff Valve", ata: "ATA 36 Pneumatic", notes: "High thermal cycle wear item; common trigger for dispatch deferral / MEL" },
        { component: "Nosewheel Steering Actuator & Servo", ata: "ATA 32 Landing Gear", notes: "Frequent seal weeping in cold operations; serviceable spares tracked" },
        { component: "Hydraulic PTU Motor Pump Bottle", ata: "ATA 29 Hydraulic", notes: "Abex / Eaton pump assembly; critical dispatch item" },
        { component: "PlaneView / Primus Epic Display Unit (DU-885 / DU-1310)", ata: "ATA 34 Avionics", notes: "Rapid exchange rotable with FAA 8130-3 / EASA dual-release" },
        { component: "Carbon Brake Heat Pack Assembly", ata: "ATA 32 Landing Gear", notes: "High consumption rotable; multiple overhaul cycles verified" },
      ],
      difficultToSource: [
        { component: "Main Landing Gear Actuator", typicalLeadTime: "6–10 weeks", bottleneck: "Heavy Part 145 overhaul station backlogs globally" },
        { component: "Cockpit Windshield Panels (Heated)", typicalLeadTime: "12–18 weeks", bottleneck: "OEM manufacturer order backlog; teardown units prioritized" },
        { component: "Flap Mechanical Drive Actuator Gearbox", typicalLeadTime: "3–6 weeks", bottleneck: "Scarcity of low-cycle serviceable surplus cores" },
        { component: "APU 36-150 Combustor Liner & Fuel Control", typicalLeadTime: "2–4 weeks", bottleneck: "Exchange pool shortages during peak charter seasons" },
      ],
      knownAlternatives: [
        { primary: "Honeywell CRT DU-880 Display", alternative: "Honeywell DU-885 LCD Retrofit", notes: "Permanent upgrade eliminating CRT obsolescence under Gulfstream ASC" },
        { primary: "Goodrich Carbon Brake Assembly", alternative: "ABSC Carbon Brake Mod", notes: "Interchangeable per manufacturer Service Bulletin when paired on axle" },
        { primary: "Legacy AC Generator 115V", alternative: "Modern Brushless IDG Variant", notes: "Requires check of generator control unit (GCU) part compatibility" },
      ],
      supplierAvailability: [
        { region: "Europe (UK / Switzerland / France)", facilities: ["Gulfstream Service Center Luton / Farnborough", "AMAC Aerospace Basel", "Jet Aviation Geneva / Basel"], rotablePools: "London Heathrow / Stansted 2-hour dispatch stock" },
        { region: "North America (East / Central)", facilities: ["Gulfstream Savannah (OEM HQ)", "West Star Aviation East Alton", "Duncan Aviation Lincoln"], rotablePools: "Teterboro & Dallas Fort Worth AOG hubs" },
        { region: "Middle East (UAE)", facilities: ["ExecuJet MRO Dubai South", "Falcon Aviation Services Al Bateen"], rotablePools: "Dubai World Central bonded inventory" },
      ],
      deskRecommendations: [
        "Verify engine enrollment (Rolls-Royce CorporateCare / JSSI) before initiating rotable loans to avoid duplicate coverage fees.",
        "Ensure all rotable orders request dual-release EASA Form 1 / FAA 8130-3 with trace back to birth for flight-critical components.",
        "Check APU hour-to-cycle ratio: APU start contactors frequently require inspection at 500-hour intervals.",
      ],
    };
  }

  // 2. Bombardier Family
  if (model.includes("bombardier") || model.includes("challenger") || model.includes("global") || model.includes("learjet") || model.includes("cl300") || model.includes("cl350") || model.includes("cl604") || model.includes("cl605") || model.includes("cl650") || model.includes("bd-700")) {
    return {
      airframeFamily: "Bombardier Aviation",
      frequentlyRequired: [
        { component: "Integrated Drive Generator (IDG 115V)", ata: "ATA 24 Electrical", notes: "Hamilton Sundstrand rotable; core exchange terms required" },
        { component: "Electric ACMP Hydraulic Motor Pump", ata: "ATA 29 Hydraulic", notes: "Primary source of system 3 hydraulic pressure; common AOG failure" },
        { component: "Flap Electronic Control Unit (FECU)", ata: "ATA 27 Flight Controls", notes: "Sensitive to power bus fluctuations; quick-swap LRU" },
        { component: "Main Wheel & Carbon Brake Heat Pack", ata: "ATA 32 Landing Gear", notes: "Goodrich / Meggitt rotable with dual release" },
        { component: "Air Cycle Machine (ACM) & Outflow Valve", ata: "ATA 21 Environmental", notes: "Liebherr / Hamilton system; overhaul turn-around 15 days" },
      ],
      difficultToSource: [
        { component: "Horizontal Stabilizer Trim Actuator (HSTA)", typicalLeadTime: "8–12 weeks", bottleneck: "Strict flight-critical airworthiness directive inspection cycles" },
        { component: "Thrust Reverser Actuator & Synchronizer", typicalLeadTime: "4–8 weeks", bottleneck: "OEM core availability restricted in Europe" },
        { component: "Cockpit Windshield (Left / Right)", typicalLeadTime: "10–16 weeks", bottleneck: "PPG / Saint-Gobain manufacturing lead time" },
      ],
      knownAlternatives: [
        { primary: "Parker Hydraulic Pump -001", alternative: "Parker Hydraulic Pump -003 / -005", notes: "Superseded part numbers fully backward compatible per Bombardier SB" },
        { primary: "Collins Pro Line 4 Display", alternative: "Collins Pro Line 21 IDS Upgrade", notes: "Full STC available; exchange cores accepted" },
      ],
      supplierAvailability: [
        { region: "Europe (UK / Germany / Switzerland)", facilities: ["Bombardier Biggin Hill Service Centre", "Lufthansa Bombardier Berlin", "TAG Aviation Geneva"], rotablePools: "London Stansted & Frankfurt express parts hub" },
        { region: "North America", facilities: ["Bombardier Hartford / Fort Lauderdale", "StandardAero Augusta", "Flying Colours Peterborough"], rotablePools: "Montreal & Dallas rotable depots" },
        { region: "Middle East", facilities: ["Bombardier Service Centre Dubai South", "Empire Aviation Dubai"], rotablePools: "DWC bonded logistics zone" },
      ],
      deskRecommendations: [
        "Confirm whether airframe is enrolled in Bombardier Smart Services or JSSI Parts program.",
        "For Challenger 300/350, monitor hydraulic brake accumulator pre-charge pressures during seasonal temperature shifts.",
        "Always request full 8130/Form 1 EASA dual-release documentation with non-incident statement.",
      ],
    };
  }

  // 3. Cessna / Textron Aviation Family
  if (model.includes("cessna") || model.includes("citation") || model.includes("mustang") || model.includes("cj") || model.includes("xls") || model.includes("sovereign") || model.includes("latitude") || model.includes("longitude") || model.includes("560xl") || model.includes("680")) {
    return {
      airframeFamily: "Cessna Citation / Textron Aviation",
      frequentlyRequired: [
        { component: "Starter-Generator (Safran / APC 150SG / 250SG)", ata: "ATA 24 Electrical", notes: "Standard 28V rotable; brush wear inspection every 300 hrs" },
        { component: "Securaplane Emergency Power Supply Battery", ata: "ATA 24 Electrical", notes: "Sealed lead-acid emergency unit; shelf life limits monitored" },
        { component: "Garmin G1000/G3000 / Collins Pro Line 21 LRU", ata: "ATA 34 Avionics", notes: "Integrated avionics unit (IAU) exchange pool readily accessible" },
        { component: "Air Cycle Machine (ACM) Pack", ata: "ATA 21 Environmental", notes: "High operational duty on midsize Citation fleet" },
        { component: "Brake Assembly & Wear Pin Retainers", ata: "ATA 32 Landing Gear", notes: "Goodrich / ABSC steel and carbon brake options" },
      ],
      difficultToSource: [
        { component: "Flap Flexible Drive Shafts & Gearboxes", typicalLeadTime: "4–8 weeks", bottleneck: "Textron parts depot backorders on legacy 560XL/Sovereign" },
        { component: "Windshield Heat Temperature Controller", typicalLeadTime: "3–6 weeks", bottleneck: "Semiconductor supply chain constraints on older revisions" },
        { component: "Trailing Link Gear Actuators", typicalLeadTime: "6–10 weeks", bottleneck: "Overhaul exchange cores scarce in Europe" },
      ],
      knownAlternatives: [
        { primary: "Ni-Cad Main Battery", alternative: "Concorde RG Sealed Lead Acid Battery", notes: "Drop-in STC replacement eliminating costly thermal runaway servicing" },
        { primary: "Legacy Starter-Generator 23078 Series", alternative: "Brushless 23080 Series", notes: "Lower maintenance requirement with approved service bulletin" },
      ],
      supplierAvailability: [
        { region: "Europe", facilities: ["Textron Aviation Dusseldorf / Doncaster / Valencia", "Atlas Air Service Ganderkesee"], rotablePools: "Amsterdam Schiphol & Frankfurt express rotable hubs" },
        { region: "North America", facilities: ["Textron Service Centers (Wichita, Orlando, Mesa)", "West Star Aviation", "Duncan Aviation"], rotablePools: "Wichita central warehouse 24/7 AOG" },
      ],
      deskRecommendations: [
        "Verify engine coverage (Williams TAP Blue, Pratt & Whitney ESP, or Honeywell MSP) before ordering engine accessories.",
        "Keep 1 spare starter-generator tagged in regional forward-stock for high-utilization CJ fleets.",
        "Check status of Citation Service Letter updates for de-icing boot surface treatments.",
      ],
    };
  }

  // 4. Embraer Family
  if (model.includes("embraer") || model.includes("phenom") || model.includes("legacy") || model.includes("praetor") || model.includes("emb-500") || model.includes("emb-505") || model.includes("emb-550")) {
    return {
      airframeFamily: "Embraer Executive Jets",
      frequentlyRequired: [
        { component: "Brake-by-Wire Control Unit (BCU)", ata: "ATA 32 Landing Gear", notes: "Critical fly-by-wire braking computer; exchange units on standby" },
        { component: "Brushless Starter-Generator (Safran 28V)", ata: "ATA 24 Electrical", notes: "Modern brushless architecture; lower wear but sensitive electronics" },
        { component: "Secondary Power Distribution Box (SPDB)", ata: "ATA 24 Electrical", notes: "Solid-state power distribution module" },
        { component: "SmartProbe Air Data Computer", ata: "ATA 34 Avionics", notes: "Multifunction air data probe; immediate AOG replacement" },
        { component: "Pratt & Whitney PW535E / PW617F Line Accessories", ata: "ATA 73 Engine Fuel", notes: "Fuel control units and oil filter delta-P switches" },
      ],
      difficultToSource: [
        { component: "Brake Hydraulic Accumulator Assembly", typicalLeadTime: "4–6 weeks", bottleneck: "Strict hydro-test certification requirements in Europe" },
        { component: "Flap Surface Actuator Drive Unit", typicalLeadTime: "6–8 weeks", bottleneck: "Low serviceable pool volume in third-party channels" },
      ],
      knownAlternatives: [
        { primary: "Goodrich Steel Brake Assembly", alternative: "Carbon Brake Upgrade", notes: "Offered on newer Phenom 300 models with extended cycle lives" },
        { primary: "Garmin G1000 NXi Core Unit", alternative: "Garmin Standard Exchange", notes: "Garmin direct exchange network delivers within 24 hours" },
      ],
      supplierAvailability: [
        { region: "Europe", facilities: ["Embraer Le Bourget Service Centre", "ExecuJet Brussels", "Aeromechanic Portugal"], rotablePools: "Paris Le Bourget bonded parts depot" },
        { region: "North America", facilities: ["Embraer Melbourne FL / Fort Lauderdale", "Constant Aviation", "Eagle Creek Aviation"], rotablePools: "Melbourne FL global warehouse" },
      ],
      deskRecommendations: [
        "Check if enrolled in Embraer Executive Care (EEC) Standard or Enhanced tier.",
        "Phenom 100/300 fleets operate high cycle counts; monitor tire and brake wear indices closely.",
        "Ensure Garmin database and G1000 software baseline compatibility is matched on any swapped LRU.",
      ],
    };
  }

  // 5. Hawker & Beechcraft King Air Family
  if (model.includes("beechcraft") || model.includes("king air") || model.includes("hawker") || model.includes("b200") || model.includes("b350") || model.includes("c90") || model.includes("800xp") || model.includes("900xp")) {
    return {
      airframeFamily: "Beechcraft & Hawker (Textron)",
      frequentlyRequired: [
        { component: "PT6A Fuel Nozzle & Flow Divider Set", ata: "ATA 73 Engine Fuel", notes: "Recommended hot section inspection replacement item" },
        { component: "APC 300A Starter-Generator", ata: "ATA 24 Electrical", notes: "Standard 28V DC starter-generator for turboprop twins" },
        { component: "Pneumatic Wing De-Ice Boot Set", ata: "ATA 30 Ice & Rain", notes: "High winter demand; pre-formed boots tracked" },
        { component: "TKS De-Ice Fluid Metering Pump", ata: "ATA 30 Ice & Rain", notes: "Hawker weeping wing fluid system critical rotable" },
        { component: "Flap Drive Gearbox & Flexible Shaft", ata: "ATA 27 Flight Controls", notes: "Common asymmetry inspection requirement" },
      ],
      difficultToSource: [
        { component: "TFE731 DEEC Engine Digital Computer", typicalLeadTime: "4–8 weeks", bottleneck: "Honeywell aerospace core shortages on legacy Hawker 800" },
        { component: "Main Gear Retract Motor / Gearbox", typicalLeadTime: "5–8 weeks", bottleneck: "High demand across commercial turboprop operators" },
      ],
      knownAlternatives: [
        { primary: "Hartzell 4-Blade Aluminum Propeller", alternative: "Hartzell 5-Blade Composite Propeller", notes: "Raisbeck Engineering STC reduces cabin noise and enhances climb performance" },
        { primary: "Legacy Cleveland Brakes", alternative: "High-Performance APS BlackSteel Brakes", notes: "FAA-PMA approved with improved heat dissipation" },
      ],
      supplierAvailability: [
        { region: "Europe", facilities: ["Textron UK", "Gama Aviation Farnborough", "Airwork Germany"], rotablePools: "London Biggin Hill / Bournemouth parts store" },
        { region: "North America", facilities: ["Stevens Aerospace", "Elliott Aviation", "Yingling Aviation"], rotablePools: "Wichita KS central supply" },
      ],
      deskRecommendations: [
        "For Hawker aircraft, check Honeywell MSP status on TFE731 engines and GTCP36-150 APU.",
        "King Air PT6A engines benefit from trend monitoring to catch fuel nozzle coking before hot section degradation.",
        "Ensure trace paperwork includes PMA approval certificates where aftermarket components are used.",
      ],
    };
  }

  // 6. Generic / Default Business Aviation Profile
  return {
    airframeFamily: makeModel || "Business Aviation Airframe",
    frequentlyRequired: [
      { component: "Starter-Generator & Voltage Regulator (28V DC)", ata: "ATA 24 Electrical", notes: "Primary rotable accessory across turbine & turboprop fleets" },
      { component: "Main Wheel & Carbon / Steel Brake Heat Pack", ata: "ATA 32 Landing Gear", notes: "Consumable rotable requiring certified wear-pin trace" },
      { component: "Bleed Air Pressure Regulating Valve (PRSOV)", ata: "ATA 36 Pneumatic", notes: "Common pneumatic subsystem failure affecting dispatch" },
      { component: "Avionics Display & Integrated Navigation LRU", ata: "ATA 34 Avionics", notes: "Quick-disconnect LRU requiring software baseline alignment" },
      { component: "Hydraulic Engine-Driven / Electric Pump", ata: "ATA 29 Hydraulic", notes: "Critical flight control & gear actuation power source" },
    ],
    difficultToSource: [
      { component: "Cockpit Heated Windshield Panels", typicalLeadTime: "8–16 weeks", bottleneck: "Specialized glass lamination backorders with OEM suppliers" },
      { component: "Landing Gear Actuation & Selector Valves", typicalLeadTime: "4–8 weeks", bottleneck: "Part 145 overhaul shop turn-around times" },
      { component: "Flap Mechanical Drive Gearboxes", typicalLeadTime: "3–6 weeks", bottleneck: "Serviceable core availability in Europe and the Americas" },
    ],
    knownAlternatives: [
      { primary: "OEM Factory New (FN) Rotable", alternative: "Dual-Release Overhauled (OH) Unit", notes: "Delivers immediate dispatch at 40–60% lower cost with full EASA/FAA warranty" },
      { primary: "Ni-Cad Battery System", alternative: "Sealed Lead-Acid (RG) Battery STC", notes: "Eliminates deep-discharge shop maintenance schedules" },
    ],
    supplierAvailability: [
      { region: "Europe", facilities: ["Major Part 145 Maintenance Hubs (Luton, Farnborough, Le Bourget, Basel, Geneva)"], rotablePools: "London & Frankfurt 4-hour express dispatch network" },
      { region: "North America", facilities: ["Authorized Repair Stations (Teterboro, Dallas, Atlanta, Wichita)"], rotablePools: "Continental USA 24/7 AOG distribution points" },
      { region: "Middle East", facilities: ["Dubai South (DWC) & Al Bateen Executive"], rotablePools: "UAE Free Zone bonded logistics" },
    ],
    deskRecommendations: [
      "Cross-check airframe hours and engine cycle logs against manufacturer maintenance inspection thresholds.",
      "Require dual-release EASA Form 1 / FAA 8130-3 certification on all rotable components.",
      "Verify engine and APU program coverage (JSSI, Rolls-Royce CorporateCare, Pratt ESP, Honeywell MSP) prior to placing rotable orders.",
    ],
  };
}
