import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app/AppShell";
import {
  ensureSession,
  getAircraftData,
  updateAircraftProfile,
  getAircraftCaseHistory,
  updateAircraftDetails,
  getAircraftDocuments,
  addAircraftDocument,
  AircraftRecord,
  AogRecord,
} from "@/lib/app.functions";
import { uploadBrowserFile } from "@/lib/file-upload";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowRight, CheckCircle2, Clock3, FileUp, Plane } from "lucide-react";

export const Route = createFileRoute("/aircraft")({
  validateSearch: z.object({ id: z.string().optional() }),
  beforeLoad: async () => {
    try {
      await ensureSession();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: AircraftPage,
});

type Tab =
  | "overview"
  | "engine"
  | "contacts"
  | "documents"
  | "verification"
  | "history"
  | "edit"
  | "passport";

function AircraftPage() {
  const { id: searchId } = Route.useSearch();
  const { data: aircraft = [] } = useQuery({
    queryKey: ["aircraft"],
    queryFn: () => getAircraftData(),
  });
  const [selectedId, setSelectedId] = useState<string | null>(searchId ?? null);

  useEffect(() => {
    if (searchId) setSelectedId(searchId);
  }, [searchId]);

  const selected = aircraft.find((a) => a.id === selectedId) ?? aircraft[0] ?? null;

  return (
    <AppShell>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Aircraft</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage enrolled aircraft and complete your profile for full AOG cover.
          </p>
        </div>
        <Link
          to="/enrol"
          className="rounded-sm bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Enrol another aircraft
        </Link>
      </div>

      {!aircraft.length ? (
        <div className="mt-8 rounded-md border border-dashed border-border bg-card p-10 text-center shadow-sm">
          <Plane className="mx-auto h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
          <h2 className="mt-4 text-lg font-semibold tracking-tight">No aircraft enrolled yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Add the first aircraft, activate the Stripe subscription, then complete the cover
            profile so the AOG desk has the right details before downtime starts.
          </p>
          <Link
            to="/enrol"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Enrol aircraft
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Aircraft selector */}
          <div className="space-y-2">
            {aircraft.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedId(a.id)}
                className={`w-full rounded-md border p-4 text-left transition-colors ${
                  selected?.id === a.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-muted/40"
                }`}
              >
                <div className="font-mono text-base font-semibold tracking-wide">
                  {a.registration}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">{a.makeModel}</div>
                <div className="mt-2">
                  <CoverBadge status={a.verificationStatus} />
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          {selected && <AircraftDetail aircraft={selected} />}
        </div>
      )}
    </AppShell>
  );
}

function AircraftDetail({ aircraft }: { aircraft: AircraftRecord }) {
  const [tab, setTab] = useState<Tab>("overview");

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "engine", label: "Engine & Maintenance" },
    { id: "contacts", label: "Contacts" },
    { id: "documents", label: "Documents" },
    { id: "verification", label: "Verification" },
    { id: "history", label: "Parts history" },
    { id: "edit", label: "Quick edit" },
    { id: "passport", label: "Parts Passport" },
  ];

  return (
    <div className="rounded-md border border-border bg-card">
      <div className="border-b border-border px-6 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-mono text-2xl font-semibold tracking-wider">
              {aircraft.registration}
            </div>
            <div className="mt-0.5 text-sm text-muted-foreground">
              {aircraft.makeModel} · {aircraft.baseAirport || "No base recorded"}
            </div>
          </div>
          <CoverBadge status={aircraft.verificationStatus} />
        </div>
        <div className="mt-4 flex gap-1 overflow-x-auto pb-px">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-t-sm px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                tab === t.id
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {tab === "overview" && <OverviewTab aircraft={aircraft} />}
        {tab === "engine" && <EngineTab aircraft={aircraft} />}
        {tab === "contacts" && <ContactsTab aircraft={aircraft} />}
        {tab === "documents" && <DocumentsTab aircraft={aircraft} />}
        {tab === "verification" && <VerificationTab aircraft={aircraft} />}
        {tab === "history" && <PartsHistoryTab aircraftId={aircraft.id} />}
        {tab === "edit" && <QuickEditTab aircraft={aircraft} />}
        {tab === "passport" && <PartsPassportTab aircraft={aircraft} />}
      </div>
    </div>
  );
}

function OverviewTab({ aircraft }: { aircraft: AircraftRecord }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Section title="Identity">
        <KV k="Registration" v={aircraft.registration} />
        <KV k="Category" v={aircraft.category} />
        <KV k="Make / Model" v={aircraft.makeModel} />
        <KV k="Serial Number" v={aircraft.serialNumber || "—"} />
        <KV k="Year of Manufacture" v={aircraft.yearOfManufacture || "—"} />
        <KV k="Type of Operations" v={aircraft.typeOfOperations || "—"} />
      </Section>
      <Section title="Subscription">
        <KV k="Plan" v={aircraft.plan === "monthly" ? "Monthly ($100/mo)" : "Annual ($1,000/yr)"} />
        <KV k="Subscription" v={aircraft.subscriptionStatus} />
        <KV
          k="AOG Cover"
          v={aircraft.verificationStatus === "Verified" ? "Active" : "Pending verification"}
        />
        <KV k="Base Airport" v={aircraft.baseAirport || "—"} />
        <KV k="Owner / Operator" v={aircraft.ownerOperatorName || "—"} />
        <KV k="Nationality" v={aircraft.nationality || "—"} />
      </Section>
    </div>
  );
}

function EngineTab({ aircraft }: { aircraft: AircraftRecord }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    engineManufacturer: aircraft.engineManufacturer,
    engineType: aircraft.engineType,
    engineSeries: aircraft.engineSeries,
    engineSerialNumbers: aircraft.engineSerialNumbers,
    numberOfEngines: aircraft.numberOfEngines,
    maintenanceProgramme: aircraft.maintenanceProgramme,
    nationality: aircraft.nationality,
    registryStandard: aircraft.registryStandard,
    totalAirframeHours: aircraft.totalAirframeHours,
  });

  const mutation = useMutation({
    mutationFn: () =>
      updateAircraftProfile({
        data: {
          id: aircraft.id,
          ...form,
          amoName: aircraft.amoName,
          amoPhone: aircraft.amoPhone,
          amoEmergencyPhone: aircraft.amoEmergencyPhone,
          picPhone: aircraft.picPhone,
          maintenancePoc: aircraft.maintenancePoc,
          insurerName: aircraft.insurerName,
          insurerPolicyRef: aircraft.insurerPolicyRef,
        },
      }),
    onSuccess: () => {
      toast.success("Engine details saved.");
      qc.invalidateQueries({ queryKey: ["aircraft"] });
    },
    onError: () => toast.error("Failed to save."),
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Engine manufacturer">
          <input
            className={inputCls}
            value={form.engineManufacturer}
            onChange={(e) => setForm((f) => ({ ...f, engineManufacturer: e.target.value }))}
          />
        </Field>
        <Field label="Engine type">
          <input
            className={inputCls}
            value={form.engineType}
            onChange={(e) => setForm((f) => ({ ...f, engineType: e.target.value }))}
          />
        </Field>
        <Field label="Engine series">
          <input
            className={inputCls}
            value={form.engineSeries}
            onChange={(e) => setForm((f) => ({ ...f, engineSeries: e.target.value }))}
          />
        </Field>
        <Field label="Engine serial numbers">
          <input
            className={inputCls}
            value={form.engineSerialNumbers}
            placeholder="e.g. P-76101, P-76102"
            onChange={(e) => setForm((f) => ({ ...f, engineSerialNumbers: e.target.value }))}
          />
        </Field>
        <Field label="Number of engines">
          <input
            className={inputCls}
            type="number"
            min={1}
            max={4}
            value={form.numberOfEngines}
            onChange={(e) => setForm((f) => ({ ...f, numberOfEngines: Number(e.target.value) }))}
          />
        </Field>
        <Field label="Total airframe hours">
          <input
            className={inputCls}
            value={form.totalAirframeHours}
            placeholder="e.g. 8420"
            onChange={(e) => setForm((f) => ({ ...f, totalAirframeHours: e.target.value }))}
          />
        </Field>
        <Field label="Maintenance programme">
          <input
            className={inputCls}
            value={form.maintenanceProgramme}
            onChange={(e) => setForm((f) => ({ ...f, maintenanceProgramme: e.target.value }))}
          />
        </Field>
        <Field label="Nationality">
          <input
            className={inputCls}
            value={form.nationality}
            placeholder="e.g. British"
            onChange={(e) => setForm((f) => ({ ...f, nationality: e.target.value }))}
          />
        </Field>
        <Field label="Registry standard">
          <input
            className={inputCls}
            value={form.registryStandard}
            placeholder="e.g. EASA, FAA, TCCA"
            onChange={(e) => setForm((f) => ({ ...f, registryStandard: e.target.value }))}
          />
        </Field>
      </div>
      <SaveButton loading={mutation.isPending} onClick={() => mutation.mutate()} />
    </div>
  );
}

function ContactsTab({ aircraft }: { aircraft: AircraftRecord }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    amoName: aircraft.amoName,
    amoPhone: aircraft.amoPhone,
    amoEmergencyPhone: aircraft.amoEmergencyPhone,
    picPhone: aircraft.picPhone,
    maintenancePoc: aircraft.maintenancePoc,
    insurerName: aircraft.insurerName,
    insurerPolicyRef: aircraft.insurerPolicyRef,
  });

  const mutation = useMutation({
    mutationFn: () =>
      updateAircraftProfile({
        data: {
          id: aircraft.id,
          engineManufacturer: aircraft.engineManufacturer,
          engineType: aircraft.engineType,
          engineSeries: aircraft.engineSeries,
          engineSerialNumbers: aircraft.engineSerialNumbers,
          numberOfEngines: aircraft.numberOfEngines,
          maintenanceProgramme: aircraft.maintenanceProgramme,
          nationality: aircraft.nationality,
          registryStandard: aircraft.registryStandard,
          totalAirframeHours: aircraft.totalAirframeHours,
          ...form,
        },
      }),
    onSuccess: () => {
      toast.success("Contact details saved.");
      qc.invalidateQueries({ queryKey: ["aircraft"] });
    },
    onError: () => toast.error("Failed to save."),
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="AMO name">
          <input
            className={inputCls}
            value={form.amoName}
            onChange={(e) => setForm((f) => ({ ...f, amoName: e.target.value }))}
          />
        </Field>
        <Field label="AMO direct phone">
          <input
            className={inputCls}
            value={form.amoPhone}
            onChange={(e) => setForm((f) => ({ ...f, amoPhone: e.target.value }))}
          />
        </Field>
        <Field label="AMO out-of-hours emergency">
          <input
            className={inputCls}
            value={form.amoEmergencyPhone}
            onChange={(e) => setForm((f) => ({ ...f, amoEmergencyPhone: e.target.value }))}
          />
        </Field>
        <Field label="Pilot in Command (direct mobile)">
          <input
            className={inputCls}
            value={form.picPhone}
            onChange={(e) => setForm((f) => ({ ...f, picPhone: e.target.value }))}
          />
        </Field>
        <Field label="Maintenance point of contact">
          <input
            className={inputCls}
            value={form.maintenancePoc}
            placeholder="Name and role"
            onChange={(e) => setForm((f) => ({ ...f, maintenancePoc: e.target.value }))}
          />
        </Field>
        <Field label="Insurer name">
          <input
            className={inputCls}
            value={form.insurerName}
            onChange={(e) => setForm((f) => ({ ...f, insurerName: e.target.value }))}
          />
        </Field>
        <Field label="Policy reference">
          <input
            className={inputCls}
            value={form.insurerPolicyRef}
            onChange={(e) => setForm((f) => ({ ...f, insurerPolicyRef: e.target.value }))}
          />
        </Field>
      </div>
      <SaveButton loading={mutation.isPending} onClick={() => mutation.mutate()} />
    </div>
  );
}

function DocumentsTab({ aircraft }: { aircraft: AircraftRecord }) {
  const qc = useQueryClient();
  const docTypes = [
    { name: "Certificate of Registration", hint: "Confirms registration and ownership" },
    { name: "Insurance Certificate", hint: "Confirms insurer and policy reference" },
    { name: "Airworthiness Certificate", hint: "Can be uploaded after enrolment" },
    { name: "Release to Service Documentation", hint: "Optional — helps desk triage faster" },
    { name: "AMO Authorisation Letter", hint: "Optional — recommended for faster AOG handling" },
  ];

  const { data: documents = [] } = useQuery({
    queryKey: ["aircraft-documents", aircraft.id],
    queryFn: () => getAircraftDocuments({ data: { aircraftId: aircraft.id } }),
  });

  const upload = useMutation({
    mutationFn: async (input: { documentType: string; file: File }) => {
      const { storageKey, fileName } = await uploadBrowserFile(input.file);
      return addAircraftDocument({
        data: { aircraftId: aircraft.id, documentType: input.documentType, fileName, storageKey },
      });
    },
    onSuccess: (_, vars) => {
      toast.success(`${vars.documentType} uploaded.`);
      qc.invalidateQueries({ queryKey: ["aircraft-documents", aircraft.id] });
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Upload failed. Please try again."),
  });

  function handleFile(documentType: string, file: File | undefined) {
    if (!file) return;
    upload.mutate({ documentType, file });
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Documents are scoped to <span className="font-semibold">{aircraft.registration}</span> only.
        Only you and the PlaneServe desk can see your aircraft's documents.
      </p>
      {docTypes.map((doc) => {
        const uploaded = documents.filter((d) => d.documentType === doc.name);
        return (
          <div key={doc.name} className="rounded-sm border border-border bg-background px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium">{doc.name}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{doc.hint}</div>
              </div>
              <label
                className={`cursor-pointer rounded-sm border border-border bg-muted px-3 py-1.5 text-xs font-medium hover:bg-muted/80 ${
                  upload.isPending ? "pointer-events-none opacity-50" : ""
                }`}
              >
                {uploaded.length > 0 ? "Replace" : "Upload"}
                <input
                  type="file"
                  className="sr-only"
                  onChange={(e) => {
                    handleFile(doc.name, e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            {uploaded.length > 0 && (
              <ul className="mt-2 space-y-1 border-t border-border pt-2">
                {uploaded.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-center justify-between gap-3 text-xs text-muted-foreground"
                  >
                    {d.storageKey ? (
                      <a
                        href={`/api/files/${d.storageKey}`}
                        target="_blank"
                        rel="noreferrer"
                        className="truncate font-mono text-primary hover:underline"
                      >
                        {d.fileName}
                      </a>
                    ) : (
                      <span className="truncate font-mono">{d.fileName}</span>
                    )}
                    <span className="shrink-0">
                      {new Date(d.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

function VerificationTab({ aircraft }: { aircraft: AircraftRecord }) {
  const tier2Fields = [
    { label: "Engine manufacturer", value: aircraft.engineManufacturer },
    { label: "Engine type", value: aircraft.engineType },
    { label: "Engine serial numbers", value: aircraft.engineSerialNumbers },
    { label: "Maintenance programme", value: aircraft.maintenanceProgramme },
    { label: "Registry standard", value: aircraft.registryStandard },
    { label: "AMO name", value: aircraft.amoName },
    { label: "AMO phone", value: aircraft.amoPhone },
    { label: "AMO out-of-hours", value: aircraft.amoEmergencyPhone },
    { label: "Pilot in Command mobile", value: aircraft.picPhone },
    { label: "Insurer name", value: aircraft.insurerName },
    { label: "Policy reference", value: aircraft.insurerPolicyRef },
    { label: "Total airframe hours", value: aircraft.totalAirframeHours },
  ];

  const complete = tier2Fields.filter((f) => f.value).length;
  const total = tier2Fields.length;
  const percent = Math.round((complete / total) * 100);
  const isVerified = aircraft.verificationStatus === "Verified";

  return (
    <div className="space-y-6">
      <div
        className={`rounded-md border p-4 ${
          isVerified ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white ${
              isVerified ? "text-green-700" : "text-amber-700"
            }`}
          >
            {isVerified ? <CheckCircle2 className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
          </div>
          <div
            className={`text-sm font-semibold ${isVerified ? "text-green-800" : "text-amber-800"}`}
          >
            {isVerified ? "AOG Cover Active" : "Cover Activation Pending"}
            <p className="mt-1 text-xs font-normal leading-5 text-muted-foreground">
              {isVerified
                ? "PlaneServe has verified this aircraft and the AOG desk can support it formally."
                : "Your subscription is active. Formal AOG cover starts once PlaneServe verifies the aircraft details below."}
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Cover profile completeness
          </div>
          <div className="text-xs font-semibold">
            {complete}/{total} fields complete · {percent}%
          </div>
        </div>
        <div className="h-2 w-full rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-accent transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {tier2Fields.map((f) => (
          <div
            key={f.label}
            className="flex items-center justify-between rounded-sm border border-border px-4 py-2.5 text-sm"
          >
            <span className="text-muted-foreground">{f.label}</span>
            <span className={f.value ? "font-medium" : "text-xs italic text-muted-foreground"}>
              {f.value || "Not recorded"}
            </span>
          </div>
        ))}
      </div>

      {!isVerified && (
        <div className="rounded-md border border-border bg-muted/20 p-4">
          <div className="flex items-start gap-3">
            <FileUp className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-semibold">Documents can be added after signup</div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Certificate of Registration and insurance are helpful for verification.
                Airworthiness, release-to-service, and AMO authorisation documents can be uploaded
                whenever they are available.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-sm border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium text-foreground/80">{label}</div>
      {children}
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-right">{v || "—"}</span>
    </div>
  );
}

function SaveButton({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="rounded-sm bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
    >
      {loading ? "Saving..." : "Save changes"}
    </button>
  );
}

function PartsHistoryTab({ aircraftId }: { aircraftId: string }) {
  const { data: cases, isLoading } = useQuery({
    queryKey: ["aircraft-case-history", aircraftId],
    queryFn: () => getAircraftCaseHistory({ data: { aircraftId } }),
  });

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading…</div>;
  }

  if (!cases || cases.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No resolved AOG cases yet for this aircraft.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground mb-4">
        {cases.length} resolved case{cases.length !== 1 ? "s" : ""} on record
      </div>
      {cases.map((c) => (
        <div key={c.id} className="rounded-sm border border-border bg-background p-4 text-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] text-muted-foreground">{c.id}</div>
              <div className="mt-1 font-semibold">{c.affectedSystem}</div>
              {c.partNumber && (
                <div className="mt-0.5 font-mono text-xs text-muted-foreground">
                  PN {c.partNumber}
                </div>
              )}
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <div>
                {new Date(c.updatedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div className="mt-1">{c.urgency}</div>
            </div>
          </div>
          {c.issueDescription && (
            <p className="mt-2 text-xs leading-5 text-muted-foreground line-clamp-2">
              {c.issueDescription}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function QuickEditTab({ aircraft }: { aircraft: AircraftRecord }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    baseAirport: aircraft.baseAirport,
    amoName: aircraft.amoName,
    amoContact: aircraft.amoPhone,
    totalAirframeHours: aircraft.totalAirframeHours,
    maintenanceProgramme: aircraft.maintenanceProgramme,
  });

  const mutation = useMutation({
    mutationFn: () => updateAircraftDetails({ data: { id: aircraft.id, ...form } }),
    onSuccess: () => {
      toast.success("Aircraft details updated.");
      qc.invalidateQueries({ queryKey: ["aircraft"] });
    },
    onError: () => toast.error("Failed to save."),
  });

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Quick-edit key operational fields. For full profile changes use the Engine & Maintenance or
        Contacts tabs.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Base airport ICAO">
          <input
            className={inputCls}
            value={form.baseAirport}
            onChange={(e) => setForm((f) => ({ ...f, baseAirport: e.target.value.toUpperCase() }))}
            placeholder="EGLL"
          />
        </Field>
        <Field label="Total airframe hours">
          <input
            className={inputCls}
            value={form.totalAirframeHours}
            onChange={(e) => setForm((f) => ({ ...f, totalAirframeHours: e.target.value }))}
            placeholder="4820"
          />
        </Field>
        <Field label="AMO name">
          <input
            className={inputCls}
            value={form.amoName}
            onChange={(e) => setForm((f) => ({ ...f, amoName: e.target.value }))}
          />
        </Field>
        <Field label="AMO contact">
          <input
            className={inputCls}
            value={form.amoContact}
            onChange={(e) => setForm((f) => ({ ...f, amoContact: e.target.value }))}
            placeholder="Phone or email"
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Maintenance programme">
            <input
              className={inputCls}
              value={form.maintenanceProgramme}
              onChange={(e) => setForm((f) => ({ ...f, maintenanceProgramme: e.target.value }))}
              placeholder="CAMP, Cescom, etc."
            />
          </Field>
        </div>
      </div>
      <SaveButton loading={mutation.isPending} onClick={() => mutation.mutate()} />
    </div>
  );
}

function PartsPassportTab({ aircraft }: { aircraft: AircraftRecord }) {
  const { data: cases, isLoading } = useQuery({
    queryKey: ["aircraft-resolved", aircraft.id],
    queryFn: () => getAircraftCaseHistory({ data: { aircraftId: aircraft.id } }),
  });

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading…</div>;

  function handleExport() {
    if (!cases || cases.length === 0) return;
    const esc = (s: string) =>
      String(s ?? "").replace(
        /[&<>"]/g,
        (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch] ?? ch,
      );
    const generated = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const rows = cases
      .map((c) => {
        const date = new Date(c.updatedAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        return `<tr><td>${esc(date)}</td><td>${esc(c.affectedSystem)}</td><td class="mono">${esc(
          c.partNumber || "—",
        )}</td></tr>`;
      })
      .join("");
    const html = `<!doctype html><html><head><meta charset="utf-8" />
      <title>Parts Passport — ${esc(aircraft.registration)}</title>
      <style>
        body{font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1a1f2b;margin:40px;}
        h1{font-size:20px;margin:0 0 4px;}
        .sub{color:#666;font-size:12px;margin:0 0 24px;}
        table{width:100%;border-collapse:collapse;font-size:13px;}
        th{text-align:left;text-transform:uppercase;font-size:10px;letter-spacing:.05em;color:#666;border-bottom:2px solid #ddd;padding:8px 10px;}
        td{padding:8px 10px;border-bottom:1px solid #eee;}
        .mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;}
        .foot{margin-top:32px;color:#999;font-size:10px;}
      </style></head><body>
      <h1>Parts Passport — ${esc(aircraft.registration)}</h1>
      <p class="sub">${esc(aircraft.makeModel)} · ${cases.length} resolved AOG case${
        cases.length === 1 ? "" : "s"
      } sourced through PlaneServe · Generated ${esc(generated)}</p>
      <table><thead><tr><th>Date</th><th>Affected system</th><th>Part number</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <p class="foot">PlaneServe AOG Support · This document lists AOG cases resolved through PlaneServe for the above aircraft.</p>
      <script>window.onload=function(){window.print();}</script>
      </body></html>`;
    const w = window.open("", "_blank");
    if (!w) {
      toast.error("Please allow pop-ups to export the Parts Passport.");
      return;
    }
    w.document.write(html);
    w.document.close();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Parts Passport — {aircraft.registration}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            All resolved AOG cases sourced through PlaneServe
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={!cases || cases.length === 0}
          className="px-3 py-1.5 rounded-sm border border-border text-xs font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Download PDF
        </button>
      </div>

      {!cases || cases.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-sm">
          No resolved cases yet. Parts Passport will populate as AOG cases are resolved.
        </div>
      ) : (
        <div className="border border-border rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Affected system
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Part number
                </th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(c.updatedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 font-medium">{c.affectedSystem}</td>
                  <td className="px-4 py-3 font-mono text-xs">{c.partNumber || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CoverBadge({ status }: { status: string }) {
  if (status === "Declined") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-sm bg-destructive/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-destructive">
        <Clock3 className="h-3 w-3" />
        Cover declined
      </span>
    );
  }
  const isVerified = status === "Verified";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[10px] font-semibold uppercase tracking-widest ${
        isVerified
          ? "bg-[oklch(0.94_0.06_150)] text-[oklch(0.3_0.1_150)]"
          : "bg-[oklch(0.94_0.06_80)] text-[oklch(0.3_0.1_60)]"
      }`}
    >
      {isVerified ? <CheckCircle2 className="h-3 w-3" /> : <Clock3 className="h-3 w-3" />}
      {isVerified ? "Cover active" : "Cover pending"}
    </span>
  );
}
