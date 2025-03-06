// components/Header.tsx
"use client";

import { Button } from "@/components/ui/button";
import { HeartPulseIcon, MoonIcon, SunIcon } from "lucide-react";
import Link from "next/link";
import { useThemeMode } from "../_hooks/useThemeMode";

export default function Header() {
  const { mounted, theme, toggleTheme } = useThemeMode();

  // Don't render theme toggle until mounted to prevent hydration mismatch
  const renderThemeToggle = () => {
    if (!mounted) return null;

    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <SunIcon className="h-5 w-5" />
        ) : (
          <MoonIcon className="h-5 w-5" />
        )}
      </button>
    );
  };

  return (
    <header className="sticky top-0 w-full p-4 backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 border-b border-blue-100 dark:border-blue-900 z-20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900"
          >
            المساعدة
          </Button>
          <Button
            variant="ghost"
            className="text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900"
          >
            اتصل بنا
          </Button>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 text-blue-700 dark:text-blue-300"
        >
          <span className="font-bold text-xl"> نظام إدارة المرضى</span>
          <HeartPulseIcon className="h-6 w-6" />
        </Link>

        {renderThemeToggle()}
      </div>
    </header>
  );
}
