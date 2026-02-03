import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from '@/components/ui/badge'

describe('Badge Component', () => {
  it('should render badge with text', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeDefined()
  })

  it('should apply default variant styles', () => {
    const { container } = render(<Badge>Default</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('bg-primary')
  })

  it('should apply secondary variant styles', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('bg-secondary')
  })

  it('should apply destructive variant styles', () => {
    const { container } = render(<Badge variant="destructive">Error</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('bg-destructive')
  })

  it('should apply outline variant styles', () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('border')
  })

  it('should accept custom className', () => {
    const { container } = render(<Badge className="custom-badge">Custom</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('custom-badge')
  })

  it('should render as inline element', () => {
    const { container } = render(<Badge>Inline</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toContain('inline-flex')
  })
})
