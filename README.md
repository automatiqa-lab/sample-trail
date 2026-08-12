# Sample Trail

A sample management workflow for the agri-food and soft-commodities sectors - coffee, cocoa, grain,
sugar, cotton - where a lot is bought and sold on the strength of a sample somebody has to approve.

Part of [Automatiqa Lab](https://www.automatiqa.io/sample-trail/) - open-source experiments where
operations meet the algorithm.

## What it does

It runs the quality approval decision on a physical sample, from dispatch to verdict, on the phone
the person is already holding.

| Stage | Surface | What happens |
|---|---|---|
| Dispatch | Form | Sample id, contract reference, origin, photo. QR generated, row created, receiver notified |
| Arrival | QR to a prefilled form | Condition photo, arrival timestamp. The clock starts |
| Assessment | Chat | A photo of the paper grading sheet, or the readings typed out, becomes named values |
| Verdict | Rule | Deterministic comparison against the contract specification. Pass, fail, borderline |
| Decision | Chat | Approve, reject, re-sample. Human, timestamp and reason written back |
| Notice | Form | A covering note to the shipper and the customer, after a person has read it |
| Chase | Schedule | Overdue nudge plus a weekly digest: throughput, approval rate, time to decision |

## What it is not

A quality-approval workflow, not a LIMS and not a traceability system. It does not track where a
sample physically is. There is no barcode estate, no scanner and no app to install: the QR opens the
camera already on the phone, and that is the whole intake surface.

What it keeps is the decision record. Which sample, against which contract specification, judged by
whom, on what evidence, and who was told. That is the part someone has to defend six months later to
a counterparty or an auditor, and the part that is usually missing.

`SCOPE.md` is the honest list of what it does not do and where it breaks.

## Three decisions that hold the rest together

**The spec is rows, not columns.** Moisture matters everywhere; a bean count matters for one crop,
an oil content for another, a staple length for a third. The Spec Library holds one row per quality
parameter, and the workflow reads whatever is there. Adding a parameter is a row, never a code
change, and the extraction prompt is built from those rows so the model is asked for the parameters
this contract actually states.

**The model reads. It does not decide.** It turns a photographed grading sheet or a typed message
into named values with a confidence on each, and stops there. The verdict is a Code node with fixed
rules, because a rejected lot is a commercial argument and it has to reason identically every time.
Swap the model and the verdicts do not move.

When the model cannot read a value, the card says so: the parameter is reported as not stated, the
sample is parked at `needs_review`, and **no decision buttons are offered at all**. Approving a
reading that was never scored is how an unreviewed sample gets waved through, so the workflow
refuses to offer the option.

**State lives in a store.** The lifecycle runs for days or weeks and an event-driven engine forgets
between events. One row per sample, one status column, written and never inferred, with every
illegal transition refused rather than silently overwritten.

## The store, and why there are three of them

Every storage point asks the same question first: which store is configured?

| Setting | Store |
|---|---|
| `workbook_id` | Excel 365, workbook on OneDrive |
| `spreadsheet_id` | Google Sheets |
| neither | n8n Data Tables |

Data Tables are the fallback and need no credential at all, so this runs the moment you import it.
Connect Excel or a spreadsheet later by putting its id in the Settings node. That is the whole
migration.

A connector nobody has configured ships **disabled**, because n8n will not publish a workflow with a
live node whose credential is missing. Connecting one is two steps: add the credential, enable that
lane.

## Installing it

1. Import all seven files from `workflows/`. Import `00-store.json` first.
2. Open the three **Execute Workflow** nodes and point them at your copy of `Sample Trail - store`.
   They ship with a placeholder rather than an id, because an id would be ours.
3. Create the store. Four tables, or a spreadsheet with four tabs: **Sample Register**, **Spec
   Library**, **Decision Log**, **Counterparties**.

   For n8n Data Tables, which need no credential, run the setup script rather than typing fifty
   three column names by hand:

   ```bash
   N8N_URL=https://your-n8n N8N_API_KEY=... node setup.js
   ```

   It creates the four tables, seeds the specification library with four worked examples, prints
   the ids you need for step 5, and changes nothing on a second run. No dependencies.

   For a spreadsheet, import `sheets/*.csv`, one per tab, headers included.
4. Put your quality parameters in the Spec Library, one row per parameter.
5. Fill in the Settings node of each flow: the table ids, your chat id, the base URL of your
   instance, and how long a grader has.
6. Attach a chat credential, a model credential, and a mail credential if you want emailed copies.
7. Enable the chat trigger in `03-evaluation`. It ships disabled because enabling it repoints your
   bot's webhook.

## The specification

One row per quality parameter, keyed by `spec_id`:

| Column | Meaning |
|---|---|
| `param` | the field name the model is asked for |
| `label`, `unit` | how it appears on the verdict card |
| `check` | `numeric` or `absent` |
| `direction`, `threshold` | for a numeric check: `min` or `max`, and the number |
| `values` | for an absent check: the comma separated list |
| `tolerance_pct` | the borderline band, in percent of the threshold |
| `required` | `no` means a sample is not held up when the value is not stated |

Two kinds of check cover what a quality clause says. A **numeric** check compares a measured value
against a threshold in one direction. An **absent** check names a condition that must not be present
at all, and no tolerance band applies to something the contract excludes by name.

A row nobody can read stops the verdict. `threshold: 12-14` produces `needs_review` with the cell
quoted back, rather than a default that would invent a contract term.

## Licence

MIT. The engine is developed and tested in a private working repository; what ships here is the
result, and the workflows are generated from it rather than drawn by hand.
