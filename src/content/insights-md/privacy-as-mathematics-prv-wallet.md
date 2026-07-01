Most products treat privacy the way a restaurant treats a promise to wash its hands: a sign on the wall, an assurance of good intent, a thing you are asked to take on faith. The privacy policy is a pledge that the company will behave, and pledges are only ever as good as the trustworthiness — and the solvency — of whoever makes them. When the company is acquired, or breached, or simply changes its mind, the pledge evaporates and your data does not.

PRV Wallet is built on a different foundation, and the difference is not marketing. It is the difference between privacy you are *promised* and privacy that is *true* — properties that hold because of how the system is constructed, not because of how a company chooses to act on a given Tuesday. We call it privacy as mathematics.

## The problem is not new, it is just usually ignored

The most expensive failures in this industry were failures of the "trust us" model. Customers handed their assets to a custodian, took the promise on faith, and discovered — with Mt. Gox, with FTX, with a long list of smaller collapses — that a promise is not a reserve and a policy is not a lock. The pattern is always the same: someone else held the thing that mattered, and their failure became your loss. Privacy has the identical structure. If a company holds your keys and your data and merely *promises* to protect them, you have not been given privacy. You have been given a counterparty.

The fix, in both cases, is to remove the counterparty.

## Non-custodial by default

So the first principle is the oldest one in this industry and the most routinely ignored: your keys, your coins. PRV Wallet is non-custodial by default. The group never takes possession of user funds, which means there is no honeypot for an attacker to breach, no balance sheet to commingle, and no counterparty whose insolvency can take your assets down with it. Self-custody does not manage the risk that destroyed the custodians. It deletes it, by deleting the custodian.

## Keys are mathematics, and they stay on your device

A wallet is, underneath the interface, key management. In PRV Wallet the keys are derived and encrypted on the device, where you are, not on a server you are asked to trust. This is the concrete thing that makes "non-custodial" more than a word: there is no privileged copy of your keys sitting somewhere else, waiting to be subpoenaed, leaked, or sold in an acquisition. The cryptography that controls your assets lives with you.

## Privacy where it counts, provable rather than blanket

Absolutism helps no one, and a wallet that makes every action maximally private makes some of them impossible. The design principle is provable privacy where it counts — using zero-knowledge techniques and confidential-transaction approaches so a user can demonstrate what genuinely needs demonstrating without exposing everything else. The goal is not a vague pledge of secrecy. It is that specific, sensitive operations carry privacy as a mathematical property, applied deliberately, that anyone can reason about rather than take on faith.

## The hard part is making it usable

Self-custody has historically failed on ergonomics, not philosophy. Seed phrases get lost. One mistake is unforgiving. For most people that is not sovereignty; it is a trap with the door left open, and it is the reason so many stayed custodial even after watching the custodians fail. So the real, worthwhile engineering is making self-custody safe enough for people who are not security engineers — sane recovery so a lost device is an inconvenience rather than a catastrophe, sensible defaults that make the safe path the easy path, and an assistant that helps without ever holding the keys. The bar is not "usable by crypto natives." The bar is "usable by your family."

## Why this is infrastructure, not a preference

As money becomes machine-readable and agents begin to act on our behalf, the wallet becomes the place where the most sensitive facts about a person — what they own and what they do with it — are either exposed or protected. That makes privacy a piece of infrastructure rather than a setting, and infrastructure has to be engineered into the foundation, because you cannot convincingly add it later.

> Non-custodial by default, keys derived and encrypted on-device, zero-knowledge where it counts. Privacy has to be provable, not promised.

The industry has run the experiment on the "trust us" model, repeatedly, at enormous cost. We would rather build on the thing that does not depend on anyone keeping their word.

*PRV Wallet is in development. This piece describes design principles, not a live feature set.*
