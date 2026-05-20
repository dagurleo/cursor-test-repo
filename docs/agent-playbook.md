# Agent Playbook

Use this repository for focused coding exercises. A good change should be easy
to explain, covered by tests, and small enough for a readable pull request.

## Recommended Workflow

1. Read [README.md](../README.md) and the relevant source files.
2. Run `rtk node --test` and `rtk node scripts/validate-fixtures.js`.
3. Pick one scenario from [scenarios.md](scenarios.md).
4. Change the smallest useful surface area.
5. Add or update tests.
6. Re-run the checks.
7. Summarize the change, tests, and any tradeoffs in the PR.

## Review Checklist

- Does the code preserve deterministic output?
- Are fixture changes validated?
- Does the CLI still work without dependencies?
- Did tests cover the behavior that changed?
- Is the README or scenario documentation still accurate?
