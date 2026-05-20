# Task Forge Agent Playground

Task Forge is a deliberately small JavaScript project for agents to practice
real repository workflows: reading unfamiliar code, making focused changes,
running tests, and preparing pull requests.

The project models a lightweight task board. It has source code, fixtures,
tests, a CLI, docs, and GitHub templates without requiring any package
installation.

## Quick Start

```bash
rtk node --test
rtk node scripts/validate-fixtures.js
rtk node src/cli.js --file data/tasks.json
```

If you prefer package scripts:

```bash
rtk npm test
rtk npm run validate
rtk npm run report
```

## What Agents Can Practice

- Find and explain the board domain model.
- Add a filter or reporting feature.
- Extend fixture validation.
- Write or adjust tests.
- Draft a tidy pull request from a small change.

Suggested exercises live in [docs/scenarios.md](docs/scenarios.md).

## Project Map

- [src/task-board.js](src/task-board.js) contains task normalization,
  filtering, summaries, and sprint planning.
- [src/report.js](src/report.js) renders a Markdown board report.
- [src/cli.js](src/cli.js) exposes the report generator as a command.
- [data/tasks.json](data/tasks.json) is the canonical fixture file.
- [test/](test/) covers behavior with Node's built-in test runner.
- [scripts/validate-fixtures.js](scripts/validate-fixtures.js) checks fixture
  shape and consistency.

## Design Constraints

- No runtime dependencies.
- Node 22+.
- Deterministic output where possible.
- Small modules with obvious seams for PR-sized improvements.
- Code modification events are emitted when tracked files change; a
  documentation-only edit is enough to exercise that path.
