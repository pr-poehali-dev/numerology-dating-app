import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'purple' | 'blue' | 'green' | 'orange' | 'pink';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes: Record<Theme, { primary: string; secondary: string; name: string }> = {
  purple: {
    primary: '280 80% 60%',
    secondary: '300 70% 50%',
    name: 'Фиолетовая'
  },
  blue: {
    primary: '210 100% 50%',
    secondary: '200 100% 45%',
    name: 'Синяя'
  },
  green: {
    primary: '150 80% 40%',
    secondary: '160 70% 35%',
    name: 'Зелёная'
  },
  orange: {
    primary: '25 95% 53%',
    secondary: '20 90% 48%',
    name: 'Оранжевая'
  },
  pink: {
    primary: '330 80% 60%',
    secondary: '340 75% 55%',
    name: 'Розовая'
  }
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('app-theme');
    return (saved as Theme) || 'purple';
  });

  useEffect(() => {
    const root = document.documentElement;
    const colors = themes[theme];
    
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--accent', colors.primary);
    root.style.setProperty('--ring', colors.primary);
    root.style.setProperty('--sidebar-primary', colors.primary);
    root.style.setProperty('--sidebar-ring', colors.primary);
    
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
