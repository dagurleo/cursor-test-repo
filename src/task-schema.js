export const STATUSES = ["todo", "doing", "blocked", "done"];
export const PRIORITIES = ["low", "medium", "high", "urgent"];

const STATUS_SET = new Set(STATUSES);
const PRIORITY_SET = new Set(PRIORITIES);
const PRIORITY_SCORE = new Map(PRIORITIES.map((priority, index) => [priority, index + 1]));

export class TaskValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "TaskValidationError";
  }
}

export function normalizeTask(rawTask) {
  if (!rawTask || typeof rawTask !== "object" || Array.isArray(rawTask)) {
    throw new TaskValidationError("Task must be an object.");
  }

  const task = {
    id: requireString(rawTask.id, "id"),
    title: requireString(rawTask.title, "title"),
    status: rawTask.status ?? "todo",
    priority: rawTask.priority ?? "medium",
    owner: rawTask.owner ?? "unassigned",
    tags: normalizeTags(rawTask.tags),
    createdAt: rawTask.createdAt ?? null,
    dueDate: rawTask.dueDate ?? null,
    completedAt: rawTask.completedAt ?? null,
  };

  if (!STATUS_SET.has(task.status)) {
    throw new TaskValidationError(`Unsupported status "${task.status}".`);
  }

  if (!PRIORITY_SET.has(task.priority)) {
    throw new TaskValidationError(`Unsupported priority "${task.priority}".`);
  }

  if (typeof task.owner !== "string" || task.owner.trim() === "") {
    throw new TaskValidationError("Task owner must be a non-empty string.");
  }

  return task;
}

export function priorityScore(priority) {
  if (!PRIORITY_SET.has(priority)) {
    throw new TaskValidationError(`Unsupported priority "${priority}".`);
  }

  return PRIORITY_SCORE.get(priority);
}

function normalizeTags(tags) {
  if (tags === undefined) {
    return [];
  }

  if (!Array.isArray(tags)) {
    throw new TaskValidationError("Task tags must be an array.");
  }

  return [...new Set(tags.map((tag) => requireString(tag, "tag")))].sort();
}

function requireString(value, fieldName) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TaskValidationError(`Task ${fieldName} must be a non-empty string.`);
  }

  return value.trim();
}
