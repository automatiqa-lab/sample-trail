# Sample Trail

A sample management workflow for the agri-food and soft-commodities sectors - coffee, cocoa, grain, sugar, cotton - where a lot is bought and sold on the strength of a sample somebody has to approve.

Part of [Automatiqa Lab](https://www.automatiqa.io/sample-trail/) - open-source experiments where operations meet the algorithm.

## What it does

It runs the quality approval decision on a physical sample, from dispatch to verdict, on the phone the person is already holding.

| Stage | Surface | What happens |
|---|---|---|
| Dispatch | Form | Sample ID, contract ref, origin, photo. QR generated, row created, receiver notified |
| Receipt | QR to prefilled form | Condition photo, arrival timestamp. SLA clock starts |
| Evaluation | Telegram | Voice note or photo of the paper cupping sheet in, structured fields out |
| Verdict | Rule | Deterministic comparison against contract specification. Pass, fail, borderline |
| Decision | Telegram | Approve, reject, re-sample. Human, timestamp and reason written back |
| Chase | Schedule | Overdue nudge plus a weekly digest: throughput, approval rate, time to decision |

## What it is not

A quality-approval workflow, not a LIMS and not a traceability system. It does not track where a sample physically is. There is no barcode estate, no scanner and no app to install - the QR opens the camera already on the phone, and that is the whole intake surface.

What it keeps is the decision record: which sample, against which contract specification, judged by whom, and on what evidence. That is the part someone has to defend six months later to a counterparty or an auditor, and the part that is usually missing.

## Design decisions

**Mobile-first**, because samples in this trade are handled by graders, cuppers and warehouse staff in sample rooms, on quays and at origin, where the device to hand is a phone rather than a desk.

**n8n form trigger and Telegram**, because neither needs vendor approval or a paid account. A channel that requires a business-account review makes the template uninstallable for whoever forks it.

**State in a sheet**, one row per sample, because the lifecycle runs for days or weeks and an event-driven engine forgets. Moving the store to Postgres is a one-node change.

**The model does exactly two jobs** - turning a voice note or a photographed cupping sheet into named fields, and drafting the covering text of a rejection. It never issues the verdict. That comes from a deterministic comparison against the contract specification, because someone defends it later.

## Status

Work in progress, roughly half-built. The lifecycle, the channel choices and the model boundary are settled; the workflows themselves are in progress. It ships as an n8n template once the lifecycle runs end to end.

Project page: [automatiqa.io/sample-trail](https://www.automatiqa.io/sample-trail/). Build logs: [automatiqa.io/tag/build-log](https://www.automatiqa.io/tag/build-log/).

## License

MIT.
