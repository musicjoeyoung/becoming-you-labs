'use client'

import { Task, TaskStatus } from '@/types/task'
import { loadTasks, saveTasks } from '@/lib/taskStorage'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import TaskModal from '@/components/TaskModal'

const TaskDetailPage = () => {
    const [task, setTask] = useState<Task | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const router = useRouter()
    const params = useParams()

    useEffect(() => {
        const tasks = loadTasks()
        const foundTask = tasks.find(t => t.id === params.id)
        setTask(foundTask || null)
        setIsLoading(false)
    }, [params.id])

    const handleTaskSave = (updatedTask: Task) => {
        const tasks = loadTasks()
        const updatedTasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
        saveTasks(updatedTasks)
        setTask(updatedTask)
    }

    const handleTaskDelete = (taskId: string) => {
        const tasks = loadTasks()
        const updatedTasks = tasks.filter(t => t.id !== taskId)
        saveTasks(updatedTasks)
        router.push('/')
    }

    const handleStatusChange = (newStatus: TaskStatus) => {
        if (!task) return

        const updatedTask = { ...task, status: newStatus }
        handleTaskSave(updatedTask)
    }

    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case 'scheduled': return 'text-blue-700 bg-blue-100 border-blue-200'
            case 'in-progress': return 'text-yellow-700 bg-yellow-100 border-yellow-200'
            case 'done': return 'text-green-700 bg-green-100 border-green-200'
        }
    }

    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case 'high': return 'text-red-700 bg-red-100 border-red-200'
            case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200'
            case 'low': return 'text-green-700 bg-green-100 border-green-200'
            default: return 'text-gray-700 bg-gray-100 border-gray-200'
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!task) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Task Not Found</h2>
                    <p className="text-gray-600 mb-8">The task you are looking for does not exist.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center space-x-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        <span>Back to Board</span>
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                    <span>Back</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h1>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>
                                    {task.status.replace('-', ' ')}
                                </span>
                                {task.priority && (
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(task.priority)}`}>
                                        {task.priority} priority
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit task"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleTaskDelete(task.id)}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete task"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                                    <line x1="10" y1="11" x2="10" y2="17" />
                                    <line x1="14" y1="11" x2="14" y2="17" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {task.description || 'No description provided.'}
                            </p>

                            {task.tags.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {task.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                            >
                                                <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M20.59 13.41L11 4.83V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h1.83l8.58 8.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83z" />
                                                    <circle cx="7.5" cy="7.5" r="1.5" />
                                                </svg>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-3">Task Details</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3 text-sm">
                                        <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="7" r="5" />
                                            <path d="M12 14c-4 0-7 3-7 7v1h14v-1c0-4-3-7-7-7z" />
                                        </svg>
                                        <span className="text-gray-600">Assignee:</span>
                                        <span className="font-medium">{task.assignee || 'Unassigned'}</span>
                                    </div>

                                    <div className="flex items-center space-x-3 text-sm">
                                        <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        <span className="text-gray-600">Created:</span>
                                        <span className="font-medium">
                                            {new Date(task.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>

                                    {task.priority && (
                                        <div className="flex items-center space-x-3 text-sm">
                                            <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 15V5a2 2 0 0 1 2-2h11l-1.34 4H20a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
                                            </svg>
                                            <span className="text-gray-600">Priority:</span>
                                            <span className="font-medium capitalize">{task.priority}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-900 mb-3">Status Actions</h3>
                                <div className="space-y-2">
                                    {(['scheduled', 'in-progress', 'done'] as TaskStatus[]).map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusChange(status)}
                                            disabled={task.status === status}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${task.status === status
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                                                }`}
                                        >
                                            Move to {status.replace('-', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TaskModal
                task={task}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleTaskSave}
                onDelete={handleTaskDelete}
            />
        </div>
    )
}

export default TaskDetailPage