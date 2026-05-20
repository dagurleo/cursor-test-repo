import { planSprint, summarizeBoard } from "./task-board.js";

export function renderBoardReport(tasks, options = {}) {
  const title = options.title ?? "Task Forge Board";
  const date = options.date ?? new Date().toISOString().slice(0, 10);
  const capacity = options.capacity ?? 3;
  const summary = summarizeBoard(tasks, date);
  const sprintPlan = planSprint(tasks, { capacity });

  return [
    `# ${title}`,
    "",
    `Generated: ${date}`,
    "",
    "## Summary",
    "",
    `- Total tasks: ${summary.total}`,
    `- Open tasks: ${summary.open}`,
    `- Completed tasks: ${summary.completed}`,
    `- Blocked tasks: ${summary.blocked}`,
    `- Overdue tasks: ${summary.overdue}`,
    "",
    "## Status Counts",
    "",
    ...Object.entries(summary.countsByStatus).map(([status, count]) => `- ${status}: ${count}`),
    "",
    "## Suggested Sprint",
    "",
    ...formatSprintPlan(sprintPlan),
    "",
  ].join("\n");
}

function formatSprintPlan(tasks) {
  if (tasks.length === 0) {
    return ["No ready tasks found."];
  }

  return tasks.map((task, index) => {
    const due = task.dueDate ? `, due ${task.dueDate}` : "";
    return `${index + 1}. ${task.id}: ${task.title} (${task.priority}${due})`;
  });
}
