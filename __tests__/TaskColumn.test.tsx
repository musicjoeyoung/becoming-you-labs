import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import TaskColumn from '@/components/TaskColumn'

describe('TaskColumn', () => {
    it('shows empty state', () => {
        render(<TaskColumn title="Scheduled" status="scheduled" tasks={[]} onTaskClick={() => { }} onTaskDrop={() => { }} />)
        expect(screen.getByText(/No tasks in scheduled/)).toBeInTheDocument()
    })
})
