import React, { createContext, useContext, useState, useMemo } from 'react';
import { colors } from '@/constants/theme';

type ThemeContextType = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  theme: typeof colors.light;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(() => (darkMode ? colors.dark : colors.light), [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
