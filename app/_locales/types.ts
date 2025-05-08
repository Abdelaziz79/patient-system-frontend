import en from "./en";

// Extract key type from the English locale
export type TranslationKey = keyof typeof en;

// This ensures all translations follow the same structure
export type Translations = typeof en;
