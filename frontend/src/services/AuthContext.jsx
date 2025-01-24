// AuthContext.js
import PropTypes from "prop-types";
import { createContext, useState, useContext, useEffect } from "react";
import AuthService from "./authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (AuthService.isLoggedIn()) {
      const currentUser = AuthService.getCurrentUser();
      setUser(currentUser);
    }
    setLoading(false); // Set loading to false after checking user
  }, []);

  const login = async (username, password) => {
    const response = await AuthService.login(username, password);
    if (response.success) {
      setUser(response.user);
      return response;
    }
    return response;
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
