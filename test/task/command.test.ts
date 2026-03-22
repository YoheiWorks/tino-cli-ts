import { Command } from 'commander';
import { describe, expect, test } from 'vitest';
import { registerTaskCommand } from '../../src/task/command.js';

describe('Taskを操作する各コマンドが `task` コマンド配下に登録されている', () => {
  test('`task`コマンドが登録されている', () => {
    const program = new Command();

    registerTaskCommand(program);

    const taskCommand = program.commands.find(cmd => cmd.name() === 'task');
    expect(taskCommand).toBeDefined();
  });

  test('`task add`コマンドが登録されている', () => {
    const program = new Command();

    registerTaskCommand(program);

    const taskCommand = program.commands.find(cmd => cmd.name() === 'task');
    expect(taskCommand).toBeDefined();

    const addCommand = taskCommand?.commands.find(cmd => cmd.name() === 'add');
    expect(addCommand).toBeDefined();
  });
});