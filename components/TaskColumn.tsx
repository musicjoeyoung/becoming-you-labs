import { Task, TaskStatus } from '@/types/task'

import TaskCard from './TaskCard'

interface TaskColumnProps {
    title: string
    status: TaskStatus
    tasks: Task[]
    onTaskClick: (task: Task) => void
    onTaskDrop: (taskId: string, newStatus: TaskStatus) => void
}

export default function TaskColumn({ title, status, tasks, onTaskClick, onTaskDrop }: TaskColumnProps) {
    const getColumnColor = (status: TaskStatus) => {
        switch (status) {
            case 'scheduled': return 'border-blue-200 bg-blue-50'
            case 'in-progress': return 'border-yellow-200 bg-yellow-50'
            case 'done': return 'border-green-200 bg-green-50'
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const taskId = e.dataTransfer.getData('text/plain')
        onTaskDrop(taskId, status)
    }

    return (
        <div className="flex-1 min-w-80">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
                    {tasks.length}
                </span>
            </div>

            <div
                className={`min-h-96 p-4 rounded-lg border-2 border-dashed ${getColumnColor(status)} transition-colors`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className="space-y-3">
                    {tasks.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">No tasks in {title.toLowerCase()}</p>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onClick={() => onTaskClick(task)}
                                draggable
                                onDragStart={(e) => {
                                    e.dataTransfer.setData('text/plain', task.id)
                                }}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}