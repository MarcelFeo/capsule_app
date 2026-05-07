import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import { mockCaregivers, mockPatients } from '../../../services/mockData';
import type { User, UserRole } from '../../../types/models';
import { createId } from '../../../utils/id';

type RegisterInput = {
  name: string;
  email: string;
  birthDate: string;
  phone: string;
  role: UserRole;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const demoUsers: User[] = [...mockPatients, ...mockCaregivers];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(demoUsers);
  const [loading, setLoading] = useState(false);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login: async (email) => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));

        const foundUser =
          registeredUsers.find((item) => item.email.toLowerCase() === email.trim().toLowerCase()) ??
          registeredUsers[0];

        setUser(foundUser);
        setLoading(false);
      },
      register: async ({ name, email, role }) => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setRegisteredUsers((current) => [
          ...current,
          {
            id: createId(role),
            name,
            email,
            role,
          },
        ]);
        setLoading(false);
      },
      logout: () => setUser(null),
    }),
    [loading, registeredUsers, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
