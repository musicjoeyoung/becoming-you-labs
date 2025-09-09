import { Task } from '@/types/task'

interface TaskCardProps {
    task: Task
    onClick?: () => void
    draggable?: boolean
    onDragStart?: (e: React.DragEvent) => void
}

const TaskCard = ({ task, onClick, draggable = false, onDragStart }: TaskCardProps) => {
    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case 'high': return 'border-red-400 bg-red-50'
            case 'medium': return 'border-yellow-400 bg-yellow-50'
            case 'low': return 'border-green-400 bg-green-50'
            default: return 'border-gray-200 bg-white'
        }
    }

    const getPriorityDot = (priority?: string) => {
        switch (priority) {
            case 'high': return 'bg-red-500'
            case 'medium': return 'bg-yellow-500'
            case 'low': return 'bg-green-500'
            default: return 'bg-gray-400'
        }
    }

    return (
        <div
            className={`task-card ${getPriorityColor(task.priority)} border-l-4 p-4`}
            onClick={onClick}
            draggable={draggable}
            onDragStart={onDragStart}
        >
            <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">{task.title}</h3>
                {task.priority && (
                    <div className={`w-2 h-2 rounded-full ${getPriorityDot(task.priority)} flex-shrink-0`} />
                )}
            </div>

            <p className="text-gray-600 text-xs mb-3 line-clamp-2">{task.description}</p>

            <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="7" r="5" />
                        <path d="M12 14c-4 0-7 3-7 7v1h14v-1c0-4-3-7-7-7z" />
                    </svg>
                    <span className="truncate">{task.assignee}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            {task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                    {task.tags.slice(0, 2).map((tag, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800"
                        >
                            <svg className="h-2 w-2 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.59 13.41L11 4.83V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h1.83l8.58 8.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83z" />
                                <circle cx="7.5" cy="7.5" r="1.5" />
                            </svg>
                            {tag}
                        </span>
                    ))}
                    {task.tags.length > 2 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                            +{task.tags.length - 2}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}
export default TaskCard