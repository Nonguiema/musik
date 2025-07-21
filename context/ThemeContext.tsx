import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  colors: {
    background: string;
    card: string;
    text: string;
    border: string;
    primary: string;
    secondary: string;
    accent: string;
    error: string;
    success: string;
    warning: string;
    muted: string;
  };
  setTheme: (theme: ThemeMode) => void;
}

const defaultColors = {
  light: {
    background: '#F8F9FA',
    card: '#FFFFFF',
    text: '#212529',
    border: '#DEE2E6',
    primary: '#3B82F6',
    secondary: '#6366F1',
    accent: '#8B5CF6',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    muted: '#9CA3AF',
  },
  dark: {
    background: '#121212',
    card: '#1E1E1E',
    text: '#E9ECEF',
    border: '#343A40',
    primary: '#60A5FA',
    secondary: '#818CF8',
    accent: '#A78BFA',
    error: '#F87171',
    success: '#34D399',
    warning: '#FBBF24',
    muted: '#9CA3AF',
  },
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  isDark: false,
  colors: defaultColors.light,
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const [theme, setThemeState] = useState<ThemeMode>('system');
  
  useEffect(() => {
    // Load saved theme preference
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@theme');
        if (savedTheme) {
          setThemeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };
    
    loadTheme();
  }, []);
  
  const setTheme = async (newTheme: ThemeMode) => {
    try {
      await AsyncStorage.setItem('@theme', newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };
  
  // Determine if we should use dark mode
  const isDark = theme === 'system' ? colorScheme === 'dark' : theme === 'dark';
  
  // Get the appropriate colors based on the theme
  const colors = isDark ? defaultColors.dark : defaultColors.light;
  
  return (
    <ThemeContext.Provider value={{ theme, isDark, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);