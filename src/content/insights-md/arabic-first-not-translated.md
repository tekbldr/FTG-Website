There is a quiet assumption baked into most AI products: that the world's languages are dialects of English waiting to be translated. Build the model in English, bolt on a translation layer, and call it multilingual. For a language like Arabic — spoken by hundreds of millions of people across more than twenty countries — that assumption is not just lazy. It produces systems that are subtly, persistently wrong.

We build Arabic-first because Arabic is a design constraint, not a translation target.

## Translation is not understanding

Arabic is genuinely hard for machines, in ways that translation cannot paper over:

- **Diglossia.** The written standard (Modern Standard Arabic) and the spoken dialects — Gulf, Egyptian, Levantine, Maghrebi and more — differ enough that a model fluent in one can be lost in another. A person in Riyadh and a person in Casablanca write "the same" language and speak very different ones.
- **Rich morphology.** Arabic packs enormous meaning into word structure — roots, patterns, prefixes and suffixes — so a single written form can carry what English needs a whole phrase to say. Tokenizers built for English fracture this badly.
- **Script and diacritics.** Right-to-left rendering, optional short-vowel diacritics that change meaning, and letters that shift shape by position all trip up systems trained on Latin text.

None of this is solved by translating outputs. It has to be learned from the language itself, at the level of pretraining data and architecture.

## The region is building models from the ground up

The meaningful shift of 2025–2026 is that Arabic models are increasingly built *from scratch*, not adapted from English base models:

- **Jais 2** (Inception, a G42 company, with Cerebras and MBZUAI, December 2025) is a 70-billion-parameter model **pretrained from scratch on roughly 2.6 trillion tokens** — a deliberate departure from earlier Arabic models that fine-tuned a Western base.
- **Falcon-H1 Arabic** (Abu Dhabi's TII, January 2026) uses a hybrid Mamba-Transformer architecture across 3B/7B/34B sizes with context up to 256K tokens.
- **ALLaM** (Saudi Arabia's SDAIA) makes the field genuinely competitive.

We report these as what they are — real, frontier-scale Arabic models — while deliberately *not* refereeing the "world's leading Arabic model" claims that accompany them. Those are vendor and single-leaderboard superlatives, contested across benchmarks. The important fact is structural: the region now treats Arabic as a first-class training objective.

## Sovereignty is residency, not just language

"Arabic-first" is half the story. The other half is **where the data lives and where the model runs.** For governments, regulated industries, and privacy-conscious users in the Gulf, data residency is increasingly a requirement, not a preference — and the regional build-out of domestic compute (from Saudi Arabia's HUMAIN program to the UAE's Stargate campus) is what makes region-resident AI practical at scale.

A fair caveat we hold ourselves to: "sovereign AI" is an ambition, not a settled state — today's regional compute still depends on globally sourced hardware and export policy. We use the word to describe a direction of travel, not a finished condition.

## What Arabic-first means for how we build

PRVAI, the group's AI arm, takes a deliberate position: **rent the best foundation models; own the durable layer above them** — voice, memory, and orchestration. Arabic-first is expressed less in which base model we use in any given month and more in the layer we own:

- **Voice and dialect** handled as first-class inputs, not afterthoughts.
- **Memory** that respects residency and privacy by design.
- **Orchestration** that can route to whichever model — Arabic-native or otherwise — is best for the task, without leaking the durable context that makes the assistant *yours*.

Its flagship, **Diwan OS**, is designed as an Arabic-first lifecycle operating system on exactly that principle: one agent, many jobs, one memory.

> Arabic is not a translation target; it is a first-class design constraint.

Region-grade AI is not English AI with an accent. It is built for the language, the culture, and the law — and increasingly, it is built where those things live.

---

### Notes & sources

Model specifications are as stated by the developers: MBZUAI/Inception/Cerebras (Jais 2, Dec 2025) and TII (Falcon-H1 Arabic, Jan 2026); ALLaM is SDAIA's Arabic model. Performance superlatives are attributed to those developers, not independently endorsed here. Compute references (HUMAIN, Stargate UAE) are announced, forward-looking programs.
