import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, test, vi, type MockInstance } from 'vitest'
import { runCli } from '../src/cli.js'

describe('CLI統合テスト', () => {
  let originalCwd: string
  let originalExitCode: typeof process.exitCode
  let tempDir: string
  let consoleLogSpy: MockInstance<typeof console.log>

  beforeEach(async () => {
    originalCwd = process.cwd()
    originalExitCode = process.exitCode
    tempDir = await mkdtemp(join(tmpdir(), 'tino-cli-integration-'))
    process.chdir(tempDir)
    process.exitCode = undefined
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(async () => {
    process.chdir(originalCwd)
    process.exitCode = originalExitCode
    await rm(tempDir, { recursive: true, force: true })
    vi.restoreAllMocks()
  })

  test('`task list`で保存済みTaskを表示できる', async () => {
    await writeFile('tasks.json', JSON.stringify([
      {
        id: 'task-1',
        title: '牛乳を買う',
        done: false,
        createdAt: '2026-03-24T10:00:00.000Z',
        updatedAt: '2026-03-24T10:00:00.000Z',
      },
    ], null, 2))

    await runCli(['node', 'tino', 'task', 'list'])

    expect(consoleLogSpy).toHaveBeenCalledWith(
      '1. [ ] 牛乳を買う (task-1) updated: 2026-03-24T10:00:00.000Z',
    )
    expect(process.exitCode).toBeUndefined()
  })

  test('不正な `task add` はエラーとして呼び出し元に伝播する', async () => {
    await expect(runCli(['node', 'tino', 'task', 'add', '   '])).rejects.toThrow('title is required')
  })
})
