import { Command } from "commander";
import { registerTaskCommand } from "#task/command.js";

async function run(): Promise<void> {
    const program = buildProgram();
    await program.parseAsync();
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

run().catch((error: unknown) => {
    if (error instanceof Error) {
        console.error(error.message);
    } else {
        console.error(error);
    }

    process.exitCode = 1;
});
