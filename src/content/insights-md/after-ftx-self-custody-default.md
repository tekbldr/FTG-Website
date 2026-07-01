In November 2022, one of the largest cryptocurrency exchanges in the world collapsed, and a generation of users learned an expensive lesson in a single week: an IOU from a custodian is only as good as the custodian. "Not your keys, not your coins" stopped being a slogan traded among enthusiasts and became a design requirement for anyone serious about building in this industry.

The lesson was real. The problem is that self-custody, as it existed then, was too hard for most people to actually use. Closing that gap — making self-custody *safe enough to be the default* — is one of the most important pieces of consumer-infrastructure work of the decade.

## "Not your keys" stopped being a slogan

The failures that have cost users the most were rarely trading failures. They were **custody** failures: commingled funds, careless key management, obligations that quietly outran reserves. Self-custody removes that entire category of risk by removing the custodian — there is no third-party balance sheet whose collapse can take your assets with it. That is the whole argument, and it is a good one.

## But self-custody had a usability problem

The reason most people stayed custodial anyway was not ignorance; it was friction. Twelve-word seed phrases you must never lose and never expose. One irreversible mistake between you and your money. No "forgot password," no support line, no undo. For the vast majority of people, that is not freedom — it is a trap with the door left open. If self-custody is going to be the default, it cannot demand that everyone become their own security engineer.

## The technology got dramatically better

The good news is that the years since 2022 produced exactly the primitives self-custody needed:

- **Smart accounts (account abstraction).** Standards like **ERC-4337**, and more recently **EIP-7702**, let a wallet be a programmable smart account rather than a bare keypair — enabling spending limits, session keys, gas sponsorship, and **social recovery** (regain access through trusted parties or devices instead of a single fragile phrase).
- **Privacy primitives.** **Stealth addresses** (ERC-5564, from Vitalik Buterin's canonical design) let a recipient receive funds to a fresh one-time address so their activity is not trivially linkable on a public chain. The approach is powerful but not free — a freshly generated stealth address holds no balance and cannot pay its own transaction fee, one of several rough edges the ecosystem is still smoothing (adoption tools like Umbra have generated tens of thousands of stealth addresses, but the gas-funding and recovery ergonomics remain hard).

The honest summary: the cryptography is largely solved; the **ergonomics** are the frontier.

## Making it safe enough to be the default

This is where PRV Wallet does its hardest work. The design goal is not "usable by crypto natives." It is "usable by your family":

- **Sane recovery** so a lost device is an inconvenience, not a catastrophe.
- **Sensible defaults** that make the safe path the easy path.
- **An assistant that helps without ever holding the keys** — guidance and automation at the interface, self-custody preserved underneath.

Privacy where it counts, keys derived and encrypted on-device, and recovery a normal person can actually perform: that combination is what turns "self-custody" from a principle into a product.

## Why "default" matters

Defaults decide outcomes. If self-custody is the hard path and custody is the easy one, most people will keep handing their assets to a third party and re-learning 2022's lesson the hard way. Flip the default — make self-custody the safe, obvious choice — and you change the risk profile of the entire ecosystem, one wallet at a time.

> "Not your keys, not your coins" became a design requirement. The work now is making self-custody safe enough that everyone chooses it.

*PRV Wallet is in development. This piece describes design principles and the state of the underlying technology, not a live feature set.*

---

### Notes & sources

Technical references are to established standards and primary explainers: ERC-4337 and EIP-7702 (account abstraction / smart accounts) and ERC-5564 with Vitalik Buterin's stealth-address explainer (2023). The described limitations (stealth-address fee funding, recovery ergonomics) are well-documented open problems. The post-2022 shift toward self-custody is described qualitatively; specific market-share figures vary by source and are not asserted here.
