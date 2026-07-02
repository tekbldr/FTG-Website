McKinsey's research arm has put a number on what generative AI is worth to banking, and it is large enough to organize a strategy around: **$200 billion to $340 billion in value annually**, the equivalent of 9 to 15 percent of the industry's operating profits. The estimate comes from the McKinsey Global Institute's analysis of sixty-three use cases across industries — the same work that sized generative AI's total economic potential at $2.6 trillion to $4.4 trillion a year — with banking among the largest sectoral beneficiaries, led by corporate banking (~$56 billion) and retail (~$54 billion).

Numbers like these usually get quoted once as ambient optimism and never interrogated. The more useful question is the one this piece is about: under what conditions does that value actually get captured — and by whom?

## Why the value is currently leaking

The first honest observation is that a potential is not a P&L. The banking industry has adopted AI faster than almost any other — supervisory surveys put implementation at roughly half of institutions, a picture we examined in detail in [What the supervisors actually found](/insights/what-supervisors-say-about-ai-in-finance) — and yet the meaningful share of McKinsey's $340 billion remains, by the estimate's own framing, *potential*. Analysts reading the 2026 investment data have started using the same phrase for this: the value is leaking — to users, who get better service nearly free, and to the infrastructure layer, which gets paid regardless.

Why the leak? Because most deployed AI in finance today is advisory. It drafts, summarizes, flags, and recommends — and then a human executes. The Bank of England's survey data makes the point with unusual precision: 55% of AI use cases in UK financial services involve some autonomous decision-making, but only **2% are fully autonomous**. Advisory AI captures the cheapest slice of the value — productivity at the margins. The expensive slice, the part that compounds, requires the machine to be able to *complete* the loop: decide, act, settle, account for itself. That requires trust infrastructure that mostly does not exist yet.

## The rails are being built in public

Which is why the most consequential AI-in-finance news of the past year did not come from a model lab. It came from the card networks.

Mastercard announced **Agent Pay** in April 2025 — a framework in which verified AI agents transact on a consumer's behalf using agentic tokens that bind a tokenized credential to a *specific agent, merchant scope, and consent policy* — and completed what it describes as the first live agentic payment that September, an AI agent buying a real product with a tokenized credential. Visa, over the same period, reports having executed hundreds of secure agent-initiated transactions with a partner ecosystem of more than a hundred companies, with pilots slated to widen across Asia-Pacific and Europe through 2026.

Treat the "hundreds of transactions" as what it is — a pilot, not a payments revolution; these are the networks' own announcements and timelines. But notice the shape of what they built, because it is the interesting part. Neither network's answer to agentic commerce is "make the model smarter." Both answers are *credential architecture*: bind the agent's authority to a scope, make the consent explicit and revocable, make every action attributable. The networks looked at the autonomy gap and concluded, correctly, that it is closed with permissions, not parameters.

## The missing half of the architecture

Here is the structural observation the payment-network announcements point at without quite saying. A scoped credential solves the *rail's* problem — it lets a network prove an agent was authorized. It does not solve the *user's* problem: where does the agent's authority come from, where is the value it spends actually held, and who holds the keys?

If the answer is "a platform holds everything and the user trusts it," we have rebuilt the custodial model this industry already stress-tested at catastrophic cost. The alternative — the one we find structurally honest — is that the agent's authority should be granted from a wallet the *user* controls: self-custodial underneath, with delegation that is bounded, auditable, and revocable in one move, and an assistant that helps but never holds the keys. That is not a hypothetical design; it is the design brief of [PRV Wallet](/prv-wallet) and PRV Copilot, and the reasoning behind it long predates the networks' pilots — we laid it out in [The agent economy](/insights/the-agent-economy) and [Agents will need wallets](/insights/agents-will-need-wallets).

The same logic runs one layer down. Agents that transact need venues whose fairness they — and their principals' lawyers — can verify: deterministic matching, no privileged fast path, surveillance built in rather than bolted on. Machine participants raise the standard a venue must meet, which is the standard [Exx1](/exx1) is being built against.

## The leak, examined

Before the synthesis, look closer at where the value goes while the trust gap stays open, because "leaking" is doing precise work in that sentence.

Value leaks *down* to the infrastructure layer: whoever sells the compute, the models, and now the agentic rails gets paid on every experiment, successful or not — which is why the networks can announce pilots with a hundred partners while most of those partners are still pre-revenue on the feature. Value leaks *out* to users: better service, faster answers, lower fees, delivered mostly free because no institution dares charge for an assistant it does not fully trust itself. And value leaks *sideways* to incumbents' cost lines rather than their top lines: the McKinsey estimate is overwhelmingly a productivity number — 9 to 15 percent of operating profits reclaimed from process cost — and productivity gains, in competitive markets, have a way of being handed to customers as pricing rather than kept as margin.

What almost never happens, in this configuration, is durable capture by the application layer. An AI feature bolted onto an existing bank captures weeks of advantage before the competitor's identical model call ships. The capture points are the ones with structural lock-in: the credential that authority flows through, the venue that activity settles on, and the memory that makes an assistant worth granting authority to at all. Two of those three are exactly what the card networks just moved on. The third — the memory — is the one an incumbent cannot buy, because it accrues per-user, over years, inside whatever surface the user actually lives in. That is the quiet stake in this race, and it is why we treat the wallet, not the chatbot, as the strategic surface.

## What would make the $340 billion real

So the honest synthesis of the research runs like this. McKinsey sized the prize: up to $340 billion a year in banking alone, 9–15% of operating profits. The supervisors measured the obstacle: a fifty-three-point gap between AI that advises and AI that is trusted to act. The networks demonstrated the direction of the answer: authority that is scoped, consented, attributable — engineered trust, not asserted trust.

What remains unbuilt is the stack that carries that answer end to end: the wallet where authority is granted and value is held, the intelligence that acts within the grant, and the venue where the resulting activity settles fairly. Build those and the leak seals: the value stops accruing only to whoever rents out the models and starts accruing to whoever operates the trust. That conviction — markets, money, and intelligence as one owned stack — is not our reading of someone else's research. It is [the thesis this group was founded on](/insights/markets-money-intelligence-one-stack). The research keeps arriving at the same address.

> McKinsey sized the prize at up to $340 billion a year. The supervisors measured the obstacle: only 2% of financial AI is trusted to act alone. The winners will be whoever engineers the trust in between.

*Estimates are attributed to their sources — McKinsey Global Institute for the value figures, the Bank of England/FCA survey for autonomy data, and Mastercard's and Visa's own announcements for their pilots — and are projections or vendor claims, not FTG measurements. FTG products referenced are in development.*
