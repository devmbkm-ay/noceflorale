'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types
type Role = "admin" | "guest";

type User = {
  id: string;
  name: string;
  email: string;
  role?: Role;
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthInitialized: boolean;
};

// Create context with a default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage key for user data
const USER_STORAGE_KEY = "wedding_user";

// Provider component
export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState<boolean>(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem(USER_STORAGE_KEY);
        
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // In case of error, ensure user is logged out
        localStorage.removeItem(USER_STORAGE_KEY);
        setUser(null);
      } finally {
        setIsAuthInitialized(true);
      }
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to your backend
      // Simulate API call with slightly longer delay for smoother UX
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Demo login logic - in a real app, this would be handled by your API
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      // Check if user is admin based on email (for demo purposes)
      const isAdminUser = 
        email.includes("admin") || 
        email === "sidney@example.com" || 
        email === "marienelle@example.com" ||
        email === "ricardo@example.com" ||
        email === "admin@noceflorale.com";
      
      // Generate a more realistic user name from email
      let displayName = email.split('@')[0];
      
      // Special handling for known admin emails
      if (email === "sidney@example.com") displayName = "Sidney";
      if (email === "marienelle@example.com") displayName = "Marienelle";
      if (email === "ricardo@example.com") displayName = "Ricardo";
      if (email === "admin@noceflorale.com") displayName = "Admin";
      
      const userData = {
        id: Date.now().toString(), // More realistic ID generation
        name: displayName,
        email,
        role: isAdminUser ? ("admin" as Role) : ("guest" as Role),
      };
      
      // Save auth data with additional metadata
      const authData = {
        ...userData,
        loginTime: new Date().toISOString(),
        sessionId: Math.random().toString(36).substring(2, 15)
      };
      
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authData));
      
      setUser(userData);
      
      // Log successful login for debugging
      console.log(`✅ User logged in successfully:`, {
        name: userData.name,
        role: userData.role,
        isAdmin: isAdminUser
      });
      
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to your backend
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!name || !email || !password) {
        throw new Error("Name, email and password are required");
      }
      
      const userData = {
        id: '1',
        name,
        email,
        role: "guest" as Role
      };
      
      // Save auth data
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      
      setUser(userData);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if the current user is an admin
  const isAdmin = !!user && user.role === "admin";

  const value = {
    user,
    isLoading,
    login,
    logout,
    register,
    isAdmin,
    isAuthInitialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
