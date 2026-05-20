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

export function createTask(input, now = () => new Date().toISOString()) {
  const task = normalizeTask({
    ...input,
    createdAt: input.createdAt ?? now(),
  });

  if (task.status === "done" && !task.completedAt) {
    return {
      ...task,
      completedAt: now(),
    };
  }

  return task;
}

export function completeTask(task, completedAt = new Date().toISOString()) {
  const normalized = normalizeTask(task);

  return {
    ...normalized,
    status: "done",
    completedAt,
  };
}

export function filterTasks(tasks, filters = {}) {
  return tasks.map(normalizeTask).filter((task) => {
    if (filters.status && task.status !== filters.status) {
      return false;
    }

    if (filters.owner && task.owner !== filters.owner) {
      return false;
    }

    if (filters.tag && !task.tags.includes(filters.tag)) {
      return false;
    }

    if (filters.minPriority && priorityScore(task.priority) < priorityScore(filters.minPriority)) {
      return false;
    }

    return true;
  });
}

export function summarizeBoard(tasks, today = new Date().toISOString().slice(0, 10)) {
  const normalizedTasks = tasks.map(normalizeTask);
  const countsByStatus = Object.fromEntries(STATUSES.map((status) => [status, 0]));
  const countsByPriority = Object.fromEntries(PRIORITIES.map((priority) => [priority, 0]));

  for (const task of normalizedTasks) {
    countsByStatus[task.status] += 1;
    countsByPriority[task.priority] += 1;
  }

  const openTasks = normalizedTasks.filter((task) => task.status !== "done");
  const blockedTasks = normalizedTasks.filter((task) => task.status === "blocked");
  const overdueTasks = openTasks.filter((task) => task.dueDate && task.dueDate < today);

  return {
    total: normalizedTasks.length,
    open: openTasks.length,
    completed: countsByStatus.done,
    blocked: blockedTasks.length,
    overdue: overdueTasks.length,
    countsByStatus,
    countsByPriority,
  };
}

export function planSprint(tasks, options = {}) {
  const capacity = options.capacity ?? 5;
  const owner = options.owner;

  return filterTasks(tasks, { owner })
    .filter((task) => task.status !== "done" && task.status !== "blocked")
    .sort(compareForSprint)
    .slice(0, capacity);
}

function compareForSprint(a, b) {
  const priorityDifference = priorityScore(b.priority) - priorityScore(a.priority);

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  const aDueDate = a.dueDate ?? "9999-12-31";
  const bDueDate = b.dueDate ?? "9999-12-31";

  if (aDueDate !== bDueDate) {
    return aDueDate.localeCompare(bDueDate);
  }

  return a.id.localeCompare(b.id);
}

function priorityScore(priority) {
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
