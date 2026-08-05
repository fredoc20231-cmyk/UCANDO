import React, { createContext, useContext, useState, ReactNode } from "react";

// NOTE: This is a placeholder auth gate for demo purposes.
// Production auth (e.g., OAuth2/OIDC/SAMLP) must replace this before real deployment.

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string;
  avatarInitial: string;
}

export const DEMO_USERS: User[] = [
  {
    id: "usr-md-001",
    name: "Dr. Alex Rivera, MD",
    email: "alex.rivera@ucando-health.org",
    role: "Attending Oncologist (MD)",
    title: "Clinician & Lead Medical Oncologist",
    avatarInitial: "AR"
  },
  {
    id: "usr-bio-002",
    name: "Dr. Jordan Chen, PhD",
    email: "j.chen@ucando-omics.org",
    role: "Bioinformatician (PhD)",
    title: "Genomic Pipeline & Multiomics Director",
    avatarInitial: "JC"
  },
  {
    id: "usr-adm-003",
    name: "Elena Vance, JD",
    email: "elena.vance@ucando-governance.org",
    role: "Compliance & Safety Officer (Admin)",
    title: "Chief Compliance Officer & Security Admin",
    avatarInitial: "EV"
  },
  {
    id: "usr-irb-004",
    name: "Dr. Marcus Vance, IRB Chair",
    email: "marcus.vance@ucando-irb.org",
    role: "Data Steward & IRB Chair",
    title: "IRB Protocol & DUC Administrator",
    avatarInitial: "MV"
  }
];

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (selectedUser?: User) => void;
  logout: () => void;
  switchUser: (selectedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(DEMO_USERS[0]);

  const login = (selectedUser?: User) => {
    setIsAuthenticated(true);
    setUser(selectedUser || DEMO_USERS[0]);
  };

  const switchUser = (selectedUser: User) => {
    setUser(selectedUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, switchUser }}>
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
