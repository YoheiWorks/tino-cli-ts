import { randomUUID } from 'node:crypto'
import { loadTasks, saveTasks } from './storage.js'
import type { Task } from './type.js'

export async function createTask(title: string): Promise<Task> {
    const trimmedTitle = title.trim()

    if (trimmedTitle.length === 0) {
        throw new Error('title is required')
    }

    const tasks = await loadTasks()
    const now = new Date().toISOString()

    const newTask: Task = {
        id: randomUUID(),
        title: trimmedTitle,
        done: false,
        createdAt: now,
        updatedAt: now,
    }

    const updatedTasks = [...tasks, newTask]
    await saveTasks(updatedTasks)

    return newTask
}