import { Command } from "commander";
import { createTask, listTasks } from "./usecases.js";
import { formatTaskList } from "./formatter.js";

export function registerTaskCommand(program: Command): void {
    const taskCommand = program
        .command("task")
        .description("Task を操作する");

    taskCommand
        .command("add <title>")
        .description("Task を追加する")
        .action(async (title: string) => {
            const task = await createTask(title)
            console.log(`Task added: ${task.title}`);
        })

    taskCommand
        .command("list")
        .description("Task を一覧表示する")
        .action(async () => {
            const tasks = await listTasks()

            console.log(formatTaskList(tasks));
        })
}