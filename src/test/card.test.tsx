import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

describe('Card Component', () => {
  it('should render card with all sections', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
          <CardDescription>Test Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    )

    expect(screen.getByText('Test Title')).toBeDefined()
    expect(screen.getByText('Test Description')).toBeDefined()
    expect(screen.getByText('Card Content')).toBeDefined()
    expect(screen.getByText('Card Footer')).toBeDefined()
  })

  it('should apply custom className to Card', () => {
    const { container } = render(<Card className="custom-card">Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('custom-card')
  })

  it('should render card without optional sections', () => {
    render(
      <Card>
        <CardContent>
          <p>Only Content</p>
        </CardContent>
      </Card>
    )

    expect(screen.getByText('Only Content')).toBeDefined()
  })

  it('should apply default card styles', () => {
    const { container } = render(<Card>Content</Card>)
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('rounded-lg')
    expect(card.className).toContain('border')
  })
})
