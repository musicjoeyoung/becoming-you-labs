import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import type { TaskFilters as TF } from '@/types/task'
import TaskFilters from '@/components/TaskFilters'

describe('TaskFilters', () => {
    it('fires onFiltersChange when typing', () => {
        const filters: TF = { search: '', assignee: '', tag: '' }
        const onFiltersChange = vi.fn()
        render(<TaskFilters filters={filters} onFiltersChange={onFiltersChange} availableAssignees={[]} availableTags={[]} />)
        fireEvent.change(screen.getByPlaceholderText(/Search tasks/i), { target: { value: 'x' } })
        expect(onFiltersChange).toHaveBeenCalled()
    })
})
