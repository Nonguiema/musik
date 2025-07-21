import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
} | null;

type AuthContextType = {
  user: User;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkLoginStatus = async () => {
      try {
        const userJson = await AsyncStorage.getItem('@user');
        
        if (userJson) {
          setUser(JSON.parse(userJson));
          // If user is logged in but on auth page, redirect to home
          if (router.pathname?.startsWith('/(auth)')) {
            router.replace('/(tabs)');
          }
        } else if (!router.pathname?.startsWith('/(auth)')) {
          // If no user and not on auth page, redirect to login
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (email: string, password: string) => {
  try {
    setIsLoading(true);

  const response = await fetch('http://192.168.1.113:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Échec de la connexion');
    }

    const userData = {
      id: data.user._id,
      name: data.user.name,
      email: data.user.email,
      isAdmin: data.user.isAdmin,
    };

    await AsyncStorage.setItem('@user', JSON.stringify(userData));
    setUser(userData);
    router.replace('/(tabs)');
  } catch (error) {
    console.error('Erreur de connexion :', error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};


  const register = async (name: string, email: string, password: string) => {
  try {
    setIsLoading(true);

   const response = await fetch('http://192.168.1.113:3000/api/auth/register', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Échec de l\'inscription');
    }

    const userData = {
      id: data.user._id,
      name: data.user.name,
      email: data.user.email,
      isAdmin: data.user.isAdmin,
    };

    await AsyncStorage.setItem('@user', JSON.stringify(userData));
    setUser(userData);
    router.replace('/(tabs)');
  } catch (error) {
    console.error('Erreur d\'inscription :', error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};


  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@user');
      setUser(null);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);