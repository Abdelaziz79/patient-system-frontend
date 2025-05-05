// Import en locale as the base for typing
import en from "@/app/_locales/en";
import ar from "./ar";

// Define Translation type based on the English locale
export type TranslationKey = keyof typeof en | string;

// This ensures all translations follow the same structure
export type Translations = Record<TranslationKey, string>;
