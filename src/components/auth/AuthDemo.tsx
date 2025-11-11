import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLogin, useRegister, useLogout } from '../../hooks/useAuthQuery';
import Button from '../common/Button/Button';

const AuthDemo: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const login = useLogin();
  const register = useRegister();
  const logout = useLogout();

  const handleLogin = async () => {
    try {
      await login.mutateAsync({
        email: 'demo@example.com',
        password: 'password123',
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async () => {
    try {
      await register.mutateAsync({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        subscribedToNewsletter: true,
      });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleLogout = () => {
    logout.mutate();
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p>Loading authentication state...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Authentication Demo</h3>
      
      {isAuthenticated ? (
        <div>
          <p className="mb-2">Welcome, {user?.firstName} {user?.lastName}!</p>
          <p className="mb-4 text-sm text-gray-600">Email: {user?.email}</p>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="mb-4">You are not logged in.</p>
          <div className="flex space-x-2">
            <Button onClick={handleLogin} disabled={login.isPending}>
              {login.isPending ? 'Logging in...' : 'Demo Login'}
            </Button>
            <Button onClick={handleRegister} variant="outline" disabled={register.isPending}>
              {register.isPending ? 'Registering...' : 'Demo Register'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthDemo;
