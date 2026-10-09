import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import { StatusPill, statusTone } from "@/components/app/ui";
import {
  ensureAdminSession,
  getAdminAircraft,
  verifyAircraft,
  adminUpdateAircraftDossier,
  type AircraftRecord,
  type UserRecord,
} from "@/lib/app.functions";
import { getAirframeIntelligence } from "@/lib/aircraft-intelligence";
import {
  X,
  Plane,
  Wrench,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Cpu,
  History,
  Sparkles,
  Edit3,
  Save,
  ExternalLink,
  ChevronRight,
  MapPin,
  Building2,
  User,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PROPELLER_CATEGORIES = new Set(["Turboprop", "Single Engine", "Multi Engine"]);

function hasPropeller(category: string) {
  return PROPELLER_CATEGORIES.has(category);
}

export const Route = createFileRoute("/admin/aircraft")({
  beforeLoad: async () => {
    try {
      await ensureAdminSession();
    } catch {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminAircraft,
});

function AdminAircraft() {
  const queryClient = useQueryClient();
  const [selectedAircraftId, setSelectedAircraftId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("");

  const { data } = useQuery({
    queryKey: ["admin-aircraft"],
    queryFn: () => getAdminAircraft(),
  });

  const users = data?.users ?? [];
  const aircraft = data?.aircraft ?? [];
  const aogRequests = (data as any)?.aogRequests ?? [];
  const partsRequests = (data as any)?.partsRequests ?? [];

  const activeAircraft = aircraft.filter((item) => !item.archivedAt);
  const categories = Array.from(new Set(activeAircraft.map((item) => item.category))).sort();

  const filteredAircraft = activeAircraft.filter((item) => {
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    const term = locationFilter.trim().toLowerCase();
    const matchesLocation =
      !term ||
      item.registration.toLowerCase().includes(term) ||
      item.baseAirport.toLowerCase().includes(term) ||
      item.ownerOperatorName.toLowerCase().includes(term) ||
      item.makeModel.toLowerCase().includes(term) ||
      item.serialNumber.toLowerCase().includes(term);
    return matchesCategory && matchesLocation;
  });

  const selectedAircraft = aircraft.find((item) => item.id === selectedAircraftId) ?? null;
  const selectedOwner = selectedAircraft
    ? users.find((item) => item.id === selectedAircraft.userId)
    : undefined;

  // Filter linked historical events for selected tail
  const linkedAog = selectedAircraft
    ? aogRequests.filter(
        (r: any) =>
          r.aircraftId === selectedAircraft.id ||
          r.registration?.toLowerCase() === selectedAircraft.registration?.toLowerCase(),
      )
    : [];

  const linkedParts = selectedAircraft
    ? partsRequests.filter(
        (pr: any) =>
          pr.aircraftReg?.toLowerCase() === selectedAircraft.registration?.toLowerCase(),
      )
    : [];

  const verifyMutation = useMutation({
    mutationFn: (id: string) => verifyAircraft({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-aircraft"] });
      queryClient.invalidateQueries({ queryKey: ["admin-enrolments"] });
      toast.success("Aircraft cover verified.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to verify aircraft.");
    },
  });

  return (
    <AppShell variant="admin">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Aircraft Maintenance Files</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete digital maintenance & rotable support dossiers with predictive sourcing intelligence.
          </p>
        </div>
        <Link
          to="/admin/parts-requests"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3.5 py-2 text-xs font-semibold shadow-sm hover:bg-muted"
        >
          Parts Sourcing Desk <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatCard label="Enrolled Aircraft" value={String(activeAircraft.length)} detail="Monitored in digital fleet" />
        <StatCard
          label="Pending Verification"
          value={String(
            activeAircraft.filter((item) => item.verificationStatus === "Pending").length,
          )}
          detail="Requires cover review"
        />
        <StatCard
          label="Airframe Categories"
          value={String(categories.length)}
          detail={categories.join(" / ") || "No aircraft"}
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-md border border-border bg-card p-4 sm:flex-row">
        <label className="grid gap-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Category
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="min-h-10 rounded-sm border border-input bg-background px-3 text-sm font-normal normal-case tracking-normal text-foreground"
          >
            <option>All</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="grid flex-1 gap-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Search by Tail / MSN / Type / Operator / Base
          <input
            value={locationFilter}
            onChange={(event) => setLocationFilter(event.target.value)}
            className="min-h-10 rounded-sm border border-input bg-background px-3 text-sm font-normal normal-case tracking-normal text-foreground"
            placeholder="Search e.g. G450, N123AB, MSN 4128, EGKB, Gulfstream..."
          />
        </label>
      </div>

      <div className="mt-8 overflow-hidden rounded-md border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <Th>Aircraft / MSN</Th>
              <Th>Model & Category</Th>
              <Th>Operator / Company</Th>
              <Th>Base Airport</Th>
              <Th>Engine Program</Th>
              <Th>Status</Th>
              <Th>Support File</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredAircraft.map((a) => {
              const u = users.find((x) => x.id === a.userId);
              return (
                <tr
                  key={a.id}
                  onClick={() => setSelectedAircraftId(a.id)}
                  className="group cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <Td className="font-mono font-semibold">
                    <div className="text-foreground group-hover:text-primary transition-colors font-bold">
                      {a.registration}
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground">
                      {a.serialNumber ? `MSN ${a.serialNumber}` : "MSN —"}
                    </div>
                  </Td>
                  <Td>
                    <div className="font-medium text-foreground">{a.makeModel}</div>
                    <div className="text-[11px] text-muted-foreground">{a.category}</div>
                  </Td>
                  <Td>
                    <div className="font-medium">{a.ownerOperatorName || u?.company || u?.name}</div>
                    <div className="text-[11px] text-muted-foreground">{u?.email}</div>
                  </Td>
                  <Td className="font-mono">{a.baseAirport || "—"}</Td>
                  <Td>
                    <div className="text-xs font-medium text-foreground">
                      {a.engineProgram || "None recorded"}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {a.engineManufacturer} {a.engineType}
                    </div>
                  </Td>
                  <Td>
                    <StatusPill tone={statusTone(a.verificationStatus)}>
                      {a.verificationStatus}
                    </StatusPill>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {a.verificationStatus === "Pending" && (
                        <button
                          onClick={() => verifyMutation.mutate(a.id)}
                          className="rounded-sm bg-accent px-2 py-1 text-xs font-semibold text-white hover:bg-accent/90"
                        >
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedAircraftId(a.id)}
                        className="inline-flex items-center gap-1 rounded-sm border border-border bg-background px-2.5 py-1 text-xs font-medium hover:bg-muted"
                      >
                        Open File <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </Td>
                </tr>
              );
            })}
            {filteredAircraft.length === 0 && (
              <tr>
                <Td className="text-muted-foreground py-8 text-center" colSpan={7}>
                  No aircraft match this filter.
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedAircraft && (
        <AircraftDossierModal
          aircraft={selectedAircraft}
          owner={selectedOwner}
          linkedAog={linkedAog}
          linkedParts={linkedParts}
          verifying={verifyMutation.isPending}
          onClose={() => setSelectedAircraftId(null)}
          onVerify={() => verifyMutation.mutate(selectedAircraft.id)}
        />
      )}
    </AppShell>
  );
}

// ── DIGITAL MAINTENANCE & SUPPORT FILE (DOSSIER) ─────────────────────────────

type DossierTab = "info" | "contacts" | "engines" | "history" | "intelligence";

function AircraftDossierModal({
  aircraft,
  owner,
  linkedAog,
  linkedParts,
  verifying,
  onClose,
  onVerify,
}: {
  aircraft: AircraftRecord;
  owner?: any;
  linkedAog: any[];
  linkedParts: any[];
  verifying: boolean;
  onClose: () => void;
  onVerify: () => void;
}) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<DossierTab>("info");
  const [isEditing, setIsEditing] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState({
    baseAirport: aircraft.baseAirport,
    serialNumber: aircraft.serialNumber,
    yearOfManufacture: aircraft.yearOfManufacture,
    typeOfOperations: aircraft.typeOfOperations,
    ownerOperatorName: aircraft.ownerOperatorName,
    engineManufacturer: aircraft.engineManufacturer,
    engineType: aircraft.engineType,
    engineProgram: aircraft.engineProgram,
    engineSerialNumbers: aircraft.engineSerialNumbers,
    totalAirframeHours: aircraft.totalAirframeHours,
    apuMakeModel: aircraft.apuMakeModel,
    maintenanceProgramme: aircraft.maintenanceProgramme,
    amoName: aircraft.amoName,
    amoPhone: aircraft.amoPhone,
    amoEmergencyPhone: aircraft.amoEmergencyPhone,
    amoEmail: aircraft.amoEmail,
    amoLocation: aircraft.amoLocation,
    picName: aircraft.picName,
    picPhone: aircraft.picPhone,
    picEmail: aircraft.picEmail,
    maintenancePoc: aircraft.maintenancePoc,
    insurerName: aircraft.insurerName,
    insurerPolicyRef: aircraft.insurerPolicyRef,
  });

  const intelligence = getAirframeIntelligence(aircraft.makeModel, aircraft.category);

  const updateMutation = useMutation({
    mutationFn: () => adminUpdateAircraftDossier({ data: { id: aircraft.id, ...formData } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-aircraft"] });
      setIsEditing(false);
      toast.success("Aircraft maintenance file updated.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update aircraft file.");
    },
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-6 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative flex h-full max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dossier Header */}
        <div className="border-b border-border bg-background px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-accent/15 px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-accent">
                  Digital Maintenance File
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {aircraft.serialNumber ? `MSN ${aircraft.serialNumber}` : "No MSN recorded"}
                </span>
                {aircraft.yearOfManufacture && (
                  <span className="text-xs text-muted-foreground font-mono">
                    · Built {aircraft.yearOfManufacture}
                  </span>
                )}
              </div>
              <h2 className="mt-1.5 font-mono text-2xl font-bold tracking-tight text-foreground">
                {aircraft.makeModel} — <span className="text-primary">{aircraft.registration}</span>
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{aircraft.ownerOperatorName || owner?.company || owner?.name || "Operator unassigned"}</span>
                <span>•</span>
                <span>Base: <strong className="font-mono text-foreground">{aircraft.baseAirport || "Not recorded"}</strong></span>
                <span>•</span>
                <span>Cover: <StatusPill tone={statusTone(aircraft.verificationStatus)}>{aircraft.verificationStatus}</StatusPill></span>
                <span>•</span>
                <span className="font-semibold text-foreground">
                  {aircraft.plan === "annual" ? "Annual Cover" : "Monthly Cover"} ({aircraft.subscriptionStatus})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {aircraft.verificationStatus === "Pending" && (
                <button
                  onClick={onVerify}
                  disabled={verifying}
                  className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-accent/90 disabled:opacity-50"
                >
                  {verifying ? "Verifying..." : "Verify Cover"}
                </button>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isEditing
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background hover:bg-muted text-foreground"
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" />
                {isEditing ? "Cancel Edit" : "Edit File"}
              </button>
              <button
                onClick={onClose}
                className="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close dossier"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Dossier Navigation Tabs */}
          <div className="mt-5 flex gap-1 overflow-x-auto border-t border-border pt-2 text-xs">
            <button
              onClick={() => setTab("info")}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 font-medium transition-colors ${
                tab === "info"
                  ? "border-accent text-accent font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Plane className="h-3.5 w-3.5" />
              Aircraft Information
            </button>
            <button
              onClick={() => setTab("contacts")}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 font-medium transition-colors ${
                tab === "contacts"
                  ? "border-accent text-accent font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="h-3.5 w-3.5" />
              Key Contacts
            </button>
            <button
              onClick={() => setTab("engines")}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 font-medium transition-colors ${
                tab === "engines"
                  ? "border-accent text-accent font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Cpu className="h-3.5 w-3.5" />
              Powerplant & Systems
            </button>
            <button
              onClick={() => setTab("history")}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 font-medium transition-colors ${
                tab === "history"
                  ? "border-accent text-accent font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <History className="h-3.5 w-3.5" />
              Parts & AOG History ({linkedAog.length + linkedParts.length})
            </button>
            <button
              onClick={() => setTab("intelligence")}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 font-medium transition-colors ${
                tab === "intelligence"
                  ? "border-accent text-accent font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Intelligence & Rotables
            </button>
          </div>
        </div>

        {/* Dossier Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-muted/20">
          {isEditing ? (
            <div className="space-y-6">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
                <strong>Editing Aircraft File:</strong> Any adjustments made here will update the live technical profile and support records for {aircraft.registration}.
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4 rounded-lg border border-border bg-card p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">General Specs</h3>
                  <Field label="MSN / Serial Number" value={formData.serialNumber} onChange={(v) => setFormData({ ...formData, serialNumber: v })} />
                  <Field label="Year of Manufacture" value={formData.yearOfManufacture} onChange={(v) => setFormData({ ...formData, yearOfManufacture: v })} />
                  <Field label="Home Base Airport" value={formData.baseAirport} onChange={(v) => setFormData({ ...formData, baseAirport: v })} />
                  <Field label="Owner / Operator Name" value={formData.ownerOperatorName} onChange={(v) => setFormData({ ...formData, ownerOperatorName: v })} />
                  <Field label="Operations (e.g. Part 91 / 135)" value={formData.typeOfOperations} onChange={(v) => setFormData({ ...formData, typeOfOperations: v })} />
                  <Field label="Total Airframe Hours" value={formData.totalAirframeHours} onChange={(v) => setFormData({ ...formData, totalAirframeHours: v })} />
                </div>

                <div className="space-y-4 rounded-lg border border-border bg-card p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Engines & APU</h3>
                  <Field label="Engine Manufacturer" value={formData.engineManufacturer} onChange={(v) => setFormData({ ...formData, engineManufacturer: v })} />
                  <Field label="Engine Type / Model" value={formData.engineType} onChange={(v) => setFormData({ ...formData, engineType: v })} />
                  <Field label="Engine Program (JSSI, Rolls, MSP, etc.)" value={formData.engineProgram} onChange={(v) => setFormData({ ...formData, engineProgram: v })} />
                  <Field label="Engine Serial Numbers" value={formData.engineSerialNumbers} onChange={(v) => setFormData({ ...formData, engineSerialNumbers: v })} />
                  <Field label="APU Make & Model" value={formData.apuMakeModel} onChange={(v) => setFormData({ ...formData, apuMakeModel: v })} />
                  <Field label="Maintenance Programme" value={formData.maintenanceProgramme} onChange={(v) => setFormData({ ...formData, maintenanceProgramme: v })} />
                </div>

                <div className="space-y-4 rounded-lg border border-border bg-card p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Chief Pilot & Maintenance POC</h3>
                  <Field label="PIC / Chief Pilot Name" value={formData.picName} onChange={(v) => setFormData({ ...formData, picName: v })} />
                  <Field label="PIC Mobile Phone" value={formData.picPhone} onChange={(v) => setFormData({ ...formData, picPhone: v })} />
                  <Field label="PIC Email Address" value={formData.picEmail} onChange={(v) => setFormData({ ...formData, picEmail: v })} />
                  <Field label="CAMO / Maintenance POC" value={formData.maintenancePoc} onChange={(v) => setFormData({ ...formData, maintenancePoc: v })} />
                </div>

                <div className="space-y-4 rounded-lg border border-border bg-card p-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AMO (Part 145 Facility)</h3>
                  <Field label="AMO Facility Name" value={formData.amoName} onChange={(v) => setFormData({ ...formData, amoName: v })} />
                  <Field label="AMO Facility Location" value={formData.amoLocation} onChange={(v) => setFormData({ ...formData, amoLocation: v })} />
                  <Field label="AMO Standard Phone" value={formData.amoPhone} onChange={(v) => setFormData({ ...formData, amoPhone: v })} />
                  <Field label="AMO 24/7 Emergency Line" value={formData.amoEmergencyPhone} onChange={(v) => setFormData({ ...formData, amoEmergencyPhone: v })} />
                  <Field label="AMO Email" value={formData.amoEmail} onChange={(v) => setFormData({ ...formData, amoEmail: v })} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-md border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateMutation.mutate()}
                  disabled={updateMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-white hover:bg-accent/90 disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  {updateMutation.isPending ? "Saving changes..." : "Save File Updates"}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: AIRCRAFT INFORMATION */}
              {tab === "info" && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <InfoTile label="Manufacturer Serial (MSN)" value={aircraft.serialNumber || "—"} isMono />
                    <InfoTile label="Year of Manufacture" value={aircraft.yearOfManufacture || "—"} />
                    <InfoTile label="Home Base Airport" value={aircraft.baseAirport || "—"} isMono />
                    <InfoTile label="Airframe Total Time" value={aircraft.totalAirframeHours ? `${aircraft.totalAirframeHours} hrs` : "—"} />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-accent" />
                        Operator & Registry Identification
                      </h3>
                      <div className="divide-y divide-border text-sm">
                        <Row label="Registered Owner" value={aircraft.ownerOperatorName || owner?.name || "—"} />
                        <Row label="Operating Entity" value={owner?.company || aircraft.ownerOperatorName || "—"} />
                        <Row label="Airframe Category" value={aircraft.category} />
                        <Row label="Make & Model" value={aircraft.makeModel} />
                        <Row label="Operations Standard" value={aircraft.typeOfOperations || "Part 91 / 135"} />
                        <Row label="Registry Standard" value={aircraft.registryStandard || "Standard Airworthiness"} />
                        <Row label="Nationality" value={aircraft.nationality || "—"} />
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-accent" />
                        AOG Cover & Readiness
                      </h3>
                      <div className="divide-y divide-border text-sm">
                        <Row label="AOG Response Tier" value="24/7 Priority Hotline Active" />
                        <Row label="Verification Status" value={aircraft.verificationStatus} />
                        <Row label="Program Tier" value={aircraft.plan === "annual" ? "Annual Elite ($1,000/yr)" : "Monthly Standard ($100/mo)"} />
                        <Row label="Enrolled Since" value={new Date(aircraft.createdAt).toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" })} />
                        <Row label="Insurer / Underwriter" value={aircraft.insurerName || "—"} />
                        <Row label="Insurance Policy Ref" value={aircraft.insurerPolicyRef || "—"} />
                        <Row label="Maintenance Programme" value={aircraft.maintenanceProgramme || "CAMP / CMP Systems"} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: KEY CONTACTS */}
              {tab === "contacts" && (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Chief Pilot / PIC */}
                    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <User className="h-4 w-4 text-accent" />
                          Chief Pilot / Pilot in Command (PIC)
                        </h3>
                        <span className="rounded bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">Cockpit Contact</span>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div>
                          <div className="text-xs text-muted-foreground">Name</div>
                          <div className="font-semibold text-foreground text-base">{aircraft.picName || "No PIC recorded"}</div>
                        </div>
                        {aircraft.picPhone && (
                          <div className="flex items-center justify-between rounded-md border border-border bg-background p-3">
                            <div>
                              <div className="text-[11px] text-muted-foreground">Direct Mobile</div>
                              <div className="font-mono text-xs font-semibold text-foreground">{aircraft.picPhone}</div>
                            </div>
                            <a
                              href={`tel:${aircraft.picPhone}`}
                              className="inline-flex items-center gap-1 rounded bg-accent px-2.5 py-1 text-xs font-semibold text-white hover:bg-accent/90"
                            >
                              <Phone className="h-3 w-3" /> Call
                            </a>
                          </div>
                        )}
                        {aircraft.picEmail && (
                          <div className="flex items-center justify-between rounded-md border border-border bg-background p-3">
                            <div>
                              <div className="text-[11px] text-muted-foreground">Email</div>
                              <div className="text-xs font-medium text-foreground">{aircraft.picEmail}</div>
                            </div>
                            <a
                              href={`mailto:${aircraft.picEmail}`}
                              className="inline-flex items-center gap-1 rounded border border-border px-2.5 py-1 text-xs font-semibold hover:bg-muted"
                            >
                              <Mail className="h-3 w-3" /> Email
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AMO Facility */}
                    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-accent" />
                          Approved Maintenance Org (AMO / Part 145)
                        </h3>
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">Part 145 MRO</span>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div>
                          <div className="text-xs text-muted-foreground">MRO Facility Name</div>
                          <div className="font-semibold text-foreground text-base">{aircraft.amoName || "No AMO recorded"}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{aircraft.amoLocation || "Location unassigned"}</div>
                        </div>
                        {aircraft.amoEmergencyPhone && (
                          <div className="flex items-center justify-between rounded-md border border-rose-500/30 bg-rose-500/10 p-3">
                            <div>
                              <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">24/7 AOG Emergency Line</div>
                              <div className="font-mono text-xs font-bold text-rose-700">{aircraft.amoEmergencyPhone}</div>
                            </div>
                            <a
                              href={`tel:${aircraft.amoEmergencyPhone}`}
                              className="inline-flex items-center gap-1 rounded bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-rose-700"
                            >
                              <Phone className="h-3 w-3" /> Call AOG
                            </a>
                          </div>
                        )}
                        {aircraft.amoPhone && (
                          <div className="flex items-center justify-between rounded-md border border-border bg-background p-3">
                            <div>
                              <div className="text-[11px] text-muted-foreground">Standard Line</div>
                              <div className="font-mono text-xs text-foreground">{aircraft.amoPhone}</div>
                            </div>
                            <a
                              href={`tel:${aircraft.amoPhone}`}
                              className="rounded border border-border px-2 py-1 text-xs font-medium hover:bg-muted"
                            >
                              Call
                            </a>
                          </div>
                        )}
                        {aircraft.amoEmail && (
                          <div className="flex items-center justify-between rounded-md border border-border bg-background p-3">
                            <div>
                              <div className="text-[11px] text-muted-foreground">AMO Desk Email</div>
                              <div className="text-xs text-foreground">{aircraft.amoEmail}</div>
                            </div>
                            <a
                              href={`mailto:${aircraft.amoEmail}`}
                              className="rounded border border-border px-2 py-1 text-xs font-medium hover:bg-muted"
                            >
                              Email
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Flight Department & Owner */}
                    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-accent" />
                        Flight Department & Account Holder
                      </h3>
                      <div className="divide-y divide-border text-sm">
                        <Row label="Account Principal" value={owner?.name || "—"} />
                        <Row label="Company / Entity" value={owner?.company || "—"} />
                        <Row label="Email" value={owner?.email || "—"} />
                        <Row label="Primary Phone" value={owner?.phone || "—"} />
                        <Row label="CAMO / Maintenance POC" value={aircraft.maintenancePoc || "—"} />
                      </div>
                    </div>

                    {/* Insurance & Support Desk */}
                    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-accent" />
                        Underwriter & Direct Dispatch
                      </h3>
                      <div className="divide-y divide-border text-sm">
                        <Row label="Insurer / Underwriter" value={aircraft.insurerName || "—"} />
                        <Row label="Policy Reference" value={aircraft.insurerPolicyRef || "—"} />
                        <Row label="Desk Emergency Dispatch" value="ops@aircraftprogram.com" />
                        <Row label="AOG Priority Routing" value="Tier 1 Active (No Handling Fees)" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: POWERPLANT & APU */}
              {tab === "engines" && (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-accent" />
                          Engines Specification
                        </h3>
                        <span className="rounded bg-accent/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-accent">
                          {aircraft.numberOfEngines}x Powerplant
                        </span>
                      </div>
                      <div className="divide-y divide-border text-sm">
                        <Row label="Manufacturer" value={aircraft.engineManufacturer || "—"} />
                        <Row label="Engine Model / Series" value={aircraft.engineType || "—"} />
                        <Row
                          label="Engine Maintenance Program"
                          value={
                            aircraft.engineProgram ? (
                              <span className="font-semibold text-primary">{aircraft.engineProgram}</span>
                            ) : (
                              "None recorded"
                            )
                          }
                        />
                        <Row label="Engine Serial Numbers" value={aircraft.engineSerialNumbers || "—"} />
                        <Row label="Total Airframe Hours" value={aircraft.totalAirframeHours ? `${aircraft.totalAirframeHours} hrs` : "—"} />
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Layers className="h-4 w-4 text-accent" />
                        Auxiliary Power Unit (APU) & Propellers
                      </h3>
                      <div className="divide-y divide-border text-sm">
                        <Row label="APU Make & Model" value={aircraft.apuMakeModel || "Honeywell / Sundstrand Line"} />
                        {hasPropeller(aircraft.category) && (
                          <>
                            <Row label="Propeller Manufacturer" value={aircraft.propellerManufacturer || "—"} />
                            <Row label="Propeller Model" value={aircraft.propellerType || "—"} />
                            <Row label="Propeller Serials" value={aircraft.propellerSerialNumbers || "—"} />
                          </>
                        )}
                        <Row label="Maintenance Programme" value={aircraft.maintenanceProgramme || "Manufacturer Spec"} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PARTS & AOG HISTORY */}
              {tab === "history" && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Historical Maintenance & Sourcing Events</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Recorded AOG dispatch calls and parts procurement quotes for tail {aircraft.registration}.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to="/admin/parts-requests"
                        className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold shadow-sm hover:bg-muted"
                      >
                        Create Parts Request →
                      </Link>
                    </div>
                  </div>

                  {/* AOG Events */}
                  <div className="rounded-lg border border-border bg-card overflow-hidden">
                    <div className="bg-muted/40 px-5 py-3 border-b border-border flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        AOG Emergency Cases ({linkedAog.length})
                      </span>
                      <Link to="/admin/aog" className="text-xs text-muted-foreground hover:text-foreground">
                        View AOG queue →
                      </Link>
                    </div>
                    {linkedAog.length > 0 ? (
                      <div className="divide-y divide-border">
                        {linkedAog.map((r: any) => (
                          <div key={r.id} className="p-4 hover:bg-muted/30 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold">{r.id.slice(-8).toUpperCase()}</span>
                                <StatusPill tone={statusTone(r.status)}>{r.status}</StatusPill>
                                <span className="text-xs font-semibold text-foreground">{r.affectedSystem}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(r.createdAt).toLocaleDateString("en-GB")}
                              </span>
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground">
                              Part: <code className="font-bold text-foreground">{r.partNumber || "Unspecified"}</code> · Urgency: <span className="font-medium text-foreground">{r.urgency}</span> · Location: {r.location || aircraft.baseAirport}
                            </div>
                            {r.issueDescription && (
                              <div className="mt-1 text-xs text-muted-foreground italic">
                                "{r.issueDescription}"
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-sm text-muted-foreground">
                        No AOG cases recorded for this tail number.
                      </div>
                    )}
                  </div>

                  {/* Parts Requests */}
                  <div className="rounded-lg border border-border bg-card overflow-hidden">
                    <div className="bg-muted/40 px-5 py-3 border-b border-border flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Parts Procurement Requests ({linkedParts.length})
                      </span>
                      <Link to="/admin/parts-requests" className="text-xs text-muted-foreground hover:text-foreground">
                        View all parts →
                      </Link>
                    </div>
                    {linkedParts.length > 0 ? (
                      <div className="divide-y divide-border">
                        {linkedParts.map((pr: any) => (
                          <div key={pr.id} className="p-4 hover:bg-muted/30 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold">{pr.reference}</span>
                                <StatusPill tone={statusTone(pr.status)}>
                                  {pr.status}
                                </StatusPill>
                                <span className="font-mono text-xs font-bold text-foreground">{pr.partNumber}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(pr.createdAt).toLocaleDateString("en-GB")}
                              </span>
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {pr.partDescription || "No description provided"}
                            </div>
                            {pr.quotedPrice && (
                              <div className="mt-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-emerald-800 flex items-center justify-between">
                                <div>
                                  Quoted: <strong className="text-sm font-bold">{pr.quotedPrice}</strong> ({pr.quotedCondition || "SV"}) · Lead: {pr.quotedLeadTime || "Ready"} · {pr.quotedTraceDocs}
                                </div>
                                <span className="text-[10px] text-emerald-700">
                                  {pr.quotedAt ? new Date(pr.quotedAt).toLocaleDateString("en-GB") : ""}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-sm text-muted-foreground">
                        No parts procurement requests recorded for this tail number.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: INTELLIGENCE */}
              {tab === "intelligence" && (
                <div className="space-y-6">
                  {/* Strategic Value Banner */}
                  <div className="rounded-lg border border-accent/20 bg-accent/8 p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-accent">
                          Aircraft Program Intelligence Dossier · {intelligence.airframeFamily}
                        </h4>
                        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                          <em>"Aircraft Program knows the aircraft before it needs us."</em> Pre-vetted component pipeline, typical rotable wear cycles, and verified supplier depots aligned to this airframe family.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Frequently Required Components */}
                  <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4 text-accent" />
                      High-Frequency Components & Rotables
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {intelligence.frequentlyRequired.map((item, idx) => (
                        <div key={idx} className="rounded-md border border-border bg-background p-3.5 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold uppercase text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                              {item.ata}
                            </span>
                          </div>
                          <div className="font-semibold text-xs text-foreground mt-1">{item.component}</div>
                          <div className="text-[11px] text-muted-foreground">{item.notes}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Difficult to Source & Bottlenecks */}
                  <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Difficult-To-Source Components & Critical Lead Times
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {intelligence.difficultToSource.map((item, idx) => (
                        <div key={idx} className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3.5 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-foreground">{item.component}</span>
                            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                              {item.typicalLeadTime}
                            </span>
                          </div>
                          <div className="text-[11px] text-muted-foreground">{item.bottleneck}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Known Alternatives */}
                  <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Layers className="h-4 w-4 text-accent" />
                      Known Alternatives & Supersessions
                    </h3>
                    <div className="divide-y divide-border">
                      {intelligence.knownAlternatives.map((alt, idx) => (
                        <div key={idx} className="py-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-medium text-muted-foreground">Original: </span>
                            <strong className="text-foreground">{alt.primary}</strong>
                            <span className="mx-2 text-muted-foreground">→</span>
                            <span className="font-medium text-accent">Alternative: </span>
                            <strong className="text-foreground">{alt.alternative}</strong>
                          </div>
                          <div className="text-[11px] text-muted-foreground sm:text-right">{alt.notes}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Supplier Availability Network */}
                  <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-accent" />
                      Vetted Supplier & Overhaul Network Pools
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {intelligence.supplierAvailability.map((sup, idx) => (
                        <div key={idx} className="rounded-md border border-border bg-background p-3.5 space-y-2">
                          <div className="text-xs font-bold text-foreground">{sup.region}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {sup.facilities.join(" · ")}
                          </div>
                          <div className="text-[10px] font-semibold text-accent border-t border-border pt-1 mt-1">
                            {sup.rotablePools}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Desk Operational Directives */}
                  <div className="rounded-lg border border-border bg-card p-5 space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Ops Desk Directives for this Airframe
                    </h3>
                    <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
                      {intelligence.deskRecommendations.map((rec, idx) => (
                        <li key={idx} className="leading-relaxed">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Dossier Footer */}
        <div className="flex items-center justify-between border-t border-border bg-background px-6 py-4">
          <div className="text-xs text-muted-foreground">
            Registered Tail: <span className="font-mono font-semibold text-foreground">{aircraft.registration}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-md border border-border px-4 py-2 text-xs font-semibold hover:bg-muted"
            >
              Close File
            </button>
            <Link
              to="/admin/parts-requests"
              className="inline-flex items-center gap-1 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-white hover:bg-accent/90"
            >
              Quote Parts for this Aircraft <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── UI SUBCOMPONENTS ──────────────────────────────────────────────────────────

function InfoTile({ label, value, isMono }: { label: string; value: string; isMono?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className={`mt-1.5 text-base font-semibold ${isMono ? "font-mono" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground text-right">{value}</span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block space-y-1 text-xs">
      <span className="font-medium text-muted-foreground">{label}</span>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-normal text-foreground"
      />
    </label>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {detail && <div className="mt-1 truncate text-xs text-muted-foreground">{detail}</div>}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-5 py-3 text-left font-semibold">{children}</th>;
}

function Td({
  children,
  className = "",
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td colSpan={colSpan} className={`px-5 py-3 ${className}`}>
      {children}
    </td>
  );
}
