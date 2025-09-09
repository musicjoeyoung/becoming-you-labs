'use client'

import { Task, TaskFilters } from '@/types/task'
import { loadTasks, saveTasks } from '@/lib/taskStorage'
import { useEffect, useState } from 'react'

import TaskCard from '@/components/TaskCard'
import TaskFiltersComponent from '@/components/TaskFilters'
import TaskModal from '@/components/TaskModal'
import { useRouter } from 'next/navigation'

const Backlog = () => {
    const [tasks, setTasks] = useState<Task[]>([])
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
    const [filters, setFilters] = useState<TaskFilters>({
        search: '',
        assignee: '',
        tag: ''
    })
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [sortBy, setSortBy] = useState<'createdAt' | 'title' | 'assignee' | 'priority'>('createdAt')
    const router = useRouter()

    useEffect(() => {
        const loadedTasks = loadTasks()
        setTasks(loadedTasks)
        setIsLoading(false)
    }, [])

    useEffect(() => {
        let filtered = tasks

        if (filters.search) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                task.description.toLowerCase().includes(filters.search.toLowerCase())
            )
        }

        if (filters.assignee) {
            filtered = filtered.filter(task => task.assignee === filters.assignee)
        }

        if (filters.tag) {
            filtered = filtered.filter(task => task.tags.includes(filters.tag))
        }

        filtered = filtered.sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title)
                case 'assignee':
                    return a.assignee.localeCompare(b.assignee)
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 }
                    return (priorityOrder[b.priority || 'medium'] || 2) - (priorityOrder[a.priority || 'medium'] || 2)
                case 'createdAt':
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
        })

        setFilteredTasks(filtered)
    }, [tasks, filters, sortBy])

    const handleTaskClick = (task: Task) => {
        router.push(`/task/${task.id}`)
    }

    const handleTaskSave = (task: Task) => {
        let updatedTasks
        if (tasks.find(t => t.id === task.id)) {
            updatedTasks = tasks.map(t => t.id === task.id ? task : t)
        } else {
            updatedTasks = [...tasks, task]
        }
        setTasks(updatedTasks)
        saveTasks(updatedTasks)
    }

    const handleTaskDelete = (taskId: string) => {
        const updatedTasks = tasks.filter(task => task.id !== taskId)
        setTasks(updatedTasks)
        saveTasks(updatedTasks)
    }

    const availableAssignees = [...new Set(tasks.map(task => task.assignee))].filter(Boolean)
    const availableTags = [...new Set(tasks.flatMap(task => task.tags))]

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled': return 'text-blue-600 bg-blue-100'
            case 'in-progress': return 'text-yellow-600 bg-yellow-100'
            case 'done': return 'text-green-600 bg-green-100'
            default: return 'text-gray-600 bg-gray-100'
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Task Backlog</h1>
                    <button
                        onClick={() => {
                            setSelectedTask(null)
                            setIsModalOpen(true)
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span>New Task</span>
                    </button>
                </div>

                <TaskFiltersComponent
                    filters={filters}
                    onFiltersChange={setFilters}
                    availableAssignees={availableAssignees}
                    availableTags={availableTags}
                />

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-700">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'title' | 'assignee' | 'priority')}
                            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="createdAt">Date Created</option>
                            <option value="title">Title</option>
                            <option value="assignee">Assignee</option>
                            <option value="priority">Priority</option>
                        </select>
                    </div>
                    <p className="text-sm text-gray-600">
                        {filteredTasks.length} of {tasks.length} tasks
                    </p>
                </div>
            </div>

            {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="h-16 w-16 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                    <p className="text-gray-600">
                        {tasks.length === 0
                            ? "Get started by creating your first task!"
                            : "Try adjusting your filters to see more tasks."
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.map((task) => (
                        <div key={task.id} className="relative">
                            <TaskCard
                                task={task}
                                onClick={() => handleTaskClick(task)}
                            />
                            <div className="absolute top-4 right-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                    {task.status.replace('-', ' ')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <TaskModal
                task={selectedTask}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleTaskSave}
                onDelete={handleTaskDelete}
            />
        </div>
    )
}

export default Backlog;