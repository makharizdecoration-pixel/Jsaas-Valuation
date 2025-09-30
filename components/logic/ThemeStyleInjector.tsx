"use client"

import { useEffect, useState, useMemo } from "react";

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

export const ThemeStyleInjector = () => {
  const [colors, setColors] = useState<ThemeColors | null>(null);

  useEffect(() => {
    async function fetchThemeColors() {
      try {
        const response = await fetch('/api/theme-colors');
        if (!response.ok) {
          throw new Error(`Failed to fetch theme colors with status: ${response.status}`);
        }
        const colorsJson = await response.json();
        setColors(colorsJson);
      } catch (error) {
        console.error("🔴 Failed to fetch theme colors from Injector:", error);
      }
    }
    fetchThemeColors();
  }, []);

  const cssVariables = useMemo(() => {
    if (!colors) return '';
    const lightVars = `
      --color-accent: ${colors.accentColor};
      --color-accent-text: ${colors.accentTextColor};
      --color-background: ${colors.lightBg};
      --color-background-secondary: ${colors.lightBgSecondary};
      --color-text-primary: ${colors.lightTextPrimary};
      --color-text-secondary: ${colors.lightTextSecondary};
      --color-border: ${colors.lightBgSecondary};
    `;
    const darkVars = `
      --color-accent: ${colors.accentColor};
      --color-accent-text: ${colors.accentTextColor};
      --color-background: ${colors.darkBg};
      --color-background-secondary: ${colors.darkBgSecondary};
      --color-text-primary: ${colors.darkTextPrimary};
      --color-text-secondary: ${colors.darkTextSecondary};
      --color-border: ${colors.darkBgSecondary};
    `;
    return `
      :root {
        ${lightVars}
      }
      .dark {
        ${darkVars}
      }
    `;
  }, [colors]);

  if (!colors) return null;

  return <style dangerouslySetInnerHTML={{ __html: cssVariables }} />;
};