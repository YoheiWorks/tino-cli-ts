import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createTask, listTasks } from '#task/usecases.js'

describe('Taskの作成', () => {
  let originalCwd: string
  let tempDir: string

  beforeEach(async () => {
    originalCwd = process.cwd()
    tempDir = await mkdtemp(join(tmpdir(), 'task-cli-'))
    process.chdir(tempDir)
  })

  afterEach(async () => {
    process.chdir(originalCwd)
    await rm(tempDir, { recursive: true, force: true })
  })

  it('titleを受け取ってTaskを作成し、tasks.jsonに保存する', async () => {
    const task = await createTask('牛乳を買う')

    expect(task.title).toBe('牛乳を買う')
    expect(task.done).toBe(false)
    expect(task.id).toBeTypeOf('string')
    expect(task.createdAt).toBeTypeOf('string')
    expect(task.updatedAt).toBeTypeOf('string')

    const raw = await readFile('tasks.json', 'utf-8')
    const tasks = JSON.parse(raw)

    expect(tasks).toHaveLength(1)
    expect(tasks[0]).toEqual(task)
  })

  it('既存のtasks.jsonがあるとき、末尾に追加して保存する', async () => {
    await createTask('既存タスク')
    const newTask = await createTask('新しいタスク')

    const raw = await readFile('tasks.json', 'utf-8')
    const tasks = JSON.parse(raw)

    expect(tasks).toHaveLength(2)
    expect(tasks[0].title).toBe('既存タスク')
    expect(tasks[1]).toEqual(newTask)
  })

  it('titleが空白だけならエラーになり、tasks.jsonは作られない', async () => {
    await expect(createTask('   ')).rejects.toThrow('title is required')

    await expect(readFile('tasks.json', 'utf-8')).rejects.toMatchObject({
      code: 'ENOENT',
    })
  })
})

describe('Taskの一覧取得', () => {
  let originalCwd: string
  let tempDir: string

  beforeEach(async () => {
    originalCwd = process.cwd()
    tempDir = await mkdtemp(join(tmpdir(), 'task-cli-'))
    process.chdir(tempDir)
  })

  afterEach(async () => {
    process.chdir(originalCwd)
    await rm(tempDir, { recursive: true, force: true })
  })

  it('保存済みTaskを一覧で返す', async () => {
    const firstTask = await createTask('既存タスク')
    const secondTask = await createTask('新しいタスク')

    await expect(listTasks()).resolves.toEqual([firstTask, secondTask])
  })

  it('tasks.jsonがなければ空配列を返す', async () => {
    await expect(listTasks()).resolves.toEqual([])
  })
});
