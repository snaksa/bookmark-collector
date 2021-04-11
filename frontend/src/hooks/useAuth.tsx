import React, { createContext, useState, useContext } from "react";

export interface AuthContextProps {
  authData: string | null;
  onLogin: Function;
  onLogout: Function;
  isAuthenticated: boolean;
}

const initialProps: AuthContextProps = {
  authData: "",
  onLogin: () => {},
  onLogout: () => {},
  isAuthenticated: false,
};

export const AuthContext = createContext<AuthContextProps>(
  initialProps
);

const AuthProvider = (props: any) => {
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
  }

  const onLogin = (newAuthData: string) => {
    setAuthData(newAuthData);
    setIsAuthenticated(true);
    localStorage.setItem("token", newAuthData);
  }

  const authDataValue = { authData, onLogin, onLogout, isAuthenticated };

  return <AuthContext.Provider value={authDataValue} {...props} />;
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;