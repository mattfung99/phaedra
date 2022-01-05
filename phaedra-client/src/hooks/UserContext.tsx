import { useState, useEffect, createContext } from 'react';
import authenticationService from '../services/authenticationService';
import { User } from '../models/user';
import { UserContextType, UserContextProviderProps } from '../models/userContext';

export const UserContext = createContext({
  user: null,
  setUser: (user: User | null) => {},
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated: boolean) => {},
  logout: () => {}
} as UserContextType);

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const logoutHandler = async () => {
    const data = await authenticationService.logout();
    setIsAuthenticated(data.isAuthenticated);
    setUser(data.user);
  };

  useEffect(() => {
    authenticationService.isAuthenticated().then((data) => {
      setUser(data.user);
      setIsAuthenticated(data.isAuthenticated);
      setIsLoaded(true);
    });
  }, [setIsAuthenticated]);

  const contextValue: UserContextType = {
    user: user,
    setUser: setUser,
    isAuthenticated: isAuthenticated,
    setIsAuthenticated: setIsAuthenticated,
    logout: logoutHandler
  };

  return <div>{!isLoaded ? null : <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>}</div>;
};
