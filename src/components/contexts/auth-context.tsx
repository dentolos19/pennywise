"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";

type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  description: string | null;
  points: number;
  monthlyBudget: number | null;
  createdAt: Date;
  updatedAt: Date;
};

type Session = {
  id: string;
  expiresAt: Date;
  token: string;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
};

type AuthContextProps = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextProps>({
  loading: true,
  session: null,
  user: null,
  login: () => {
    throw new Error("Function not implemented.");
  },
  logout: () => {
    throw new Error("Function not implemented.");
  },
  register: () => {
    throw new Error("Function not implemented.");
  },
  refresh: () => {
    throw new Error("Function not implemented.");
  },
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider(props: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });
    if (error) throw error;
    if (data) {
      setSession(data.session as Session);
      setUser(data.user as User);
    }
  };

  const logout = async () => {
    await authClient.signOut();
    setSession(null);
    setUser(null);
  };

  const register = async (email: string, password: string, name?: string) => {
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name: name || email.split("@")[0],
    });
    if (error) throw error;
    if (data) {
      setSession(data.session as Session);
      setUser(data.user as User);
    }
  };

  const refresh = async () => {
    try {
      const { data } = await authClient.getSession();
      if (data) {
        setSession(data.session as Session);
        setUser(data.user as User);
      } else {
        setSession(null);
        setUser(null);
      }
    } catch {
      setSession(null);
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ loading, user, session, login, logout, register, refresh }}>
      {props.children}
    </AuthContext.Provider>
  );
}
