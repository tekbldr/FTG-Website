Something quietly inverted in the last year. For most of the history of software, the hard part was getting a machine to *understand* what you wanted. That problem is not solved, but it is no longer the binding constraint. The new bottleneck is narrower and stranger: an AI can now plan your travel, compare three suppliers, and draft the purchase order — and then it stalls at the checkout, because every payment rail ever built assumes a human is sitting there to tap "confirm."

We think this is the most consequential unsolved problem in applied AI right now, and almost nobody outside a handful of payments and crypto teams is treating it as urgent. This is our attempt to lay out why it matters, what actually breaks, and the shape of what has to get built.

## The wall between reasoning and doing

Ask a capable model to book a hotel and it will happily produce a plan, a shortlist, and a recommendation. Ask it to *pay* for the room and you watch it walk into a pane of glass. Card networks want a cardholder. Bank transfers want a signatory. Two-factor authentication wants a phone in a human hand. The entire apparatus of digital payments was designed, sensibly, to answer one question: is a specific person authorizing this specific charge? An autonomous agent fails that question by construction. It has no thumbs, no phone, and no legal identity of its own.

The industry's first answer was a hack: store the user's card and let the agent "act as" the human. It demos well. It falls apart the instant you care about the things that actually matter in commerce — who authorized this, up to what limit, for how long, and what happens when the agent gets it wrong.

## What actually breaks

Strip the problem down and four things are genuinely missing, none of which a stored card solves:

**Identity.** A merchant, or another agent, needs to know *what* it is transacting with and on whose authority. "A card ending in 4242" is not an answer when the cardholder never saw the transaction.

**Authorization that is bounded and revocable.** A human clicking "buy" is a fresh, specific act of consent. An agent with a saved card and a spending limit is a standing liability — closer to handing someone a signed blank cheque than to a considered purchase. The right model is a grant: spend up to this, on that, until then, and let me revoke it in one move.

**Settlement built for machines.** Agents will transact constantly, in tiny amounts, at all hours. A software agent paying half a cent to read one article, or a few cents to call an API, is nonsense on card rails, where interchange fees and minimums make micropayments uneconomic before the value even changes hands. Machines need settlement that is cheap, fast, always on, and final.

**Trust without a human in the loop.** When there is no person to call, both sides need cryptographic assurance that a payment is authorized and good — not a chargeback process designed around human dispute.

## The scaffolding is going up

The encouraging part is that 2025 and 2026 were the years serious players stopped talking about this and started shipping primitives for it.

Coinbase revived an old, mostly-forgotten corner of the web — HTTP status code 402, "Payment Required," which has sat unused in the standard for decades — as **x402**, a way for a server to ask a machine for payment inline. Anthropic's **Model Context Protocol** gave agents a common language for using tools, which is the substrate any payment action rides on. Google published an **Agent Payments Protocol (AP2)**. Visa announced **Intelligent Commerce**, and Mastercard launched **Agent Pay for Machines** — which is worth pausing on, because a network that processes a meaningful share of the planet's card volume chose to settle agent payments across cards, bank accounts, *and* stablecoins.

A necessary caveat, and we hold ourselves to it: most of this is early. Some of it is a press release with a pilot attached. None of it has proven itself at scale, and the trust, liability, and regulatory questions are wide open. But the direction is not ambiguous. When the incumbents and the crypto-native builders independently converge on "agents need their own way to pay," the question stops being *whether* and becomes *on what.*

## Why stablecoins keep turning up in this conversation

Notice what the machine-payment requirements are: tiny amounts, instant, 24/7, final, cheap. That list reads like a specification, and regulated stablecoins happen to match it more closely than any incumbent rail. It is not an accident or an ideological preference that a company as far from crypto-maximalism as Mastercard put stablecoins next to cards in an agent product. It is the requirements doing the talking.

## The shape of the answer

If a stored card is the wrong tool, the right one is a wallet — but a particular kind. Programmable, so an agent can be granted a budget and a scope. Non-custodial, so authority is delegated rather than surrendered. Auditable, so every action an agent takes is a signed, inspectable transaction instead of an opaque instruction to someone's backend. In that model, "let the AI handle it" becomes a bounded, revocable, reviewable delegation rather than a leap of faith.

This is why we think the wallet, not the model, is the surface where money and machine intelligence actually meet — and why we build the wallet and the intelligence layer on one identity-and-memory backbone rather than treating them as separate products that meet at an API. When agents need to pay — and within a few years, quietly, many of them will — the money layer and the thinking layer should not be strangers introduced at the last second.

## What we're watching

The honest scorecard for the agent economy is not the announcements. It is three quieter numbers: how much real value actually settles machine-to-machine (versus demos), how much of it settles on stablecoin rails, and whether anyone solves agent *identity* in a way merchants trust. Get those three and the agent economy is real. Miss them and it stays a very impressive way to fill a shopping cart that a human still has to check out.

*This piece describes an emerging landscape and FTG's design thesis. Named products and protocols are cited as announced by their owners and are, in several cases, early or pilot-stage rather than proven at scale.*
