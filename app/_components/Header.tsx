"use client";

import { Button } from "@/components/ui/button";
import {
  BellIcon,
  ChevronDown,
  HeartPulseIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useThemeMode } from "../_hooks/useThemeMode";
import { useAuthContext } from "../_providers/AuthProvider";

export default function Header() {
  const { mounted, theme, toggleTheme } = useThemeMode();
  const { user, isAuthenticated } = useAuthContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  // Check screen size on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 w-full p-3 md:p-4 backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 border-b border-blue-100 dark:border-blue-900 z-20 transition-all">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo - visible on all screens */}
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <HeartPulseIcon className="h-5 w-5 md:h-6 md:w-6" />
          <span className={`font-bold ${isMobile ? "text-lg" : "text-xl"}`}>
            {isMobile ? "PMS" : "Patient System"}
          </span>
        </div>

        {/* Search bar - only on larger screens */}
        <div className="hidden md:flex flex-1 max-w-md px-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2 px-4 rounded-full bg-blue-50 dark:bg-blue-900/30 text-gray-700 dark:text-gray-200 border border-blue-100 dark:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Actions - right aligned */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
          >
            {theme === "dark" ? (
              <SunIcon className="h-4 w-4 md:h-5 md:w-5" />
            ) : (
              <MoonIcon className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </Button>

          {/* Notifications - only when authenticated */}
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 relative text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
            >
              <BellIcon className="h-4 w-4 md:h-5 md:w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
          )}

          {/* User profile or login/register */}
          {isAuthenticated ? (
            <div className="relative" data-dropdown>
              <Button
                variant="ghost"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 h-8 px-2 md:px-3"
              >
                <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-blue-200 dark:bg-blue-700 flex items-center justify-center text-blue-700 dark:text-blue-200 font-medium text-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="hidden md:inline max-w-[100px] truncate">
                  {user?.name || "User"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-2 z-50 border border-blue-100 dark:border-blue-900">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button
                    className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size={isMobile ? "sm" : "default"}
                  className="text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size={isMobile ? "sm" : "default"}
                  className="bg-blue-600 hover:bg-blue-700 text-white ml-1 md:ml-2"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search - expandable when needed */}
      <div className="md:hidden mt-2 px-2">
        <input
          type="text"
          placeholder="Search..."
          className="w-full py-1.5 px-3 rounded-full bg-blue-50 dark:bg-blue-900/30 text-gray-700 dark:text-gray-200 border border-blue-100 dark:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
        />
      </div>
    </header>
  );
}
