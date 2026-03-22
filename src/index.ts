import { Command } from "commander";
import { handleAddTask } from "./task/action.js";

const program = new Command();

program
  .name("tino")
  .description("Issue / Task / Note を扱うローカル管理ツール")
  .version("0.1.0");

const task = program
  .command("task")
  .description("Task を操作する");

task
  .command("add <title>")
  .description("Task を追加する")
  .option("-d, --description <description>", "説明")
  .action((title, options) => handleAddTask(title, options.description));

program.parse();