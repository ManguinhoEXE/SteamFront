import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../data/services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticación solo en rutas protegidas
  useEffect(() => {
    const publicRoutes = [
      '/login',
      '/password-reset-request',
      '/password-reset-confirm'
    ];
    const currentPath = window.location.pathname;
    if (!publicRoutes.includes(currentPath)) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authService.verify();
      if (response.authenticated) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Error al iniciar sesión' 
      };
    }
  };

  const register = async (data) => {
    try {
      const response = await authService.register(data);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error en registro:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Error al registrar usuario' 
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error en logout:', error);
      // Limpiar de todas formas
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
