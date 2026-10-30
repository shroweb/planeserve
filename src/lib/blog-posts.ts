export interface BlogPost {
  slug: string;
  title: string;
  /** Short headline used on cards and in related links. */
  cardTitle: string;
  description: string;
  published: string;
  modified?: string;
  displayDate: string;
  icon: "wrench" | "checklist" | "clock" | "cost" | "docs" | "truck" | "scale";
}

export const BLOG_POSTS = [
  {
    slug: "what-does-aog-mean-in-aviation",
    title: "What Does AOG Mean in Aviation? Definition & True Downtime Costs",
    cardTitle: "What Does AOG Mean in Aviation?",
    description:
      "Learn what AOG (Aircraft On Ground) means in aviation. Explore immediate operational costs, common causes, emergency MRO logistics, and compliance risks.",
    published: "2026-10-19",
    modified: "2026-10-30",
    displayDate: "19 October 2026",
    icon: "wrench",
  },
  {
    slug: "aog-response-checklist",
    title: "Aircraft AOG Response Checklist — What to Do When Grounded Off-Base",
    cardTitle: "AOG Response Checklist",
    description:
      "A step-by-step AOG response checklist for flight crews: cockpit fault logging, MEL deferral, AMO triage, parts sourcing, expedited logistics, and customs clearance.",
    published: "2026-10-19",
    modified: "2026-10-30",
    displayDate: "19 October 2026",
    icon: "checklist",
  },
  {
    slug: "retained-aog-procurement",
    title: "AOG Request: Why Retained Procurement Beats 2:00 AM Scrambling",
    cardTitle: "Retained AOG Procurement vs 2:00 AM Scrambling",
    description:
      "See how pre-enrolled aircraft information, pre-authorization, and a 24/7 AOG desk can help operators manage urgent aircraft parts procurement.",
    published: "2026-10-27",
    displayDate: "27 October 2026",
    icon: "clock",
  },
  {
    slug: "cost-of-aog",
    title: "Cost of AOG: What an Hour on the Ground Really Costs a Business Jet",
    cardTitle: "The True Cost of an AOG Hour",
    description:
      "Break down the cost of AOG for a business jet: direct parts and freight, replacement flights, crew expenses and the indirect costs that never reach the invoice.",
    published: "2026-10-30",
    displayDate: "30 October 2026",
    icon: "cost",
  },
  {
    slug: "easa-form-1-vs-faa-8130-3",
    title: "EASA Form 1 vs FAA 8130-3 vs UK CAA Form 1: Release Certificates Explained",
    cardTitle: "EASA Form 1 vs FAA 8130-3 vs UK CAA Form 1",
    description:
      "What EASA Form 1, FAA 8130-3 and UK CAA Form 1 each certify, what a dual release means, and the paperwork red flags that turn a located part into a second AOG delay.",
    published: "2026-10-30",
    displayDate: "30 October 2026",
    icon: "docs",
  },
  {
    slug: "aog-logistics",
    title: "AOG Logistics: Onboard Courier, Next Flight Out and Charter Dispatch",
    cardTitle: "AOG Logistics: OBC, NFO and Charter",
    description:
      "How AOG parts actually move: next flight out, onboard courier and dedicated charter compared, plus customs, dangerous goods and ramp-access planning.",
    published: "2026-10-30",
    displayDate: "30 October 2026",
    icon: "truck",
  },
  {
    slug: "aog-desk-vs-parts-broker",
    title: "AOG Desk vs Parts Broker: The Disclosed Agency Model Explained",
    cardTitle: "AOG Desk vs Traditional Parts Broker",
    description:
      "An AOG desk acting as your disclosed agent differs from a traditional parts broker. See how each is paid, what you can see, and the questions worth asking.",
    published: "2026-10-30",
    displayDate: "30 October 2026",
    icon: "scale",
  },
] as const satisfies readonly BlogPost[];

export function getPost(slug: string): BlogPost | undefined {
  return (BLOG_POSTS as readonly BlogPost[]).find((p) => p.slug === slug);
}
