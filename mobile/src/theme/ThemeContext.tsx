import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, createTheme, ColorMode } from './theme';

interface ThemeContextType {
  theme: Theme;
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  toggleMode: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  initialMode?: ColorMode | 'system';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialMode = 'system',
}) => {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<ColorMode>(() => {
    if (initialMode === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return initialMode;
  });

  useEffect(() => {
    if (initialMode === 'system' && systemColorScheme) {
      setModeState(systemColorScheme === 'dark' ? 'dark' : 'light');
    }
  }, [systemColorScheme, initialMode]);

  const setMode = useCallback((newMode: ColorMode) => {
    setModeState(newMode);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const theme = createTheme(mode);
  const isDark = mode === 'dark';

  const value: ThemeContextType = {
    theme,
    mode,
    setMode,
    toggleMode,
    isDark,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
