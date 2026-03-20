import { createContext, useState, useEffect, type ReactNode } from 'react';
import { useColorScheme } from '@mui/material/styles';
import { type ThemeContextType } from '../types/ThemeContextType';

export const ThemeContext = createContext<ThemeContextType | null>(null);

type ThemeProviderRawProps = {
  children: ReactNode;
};

export const ThemeProviderRaw = ({ children }: ThemeProviderRawProps) => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const { setMode } = useColorScheme();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
      setMode?.('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      setMode?.('light');
    }
  }, [setMode]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setMode?.('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setMode?.('light');
    }
  };

  const value: ThemeContextType = {
    isDark,
    toggleTheme,
    theme: isDark ? 'dark' : 'light',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
