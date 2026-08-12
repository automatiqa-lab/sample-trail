# Changelog

## 0.1.0

First public release. Seven workflows: a store, and one per flow.

- Dispatch mints a sample id, looks up the contract specification, and returns a QR that opens the
  arrival form with the id already in it.
- Arrival starts the assessment clock and asks a grader for a reading.
- Assessment reads a photographed grading sheet or typed text into the named parameters the
  contract states, with a confidence on each.
- The verdict is a deterministic comparison: pass, borderline, fail, or needs review when something
  was not stated or was read with low confidence. No clock, no randomness, no model.
- A person decides. The decision, the decider and the timestamp are written, and the card is stamped.
- An optional form composes a covering note from the verdict and emails the counterparties, after a
  person has read it.
- A daily scan nudges overdue samples and sends a weekly digest.

Three storage connectors behind every storage point, chosen at run time from whatever is
configured: Excel 365, Google Sheets, and n8n Data Tables as the fallback that needs no credential.
