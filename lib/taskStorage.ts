import { Task } from '@/types/task'

const STORAGE_KEY = 'kanban-tasks'

export const loadTasks = (): Task[] => {
    if (typeof window === 'undefined') return []

    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) return getDefaultTasks()

        const parsed = JSON.parse(stored)
        return parsed.map((task: Omit<Task, 'createdAt' | 'dueDate'> & { createdAt: string, dueDate?: string }) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        }))
    } catch (error) {
        console.error('Error loading tasks:', error)
        return getDefaultTasks()
    }
}

export const saveTasks = (tasks: Task[]): void => {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (error) {
        console.error('Error saving tasks:', error)
    }
}

export const getDefaultTasks = (): Task[] => [
    {
        id: '1',
        title: 'Design System Setup',
        description: 'Create a comprehensive design system with components, colors, and typography guidelines.',
        status: 'scheduled',
        assignee: 'Joseph Young',
        tags: ['design', 'frontend'],
        createdAt: new Date('2024-01-15'),
        priority: 'high'
    },
    {
        id: '2',
        title: 'API Integration',
        description: 'Integrate with external APIs for data synchronization and real-time updates.',
        status: 'in-progress',
        assignee: 'Tyrese Haliburton',
        tags: ['backend', 'api'],
        createdAt: new Date('2024-01-16'),
        priority: 'medium'
    },
    {
        id: '3',
        title: 'User Authentication',
        description: 'Implement secure user authentication with JWT tokens and role-based access.',
        status: 'done',
        assignee: 'Reggie Miller',
        tags: ['security', 'backend'],
        createdAt: new Date('2024-01-10'),
        priority: 'high'
    },
    {
        id: '4',
        title: 'Mobile Responsive Design',
        description: 'Ensure the application works perfectly on all mobile devices and screen sizes.',
        status: 'scheduled',
        assignee: 'Aliyah Boston',
        tags: ['frontend', 'mobile'],
        createdAt: new Date('2024-01-17'),
        priority: 'medium'
    },
    {
        id: '5',
        title: 'Performance Optimization',
        description: 'Optimize application performance, reduce bundle size, and improve loading times.',
        status: 'in-progress',
        assignee: 'Caitlin Clark',
        tags: ['performance', 'optimization'],
        createdAt: new Date('2024-01-18'),
        priority: 'low'
    }
]