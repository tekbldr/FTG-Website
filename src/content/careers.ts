// ============================================================================
// Careers landing content — employer brand context shown around the live job
// board (which stays DB-backed). Interview stages mirror the seeded ATS
// pipeline. Benefits/visa specifics are the working policy — editable here
// without touching layout, like every other content module.
// ============================================================================

export const careersIntro = {
  eyebrow: "Careers · We fund · build · operate",
  headline: "Build the operating stack for the digital economy.",
  sub: "Open roles across Exx1, PRVAI, PRV Wallet, Diwan OS, and EQWT1. We hire operators and engineers who want to build infrastructure, not features — apply and track your status in real time.",
};

export type CultureBlock = { title: string; body: string };

// "How we work" — culture stated as operating principles, in the group's own
// voice, rather than perk-speak or invented employee quotes.
export const culture: CultureBlock[] = [
  {
    title: "Operator-owners",
    body: "FTG doesn't stop at the cheque, and neither do its teams. The people who design a system operate it — you ship it, you run it, you answer for it. Ownership here is a job description, not a slogan.",
  },
  {
    title: "Small teams, senior trust",
    body: "We run small, senior teams with real authority. Decisions are argued in writing, made quickly, and owned by someone with a name. If you need a committee to feel safe shipping, you will hate it here — happily.",
  },
  {
    title: "One stack, many surfaces",
    body: "Work compounds across the group. The memory backbone you build serves the wallet, the exchange, and the AI at once. Engineers move between an exchange matching engine, a non-custodial wallet, and Arabic-first AI without changing employer.",
  },
  {
    title: "Plain words, provable claims",
    body: "The discipline in our research — projections labelled, superlatives attributed, 'in build' meaning in build — is the same discipline inside. Status updates say what is true. Post-mortems name causes, not people.",
  },
];

export type Benefit = { title: string; body: string };

export const benefits: Benefit[] = [
  {
    title: "Ownership in what you build",
    body: "Meaningful equity participation across the group — operator-owners means you, too.",
  },
  {
    title: "Competitive, region-aware pay",
    body: "Compensation benchmarked to the market we hire in, reviewed as the group grows.",
  },
  {
    title: "Relocation & visa support",
    body: "For roles based in our Gulf hubs, we sponsor visas and support the move — flights, first weeks' housing, and the paperwork.",
  },
  {
    title: "Remote-flexible by role",
    body: "Some roles are hub-based, many are remote-friendly across time zones near the Gulf. Every listing says which, up front.",
  },
  {
    title: "Hardware & tools",
    body: "The machine and tools you actually want. Nobody does their best work fighting their laptop.",
  },
  {
    title: "Learning that compounds",
    body: "Budget for books, courses, and conferences — plus the faster teacher: shipping real infrastructure next to senior people.",
  },
];

export type InterviewStage = { n: string; title: string; body: string };

// Mirrors the live ATS pipeline candidates see in their portal.
export const interviewStages: InterviewStage[] = [
  {
    n: "01",
    title: "Application review",
    body: "A human reads every application — no keyword filters, no automated rejections. You hear from us either way.",
  },
  {
    n: "02",
    title: "Screening call",
    body: "Thirty minutes with the hiring team: your story, the role's reality, and whether the fit is worth both sides' time.",
  },
  {
    n: "03",
    title: "Role deep-dive",
    body: "A working session in your craft — a technical interview, a portfolio walk-through, or a case, depending on the role. Real problems, not riddles.",
  },
  {
    n: "04",
    title: "Team interviews",
    body: "Meet the people you would work with, including leadership. You are interviewing us here too — ask the hard questions.",
  },
  {
    n: "05",
    title: "Offer",
    body: "A clear written offer, time to consider it, and straight answers about equity, pay, and the road ahead.",
  },
];

export const interviewNote =
  "You can track exactly which stage you are at from your candidate portal, and every stage change notifies you. The typical process runs two to three weeks end to end.";

export const visaRelocation = {
  heading: "Visas, relocation, and where we work",
  body: "FTG's operating hubs are in the Gulf — Saudi Arabia and the UAE — with team members working remotely across nearby time zones. For hub-based roles we sponsor employment visas and handle the process with you: paperwork, flights, and support while you land. Each listing states its location and work mode up front, so there are no surprises at offer stage. If a role is remote-friendly, it means it — we hire the best person in the time zones the team spans.",
};

export type TeamStory = { role: string; title: string; body: string };

// Discipline narratives — what the work is actually like, told honestly,
// without inventing named employees.
export const teamStories: TeamStory[] = [
  {
    role: "Engineering",
    title: "The stack goes all the way down",
    body: "Engineers here work on the parts most companies rent: a matching engine's determinism, on-device key derivation, a memory graph threading every product. The bar is 'provable over promised' — the same discipline our research preaches is the one your code reviews enforce.",
  },
  {
    role: "Product & design",
    title: "Sophistication is restraint",
    body: "One accent colour per view. Mono for numbers. Motion only as signal. The design system is deliberately spare because trust is visual — a wallet, an exchange, and an AI your family could use have no room for decoration pretending to be meaning.",
  },
  {
    role: "Investment team",
    title: "Research with skin in it",
    body: "The investment side writes the FTG Research you can read on this site — problem-first, primary-sourced, superlatives attributed. Evaluating founders while operating companies keeps the judgement honest: we know what building actually costs.",
  },
];

export const hiringCta = {
  heading: "No perfect-fit role listed?",
  body: "Strong people beat perfect timing. If you believe you belong at the convergence of markets, money, and intelligence, write to us with what you want to own.",
  email: "hello@ftg.vc",
};
