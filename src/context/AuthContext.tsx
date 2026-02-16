import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as authApi from "../api/auth";

type AuthState = {
  user: authApi.AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<authApi.AuthUser | null>>;
};

const AuthContext = createContext<AuthState | null>(null);

function safeReadUser(): authApi.AuthUser | null {
  try {
    const raw = localStorage.getItem("gls_user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function safeWriteUser(u: authApi.AuthUser | null) {
  try {
    if (!u) {
      localStorage.removeItem("gls_user");
      return;
    }
    localStorage.setItem("gls_user", JSON.stringify(u));
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<authApi.AuthUser | null>(safeReadUser());
  const [loading, setLoading] = useState<boolean>(true);

  // Only active users are authenticated
  const isAuthenticated = !!user && String(user.status).toLowerCase() === "active";

  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        const token = localStorage.getItem("gls_token");

        // ✅ no token => finish boot immediately
        if (!token) {
          if (mounted) setLoading(false);
          return;
        }

        // ✅ if backend has /auth/me this refreshes user state
        const u = await authApi.me();
        if (mounted && u) {
          setUser(u);
          safeWriteUser(u);
        }
      } catch {
        // fallback to cached user (already loaded from localStorage)
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();
    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      setUser,
      loading,
      isAuthenticated,

      login: async (email, password) => {
        const res = await authApi.login({ email, password });

        // store user if provided
        const nextUser =
          res.user && Object.keys(res.user).length > 0 ? res.user : safeReadUser();

        if (nextUser) {
          setUser(nextUser);
          safeWriteUser(nextUser);
        } else {
          setUser(null);
          safeWriteUser(null);
        }

        // ✅ Block inactive/blocked users immediately
        const status = String(nextUser?.status || "").toLowerCase();
        if (status && status !== "active") {
          await authApi.logout();
          localStorage.removeItem("gls_token");
          setUser(null);
          safeWriteUser(null);
          throw new Error("Your account is not active. Please contact admin.");
        }
      },

      logout: async () => {
        await authApi.logout();
        localStorage.removeItem("gls_token");
        setUser(null);
        safeWriteUser(null);
      },
    }),
    [user, loading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
