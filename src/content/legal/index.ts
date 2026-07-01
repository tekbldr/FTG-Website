// ============================================================================
// Legal / trust document registry. Bodies live as Markdown strings in sibling
// modules (bundled reliably — no fs reads at runtime); this index carries the
// per-document metadata used for routing, the /trust hub, and SEO.
// ============================================================================
import { body as privacy } from "./privacy";
import { body as terms } from "./terms";
import { body as cookies } from "./cookies";
import { body as candidatePrivacy } from "./candidate-privacy";
import { body as founderPrivacy } from "./founder-privacy";
import { body as security } from "./security";
import { body as accessibility } from "./accessibility";

export type LegalDoc = {
  slug: string;
  title: string;
  // Short hub-card + meta description.
  description: string;
  updated: string; // ISO date
  body: string;
};

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "privacy",
    title: "Privacy Notice",
    description: "What personal data FTG collects, why, where it lives (EU — Frankfurt), who sees it, how long we keep it, and the rights you have over it.",
    updated: "2026-07-02",
    body: privacy,
  },
  {
    slug: "terms",
    title: "Terms of Use",
    description: "The rules for using www.ftg.vc and its platforms — accounts, acceptable use, your content, IP, and what this site is (and is not).",
    updated: "2026-07-02",
    body: terms,
  },
  {
    slug: "cookies",
    title: "Cookie Notice",
    description: "The complete list of cookies this site sets — essential only, no advertising or third-party analytics — and the choices you have.",
    updated: "2026-07-02",
    body: cookies,
  },
  {
    slug: "candidate-privacy",
    title: "Candidate Privacy Notice",
    description: "How job applications are handled: private scanned storage, role-based access, no automated decisions, and automatic deletion 6 months after a decision.",
    updated: "2026-07-02",
    body: candidatePrivacy,
  },
  {
    slug: "founder-privacy",
    title: "Founder Submission Privacy Notice",
    description: "How pitch decks and financials are protected: private EU storage, assignment-scoped access, conflict-of-interest controls, and no third-party sharing without consent.",
    updated: "2026-07-02",
    body: founderPrivacy,
  },
  {
    slug: "security",
    title: "Security",
    description: "How the platform is engineered to protect data: row-level security, least privilege, private signed storage, malware scanning, audit trails, and how to report a vulnerability.",
    updated: "2026-07-02",
    body: security,
  },
  {
    slug: "accessibility",
    title: "Accessibility Statement",
    description: "Our WCAG 2.1 AA target, the accessibility measures built into the site, known limitations, and how to reach us if something is hard to use.",
    updated: "2026-07-02",
    body: accessibility,
  },
];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return LEGAL_DOCS.find((d) => d.slug === slug);
}
