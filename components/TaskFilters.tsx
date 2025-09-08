import type { TaskFilters } from '@/types/task'

interface TaskFiltersProps {
    filters: TaskFilters
    onFiltersChange: (filters: TaskFilters) => void
    availableAssignees: string[]
    availableTags: string[]
}

const TaskFilters = ({
    filters,
    onFiltersChange,
    availableAssignees,
    availableTags
}: TaskFiltersProps) => {
    const updateFilter = (key: keyof TaskFilters, value: string) => {
        onFiltersChange({ ...filters, [key]: value })
    }

    const clearFilters = () => {
        onFiltersChange({ search: '', assignee: '', tag: '' })
    }

    const hasActiveFilters = filters.search || filters.assignee || filters.tag

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-64">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={filters.search}
                            onChange={(e) => updateFilter('search', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="relative">
                        <select
                            value={filters.assignee}
                            onChange={(e) => updateFilter('assignee', e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Assignees</option>
                            {availableAssignees.map((assignee) => (
                                <option key={assignee} value={assignee}>
                                    {assignee}
                                </option>
                            ))}
                        </select>
                        <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="7" r="5" />
                            <path d="M12 14c-4 0-7 3-7 7v1h14v-1c0-4-3-7-7-7z" />
                        </svg>
                    </div>

                    <div className="relative">
                        <select
                            value={filters.tag}
                            onChange={(e) => updateFilter('tag', e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Tags</option>
                            {availableTags.map((tag) => (
                                <option key={tag} value={tag}>
                                    {tag}
                                </option>
                            ))}
                        </select>
                        <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 2v4h4M7 2l10 10-4 4L3 6l4-4z" />
                        </svg>
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                            <span>Clear</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
export default TaskFilters