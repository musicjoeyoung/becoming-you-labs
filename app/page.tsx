'use client'

import { Task, TaskFilters, TaskStatus } from '@/types/task'
import { loadTasks, saveTasks } from '@/lib/taskStorage'
import { useEffect, useState } from 'react'

import TaskColumn from '@/components/TaskColumn'
import TaskFiltersComponent from '@/components/TaskFilters'
import TaskModal from '@/components/TaskModal'
import { useRouter } from 'next/navigation'

const HomePage = () => {
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

    setFilteredTasks(filtered)
  }, [tasks, filters])

  const handleTaskClick = (task: Task) => {
    router.push(`/task/${task.id}`)
  }

  const handleTaskDrop = (taskId: string, newStatus: TaskStatus) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    )
    setTasks(updatedTasks)
    saveTasks(updatedTasks)
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

  const scheduledTasks = filteredTasks.filter(task => task.status === 'scheduled')
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress')
  const doneTasks = filteredTasks.filter(task => task.status === 'done')

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
          <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
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
      </div>

      <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
        <TaskColumn
          title="Scheduled"
          status="scheduled"
          tasks={scheduledTasks}
          onTaskClick={handleTaskClick}
          onTaskDrop={handleTaskDrop}
        />

        <TaskColumn
          title="In Progress"
          status="in-progress"
          tasks={inProgressTasks}
          onTaskClick={handleTaskClick}
          onTaskDrop={handleTaskDrop}
        />

        <TaskColumn
          title="Done"
          status="done"
          tasks={doneTasks}
          onTaskClick={handleTaskClick}
          onTaskDrop={handleTaskDrop}
        />
      </div>

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

export default HomePage