import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

// Constants for storage keys and expiration time (30 minutes)
const USER_STORAGE_KEY = "user";
const USER_EXPIRY_KEY = "user_expiry";
const EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes in ms

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage if not expired
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        const expiry = localStorage.getItem(USER_EXPIRY_KEY);
        const now = Date.now();

        if (storedUser && expiry && now < Number(expiry)) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          return true;
        } else {
          clearStorage();
          return false;
        }
      } catch (error) {
        console.error("Error loading user from storage:", error);
        clearStorage();
        return false;
      }
    };

    const hasValidUser = loadUserFromStorage();

    if (!hasValidUser) {
      fetchUser(false); // full fetch
    } else {
      // Refresh silently in background
      fetchUser(true);
      setLoading(false);
    }
  }, []);

  const clearStorage = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(USER_EXPIRY_KEY);
  };

  const fetchUser = async (silent = false) => {
    if (!silent) setLoading(true);

    try {
      const res = await api.get("/api/user", { withCredentials: true });

      if (res.data?.name) {
        setUser(res.data);
        const expiryTime = Date.now() + EXPIRY_TIME;
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data));
        localStorage.setItem(USER_EXPIRY_KEY, expiryTime.toString());
      } else {
        setUser(null);
        clearStorage();
      }
    } catch (err) {
      console.error("Fetch user failed:", err);
      if (!silent) {
        setUser(null);
        clearStorage();
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const login = (provider) => {
    clearStorage();
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  const logout = async () => {
    try {
      await api.post("/api/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout API call failed:", err);
    } finally {
      clearStorage();
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
