#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { normalizeTask, STATUSES, PRIORITIES, TaskValidationError } from "../src/task-board.js";

const fixturePath = new URL("../data/tasks.json", import.meta.url);
const tasks = JSON.parse(await readFile(fixturePath, "utf8"));
const errors = [];

if (!Array.isArray(tasks)) {
  errors.push("data/tasks.json must contain an array of tasks.");
} else {
  const seenIds = new Set();

  for (const [index, task] of tasks.entries()) {
    try {
      const normalized = normalizeTask(task);

      if (seenIds.has(normalized.id)) {
        errors.push(`Task ${normalized.id} is duplicated.`);
      }

      seenIds.add(normalized.id);

      if (normalized.status === "done" && !normalized.completedAt) {
        errors.push(`Task ${normalized.id} is done but has no completedAt timestamp.`);
      }

      if (normalized.status !== "done" && normalized.completedAt) {
        errors.push(`Task ${normalized.id} is not done but has completedAt set.`);
      }
    } catch (error) {
      if (error instanceof TaskValidationError) {
        errors.push(`Task at index ${index}: ${error.message}`);
      } else {
        throw error;
      }
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exitCode = 1;
} else {
  console.log(`Fixture validation passed (${tasks.length} tasks).`);
  console.log(`Statuses: ${STATUSES.join(", ")}`);
  console.log(`Priorities: ${PRIORITIES.join(", ")}`);
}
