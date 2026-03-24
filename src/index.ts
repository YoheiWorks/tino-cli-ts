import { runCli } from "./cli.js";

run().catch((error: unknown) => {
    if (error instanceof Error) {
        console.error(error.message);
    } else {
        console.error(error);
    }

    process.exitCode = 1;
});

async function run(): Promise<void> {
    await runCli();
}
