In November 2022, one of the largest cryptocurrency exchanges in the world went from industry darling to bankruptcy in about a week, and when the receivers finally counted, something on the order of eight billion dollars of customer money was simply not where it was supposed to be. FTX did not lose that money on a bad trade. It lost it because customer funds and the house's funds were never truly separate, and a promise to keep them apart turned out to be worth exactly nothing once the promise was tested. A generation of users learned the lesson in real time: an IOU from a custodian is only ever as good as the custodian.

"Not your keys, not your coins" stopped being a slogan traded among enthusiasts that week and became a design requirement for anyone serious about building here. The lesson was correct. The trouble is that self-custody, as it actually existed in 2022, was too hard for most people to use — which is why so many kept handing their assets to custodians even after watching custodians fail. Closing that gap, making self-custody safe enough to be the *default*, is one of the more important pieces of consumer-infrastructure work of this decade.

## The failure that keeps happening is a custody failure

It is worth being precise, because the industry keeps drawing the wrong lesson. The catastrophes — FTX, and Mt. Gox before it, and a long tail of smaller collapses — were not trading failures. They were custody and operational failures: funds commingled, keys mishandled, obligations that outran reserves. Self-custody addresses this at the root, by removing the custodian entirely. There is no third-party balance sheet whose collapse can take your assets with it, because there is no third party holding them. That is the whole argument, and after 2022 it is not a hard one to make.

## But self-custody had a usability problem, and it was fatal

The reason most people stayed custodial was not ignorance. It was friction. A twelve-word seed phrase you must never lose and never expose. One irreversible mistake standing between you and your money. No "forgot password," no support line, no undo. For the overwhelming majority of people, that is not freedom — it is a trap with the door left open, and it is entirely rational to prefer a custodian who at least has a phone number, right up until the custodian implodes. If self-custody is going to be the default, it cannot demand that every user become their own security engineer.

## The technology to fix this arrived after 2022

The genuinely good news is that the years since the FTX collapse produced exactly the primitives self-custody was missing:

- **Smart accounts.** Account-abstraction standards — ERC-4337, and more recently EIP-7702 — let a wallet behave like a programmable smart account rather than a bare keypair. That unlocks spending limits, session keys, gas sponsorship, and, crucially, **social recovery**: you can regain access through trusted parties or devices instead of staking everything on a single fragile phrase. The seed phrase was never the point; controlling your assets was, and now you can do the second without the first.
- **Privacy primitives.** Stealth-address schemes (standardized as ERC-5564, from Vitalik Buterin's original design) let a recipient receive funds to a fresh, one-time address so their activity is not trivially linkable on a public chain. The approach is powerful and not yet frictionless — a freshly generated stealth address holds no balance and cannot pay its own transaction fee, one of several rough edges the ecosystem is still sanding down — but the direction is set.

The honest one-line summary: the cryptography is largely solved. The *ergonomics* are the frontier, and ergonomics is a design problem, which means it is a problem you can actually ship your way out of.

## Making it safe enough to be the default

This is where the real work sits, and where PRV Wallet does its hardest engineering. The design goal is not "usable by crypto natives." It is "usable by your family": sane recovery so a lost device is an inconvenience rather than a catastrophe, sensible defaults that make the safe path the easy path, and an assistant that helps without ever holding the keys. Privacy where it counts, keys derived and encrypted on the device, and recovery a normal person can actually perform — that combination is what turns self-custody from a principle you admire into a product you would hand your parents.

## Why "default" is the whole game

Defaults decide outcomes, quietly and at scale. If self-custody is the hard path and custody is the easy one, most people will keep handing their assets to a third party and keep re-learning 2022's lesson the expensive way. Flip the default — make self-custody the safe, obvious, boring choice — and you change the risk profile of the entire ecosystem one wallet at a time. That is the win worth chasing. Not convincing enthusiasts, who were already convinced, but making the safe thing effortless for everyone else.

> "Not your keys, not your coins" became a design requirement. The work now is making self-custody safe enough that everyone chooses it.

*PRV Wallet is in development. This piece describes design principles and the state of the underlying technology. The post-2022 shift toward self-custody is described qualitatively; specific figures vary by source and are not asserted here.*
