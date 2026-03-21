import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../api";

const AuthContext = createContext(null);

const GUEST_INITIAL = { 
  id: "6673f0000000000000000000", 
  _id: "6673f0000000000000000000",
  name: "Guest User", 
  email: "guest@interviewai.com",
  role: "user"
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(GUEST_INITIAL);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Just ensure guest user is set
    setUser(GUEST_INITIAL);
    setLoading(false);
  }, []);

  const login = useCallback(async () => {
    setUser(GUEST_INITIAL);
    return { success: true, user: GUEST_INITIAL };
  }, []);

  const register = useCallback(async () => {
    setUser(GUEST_INITIAL);
    return { success: true, user: GUEST_INITIAL };
  }, []);

  const logout = useCallback(() => {
    // Disable logout to keep simplicity, or just keep guest state
    console.log("Logout bypassed in Guest Mode");
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
