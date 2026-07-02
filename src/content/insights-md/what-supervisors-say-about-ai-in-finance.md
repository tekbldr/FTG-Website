When the people whose job is to prevent financial crises all start publishing studies about the same technology within eighteen months of each other, it is worth reading the studies. Between late 2024 and 2026, the Financial Stability Board, the Bank for International Settlements, the Bank of England, and the International Monetary Fund each published substantial work on artificial intelligence in the financial system. These are not press releases. They are the supervisors' honest map of where AI is actually deployed in finance, and where they think it breaks.

Most coverage read them as warnings. We read them as something more useful: a build specification. Here is what the research actually found.

## Adoption is real, spending is doubling

Start with the baseline the supervisors established, because it kills the idea that AI in finance is hype-in-waiting. The Bank of England's April 2025 *Financial Stability in Focus*, drawing on industry survey work, reports that around **50% of banking-sector respondents had already implemented AI**, with generative AI at roughly 40% — and that financial institutions are forecast to **double their spending on AI by 2027**. The FSB's November 2024 report on the financial-stability implications of AI reached the same conclusion from the global vantage point: adoption is broad, accelerating, and increasingly load-bearing.

The BIS, in its Annual Economic Report chapter on AI and the economy, went a step further and addressed central banks themselves — arguing they will need to use the technology to supervise a system that runs on it. When the referee starts training, the game has changed.

## The autonomy gap: 55% versus 2%

The single most interesting statistic in the supervisory literature comes from the Bank of England and FCA's survey of AI use in UK financial services: **55% of AI use cases involve some form of autonomous decision-making — but only 2% are described as fully autonomous.**

Read those two numbers together, because the gap between them is the entire story of AI in finance right now. Institutions are perfectly willing to let models *inform* decisions at scale. They are almost universally unwilling to let models *make* them unsupervised. The missing 53 points are not a technology gap — the models can act — they are a trust gap: no infrastructure exists that lets an institution delegate a bounded, auditable, revocable slice of authority to a machine and prove afterwards what the machine did.

We have made this argument from the builder's side — in [The agent economy](/insights/the-agent-economy) and [Agents will need wallets](/insights/agents-will-need-wallets) — that agents don't need permission to be smart, they need rails to be accountable. The BoE's 55/2 split is that argument, measured. Whoever closes the gap — bounded delegation, scoped permissions, revocation in one move, an audit trail by construction — converts the majority of AI use cases in finance from "advisory" to "operational." That is precisely the design brief PRV Copilot is built against: an assistant that operates strictly within permissions you grant and never holds the keys.

## The failure modes, named

The supervisors' risk catalogue is specific, and it is the same list in every report. Concentration: much of the financial system leaning on the same handful of foundation models and cloud providers, so one vendor's failure propagates everywhere. Correlation: models trained on the same data, reacting the same way in the same moment — herding, at machine speed. Opacity: decisions no one inside the institution can fully explain to a supervisor after the fact.

And, most urgently in the most recent work: adversaries. The IMF's 2026 analysis is blunt that financial-stability risks mount as AI fuels cyberattacks — the same capabilities that automate a bank's operations automate the attacks against it, and industry surveys the supervisors cite show institutions responding, with ~89% prioritising cybersecurity investment alongside ~90% for generative AI. The IMF has separately estimated that AI could affect around **40% of jobs globally** — a reminder that the transition being managed is not just technical.

None of this is an argument against AI in finance. Every one of these reports assumes deployment continues. It is an argument about *architecture* — and each named failure mode has a known structural answer. Concentration argues for owning your critical path rather than renting all of it. Opacity argues for systems designed to be provable rather than merely performant. Machine-speed herding argues for venues with surveillance and market-conduct controls built in from the first commit, which is how we are building [Exx1](/exx1).

## What each failure mode demands, structurally

It is worth being concrete about the mapping from the supervisors' catalogue to architecture, because every entry has a known engineering answer — just not a cheap one.

Concentration risk is answered by owning the critical path. A financial institution whose matching, custody, or risk logic lives entirely inside a rented black box has outsourced not just a function but its own failure modes; the supervisors' concern about "the same handful of providers" is, from the builder's side, the argument for building the keystone layers in-house even when renting would ship faster. Correlation risk — everyone's models flinching in unison — is answered at the venue level: circuit-breaking, surveillance, and market-conduct controls designed for participants that react in microseconds, built into the market's fabric rather than appended after the first incident. Opacity is answered by designing for the audit before the audit exists: append-only histories, decisions that carry their reasoning, controls that are provable rather than asserted. And the adversarial finding — AI-fueled attacks against AI-run institutions — is answered by the oldest discipline of all: minimize what an attacker can win. No honeypot of pooled credentials, no privileged copy of every customer's keys, no single system whose compromise is total. Self-custody architectures are not just a philosophy; against AI-scaled attackers, they are attack-surface reduction.

The pattern across all four: the supervisors' concerns are uniformly about *structure*, not capability. Nothing in these reports says the models are too weak. Everything says the surrounding architecture is too thin.

## Reading the map as a builder

There is a habit of treating supervisory reports as the opposition — the people who slow the future down. The record suggests otherwise. The jurisdictions that wrote clear digital-asset rules early became, precisely because of that clarity, the places serious builders went; we documented that dynamic in [The Gulf's head start](/insights/gulf-financial-infrastructure-head-start). The same pattern is now repeating with AI in finance. The supervisors have done builders the favor of naming, with data, exactly which properties the financial system will require of intelligent software: bounded autonomy, provable behavior, resilience to concentration, defenses that assume AI-equipped adversaries.

That list is not a constraint on our roadmap. It largely *is* our roadmap.

> Half the industry has deployed AI; 2% trusts it fully. The distance between those numbers is not a model problem — it is missing trust infrastructure, and it is the most precisely specified build opportunity in finance.

*Figures are drawn from the FSB's November 2024 report on AI and financial stability, the Bank of England's April 2025 Financial Stability in Focus and BoE/FCA survey, the BIS Annual Economic Report chapter on AI, and IMF analyses — attributed as their estimates. FTG products referenced are in development; nothing here describes live metrics.*
