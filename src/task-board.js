import { normalizeTask, priorityScore, PRIORITIES, STATUSES } from "./task-schema.js";

export {
  normalizeTask,
  PRIORITIES,
  priorityScore,
  STATUSES,
  TaskValidationError,
} from "./task-schema.js";

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
