"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { ThemeStyleInjector } from '@/components/logic/ThemeStyleInjector'; // <-- 1. تم إضافة هذا السطر

interface ThemeColors {
  accentColor: string;
  accentTextColor: string;
  lightBg: string;
  lightBgSecondary: string;
  lightTextPrimary: string;
  lightTextSecondary: string;
  darkBg: string;
  darkBgSecondary: string;
  darkTextPrimary: string;
  darkTextSecondary: string;
}

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  colors: ThemeColors | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark');
  const [colors, setColors] = useState<ThemeColors | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function fetchThemeColors() {
      try {
        const response = await fetch('/api/theme-colors');
        if (!response.ok) {
          throw new Error(`Failed to fetch theme colors with status: ${response.status}`);
        }
        const colorsJson = await response.json();
        setColors(colorsJson);
        console.log("✅ Theme colors fetched successfully via API Route:", colorsJson);
      } catch (error) {
        console.error("🔴 Failed to fetch theme colors:", error);
      }
    }
    fetchThemeColors();
  }, []);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('theme') === 'dark' || 
                       (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const initialTheme = isDarkMode ? 'dark' : 'light';
    setThemeState(initialTheme);
    const root = window.document.documentElement;
    root.classList.remove(initialTheme === 'dark' ? 'light' : 'dark');
    root.classList.add(initialTheme);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const setTheme = (newTheme: 'light' | 'dark') => {
    const root = window.document.documentElement
    root.classList.remove(theme)
    root.classList.add(newTheme)
    localStorage.setItem('theme', newTheme)
    setThemeState(newTheme)
  }

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors }}>
      <ThemeStyleInjector /> {/* <-- 2. تم إضافة هذا السطر */}
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}