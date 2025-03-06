import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

export const useThemeMode = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  const toggleTheme = () => {
    if (currentTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return {
    theme: currentTheme as ThemeMode,
    setTheme,
    toggleTheme,
    mounted,
  };
};
