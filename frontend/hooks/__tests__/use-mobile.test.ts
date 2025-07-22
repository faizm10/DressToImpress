import { renderHook } from '@testing-library/react'
import { useIsMobile } from '../use-mobile'

// Mock window.innerWidth
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    value: width,
  })
}

// Mock matchMedia
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

describe('useIsMobile hook', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
  })

  it('should return true for mobile screen width', () => {
    mockInnerWidth(375) // Mobile width
    mockMatchMedia(true)
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(true)
  })

  it('should return false for desktop screen width', () => {
    mockInnerWidth(1024) // Desktop width
    mockMatchMedia(false)
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(false)
  })

  it('should return false for tablet screen width', () => {
    mockInnerWidth(768) // Tablet width (exactly at breakpoint)
    mockMatchMedia(false)
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(false)
  })

  it('should return true for small mobile screen width', () => {
    mockInnerWidth(320) // Small mobile width
    mockMatchMedia(true)
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(true)
  })

  it('should handle undefined initial state', () => {
    // Mock window.innerWidth to desktop size
    mockInnerWidth(1024)
    mockMatchMedia(false)
    const { result } = renderHook(() => useIsMobile())
    
    // Should be false for desktop width
    expect(result.current).toBe(false)
  })
}) 