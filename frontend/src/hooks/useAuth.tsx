import React, { createContext, useState, useContext, ReactNode } from "react";

export interface AuthContextProps {
  authData: string | null;
  onLogin: (token: string) => void;
  onLogout: () => void;
  isAuthenticated: boolean;
}

const initialProps: AuthContextProps = {
  authData: "",
  onLogin: () => {
    throw "not implemented";
  },
  onLogout: () => {
    throw "not implemented";
  },
  isAuthenticated: false,
};

export const AuthContext = createContext<AuthContextProps>(initialProps);

const AuthProvider = (props: { children: ReactNode }): JSX.Element => {
  const [authData, setAuthData] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  if (authData === null) {
    const token = localStorage.getItem("token");
    setAuthData(token ?? "");
    setIsAuthenticated(!!token);
  }

  const onLogout = () => {
    setAuthData("");
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  const onLogin = (newAuthData: string) => {
    setAuthData(newAuthData);
    setIsAuthenticated(true);
    localStorage.setItem("token", newAuthData);
  };

  const authDataValue = { authData, onLogin, onLogout, isAuthenticated };

  return <AuthContext.Provider value={authDataValue} {...props} />;
};

export const useAuth = (): AuthContextProps => useContext(AuthContext);

export default AuthProvider;
