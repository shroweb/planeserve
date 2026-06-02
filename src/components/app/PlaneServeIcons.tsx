/**
 * PlaneServe custom icon set — 55 aviation-specific icons.
 * All icons are 24×24, stroke-width 1.5, currentColor.
 * Usage: <PsIcon name="aircraft" className="h-5 w-5 text-accent" />
 * Or import named: import { AircraftIcon } from "@/components/app/PlaneServeIcons"
 */

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(props: IconProps, children: React.ReactNode) {
  const { size = 24, className = "", ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}

export function AircraftIcon(p: IconProps) {
  return base(p, <path d="M12 2.4c.6 0 1 .7 1 1.9V9l8.5 4.7v1.7L13 12.8v5.3l2.6 1.9v1.4L12 20.6l-3.6.7v-1.4L11 18.1v-5.3L2.5 15.4v-1.7L11 9V4.3c0-1.2.4-1.9 1-1.9Z" />);
}

export function AogIcon(p: IconProps) {
  return base(p, <>
    <path d="M10.3 4.3 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9.5v4" /><path d="M12 17h.01" />
  </>);
}

export function ArrowRightIcon(p: IconProps) {
  return base(p, <>
    <path d="M4 12h15" /><path d="m12 5 7 7-7 7" />
  </>);
}

export function AttachmentIcon(p: IconProps) {
  return base(p, <path d="M20 11.5 11.6 19.9a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8" />);
}

export function BellIcon(p: IconProps) {
  return base(p, <>
    <path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5H3.5S6 15 6 9Z" />
    <path d="M10.3 20a2 2 0 0 0 3.4 0" />
  </>);
}

export function BillingIcon(p: IconProps) {
  return base(p, <>
    <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
    <path d="M3 9.5h18" /><path d="M6.5 14.5h4" />
  </>);
}

export function BroadcastIcon(p: IconProps) {
  return base(p, <>
    <circle cx="12" cy="9" r="1.8" />
    <path d="M9.2 6.2a4 4 0 0 0 0 5.6M14.8 6.2a4 4 0 0 1 0 5.6" />
    <path d="M6.7 3.7a8 8 0 0 0 0 10.6M17.3 3.7a8 8 0 0 1 0 10.6" />
    <path d="M10.5 10.6 8 21M13.5 10.6 16 21" />
    <path d="M9.2 17h5.6" />
  </>);
}

export function CalendarIcon(p: IconProps) {
  return base(p, <>
    <rect x="3.5" y="5" width="17" height="16" rx="1.5" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </>);
}

export function CheckIcon(p: IconProps) {
  return base(p, <path d="M5 12.5 10 17.5 19.5 6.5" />);
}

export function ChevronDownIcon(p: IconProps) {
  return base(p, <path d="m5 9 7 7 7-7" />);
}

export function ChevronRightIcon(p: IconProps) {
  return base(p, <path d="m9 5 7 7-7 7" />);
}

export function ClearedIcon(p: IconProps) {
  return base(p, <>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.3 12.2l2.6 2.6 4.8-5.4" />
  </>);
}

export function CloseIcon(p: IconProps) {
  return base(p, <path d="M6 6l12 12M18 6 6 18" />);
}

export function CoverIcon(p: IconProps) {
  return base(p, <>
    <path d="M12 3 5 5.5V11c0 5 3 8 7 9.5 4-1.5 7-4.5 7-9.5V5.5L12 3Z" />
    <path d="m9.3 11.8 1.9 1.9L15 9.8" />
  </>);
}

export function DashboardIcon(p: IconProps) {
  return base(p, <>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="3" y="15" width="7" height="6" rx="1" />
    <rect x="14" y="3" width="7" height="6" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
  </>);
}

export function DispatchIcon(p: IconProps) {
  return base(p, <>
    <path d="M2.5 6.5h9.5v8.5H2.5z" />
    <path d="M12 9.2h3.6l2.9 2.9V15H12z" />
    <circle cx="6.2" cy="17.5" r="1.7" />
    <circle cx="15.8" cy="17.5" r="1.7" />
    <path d="M4 15.2h.4M13.6 15.2h.4" />
  </>);
}

export function DocumentIcon(p: IconProps) {
  return base(p, <>
    <path d="M6 3h7.5L18 7.5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M13.5 3v4H18" />
  </>);
}

export function DownloadIcon(p: IconProps) {
  return base(p, <>
    <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    <path d="M12 4v11.5" />
    <path d="m7.5 11 4.5 4.5 4.5-4.5" />
  </>);
}

export function FilterIcon(p: IconProps) {
  return base(p, <path d="M4 5h16l-6 7v6l-4-2v-4Z" />);
}

export function FleetIcon(p: IconProps) {
  return base(p, <>
    <path d="M8 4 11.5 9.8 8.7 9.2 8.7 12.5 9.8 13.4 8 12.9 6.2 13.4 7.3 12.5 7.3 9.2 4.5 9.8Z" />
    <path d="M16 10 19.5 15.8 16.7 15.2 16.7 18.5 17.8 19.4 16 18.9 14.2 19.4 15.3 18.5 15.3 15.2 12.5 15.8Z" />
  </>);
}

export function GaugeIcon(p: IconProps) {
  return base(p, <>
    <path d="M3.5 18.5a9 9 0 1 1 17 0" />
    <path d="M12 13.8l4.2-3.6" />
    <circle cx="12" cy="14.5" r="1.4" />
    <path d="M5.5 14.2h1M17.5 14.2h1M12 7.5v1" />
  </>);
}

export function GlobeIcon(p: IconProps) {
  return base(p, <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a13 13 0 0 1 0 18 13 13 0 0 1 0-18Z" />
  </>);
}

export function GroundedIcon(p: IconProps) {
  return base(p, <>
    <path d="M12 2.4c.6 0 1 .7 1 1.9V9l8.5 4.7v1.7L13 12.8v5.3l2.6 1.9v1.4L12 20.6l-3.6.7v-1.4L11 18.1v-5.3L2.5 15.4v-1.7L11 9V4.3c0-1.2.4-1.9 1-1.9Z" />
    <path d="M3.5 3.5 20.5 20.5" />
  </>);
}

export function HangarIcon(p: IconProps) {
  return base(p, <>
    <path d="M3 21V11c0-.5.3-1 .8-1.3l7.4-3.9c.5-.3 1.1-.3 1.6 0l7.4 3.9c.5.3.8.8.8 1.3v10" />
    <path d="M3 21h18" />
    <path d="M8 21v-5.5a4 4 0 0 1 8 0V21" />
  </>);
}

export function InventoryIcon(p: IconProps) {
  return base(p, <>
    <ellipse cx="12" cy="6" rx="7" ry="2.6" />
    <path d="M5 6v12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6" />
    <path d="M5 12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6" />
  </>);
}

export function InvoiceIcon(p: IconProps) {
  return base(p, <>
    <path d="M6 3h12v17.5l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2-2 1.2Z" />
    <path d="M9 8h6M9 11.5h6" />
  </>);
}

export function LiveIcon(p: IconProps) {
  return base(p, <>
    <circle cx="12" cy="12" r="2.2" />
    <path d="M7.9 7.9a6 6 0 0 0 0 8.2M16.1 16.1a6 6 0 0 0 0-8.2" />
    <path d="M5 5a9.5 9.5 0 0 0 0 14M19 19a9.5 9.5 0 0 0 0-14" />
  </>);
}

export function LogoutIcon(p: IconProps) {
  return base(p, <>
    <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
    <path d="m15 16 5-4-5-4" /><path d="M20 12H9" />
  </>);
}

export function MemberIcon(p: IconProps) {
  return base(p, <>
    <circle cx="12" cy="8" r="4" />
    <path d="M5 20.5a7 7 0 0 1 14 0" />
  </>);
}

export function MessageIcon(p: IconProps) {
  return base(p, <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4V5Z" />);
}

export function MoreIcon(p: IconProps) {
  const { size = 24, className = "", ...rest } = p;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} className={className} {...rest}>
      <circle cx="5" cy="12" r="1.4" fill="currentColor" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      <circle cx="19" cy="12" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function NetworkIcon(p: IconProps) {
  return base(p, <>
    <rect x="9.5" y="3" width="5" height="5" rx="1" />
    <rect x="3" y="16" width="5" height="5" rx="1" />
    <rect x="16" y="16" width="5" height="5" rx="1" />
    <path d="M12 8v3M5.5 16v-2a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2" />
  </>);
}

export function PartIcon(p: IconProps) {
  return base(p, <>
    <path d="M20.5 7.8v8.4a1.5 1.5 0 0 1-.76 1.3l-7 3.9a1.5 1.5 0 0 1-1.48 0l-7-3.9A1.5 1.5 0 0 1 3.5 16.2V7.8a1.5 1.5 0 0 1 .76-1.3l7-3.9a1.5 1.5 0 0 1 1.48 0l7 3.9a1.5 1.5 0 0 1 .76 1.3Z" />
    <path d="m3.8 7 8.2 4.6L20.2 7M12 21.2v-9.6" />
  </>);
}

export function PhoneIcon(p: IconProps) {
  return base(p, <path d="M6.5 3.5 9 4l1 4-1.8 1.4a13 13 0 0 0 5.4 5.4L16 13l4 1 .5 2.5a1.8 1.8 0 0 1-1.9 2.2A14.5 14.5 0 0 1 4.3 5.4 1.8 1.8 0 0 1 6.5 3.5Z" />);
}

export function PlusIcon(p: IconProps) {
  return base(p, <path d="M12 5v14M5 12h14" />);
}

export function PriorityIcon(p: IconProps) {
  return base(p, <>
    <path d="M5.5 21V3.5" />
    <path d="M5.5 4.5h11l-2.3 3.6L16.5 12H5.5" />
  </>);
}

export function ProgressIcon(p: IconProps) {
  return base(p, <>
    <path d="M12 3a9 9 0 1 0 9 9" />
    <path d="M12 7.5v4.5l3 2" />
  </>);
}

export function QuoteIcon(p: IconProps) {
  return base(p, <>
    <path d="M6 3h7.5L18 7.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    <path d="M13.5 3v4H18M11 9.5v7" />
    <path d="M13 10.8c0-.9-1-1.3-2-1.3s-2 .5-2 1.4.9 1.1 2 1.3 2 .5 2 1.4-1 1.4-2 1.4-2-.5-2-1.4" />
  </>);
}

export function RevenueIcon(p: IconProps) {
  return base(p, <>
    <path d="M3 3v18h18" />
    <path d="m6.5 14 3.5-3.5 3 3L21 7M21 11V7h-4" />
  </>);
}

export function RouteIcon(p: IconProps) {
  return base(p, <>
    <circle cx="5.5" cy="6" r="2.3" />
    <path d="M5.5 8.3v3.2a4 4 0 0 0 4 4h4.3" />
    <path d="m12.8 12.3 4 3.2-4 3.2" />
  </>);
}

export function RunwayIcon(p: IconProps) {
  return base(p, <>
    <path d="M9 3 5 21M15 3l4 18" />
    <path d="M12 5.5v2.5M12 11v2.5M12 16.5v2.5" />
  </>);
}

export function SearchIcon(p: IconProps) {
  return base(p, <>
    <circle cx="11" cy="11" r="7" />
    <path d="m16 16 4.5 4.5" />
  </>);
}

export function SettingsIcon(p: IconProps) {
  return base(p, <>
    <path d="M5 21v-7M5 10V3M12 21v-9M12 8V3M19 21v-5M19 12V3" />
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="6" r="2" />
    <circle cx="19" cy="14" r="2" />
  </>);
}

export function SlaIcon(p: IconProps) {
  return base(p, <>
    <circle cx="12" cy="13.5" r="7.5" />
    <path d="M12 9.5v4l2.6 1.6M9.5 2.5h5" />
    <path d="m19 6 1.4-1.4" />
  </>);
}

export function SupplierIcon(p: IconProps) {
  return base(p, <>
    <path d="M3 20.5V9.5l9-5 9 5v11M3 20.5h18" />
    <path d="M8.5 20.5v-5h7v5M8.5 11.5h7" />
  </>);
}

export function TailIcon(p: IconProps) {
  return base(p, <>
    <path d="M7 20.5l4.2-15.8c.2-.9 1.4-.9 1.6 0L17 20.5" />
    <path d="M8.7 14.5h6.6M4.5 20.5h15" />
  </>);
}

export function TakeoffIcon(p: IconProps) {
  return base(p, <>
    <path d="M3 20.5h3M9 20.5h3M15 20.5h6" />
    <path d="M4.9 14.3 9.8 12.5 8 8a1 1 0 0 1 1.5-1.2l4.4 3.9 4.3-1.6a1.6 1.6 0 0 1 1.3 2.9l-12 6.2a1 1 0 0 1-1.3-.4l-1-1.7a1 1 0 0 1 .4-1.3Z" />
  </>);
}

export function TeamIcon(p: IconProps) {
  return base(p, <>
    <circle cx="9" cy="8.5" r="3.5" />
    <path d="M3 19.5a6 6 0 0 1 12 0" />
    <path d="M16 6.2a3.5 3.5 0 0 1 0 6.6M16.8 13.6a6 6 0 0 1 4.2 5.4" />
  </>);
}

export function TechLogIcon(p: IconProps) {
  return base(p, <>
    <rect x="5" y="4" width="14" height="17" rx="1.5" />
    <path d="M9 4V3.2A1.2 1.2 0 0 1 10.2 2h3.6A1.2 1.2 0 0 1 15 3.2V4" />
    <path d="M8.5 10h7M8.5 14h7M8.5 18h4" />
  </>);
}

export function TraceIcon(p: IconProps) {
  return base(p, <>
    <path d="M6 3h7.5L18 7.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    <path d="M13.5 3v4H18" />
    <circle cx="11" cy="12.5" r="2.2" />
    <path d="M9.4 14.1 8.7 17.5l2.3-1.2 2.3 1.2-.7-3.4" />
  </>);
}

export function TriageIcon(p: IconProps) {
  return base(p, <path d="M3.5 5h17l-6.5 7.5V19l-4-2v-4.5Z" />);
}

export function TurbineIcon(p: IconProps) {
  return base(p, <>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="2.2" />
    <path d="M12 3.5v6.3M12 14.2v6.3M3.5 12h6.3M14.2 12h6.3" />
  </>);
}

export function UpdatesIcon(p: IconProps) {
  return base(p, <path d="M2 12.5h4l2.5-7 5 15.5 2.5-8.5h6" />);
}

export function UploadIcon(p: IconProps) {
  return base(p, <>
    <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    <path d="M12 15.5V4" />
    <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
  </>);
}

export function VerifiedDocIcon(p: IconProps) {
  return base(p, <>
    <path d="M18 11V7.5L13.5 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h5" />
    <path d="M13.5 3v4H18M14.3 18.4l1.9 1.9L20.5 16" />
  </>);
}

// ── Generic dispatcher ────────────────────────────────────────────────────────

const ICON_MAP = {
  aircraft: AircraftIcon, aog: AogIcon, "arrow-right": ArrowRightIcon,
  attachment: AttachmentIcon, bell: BellIcon, billing: BillingIcon,
  broadcast: BroadcastIcon, calendar: CalendarIcon, check: CheckIcon,
  "chevron-down": ChevronDownIcon, "chevron-right": ChevronRightIcon,
  cleared: ClearedIcon, close: CloseIcon, cover: CoverIcon,
  dashboard: DashboardIcon, dispatch: DispatchIcon, document: DocumentIcon,
  download: DownloadIcon, filter: FilterIcon, fleet: FleetIcon,
  gauge: GaugeIcon, globe: GlobeIcon, grounded: GroundedIcon,
  hangar: HangarIcon, inventory: InventoryIcon, invoice: InvoiceIcon,
  live: LiveIcon, logout: LogoutIcon, member: MemberIcon,
  message: MessageIcon, more: MoreIcon, network: NetworkIcon,
  part: PartIcon, phone: PhoneIcon, plus: PlusIcon,
  priority: PriorityIcon, progress: ProgressIcon, quote: QuoteIcon,
  revenue: RevenueIcon, route: RouteIcon, runway: RunwayIcon,
  search: SearchIcon, settings: SettingsIcon, sla: SlaIcon,
  supplier: SupplierIcon, tail: TailIcon, takeoff: TakeoffIcon,
  team: TeamIcon, "tech-log": TechLogIcon, trace: TraceIcon,
  triage: TriageIcon, turbine: TurbineIcon, updates: UpdatesIcon,
  upload: UploadIcon, "verified-doc": VerifiedDocIcon,
} as const;

export type PsIconName = keyof typeof ICON_MAP;

export function PsIcon({ name, ...props }: IconProps & { name: PsIconName }) {
  const Icon = ICON_MAP[name];
  return <Icon {...props} />;
}
