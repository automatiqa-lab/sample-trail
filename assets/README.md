# Screenshots

Real captures only. Nothing here is a mock up, and nothing here should show an address, a chat id,
an instance hostname or a table id.

Drop files in with exactly these names. The README wires them in once they exist, never before: a
link to a missing file renders as a broken image on the repository front page, which reads worse
than no picture at all.

## In the repository now

| File | What it shows | How it was made |
|---|---|---|
| `arrival-notice.png` | The message a grader replies to | captured, nothing redacted |
| `needs-review.png` | A refused verdict, no buttons offered | captured, chat id blocked out |
| `command-new.png` | The bot answering /new | captured, hostname blocked out |
| `canvas-notify.png` | The notice flow on the canvas | captured, four workflow ids blocked out |
| `form-dispatch.png` | The dispatch form, filled in | rendered headless, no browser chrome to redact |
| `form-arrival.png` | The arrival form, id prefilled from the QR | same |

The two forms were captured with headless Chrome against the live instance, with the fields
filled through the same query parameter mechanism the QR uses. Real pages, real values, and no
URL bar to leak a hostname.

Redaction is a solid block, never a blur. At this text size a blur is often still legible.

## Still wanted

| Filename | What to capture | Redact before saving |
|---|---|---|
| `canvas-evaluation.png` | The assessment flow on the n8n canvas, with the model boundary sticky note in shot | The instance hostname in the browser bar. Crop the chrome |
| `form-dispatch.png` | The dispatch form, filled in or empty | The URL bar |
| `form-arrival.png` | The arrival form opened from the QR, **sample id already filled in** | The URL bar. The prefilled id itself is fine, it is fictional |
| `email-qr.png` | The dispatch email with the QR inline | To and From lines, **and the QR itself** |
| `verdict-card.png` | A verdict card with the three decision buttons | The "Assessed by" line if it shows a number rather than a name |
| `stamped-decision.png` | A card after a decision: buttons gone, outcome and decider stamped | The note link beneath it carries the hostname |

## The QR is not a picture

It encodes `https://your-instance/form/sample-receipt?sample_id=…`, so publishing a screenshot of one
publishes the hostname in a form anyone can scan. Cropping the email header does not deal with that.

Either cover the QR with a solid block before saving, or leave it and accept that the instance
address is public. Blurring is not enough at that size; the error correction in a QR code recovers
from a surprising amount of damage.

## What every capture should avoid

An email address, a chat id, a table id, a workflow id, an instance hostname anywhere including a
browser bar, and a real counterparty name. The seeded data is fictional on purpose, so a capture
taken against the seed is safe on all but the last two.
