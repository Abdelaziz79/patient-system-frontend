"use client";

import ar from "@/app/_locales/ar";
import en from "@/app/_locales/en";
import { TranslationKey, Translations } from "@/app/_locales/types";
import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  dir: string;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
  loading: boolean;
}

const translations = {
  en,
  ar,
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLocale, setCurrentLocale] = useState<Language>("en");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    // Get language from localStorage or browser preference
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage) {
      setCurrentLocale(savedLanguage);
      updateDocumentSettings(savedLanguage);
    }
    setLoading(false);
  }, []);

  const updateDocumentSettings = (locale: Language) => {
    setLoading(true);

    // Update direction
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";

    // Update lang attribute
    document.documentElement.lang = locale;
    setLoading(false);
  };

  const toggleLanguage = () => {
    setLoading(true);

    const newLocale = currentLocale === "en" ? "ar" : "en";
    updateDocumentSettings(newLocale);
    setCurrentLocale(newLocale);
    localStorage.setItem("language", newLocale);
    setLoading(false);
  };

  const t = (key: TranslationKey): string => {
    // If translation exists in current locale, use it, otherwise fall back to English
    return (
      (translations[currentLocale] as Translations)[key] || translations.en[key]
    );
  };

  const value = {
    language: currentLocale,
    isRTL: currentLocale === "ar",
    dir: currentLocale === "ar" ? "rtl" : "ltr",
    toggleLanguage,
    t,
    loading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
