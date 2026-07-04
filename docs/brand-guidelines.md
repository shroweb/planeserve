# Aircraft Program Brand Guidelines

## Brand Essence

Aircraft Program is a retained AOG parts support route for private and business aircraft operators.

The brand should feel calm, precise, operational, and quietly premium. Aircraft Program is not a public marketplace, travel product, or generic SaaS dashboard. It is a trusted support desk for people who need hard-to-source aircraft parts handled quickly, clearly, and professionally.

### Mission

Help aircraft owners and operators reduce downtime by giving them a dependable route for AOG parts sourcing, aircraft support profiles, document handling, and operational updates.

### Brand Promise

When downtime matters, Aircraft Program gives operators a calm, capable team and system to move the request forward.

### Tone Of Voice

- Calm under pressure
- Precise and operational
- Clear rather than clever
- Premium without sounding luxury-heavy
- Direct, useful, and human

### Use These Words

- AOG
- Aircraft support profile
- Sourcing route
- Triage
- Verified documents
- Operational updates
- Supplier outreach
- Parts support
- Priority
- Trace
- Dispatch

### Avoid These Words

- Marketplace
- Cheap
- Instant guaranteed
- Travel
- Concierge luxury
- Disruptive
- Revolutionary
- Magic
- AI-powered unless the feature genuinely uses AI

## Visual Direction

Aircraft Program should feel like a private aviation operations room: composed, technical, discreet, and fast-moving. The UI should prioritise trust, legibility, and workflow clarity.

The design should borrow from:

- Private aviation operations
- Aircraft maintenance control
- Premium B2B logistics
- Industrial procurement
- Financial operations dashboards

Avoid:

- Playful startup design
- Oversized SaaS gradients
- Generic bright blue dashboards
- Decorative blobs or abstract orbs
- Travel-booking visual language
- Overly luxurious gold-and-black styling

## Logo Direction

The wordmark should be clean, technical, and confident. It should work well in a dark sidebar, on documents, and in email headers.

### Wordmark Guidance

- Use a simple sans-serif wordmark.
- Keep letter spacing normal.
- Prioritise readability over aviation cliches.
- Avoid excessive wing, globe, or contrail symbols.

### Symbol Ideas

- Abstract aircraft part locator mark
- Precision route/path mark
- Subtle aircraft profile outline
- Monogram built from `P` and a directional cut

### Usage Rules

- Keep the logo clear of dense UI controls.
- Use the full wordmark in navigation and documents.
- Use a compact icon only for favicons, app icons, or collapsed sidebars.
- Minimum digital wordmark width: `120px`.
- Minimum icon size: `24px`.

## Colour System

Aircraft Program should use a restrained, premium operational palette with warm technical accents.

### Core Palette

| Token          | Hex       | Use                        |
| -------------- | --------- | -------------------------- |
| `--ps-ink`     | `#18202A` | Primary text, dark sidebar |
| `--ps-navy`    | `#202D3D` | Navigation, hero overlays  |
| `--ps-slate`   | `#596473` | Secondary text             |
| `--ps-cloud`   | `#F5F7F8` | App background             |
| `--ps-surface` | `#FFFFFF` | Cards, panels, forms       |
| `--ps-border`  | `#DDE3E8` | Borders and dividers       |
| `--ps-copper`  | `#B98545` | Premium accent, CTAs       |
| `--ps-runway`  | `#2F6F73` | Operational highlight      |
| `--ps-mist`    | `#E8EEF0` | Muted UI fill              |

### Status Palette

| Status  | Hex       | Use                                      |
| ------- | --------- | ---------------------------------------- |
| Success | `#2F7D55` | Verified documents, resolved requests    |
| Warning | `#B7791F` | Waiting, missing customer action         |
| Error   | `#B64235` | Grounded aircraft, missing critical docs |
| Info    | `#2F6F73` | In progress, operational notices         |

### Dark Mode

Dark mode should use deep ink and navy surfaces, not pure black. Accents should remain restrained.

- Background: `#111820`
- Surface: `#18202A`
- Border: `#2B3745`
- Text: `#F4F7F8`
- Muted text: `#A8B2BD`
- Accent: `#C49358`

## Typography

Use typography that feels precise and operational.

### Recommended Fonts

- Headings: `Inter`, `Geist`, or `IBM Plex Sans`
- Body: `Inter`, `Geist`, or `Source Sans 3`
- Numeric/table data: `IBM Plex Mono`, `Geist Mono`, or `JetBrains Mono`

### Hierarchy

- Hero H1: `48-64px`, medium/semi-bold, tight but not negative letter spacing
- Page H1: `28-36px`
- Panel headings: `13-14px`, uppercase only when used as a dashboard label
- Body: `15-16px`
- Table body: `13-14px`
- Metadata: `11-12px`

Keep letter spacing at `0` for most text. Uppercase labels may use `0.08em`.

## UI Design System

### Buttons

Primary buttons should be confident but not loud.

- Primary: ink/navy background, white text
- Accent: copper background, ink text
- Secondary: white or transparent with border
- Destructive: restrained red border or fill

Border radius: `4px`.

### Inputs And Forms

Forms should feel professional and dense enough for operations users.

- Labels above fields
- Required fields marked subtly
- Clear focus state using runway or copper
- Avoid large pill-shaped inputs
- Use helper text for document and aircraft profile fields

### Tables

Tables are core to the admin experience.

- Use compact rows
- Keep numeric and IDs in mono
- Freeze or preserve meaningful column order
- Use badges for status, not long text blocks
- Put actions at the far right

### Status Badges

Use short labels:

- `New`
- `In progress`
- `Waiting client`
- `Resolved`
- `Missing`
- `Uploaded`
- `Verified`

Badges should be low-height, squared, and readable.

### Priority Scoring

AOG priority should be displayed as a score plus reasons.

Example:

- `96/100`
- Aircraft grounded
- Documents uploaded
- Exact alternate part match

High priority should use restrained red. Medium priority should use amber. Low priority should use muted slate.

### Admin Dashboard

The admin panel should feel like an operations command centre.

Prioritise:

- Open AOG queue
- Grounded aircraft
- Waiting customer action
- Missing documentation
- Recent enrolments
- Supplier/RFQ readiness later

Avoid marketing-style cards or decorative hero sections inside admin.

### AOG Request Forms

The AOG form should reduce repeat calls by capturing the right information upfront.

Include:

- Aircraft registration
- Location
- Aircraft type
- Urgency
- Affected system
- Part number
- Issue description
- Contact details
- Document/photo uploads
- Smart aircraft profile suggestions
- Document checklist

### Document Vault

Document states:

- `Missing`
- `Uploaded`
- `Verified`

Core documents:

- Tech log extract
- Part or fault photo
- Release certificate / trace
- Supplier quote
- Delivery confirmation

### Aircraft Profile Cards

Aircraft cards should highlight:

- Registration
- Make/model
- Serial number
- Engine type
- Avionics suite
- Base airport
- Plan
- Known part families
- Alternate part numbers
- Support notes

## Layout Principles

### Landing Page

The landing page should immediately communicate aircraft support and AOG urgency.

- Use real aviation/hangar imagery.
- Keep headline direct.
- Show proof and operational workflow early.
- Avoid a generic SaaS hero.

### Member Dashboard

The member dashboard should help customers act quickly.

- Submit AOG should be obvious.
- Aircraft status should be visible.
- Recent requests should show status.
- Billing should be secondary.

### Admin Panel

The admin panel should be dense, calm, and workflow-led.

- Sidebar navigation
- Priority queue first
- Tables for repeat operations
- Clear status controls
- Document completeness visible without opening a modal

### Mobile Behaviour

Mobile should support urgent use in the field.

- AOG submit flow must work cleanly on mobile.
- Tables can become horizontally scrollable.
- Admin actions should remain tappable.
- Avoid cramped button text.

## Imagery And Iconography

### Photography

Use:

- Hangars
- Aircraft maintenance environments
- Business aircraft details
- Ground operations
- Parts/document handling
- Clean runway or apron moments

Avoid:

- Holiday travel imagery
- Passenger cabin luxury shots as primary imagery
- Dark, vague silhouettes
- Overly dramatic aircraft sunset shots
- Stock photos with fake customer service poses

### Icons

Use thin-line icons with consistent stroke width.

Preferred icon themes:

- Plane
- Shield/check
- File/check
- Clock
- Package
- Wrench
- Radio/signal
- Route/path

## Copywriting Examples

### Homepage Hero

`Hard-to-source aircraft parts, handled fast.`

`Aircraft Program gives aircraft owners and operators a retained route for hard-to-source parts, document handling, and urgent sourcing updates when downtime matters.`

### AOG CTA

`Submit AOG Request`

`Send the aircraft, fault, part, and document details the operations team needs to start sourcing.`

### Admin Dashboard Heading

`Operations overview`

`Live triage view for enrolments, grounded aircraft, missing documents, and open AOG work.`

### Document Vault Empty State

`No documents uploaded yet. Add the tech log extract, part photo, or trace paperwork so the sourcing team can verify the request faster.`

### Supplier RFQ Future Feature

`Send supplier RFQs`

`Compare supplier response, condition, lead time, paperwork, and dispatch route before customer approval.`

### Confirmation Email

Subject: `Aircraft Program received your AOG request`

Body:

`We have received your AOG request for {registration}. The Aircraft Program operations team is reviewing the aircraft profile, uploaded documents, and sourcing route. We will update you as soon as the request is triaged.`

## Implementation Tokens

```css
:root {
  --ps-ink: #18202a;
  --ps-navy: #202d3d;
  --ps-slate: #596473;
  --ps-cloud: #f5f7f8;
  --ps-surface: #ffffff;
  --ps-border: #dde3e8;
  --ps-copper: #b98545;
  --ps-runway: #2f6f73;
  --ps-mist: #e8eef0;

  --ps-success: #2f7d55;
  --ps-warning: #b7791f;
  --ps-error: #b64235;
  --ps-info: #2f6f73;

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;

  --shadow-panel: 0 18px 50px rgb(24 32 42 / 0.08);
  --shadow-focus: 0 0 0 3px rgb(47 111 115 / 0.18);
}
```

### Spacing Scale

- `4px`
- `8px`
- `12px`
- `16px`
- `24px`
- `32px`
- `48px`
- `64px`

### Component Rules

- Cards: max `8px` radius, subtle borders, minimal shadow.
- Buttons: `4px` radius, clear hierarchy.
- Sidebar: deep navy/ink with low-contrast separators.
- Tables: compact, readable, status-led.
- Forms: structured into groups, never decorative.
- Badges: short, squared, operational.

## Product Design Principle

Every screen should answer one question:

`What does the operator or admin need to do next to keep the aircraft moving?`
