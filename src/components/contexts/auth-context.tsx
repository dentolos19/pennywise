"use client";

import { getUser, loginUser, logoutUser, registerUser } from "@/lib/auth";
import { User, UserInfo, UserInfoDocument } from "@/lib/integrations/appwrite/types";
import { Models } from "appwrite";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextProps = {
  loading: boolean;
  session?: Models.Session;
  user?: User;
  userInfo?: UserInfo;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextProps>({
  loading: true,
  session: undefined,
  user: undefined,
  userInfo: undefined,
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
  const [session, setSession] = useState<Models.Session>();
  const [user, setUser] = useState<User>();
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const login = async (email: string, password: string) => {
    await loginUser(email, password).then((data) => {
      setSession(data.session);
      setUser(data.user);
      setUserInfo(data.userInfo);
    });
  };

  const logout = async () => {
    await logoutUser().then(() => {
      setSession(undefined);
      setUser(undefined);
      setUserInfo(undefined);
    });
  };

  const register = async (email: string, password: string, name?: string) => {
    await registerUser(email, password, name).then((data) => {
      setSession(data.session);
      setUser(data.user);
      setUserInfo(data.userInfo);
    });
  };

  const refresh = async () => {
    await getUser().then((data) => {
      if (data) {
        setSession(data.session);
        setUser(data.user);
        setUserInfo(data.userInfo as UserInfoDocument);
      } else {
        setUser(undefined);
        setSession(undefined);
        setUserInfo(undefined);
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ loading, user, userInfo, session, login, logout, register, refresh }}>
      {props.children}
    </AuthContext.Provider>
  );
}
