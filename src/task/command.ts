import { Command } from "commander";
import { handleAddTask } from "./action.js";

export function registerTaskCommand(program: Command): void {
    const task = program
        .command("task")
        .description("Task を操作する");

    task
        .command("add <title>")
        .description("Task を追加する")
        .option("-d, --description <description>", "説明")
        .action((title: string, options: { description?: string }) => handleAddTask(title, options.description));
}