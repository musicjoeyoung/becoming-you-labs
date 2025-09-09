import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import type { Task } from '@/types/task'
import TaskCard from '@/components/TaskCard'

describe('TaskCard', () => {
    it('shows title', () => {
        const task: Task = { id: '1', title: 'Test Task', description: 'Desc', status: 'scheduled', assignee: 'Me', tags: [], createdAt: new Date(), priority: 'low' }
        render(<TaskCard task={task} />)
        expect(screen.getByText('Test Task')).toBeInTheDocument()
    })
})
