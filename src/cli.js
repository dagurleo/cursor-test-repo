#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { renderBoardReport } from "./report.js";

const { values } = parseArgs({
  options: {
    file: {
      type: "string",
      short: "f",
    },
    title: {
      type: "string",
      short: "t",
    },
    capacity: {
      type: "string",
      short: "c",
    },
    date: {
      type: "string",
      short: "d",
    },
  },
});

const file = values.file ?? new URL("../data/tasks.json", import.meta.url);
const tasks = JSON.parse(await readFile(file, "utf8"));
const capacity = values.capacity ? Number.parseInt(values.capacity, 10) : undefined;

if (values.capacity && (!Number.isInteger(capacity) || capacity < 1)) {
  throw new Error("--capacity must be a positive integer.");
}

process.stdout.write(
  renderBoardReport(tasks, {
    title: values.title,
    date: values.date,
    capacity,
  }),
);
