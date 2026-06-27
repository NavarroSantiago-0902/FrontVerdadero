import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('rm_token') || '');
  const [user, setUser] = useState(localStorage.getItem('rm_user') || '');

  const login = (tok, username) => {
    setToken(tok);
    setUser(username);
    localStorage.setItem('rm_token', tok);
    localStorage.setItem('rm_user', username);
  };

  const logout = () => {
    setToken('');
    setUser('');
    localStorage.removeItem('rm_token');
    localStorage.removeItem('rm_user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
