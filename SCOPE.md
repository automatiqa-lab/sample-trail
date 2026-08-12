# Scope and limits

The honest list. Read it before pointing this at anything that matters.

## What it is

A quality approval workflow for a physical commodity sample: dispatch, arrival, assessment,
verdict against a contract spec, and a decision made by a named person. It runs on n8n with a
spreadsheet as the system of record.

## What it is not

**Not a LIMS.** No instrument integration, no chain of custody, no accreditation support.

**Not a traceability system.** It does not track where a sample physically is. There is no
barcode estate and no scanner. The QR at dispatch opens a form on the phone that is already in
somebody's hand, and that is the whole intake surface.

**Not a grading standard.** The spec library holds whatever thresholds you put in it. Nothing here
knows what a defensible threshold is for your contract, your commodity or your origin.

**Not a substitute for the contract.** A verdict is a comparison against numbers somebody typed
into a sheet. If those numbers do not match the contract, the verdict is wrong in a way no code
can catch.

## Known limits

**The spreadsheet is the ceiling.** One row per sample, read and written by every flow. It is
fine for the volume a sample desk actually does and it will not hold up under thousands of
concurrent writes. Move to a database before that becomes interesting.

**Nothing authenticates the person.** Whoever can reach the form can log a receipt, and whoever is
in the chat can press a decision button. The decider's handle is recorded from the message sender
rather than typed, so the record is honest about who pressed it, but the chat membership is the
access control. That is a deliberate template level simplification and it is the first thing to
fix in a real deployment.

**Transcription quality is the input quality.** A voice note recorded on a quay in wind will read
badly. The confidence gate catches the worst of it and routes the sample to a person; it does not
turn a bad recording into a good reading.

**The model can be confidently wrong within its confidence.** A number stated clearly and heard
wrongly passes the gate. The transcript is kept on the row precisely because that is the thing to
check when a verdict is questioned.

**There is no calibration loop.** Nothing measures whether extraction accuracy drifts when a
provider changes a model. For a template, the mitigation is that the verdict is deterministic:
a changed model changes what was read, never how it was judged.

**The QR prefill only works on a production URL.** On a test URL the receipt form renders empty
and looks broken. This is n8n behaviour, not a bug in the workflow.

**No retention policy.** Photos, voice notes and transcripts accumulate wherever the operator
points the workflow. Decide how long you keep them before you start.

## What is wired but not running

**Voice notes.** The branch exists and is inert. Transcription is a different service from the one
that reads the text, and with no `transcription_url` set the workflow says so and asks for a photo
or typed readings rather than guessing at a recording it cannot hear. Set the endpoint and the
model in the Settings node and the branch comes alive: anything that takes a file and returns text
fits. Nothing else changes, because a transcript is read by the same prompt as a typed message.

**Photographs are recorded, not stored.** A dispatch or arrival photo arrives as binary and the row
records its file name. There is no upload node, so `dispatch_photo` and `receipt_photo` are not
links. Add a storage node after the form and write its URL into the same column: the schema already
has the field, and nothing else reads it.

**Rejection reasons.** A rejection writes the decision, the decider and the timestamp, and leaves
`decision_note` empty. The build spec asks for a prompted reason, which needs a second conversation
state on a channel that deliberately has none. Type it into the row, or wait for v2.
