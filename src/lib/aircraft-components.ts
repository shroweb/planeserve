// Curated "commonly-failed components" per aircraft type, grouped by ATA system.
//
// Keys: aircraft make/model (lower-cased) → ATA option label (must match the
// ATA_OPTIONS strings used in the submit-AOG form) → component names.
//
// This is STARTER/EXAMPLE data. Replace and extend with PlaneServe's curated
// lists (the data James is supplying). The submit form falls back to free text
// whenever there's no curated list for the aircraft+system, so partial coverage
// is fine — add aircraft types as the data arrives.

export type ComponentCatalog = Record<string, Record<string, string[]>>;

export const COMPONENT_CATALOG: ComponentCatalog = {
  "learjet 35a": {
    "Hydraulic Power (ATA 29)": [
      "Hydraulic pump",
      "Brake metering valve",
      "Reservoir assembly",
      "Pressure switch",
    ],
    "Landing Gear / Brakes / Tyres (ATA 32)": [
      "Brake actuator seal kit",
      "Main gear actuator",
      "Nose gear actuator",
      "Main wheel / tyre assembly",
    ],
  },
  "cessna citation cj4": {
    "Hydraulic Power (ATA 29)": ["Hydraulic pump", "Brake metering valve", "Nose gear actuator"],
    "Electrical Power — generator, battery (ATA 24)": [
      "Starter generator",
      "Main battery",
      "Bus tie contactor",
    ],
  },
};

// Components for a given aircraft + ATA system. Empty array = no curated list
// (caller should offer free text).
export function componentsFor(makeModel: string | undefined, ataLabel: string): string[] {
  if (!makeModel || !ataLabel) return [];
  return COMPONENT_CATALOG[makeModel.trim().toLowerCase()]?.[ataLabel] ?? [];
}
