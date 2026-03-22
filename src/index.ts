import { Command } from "commander";

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
  .action((title, options) => {
    console.log(`Adding task: ${title}`);

    if (options.description) {
      console.log(`Description: ${options.description}`);
    }
  });

program.parse();