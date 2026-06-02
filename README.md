# Task Forge: Agent Playground With Sparks

Task Forge is a deliberately small JavaScript project with just enough shine
for agents to practice real repository workflows: reading unfamiliar code,
making focused changes, running tests, and preparing pull requests.

The project models a lightweight task board. It has source code, fixtures,
tests, a CLI, docs, and GitHub templates without requiring any package
installation.

## Why It Exists

Think of this repo as a compact workshop bench for agent experiments. The parts
are small, the tests are deterministic, and the whole thing is meant to be easy
to understand before making a tidy pull request.

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

## Landing Page

This repository includes a static [landing page](index.html) for GitHub Pages.
The page supports light and dark themes, with a header switcher that remembers
the visitor's choice and falls back to their system preference on first load.
To publish it, open the repository settings on GitHub, go to **Pages**, choose
**Deploy from a branch**, select the default branch, and set the source folder
to `/ (root)`.

## Tiny Code Spells

Fake examples for the vibe:

```js
import { forgeBoard, summonSprint } from "./src/task-board.js";

const board = forgeBoard({
  mood: "focused",
  tasks: ["read", "patch", "test", "ship"],
});

console.log(summonSprint(board, { velocity: "responsible" }));
```

```bash
rtk node scripts/validate-fixtures.js --strict --sparkle
rtk node src/cli.js --file data/tasks.json --format cosmic-markdown
```

```md
## Pull Request Energy

- Clear scope
- Passing checks
- Notes future agents can trust
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
