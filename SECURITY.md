# Security

## Reporting

Email **aleks@automatiqa.io**. Please do not open a public issue for a vulnerability.

Expect an acknowledgement within a few days. This is a lab project maintained by one person, so
there is no formal SLA, and I would rather tell you that than publish one I cannot keep.

## What this handles

Sample Trail touches commercially sensitive material: contract references, counterparty names and
addresses, quality readings, and photographs taken inside a sample room. It runs entirely inside the
deployer's own boundary. There is no hosted component, no telemetry, and nothing is sent anywhere
except to the services the deployer configures: their own store, their own chat, their own mail, and
the model endpoint they choose.

## What a deployer is responsible for

**The forms are public.** Anyone who can reach the dispatch or arrival URL can submit to them. They
are unauthenticated by design, because a QR on a bag has to open on a phone with no login. Put them
behind whatever your situation warrants before real samples run through them.

**The chat is the access control.** Anyone in the chat can press a decision button. The decider is
recorded from whoever pressed it and cannot be forged by typing somebody else's name, so the record
stays honest, but membership of that chat is the boundary.

**Notices leave the building.** One node sends mail to a counterparty, and it runs only after a
person has read the text and pressed Submit. Do not automate around that.

**The model sees what you send it.** A photographed grading sheet goes to the endpoint configured in
Settings. Point it somewhere your data may go.

## What is deliberately absent

No credentials are committed to this repository, and no instance identifiers: table ids, chat ids
and the base URL are placeholders. A check in CI fails the build if any of them reappear.
