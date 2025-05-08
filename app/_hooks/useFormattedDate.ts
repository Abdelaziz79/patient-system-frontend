import { useLanguage } from "@/app/_contexts/LanguageContext";
import { formatDistanceToNow } from "date-fns";
import { useCallback } from "react";

/**
 * Hook for formatted dates based on the current language
 */
export function useFormattedDate() {
  const { language } = useLanguage();

  /**
   * Format a date to a localized string
   */
  const formatDate = useCallback(
    (dateString: string) => {
      if (!dateString) return "";

      const date = new Date(dateString);

      if (isNaN(date.getTime())) return "";

      return date.toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    [language]
  );

  /**
   * Format a date to a relative time string (e.g. "2 days ago")
   */
  const formatRelativeTime = useCallback((dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "";

    return formatDistanceToNow(date, {
      addSuffix: true,
    });
  }, []);

  return {
    formatDate,
    formatRelativeTime,
  };
}
