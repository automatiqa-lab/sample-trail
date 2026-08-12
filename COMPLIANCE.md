# EU AI Act compliance - Sample Trail

Not legal advice. This file records how Sample Trail meets its transparency obligations, and why.
It is the project's defence file: every entry is dated, and its history is in git.

Contact for compliance and incident reports: aleks@automatiqa.io

## Role classification

**Sample Trail is a template publisher, and whoever runs it is the deployer.** The lab publishes a
workflow definition and the library behind it; it operates no instance and holds no key. Running it
means importing the workflow into your own n8n, pointing it at a model endpoint you contract for,
and putting your own samples through it. That makes the operator the deployer under Art. 50(4), and
the lab the provider of a component rather than of a system placed on the market. Because the
template ships with marking on by default, the operator's laziest path is the compliant one, and
the Art. 50(2) obligation is met at the point of publication rather than left to whoever installs
it.

Recorded 2026-08-11.

## Obligations that apply

| Obligation | Applies | How this project meets it |
|---|---|---|
| Art. 50(1) interaction disclosure | yes, narrowly | The person assessing a sample sends a voice note to a chat and a model transcribes it. The bot states that a model reads the evaluation and that the verdict is a fixed rule, in the message that asks for the recording. |
| Art. 50(2) machine-readable marking | yes | The transcript and the extracted values are model output. They travel with an `ai_generated` envelope per `automatiqa-disclosure/1` and a readable line on the verdict card. See the open item below. |
| Art. 50(4) deployer disclosure | deployer-side | See "What remains the deployer's job" |
| Art. 4 AI literacy | yes | This file, the README section on where a model is used, and `docs/scope-and-limits.md` |
| Art. 5 prohibited practices | screened | No biometric categorisation, no emotion inference, no social scoring, no manipulation of a natural person. The system reads a quality evaluation and applies thresholds from a contract. |
| Annex III high-risk | no | See screening below |

## Annex III screening

Considered and rejected, with the near-misses named rather than waved off.

**Essential private services (Annex III 5(b)).** The nearest miss. A verdict can influence whether
a lot is bought and therefore whether a supplier keeps supplying, which touches commercial access.
It falls outside because the assessment is of a physical sample against contract thresholds, not of
a person's creditworthiness or entitlement; the subject is a lot and a legal entity rather than a
natural person; and no automated decision restricts access to anything. A failed sample produces a
card that a named person then decides on.

**Employment (Annex III 4).** Not touched, and worth stating why it could look otherwise. The
register records who assessed each sample and who decided it. Those fields exist so the record is
attributable, not so anybody is scored: nothing aggregates them, ranks them or feeds them into an
evaluation of a worker. Using them that way would be a change of purpose that puts the deployer in
Annex III 4, and it is called out here so nobody drifts into it by adding a chart.

**Critical infrastructure (Annex III 2), justice, migration, law enforcement, education.** Not
touched.

The system generates no synthetic image, audio or video, so the deep-fake limb of Art. 50 does not
fire. Text is the only generated modality.

Screened 2026-08-11. Re-run on any change of purpose or new modality.

## What this project does out of the box

The boundary is the evaluation step, and it is the only place a model touches the workflow. What
crosses it is a transcript and a set of named values, both of which land on a shared row and travel
onward into a chat message.

Two channels, both required, neither sufficient alone:

- A readable line on the verdict card stating that the reading was transcribed by AI and that the
  verdict is a fixed rule.
- An `ai_generated` envelope carried with the row, per `automatiqa-disclosure/1`, with
  `scope: ["transcript", "extracted_values"]` and a review state that flips from `unreviewed` to
  `accepted` when a person presses a decision button.

Marking schema: `automatiqa-disclosure/1`, wording from the lab convention, version 2.

**Open at GATE 1.** The register schema in the build spec carries no disclosure column, and the
spec forbids adding anything outside it. The column and the card line are therefore proposed rather
than built, and are the first item in the open list at the foot of `docs/data-model.md`. Nothing
ships until that is settled, because a template that publishes model output unmarked is exactly the
thing this file exists to prevent.

## Carve-outs, and why

**The verdict is not marked, and must not be.** It is computed by a deterministic comparison
against thresholds a person typed into a spreadsheet. No model contributes to it, no model can
change it, and the build fails if the code behind it ever reads a clock or a random source. Marking
it as AI-generated would be false, and it would train people to ignore the label where it is true.

**The decision is not marked.** It is a person pressing a button, recorded under their own handle.

**Seed data is not marked.** It is invented by hand and stated as fictional in `sheets/README.md`.

## What remains the deployer's job

- Disclose to the people who use it. Whoever speaks into the bot should know a model transcribes
  what they say. The template ships that line; do not delete it.
- Keep the marking intact. A workflow that rebuilds the row and drops the `ai_generated` field
  breaks detection, and the obligation then sits with you.
- Authenticate your surfaces. Anyone who can reach the form can log a receipt and anyone in the
  chat can press a decision button.
- Decide your retention. Voice notes, photographs and transcripts accumulate wherever you point the
  workflow.

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-08-11 | Template publisher, operator is deployer | The lab runs no instance and holds no key |
| 2026-08-11 | Art. 50(1) applies narrowly, at the chat surface | A person speaks into a channel and a model reads it, which is close enough to an interaction to disclose rather than argue about |
| 2026-08-11 | The verdict is never marked as AI-generated | It is deterministic, and a false label devalues a true one |
| 2026-08-11 | The disclosure column is proposed, not built | The build spec gates schema changes at GATE 1 |
