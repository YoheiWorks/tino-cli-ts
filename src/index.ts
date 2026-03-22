import { Command } from "commander";
import { registerTaskCommand } from "./task/command.js";

function run(): void {
    const program = buildProgram();
    program.parse();
}

function buildProgram(): Command {
    const program = new Command();

    program
        .name("tino")
        .description("Issue / Task / Note を扱うローカル管理ツール")
        .version("0.1.0");

    registerTaskCommand(program);

    return program;
}

run();