import { readFile, writeFile } from 'node:fs/promises'
import type { Task } from './type.js'

const TASK_FILE_PATH = 'tasks.json'

export async function loadTasks(): Promise<Task[]> {
  try {
    const raw = await readFile(TASK_FILE_PATH, 'utf-8')
    return JSON.parse(raw) as Task[]
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return []
    }

    throw error
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await writeFile(TASK_FILE_PATH, JSON.stringify(tasks, null, 2), 'utf-8')
}