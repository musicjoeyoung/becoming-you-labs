export interface Task {
    id: string
    title: string
    description: string
    status: 'scheduled' | 'in-progress' | 'done'
    assignee: string
    tags: string[]
    createdAt: Date
    priority?: 'low' | 'medium' | 'high'
    dueDate?: Date
}

export type TaskStatus = Task['status']

export interface TaskFilters {
    search: string
    assignee: string
    tag: string
}