import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");

  let parsedUser = null;
  if (storedUser && storedUser !== "undefined") {
    try {
      parsedUser = JSON.parse(storedUser);
    } catch (e) {
      console.error("Failed to parse stored user", e);
      localStorage.removeItem("user");
    }
  }

  const [user, setUser] = useState<User | null>(parsedUser);
  const [token, setToken] = useState<string | null>(storedToken);

  const login = (newToken: string, newUser: User) => {
    if (!newToken || !newUser) return;
    // Normalize role to uppercase so ProtectedRoute comparisons always match
    const normalizedUser: User = {
      ...newUser,
      role: (newUser.role ?? "").replace(/^ROLE_/i, "").toUpperCase(),
    };
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setToken(newToken);
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export default AuthContext;
