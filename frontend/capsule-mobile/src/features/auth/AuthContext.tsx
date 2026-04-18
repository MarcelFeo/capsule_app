import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Role } from '../../types/auth';

interface AuthContextType {
  userToken: string | null;
  userRole: Role | null;
  login: (token: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token');
        const role = await SecureStore.getItemAsync('user_role');
        if (token && role) {
          setUserToken(token);
          setUserRole(role as Role);
        }
      } catch (e) {
        console.error("erro ao carregar o token de acesso", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (token: string, role: Role) => {
    await SecureStore.setItemAsync('access_token', token);
    await SecureStore.setItemAsync('user_role', role);
    setUserToken(token);
    setUserRole(role);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('user_role');
    setUserToken(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, userRole, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};