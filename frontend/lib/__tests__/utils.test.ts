import { cn } from '../utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-2 py-1', 'bg-red-500', 'text-white')
    expect(result).toBe('px-2 py-1 bg-red-500 text-white')
  })

  it('should handle conditional classes', () => {
    const isActive = true
    const result = cn(
      'base-class',
      isActive && 'active-class',
      'always-present'
    )
    expect(result).toBe('base-class active-class always-present')
  })

  it('should handle false conditional classes', () => {
    const isActive = false
    const result = cn(
      'base-class',
      isActive && 'active-class',
      'always-present'
    )
    expect(result).toBe('base-class always-present')
  })

  it('should handle empty strings and undefined values', () => {
    const result = cn('base-class', '', undefined, null, 'valid-class')
    expect(result).toBe('base-class valid-class')
  })

  it('should handle Tailwind conflicts and merge them', () => {
    const result = cn('px-2 py-1', 'px-4')
    expect(result).toBe('py-1 px-4')
  })

  it('should handle arrays of classes', () => {
    const result = cn(['px-2', 'py-1'], 'bg-red-500')
    expect(result).toBe('px-2 py-1 bg-red-500')
  })
}) 