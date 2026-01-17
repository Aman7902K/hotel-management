import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = async (userData) => {
    try {
      const { data } = await authAPI. register(userData);
      
      // ✅ Validate response has required data
      if (data && data.token) {
        setUser(data);
        localStorage.setItem('user', JSON. stringify(data));
        return { success: true, data };
      } else {
        throw new Error('Invalid response from server - missing token');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Registration failed',
      };
    }
  };

const login = async (email, password) => {
  try {
    // ✅ Pass as object, not stringified
    const { data } = await authAPI.login({ email, password });

    console.log('Login response:', data);
    
    if (data && data.token) {
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true, data };
    } else {
      throw new Error('Invalid response from server - missing token');
    }
  } catch (error) {
    console.error('Login error:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Login failed',
    };
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;