# Contributing

Thank you for looking. A few things worth knowing before you spend time on a change.

## How this repository is produced

The workflows here are **generated**, not drawn. They are built and tested in a private working
repository and exported into this one, which is why every Code node carries a bundled library and a
short adapter rather than hand written logic.

That has a consequence for pull requests: a change made directly to a JSON file here will be
overwritten by the next export. **Open an issue describing the behaviour first.** If we agree on it,
the change lands upstream and arrives here in the following release, credited to you.

Changes to the documentation, the sheet templates and the checks in `scripts/` are ordinary pull
requests and very welcome.

## Two properties that must not regress

**The verdict is deterministic.** Given the same reading and the same specification it returns the
same verdict, in the same order, forever. No clock, no randomness, no locale, no network and no
model anywhere in that path. A rejected lot is a commercial argument, and the answer has to
reproduce when somebody asks six months later why the sample failed.

**The model reads, it does not decide.** It turns a photographed grading sheet or a typed message
into named values with a confidence on each. Anything that would let it produce a pass or a fail is
out of scope, however convenient.

If a proposal needs either of those to bend, it is a different project and worth being honest about
that rather than arguing the edges.

## Accurate scope

This screens a sample against thresholds somebody typed into a store. It is not a LIMS, not a
traceability system, and it does not know whether your thresholds are defensible. Wording that
implies otherwise will be edited.

## Reporting a bug

Most useful with: which workflow, what the register row and the decision log said, what you
expected, and what happened. If a verdict looks wrong, include the specification rows and the
extracted values, because between them they determine the answer completely.
