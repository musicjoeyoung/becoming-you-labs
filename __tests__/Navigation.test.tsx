import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import Navigation from '@/components/Navigation'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))
vi.mock('next/link', () => ({ default: (props: { href: string; children: React.ReactNode; className?: string }) => <a {...props} /> }))

describe('Navigation', () => {
    it('renders brand text', () => {
        render(<Navigation />)
        expect(screen.getByText('TaskFlow')).toBeInTheDocument()
    })
})
