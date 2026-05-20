# Agent Exercise Scenarios

These are intentionally PR-sized. Each one should touch code, tests, and
possibly docs.

## Scenario 1: Filter Reports by Tag

Add `--tag <tag>` to the CLI so the report can focus on tasks with a single
tag. Update `renderBoardReport` or its call site in the smallest clean way, and
cover the behavior with tests.

Acceptance criteria:

- `rtk node src/cli.js --tag reporting` only reports matching tasks.
- Existing report output stays unchanged when no tag is provided.
- Tests cover the new CLI behavior.

## Scenario 2: Show Owners in Sprint Suggestions

Sprint suggestions currently show id, title, priority, and due date. Add the
owner to each suggestion.

Acceptance criteria:

- Report output includes the owner for suggested sprint tasks.
- Existing summary counts remain unchanged.
- Tests assert the new Markdown format.

## Scenario 3: Validate Date Shapes

Fixture validation checks task consistency but does not validate date string
shape. Add basic `YYYY-MM-DD` validation for `dueDate` and ISO timestamp
validation for `createdAt` and `completedAt`.

Acceptance criteria:

- Invalid date shapes fail `rtk node scripts/validate-fixtures.js`.
- Valid null dates are still allowed.
- Tests or fixture validation coverage explain the expected rules.

## Scenario 4: Add a CSV Export

Add a tiny exporter that turns tasks into CSV rows for spreadsheet import.

Acceptance criteria:

- The exporter escapes commas and quotes correctly.
- A test covers at least one quoted field.
- The CLI can emit Markdown by default and CSV with a flag.
