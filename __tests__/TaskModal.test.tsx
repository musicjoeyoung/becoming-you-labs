import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import TaskModal from '@/components/TaskModal'

describe('TaskModal', () => {
    it('renders create heading', () => {
        render(<TaskModal task={null} isOpen={true} onClose={() => { }} onSave={() => { }} onDelete={() => { }} />)
        expect(screen.getByText('Create New Task')).toBeInTheDocument()
    })
})
