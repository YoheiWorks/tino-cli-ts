import { Command } from "commander";
import { createTask } from "./usecases.js";

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
}