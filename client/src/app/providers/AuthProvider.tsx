import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiRequest } from '../../lib/api-client';

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    tokenType: string;
  };
}

interface UserResponse {
  success: boolean;
  data: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Fetch user profile if token exists
  const fetchUserProfile = async (currentToken: string) => {
    try {
      const response = await apiRequest<UserResponse>('/users/me', {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // The backend login endpoint expects OAuth2PasswordRequestForm (form-data urlencoded format)
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (response.success && response.data.accessToken) {
        const newToken = response.data.accessToken;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        await fetchUserProfile(newToken);
      } else {
        throw new Error('Login failed: Token not found in response');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const response = await apiRequest<UserResponse>('/auth/register', {
        method: 'POST',
        data: { email, password, fullName }
      });
      
      if (response.success) {
        // Automatic login after successful registration
        await login(email, password);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
