# Authentication System Documentation

This document explains how to use the authentication system implemented in the DJ Giveaways project.

## Overview

The authentication system is built using:
- **React 18+** with TypeScript
- **TanStack Query v5+** for server state management
- **Zustand** for client state management with persistence
- **Axios** for HTTP requests with interceptors
- **React Router** for navigation

## Architecture

### 1. Token Management (`src/utils/token.ts`)
Simple utilities for managing authentication tokens in localStorage.

```typescript
import { setToken, getToken, clearToken, isAuthenticated } from '../utils/token';

// Set token after successful login
setToken('your-jwt-token');

// Check if user is authenticated
if (isAuthenticated()) {
  // User is logged in
}

// Clear token on logout
clearToken();
```

### 2. API Client (`src/services/api.ts`)
Axios instance with automatic token injection and error handling.

- Automatically adds `Authorization: Bearer <token>` header to requests
- Handles 401 errors by clearing tokens and redirecting to login
- Global error handling with toast notifications

### 3. Auth Service (`src/services/authService.ts`)
Service layer for authentication API calls.

```typescript
import { authService } from '../services/authService';

// Login
const response = await authService.login({ email, password });

// Register
const response = await authService.register(userData);

// Get profile
const profile = await authService.getProfile();
```

### 4. Auth Store (`src/store/useAuthStore.ts`)
Zustand store with persistence for authentication state.

```typescript
import { useAuthStore } from '../store/useAuthStore';

const { user, isAuthenticated, isLoading, setAuth, logout } = useAuthStore();
```

### 5. Auth Hooks (`src/hooks/useAuth.ts` & `src/hooks/useAuthQuery.ts`)
React hooks for authentication operations.

```typescript
import { useAuth } from '../hooks/useAuth';
import { useLogin, useRegister, useLogout } from '../hooks/useAuthQuery';

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const login = useLogin();
  const register = useRegister();
  const logout = useLogout();

  // Use the hooks...
}
```

## Usage Examples

### 1. Login Form

```typescript
import { useLogin } from '../hooks/useAuthQuery';

function LoginForm() {
  const login = useLogin();

  const handleSubmit = async (credentials) => {
    try {
      await login.mutateAsync(credentials);
      // User is now logged in and redirected
    } catch (error) {
      // Error is handled automatically with toast notifications
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      <button type="submit" disabled={login.isPending}>
        {login.isPending ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

### 2. Protected Route

```typescript
import ProtectedRoute from '../components/auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
```

### 3. Conditional Rendering

```typescript
import { useAuth } from '../hooks/useAuth';

function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <header>
      {isAuthenticated ? (
        <div>
          Welcome, {user?.firstName}!
          <button onClick={() => logout()}>Logout</button>
        </div>
      ) : (
        <div>
          <Link to="/auth/login">Login</Link>
          <Link to="/auth/register">Register</Link>
        </div>
      )}
    </header>
  );
}
```

### 4. Profile Management

```typescript
import { useProfile } from '../hooks/useAuthQuery';

function ProfilePage() {
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div>Error loading profile</div>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {profile?.firstName} {profile?.lastName}</p>
      <p>Email: {profile?.email}</p>
    </div>
  );
}
```

## API Endpoints

The authentication system expects the following API endpoints:

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | Login user | No |
| POST | `/auth/register` | Register new user | No |
| GET | `/auth/profile` | Get current user profile | Yes |
| PUT | `/auth/profile` | Update user profile | Yes |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password with token | No |
| POST | `/auth/verify-email` | Verify email with token | No |
| POST | `/auth/logout` | Logout user | Yes |

## Type Definitions

### User Interface
```typescript
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin' | 'moderator';
  isVerified: boolean;
  isActive: boolean;
  subscribedToNewsletter: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Auth Response
```typescript
interface AuthResponse {
  token: string;
  user: User;
}
```

### Login Request
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

### Register Request
```typescript
interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  subscribedToNewsletter?: boolean;
}
```

## Environment Variables

Create a `.env` file in your project root:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## Error Handling

The system includes comprehensive error handling:

1. **Network errors** - Displayed via toast notifications
2. **401 Unauthorized** - Automatically clears tokens and redirects to login
3. **403 Forbidden** - Shows permission denied message
4. **500 Server Error** - Shows generic server error message
5. **Validation errors** - Handled at the form level

## Security Features

1. **Token Storage** - JWT tokens stored in localStorage
2. **Automatic Token Injection** - Tokens automatically added to API requests
3. **Token Expiration** - Automatic logout on 401 responses
4. **Persistent State** - Authentication state persists across browser sessions
5. **Secure Headers** - Proper Content-Type and Authorization headers

## Best Practices

1. **Always use the hooks** - Don't call the store directly in components
2. **Handle loading states** - Use `isLoading` from `useAuth()`
3. **Error boundaries** - Wrap your app in error boundaries for better UX
4. **Type safety** - Use TypeScript interfaces for all auth-related data
5. **Testing** - Mock the auth hooks in your tests

## Troubleshooting

### Common Issues

1. **Token not being sent**
   - Check if token is stored in localStorage
   - Verify axios interceptor is working

2. **401 errors on every request**
   - Token might be expired
   - Check if token format is correct

3. **User data not persisting**
   - Ensure `initializeAuth` is called on app mount
   - Check Zustand persistence configuration

4. **Infinite loading**
   - Check if profile query is enabled correctly
   - Verify API endpoints are responding

### Debug Mode

Enable React Query DevTools to debug queries:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## Migration Guide

If you're updating from an older version:

1. Update your types to match the new interfaces
2. Replace direct store calls with hooks
3. Update your API endpoints to match the expected format
4. Test all authentication flows thoroughly

## Support

For issues or questions about the authentication system, please check:
1. This documentation
2. The example components in `src/components/auth/`
3. The test files for usage examples
