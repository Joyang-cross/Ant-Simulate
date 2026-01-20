import { useState, useEffect } from "react";

export type Theme = "dark" | "light";

const THEME_KEY = "ant-simulate-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // localStorage에서 저장된 테마 가져오기
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(THEME_KEY) as Theme;
      if (saved) return saved;
    }
    // 기본값: 다크모드
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
    
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setDarkMode = () => setTheme("dark");
  const setLightMode = () => setTheme("light");

  return {
    theme,
    isDark: theme === "dark",
    isLight: theme === "light",
    toggleTheme,
    setDarkMode,
    setLightMode,
    setTheme,
  };
}
