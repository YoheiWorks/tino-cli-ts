import { Command } from "commander";
import { registerTaskCommand } from "#task/command.js";

export function buildProgram(): Command {
    const program = new Command();

    program
        .name("tino")
        .description("Issue / Task / Note を扱うローカル管理ツール")
        .version("0.1.0");

    registerTaskCommand(program);

    return program;
}

export async function runCli(argv: string[] = process.argv): Promise<void> {
    const program = buildProgram();
    await program.parseAsync(argv);
}
