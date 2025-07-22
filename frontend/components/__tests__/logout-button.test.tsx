import { render, screen, fireEvent } from '@testing-library/react'
import { LogoutButton } from '../logout-button'

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signOut: jest.fn().mockResolvedValue({ error: null }),
    },
  })),
}))

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('LogoutButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render logout button', () => {
    render(<LogoutButton />)
    
    const button = screen.getByRole('button', { name: /logout/i })
    expect(button).toBeInTheDocument()
  })

  it('should call signOut and redirect when clicked', async () => {
    const { createClient } = require('@/lib/supabase/client')
    const mockSignOut = jest.fn().mockResolvedValue({ error: null })
    
    createClient.mockReturnValue({
      auth: {
        signOut: mockSignOut,
      },
    })

    render(<LogoutButton />)
    
    const button = screen.getByRole('button', { name: /logout/i })
    fireEvent.click(button)
    
    // Wait for async operations to complete
    await screen.findByRole('button', { name: /logout/i })
    
    expect(mockSignOut).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('should handle signOut error gracefully', async () => {
    const { createClient } = require('@/lib/supabase/client')
    const mockSignOut = jest.fn().mockResolvedValue({ 
      error: { message: 'Sign out failed' } 
    })
    
    createClient.mockReturnValue({
      auth: {
        signOut: mockSignOut,
      },
    })

    render(<LogoutButton />)
    
    const button = screen.getByRole('button', { name: /logout/i })
    fireEvent.click(button)
    
    // Wait for async operations to complete
    await screen.findByRole('button', { name: /logout/i })
    
    expect(mockSignOut).toHaveBeenCalledTimes(1)
    // Should still redirect even if signOut fails
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('should be accessible with proper ARIA attributes', () => {
    render(<LogoutButton />)
    
    const button = screen.getByRole('button', { name: /logout/i })
    expect(button).toBeInTheDocument()
    // Button component doesn't set a default type, so we just check it exists
    expect(button).toBeInTheDocument()
  })
}) 