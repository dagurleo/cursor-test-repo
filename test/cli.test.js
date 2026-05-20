import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("cli renders a report from the fixture file", () => {
  const result = spawnSync(
    process.execPath,
    ["src/cli.js", "--file", "data/tasks.json", "--date", "2026-05-20", "--capacity", "2"],
    {
      encoding: "utf8",
    },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /^# Task Forge Board/);
  assert.match(result.stdout, /- Total tasks: 6/);
  assert.match(result.stdout, /1\. TF-101: Sketch onboarding checklist/);
  assert.match(result.stdout, /2\. TF-105: Create weekly board summary/);
});
