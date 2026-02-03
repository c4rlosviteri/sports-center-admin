import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Input } from '@/components/ui/input'

describe('Input Component', () => {
  it('should render input field', () => {
    render(<Input type="text" placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeDefined()
  })

  it('should handle different input types', () => {
    const { rerender } = render(<Input type="email" data-testid="input" />)
    let input = screen.getByTestId('input') as HTMLInputElement
    expect(input.type).toBe('email')

    rerender(<Input type="password" data-testid="input" />)
    input = screen.getByTestId('input') as HTMLInputElement
    expect(input.type).toBe('password')

    rerender(<Input type="number" data-testid="input" />)
    input = screen.getByTestId('input') as HTMLInputElement
    expect(input.type).toBe('number')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled data-testid="input" />)
    const input = screen.getByTestId('input') as HTMLInputElement
    expect(input.disabled).toBe(true)
  })

  it('should accept custom className', () => {
    render(<Input className="custom-input" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toContain('custom-input')
  })

  it('should apply default input styles', () => {
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toContain('border')
    expect(input.className).toContain('rounded-md')
  })
})
