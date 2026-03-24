import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Command } from 'commander';
import { afterEach, beforeEach, describe, expect, test, vi, type MockInstance } from 'vitest';
import { registerTaskCommand } from '#task/command.js';

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

  test('`task list`コマンドが登録されている', () => {
      const program = new Command();
  
      registerTaskCommand(program);
  
      const taskCommand = program.commands.find(cmd => cmd.name() === 'task');
      expect(taskCommand).toBeDefined();
  
      const listCommand = taskCommand?.commands.find(cmd => cmd.name() === 'list');
      expect(listCommand).toBeDefined();
    });
});

describe('`task list`コマンドの動作', () => {
    let consoleLogSpy: MockInstance<typeof console.log>

    beforeEach(async () => {
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    });

    let originalCwd: string
    let tempDir: string
    
    beforeEach(async () => {
      originalCwd = process.cwd()
      tempDir = await mkdtemp(join(tmpdir(), 'task-command-'))
      process.chdir(tempDir)
    })

    afterEach(async () => {
      process.chdir(originalCwd)
      await rm(tempDir, { recursive: true, force: true })
      vi.restoreAllMocks()
    })

    test('`task list`はTaskがないときに0件メッセージを表示する', async () => {
      const program = new Command();
  
      registerTaskCommand(program);
  
      await program.parseAsync(['task', 'list'], { from: 'user' })
  
      expect(consoleLogSpy).toHaveBeenCalledWith('No tasks found.')
    })
  
    test('`task list`は保存済みTaskを整形して表示する', async () => {
      const program = new Command();
  
      await writeFile('tasks.json', JSON.stringify([
        {
          id: 'task-1',
          title: '牛乳を買う',
          done: false,
          createdAt: '2026-03-24T10:00:00.000Z',
          updatedAt: '2026-03-24T10:00:00.000Z',
        },
        {
          id: 'task-2',
          title: 'レポートを出す',
          done: true,
          createdAt: '2026-03-24T11:00:00.000Z',
          updatedAt: '2026-03-24T12:00:00.000Z',
        },
      ], null, 2))
  
      registerTaskCommand(program);
  
      await program.parseAsync(['task', 'list'], { from: 'user' })
  
      expect(consoleLogSpy).toHaveBeenCalledWith(
        [
          '1. [ ] 牛乳を買う (task-1) updated: 2026-03-24T10:00:00.000Z',
          '2. [x] レポートを出す (task-2) updated: 2026-03-24T12:00:00.000Z',
        ].join('\n'),
      )
    })
});