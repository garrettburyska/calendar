import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5050/api/user/check-session", {
        credentials: "include",
      });

      const data = await res.json();

      if (data.loggedIn) {
        if (!loggedIn) setLoggedIn(true);
        setUser(data.user);
      } else {
        if (loggedIn) setLoggedIn(false);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [loggedIn]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5050/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        await checkSession();
        return true;
      } else {
        const errorData = await res.json();
        console.error(errorData.message);
        return false;
      }
    } catch (e) {
      console.error("Login error:", e);
      return false;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:5050/api/user/logout", {
        method: "POST",
        credentials: "include",
      });
      setLoggedIn(false);
      setUser(null);
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ loggedIn, loading, user, login, logout }}>
      {!loading && children}
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
}