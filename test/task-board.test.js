import assert from "node:assert/strict";
import test from "node:test";
import {
  completeTask,
  createTask,
  filterTasks,
  normalizeTask,
  planSprint,
  summarizeBoard,
  TaskValidationError,
} from "../src/task-board.js";

const sampleTasks = [
  {
    id: "A-1",
    title: "Ship report",
    status: "todo",
    priority: "high",
    owner: "mira",
    tags: ["reporting"],
    dueDate: "2026-05-21",
  },
  {
    id: "A-2",
    title: "Fix blocker",
    status: "blocked",
    priority: "urgent",
    owner: "eli",
    tags: ["ops"],
    dueDate: "2026-05-18",
  },
  {
    id: "A-3",
    title: "Clean labels",
    status: "doing",
    priority: "medium",
    owner: "mira",
    tags: ["quality", "reporting"],
    dueDate: "2026-05-20",
  },
  {
    id: "A-4",
    title: "Close old task",
    status: "done",
    priority: "low",
    owner: "sana",
    tags: [],
    completedAt: "2026-05-12T12:00:00.000Z",
  },
];

test("normalizeTask applies defaults and sorts unique tags", () => {
  const task = normalizeTask({
    id: " A-5 ",
    title: " Draft handoff ",
    tags: ["docs", "docs", "agent"],
  });

  assert.deepEqual(task, {
    id: "A-5",
    title: "Draft handoff",
    status: "todo",
    priority: "medium",
    owner: "unassigned",
    tags: ["agent", "docs"],
    createdAt: null,
    dueDate: null,
    completedAt: null,
  });
});

test("normalizeTask rejects unsupported statuses", () => {
  assert.throws(
    () =>
      normalizeTask({
        id: "A-6",
        title: "Invent status",
        status: "waiting",
      }),
    TaskValidationError,
  );
});

test("createTask stamps createdAt and completedAt when needed", () => {
  const now = () => "2026-05-20T00:00:00.000Z";
  const task = createTask(
    {
      id: "A-7",
      title: "Already finished",
      status: "done",
    },
    now,
  );

  assert.equal(task.createdAt, "2026-05-20T00:00:00.000Z");
  assert.equal(task.completedAt, "2026-05-20T00:00:00.000Z");
});

test("completeTask preserves fields and marks task done", () => {
  const task = completeTask(sampleTasks[0], "2026-05-22T09:00:00.000Z");

  assert.equal(task.status, "done");
  assert.equal(task.completedAt, "2026-05-22T09:00:00.000Z");
  assert.equal(task.title, "Ship report");
});

test("filterTasks supports owner, tag, and minimum priority", () => {
  const tasks = filterTasks(sampleTasks, {
    owner: "mira",
    tag: "reporting",
    minPriority: "medium",
  });

  assert.deepEqual(
    tasks.map((task) => task.id),
    ["A-1", "A-3"],
  );
});

test("summarizeBoard counts status, priority, blocked, and overdue tasks", () => {
  const summary = summarizeBoard(sampleTasks, "2026-05-20");

  assert.equal(summary.total, 4);
  assert.equal(summary.open, 3);
  assert.equal(summary.completed, 1);
  assert.equal(summary.blocked, 1);
  assert.equal(summary.overdue, 1);
  assert.deepEqual(summary.countsByStatus, {
    todo: 1,
    doing: 1,
    blocked: 1,
    done: 1,
  });
});

test("planSprint skips done and blocked tasks, then sorts by priority and due date", () => {
  const sprint = planSprint(sampleTasks, { capacity: 3 });

  assert.deepEqual(
    sprint.map((task) => task.id),
    ["A-1", "A-3"],
  );
});
