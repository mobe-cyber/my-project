import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark';
export type Direction = 'ltr' | 'rtl';
export type Language = 'en' | 'ar';

export interface ThemeContextType {
  theme: Theme;
  direction: Direction;
  language: Language;
  toggleTheme: () => void;
  changeLanguage: (lang: Language) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};