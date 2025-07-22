# Jest Unit Testing Guide

This guide will help you understand how to write and run unit tests for your Next.js frontend project.

## 🚀 Getting Started

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Test File Structure

Tests should be placed in `__tests__` folders next to the files they test:

```
components/
├── __tests__/
│   └── logout-button.test.tsx
├── logout-button.tsx
└── login-form.tsx

hooks/
├── __tests__/
│   └── use-mobile.test.ts
└── use-mobile.ts

lib/
├── __tests__/
│   └── utils.test.ts
└── utils.ts
```

## 📝 Writing Tests

### 1. Testing Utility Functions

Utility functions are the easiest to test because they're pure functions with no side effects.

**Example: `lib/utils.ts`**
```typescript
import { cn } from '../utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-2 py-1', 'bg-red-500', 'text-white')
    expect(result).toBe('px-2 py-1 bg-red-500 text-white')
  })
})
```

### 2. Testing Custom Hooks

Use `@testing-library/react`'s `renderHook` to test custom hooks.

**Example: `hooks/use-mobile.ts`**
```typescript
import { renderHook } from '@testing-library/react'
import { useIsMobile } from '../use-mobile'

describe('useIsMobile hook', () => {
  it('should return true for mobile screen width', () => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 375,
    })
    
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })
})
```

### 3. Testing React Components

Use `@testing-library/react` to test components by simulating user interactions.

**Example: `components/logout-button.tsx`**
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { LogoutButton } from '../logout-button'

describe('LogoutButton', () => {
  it('should call signOut when clicked', async () => {
    render(<LogoutButton />)
    
    const button = screen.getByRole('button', { name: /logout/i })
    fireEvent.click(button)
    
    // Assert expected behavior
    expect(mockSignOut).toHaveBeenCalled()
  })
})
```

## 🎯 Testing Best Practices

### 1. Test Structure (AAA Pattern)

```typescript
describe('ComponentName', () => {
  it('should do something specific', () => {
    // Arrange - Set up test data and mocks
    const mockData = { id: 1, name: 'Test' }
    
    // Act - Execute the function/component
    const result = someFunction(mockData)
    
    // Assert - Verify the expected outcome
    expect(result).toBe(expectedValue)
  })
})
```

### 2. Mocking External Dependencies

```typescript
// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signOut: jest.fn().mockResolvedValue({ error: null }),
    },
  })),
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))
```

### 3. Testing Async Functions

```typescript
it('should handle async operations', async () => {
  render(<AsyncComponent />)
  
  const button = screen.getByRole('button')
  fireEvent.click(button)
  
  // Wait for async operations
  await screen.findByText('Success')
  
  expect(screen.getByText('Success')).toBeInTheDocument()
})
```

### 4. Testing User Interactions

```typescript
it('should update form values', () => {
  render(<LoginForm />)
  
  const emailInput = screen.getByLabelText(/email/i)
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
  
  expect(emailInput).toHaveValue('test@example.com')
})
```

## 🔧 Common Testing Patterns

### 1. Testing Form Submissions

```typescript
it('should submit form with correct data', async () => {
  const mockSubmit = jest.fn()
  render(<Form onSubmit={mockSubmit} />)
  
  const emailInput = screen.getByLabelText(/email/i)
  const passwordInput = screen.getByLabelText(/password/i)
  const submitButton = screen.getByRole('button', { name: /submit/i })
  
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
  fireEvent.change(passwordInput, { target: { value: 'password123' } })
  fireEvent.click(submitButton)
  
  expect(mockSubmit).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  })
})
```

### 2. Testing Error States

```typescript
it('should display error message', async () => {
  render(<Component />)
  
  const button = screen.getByRole('button')
  fireEvent.click(button)
  
  await screen.findByText(/error message/i)
  expect(screen.getByText(/error message/i)).toBeInTheDocument()
})
```

### 3. Testing Loading States

```typescript
it('should show loading state', async () => {
  render(<Component />)
  
  const button = screen.getByRole('button')
  fireEvent.click(button)
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
  
  // Wait for loading to complete
  await screen.findByText(/complete/i)
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
})
```

## 📊 Coverage Reports

The project is configured to generate coverage reports. Run:

```bash
npm run test:coverage
```

This will show:
- **Statements**: Percentage of statements executed
- **Branches**: Percentage of conditional branches executed
- **Functions**: Percentage of functions called
- **Lines**: Percentage of lines executed

## 🚨 Troubleshooting

### Common Issues

1. **"toBeInTheDocument is not a function"**
   - Make sure `@testing-library/jest-dom` is imported in `jest.setup.js`

2. **"Cannot find module"**
   - Check that the import path is correct
   - Ensure the module exists and is exported

3. **"window is not defined"**
   - Mock browser APIs in your test setup
   - Use `jest-environment-jsdom`

4. **Async test failures**
   - Use `await` for async operations
   - Use `screen.findBy*` instead of `screen.getBy*` for async elements

### Debugging Tests

```typescript
// Add this to see what's rendered
screen.debug()

// Or debug a specific element
screen.debug(screen.getByRole('button'))
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library User Events](https://testing-library.com/docs/user-event/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

## 🎯 What to Test Next

Based on your codebase, here are some good candidates for testing:

1. **Form Components**: `login-form.tsx`, `sign-up-form.tsx`
2. **Data Processing**: Functions in `lib/data.ts`
3. **Custom Hooks**: `use-attires.ts`, `use-supabase-upload.ts`
4. **UI Components**: `Button`, `Input`, `Card` components
5. **Business Logic**: Any utility functions or data transformations

Start with simple utility functions and gradually work your way up to more complex components! 