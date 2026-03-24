export function formatTaskList(tasks: Array<{
    id: string
    title: string
    done: boolean
    updatedAt: string
}>): string {
    if (tasks.length === 0) {
        return "No tasks found."
    }

    const lines = tasks.map((task, index) => {
        const status = task.done ? "[x]" : "[ ]";
        return `${index + 1}. ${status} ${task.title} (${task.id}) updated: ${task.updatedAt}`;
    });

    return lines.join("\n");
}