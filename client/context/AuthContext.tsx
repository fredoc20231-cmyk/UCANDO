import React, { createContext, useContext, useState, ReactNode } from "react";

// NOTE: This is a placeholder auth gate for demo purposes.
// Production auth (e.g., OAuth2/OIDC/SAMLP) must replace this before real deployment.

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email?: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (email = "dr.vance@demo-cancercenter.org", name = "Dr. Alex Rivera, MD") => {
    setIsAuthenticated(true);
    setUser({
      id: "usr-001",
      name,
      email,
      role: "Attending Oncologist",
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
