import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI } from '../services/authentication';
import { User, RegisterData, AuthContextType } from '../types/user';



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await authAPI.verifyToken(storedToken);
          if (response.success && response.user) {
            setUser(response.user);
            setToken(storedToken);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.login(email, password);
      
      if (response.success && response.token && response.user) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('token', response.token);
        return true;
      } else {
        // 🔥 MOSTRAR ERRORES ESPECÍFICOS DEL BACKEND
        if (response.errors && response.errors.length > 0) {
          // Mostrar el primer error de validación
          setError(response.errors[0].msg || response.message || 'Error en el login');
        } else {
          // Mostrar mensaje general de error
          setError(response.message || 'Error en el login');
        }
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Error de conexión con el servidor');
      return false;
    } finally {
      setIsLoading(false);
    }
  };


  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.register(userData);
      
      if (response.success && response.token && response.user) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('token', response.token);
        return true;
      } else {
        // Mostrar errores específicos del backend
        if (response.errors && response.errors.length > 0) {
          setError(response.errors[0].msg || response.message || 'Error en el registro');
        } else {
          setError(response.message || 'Error en el registro');
        }
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Error de conexión');
      return false;
    } finally {
      setIsLoading(false);
    }
  };


  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('token');
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
