import React from 'react';
import { User } from './user';

export type UserContextType = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  logout: () => void;
};

export type UserContextProviderProps = {
  children: React.ReactNode;
};
