"use client"

import { Task, TaskStatus } from '@/types/task'
import { useEffect, useState } from 'react'

interface TaskModalProps {
    task: Task | null
    isOpen: boolean
    onClose: () => void
    onSave: (task: Task) => void
    onDelete: (taskId: string) => void
}

const TaskModal = ({ task, isOpen, onClose, onSave, onDelete }: TaskModalProps) => {
    const [formData, setFormData] = useState<Partial<Task>>({})
    const [newTag, setNewTag] = useState('')

    useEffect(() => {
        if (task) {
            setFormData(task)
        } else {
            setFormData({
                title: '',
                description: '',
                status: 'scheduled',
                assignee: '',
                tags: [],
                priority: 'medium'
            })
        }
    }, [task])

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const taskData: Task = {
            id: task?.id || Date.now().toString(),
            title: formData.title || '',
            description: formData.description || '',
            status: formData.status || 'scheduled',
            assignee: formData.assignee || '',
            tags: formData.tags || [],
            createdAt: task?.createdAt || new Date(),
            priority: formData.priority || 'medium'
        }

        onSave(taskData)
        onClose()
    }

    const addTag = () => {
        if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
            setFormData({
                ...formData,
                tags: [...(formData.tags || []), newTag.trim()]
            })
            setNewTag('')
        }
    }

    const removeTag = (tagToRemove: string) => {
        setFormData({
            ...formData,
            tags: formData.tags?.filter(tag => tag !== tagToRemove) || []
        })
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            {task ? 'Edit Task' : 'Create New Task'}
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={formData.title || ''}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="scheduled">Scheduled</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                            <input
                                type="text"
                                value={formData.assignee || ''}
                                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter assignee name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Add tag..."
                                />
                                <button
                                    type="button"
                                    onClick={addTag}
                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {formData.tags?.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="ml-1 text-blue-600 hover:text-blue-800"
                                        >
                                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            {task && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onDelete(task.id)
                                        onClose()
                                    }}
                                    className="px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    Delete Task
                                </button>
                            )}

                            <div className="flex gap-2 ml-auto">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {task ? 'Update Task' : 'Create Task'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default TaskModal