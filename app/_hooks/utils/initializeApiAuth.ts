import { initializeAuth } from "./authUtils";

/**
 * Global function to initialize authentication across all API modules.
 * This should be called as early as possible in your application.
 * Ideally from _app.tsx or a global layout component.
 */
export const initializeApiAuth = () => {
  // Initialize auth from localStorage
  initializeAuth();
};

/**
 * Function to load auth token as soon as the module is imported
 * This is useful for server-side rendering environments
 */
export const bootstrapAuth = (() => {
  // Check if we're in the browser environment before accessing localStorage
  if (typeof window !== "undefined") {
    initializeAuth();
  }
  return true;
})();
