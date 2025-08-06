"use client";

import {createContext, useContext, useEffect, useState, ReactNode} from "react";
import {useRouter} from "next/navigation";

interface User {
  id: string;
  username: string;
  email: string;
  role: "User" | "Admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userRole?: string, username?: string) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isUser: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeToken(token: string): any {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
}

export function AuthProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("userData");

    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
      }
    } else if (token) {
      // Fallback: try to decode token
      const decoded = decodeToken(token);
      if (decoded) {
        setUser(decoded);
      } else {
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string, userRole?: string, username?: string) => {
    const decoded = decodeToken(token);
    if (decoded) {
      let userData;

      if (decoded.id && decoded.username && decoded.role) {
        userData = decoded;
      } else if (decoded.userId && userRole) {
        userData = {
          id: decoded.userId,
          username:
            username ||
            decoded.username ||
            decoded.name ||
            (userRole === "Admin" ? "myadmin" : "testuser"),
          email: decoded.email || "",
          role: userRole as "User" | "Admin",
        };
      }

      if (userData) {
        localStorage.setItem("token", token);
        localStorage.setItem("userData", JSON.stringify(userData));
        setUser(userData);
        document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setUser(null);
    router.push("/login");
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const isAdmin = (): boolean => {
    return user?.role === "Admin";
  };

  const isUser = (): boolean => {
    return user?.role === "User";
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAdmin,
    isUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
