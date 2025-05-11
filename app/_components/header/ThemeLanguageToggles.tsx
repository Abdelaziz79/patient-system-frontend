import { useLanguage } from "@/app/_contexts/LanguageContext";
import { useThemeMode } from "@/app/_hooks/useThemeMode";
import { Button } from "@/components/ui/button";
import { Globe, Moon, Sun } from "lucide-react";

export default function ThemeLanguageToggles() {
  const { theme, toggleTheme } = useThemeMode();
  const { language, toggleLanguage } = useLanguage();

  return (
    <>
      {/* Language toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleLanguage}
        className="h-8 w-8 md:h-9 md:w-9 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 relative group"
      >
        <Globe className="h-4 w-4 md:h-5 md:w-5" />
        <span className="absolute top-0 right-0 text-[10px] font-bold bg-blue-600 text-white dark:bg-blue-700 dark:text-blue-50 rounded-full h-4 w-4 flex items-center justify-center transform translate-x-1 -translate-y-1">
          {language.toUpperCase()}
        </span>
      </Button>

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="h-8 w-8 md:h-9 md:w-9 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4 md:h-5 md:w-5" />
        ) : (
          <Moon className="h-4 w-4 md:h-5 md:w-5" />
        )}
      </Button>
    </>
  );
}
