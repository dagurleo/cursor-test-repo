import assert from "node:assert/strict";
import test from "node:test";
import { renderBoardReport } from "../src/report.js";

test("renderBoardReport produces deterministic markdown when date is provided", () => {
  const report = renderBoardReport(
    [
      {
        id: "R-1",
        title: "Write report",
        status: "todo",
        priority: "high",
        owner: "eli",
        tags: ["reporting"],
        dueDate: "2026-05-21",
      },
      {
        id: "R-2",
        title: "Done already",
        status: "done",
        priority: "low",
        owner: "mira",
        tags: [],
        completedAt: "2026-05-19T10:00:00.000Z",
      },
    ],
    {
      title: "Demo Board",
      date: "2026-05-20",
      capacity: 2,
    },
  );

  assert.match(report, /^# Demo Board/);
  assert.match(report, /Generated: 2026-05-20/);
  assert.match(report, /- Open tasks: 1/);
  assert.match(report, /1\. R-1: Write report \(high, due 2026-05-21\)/);
});
