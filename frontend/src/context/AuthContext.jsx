import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email) => {
    // Generate initials from email for avatar
    const prefix = email.split('@')[0];
    const initials = prefix.substring(0, 2).toUpperCase();
    
    const loggedUser = { 
      email, 
      name: prefix.charAt(0).toUpperCase() + prefix.slice(1), 
      initials, 
      role: 'Admin' 
    };
    
    setUser(loggedUser);
    localStorage.setItem('user', JSON.stringify(loggedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
