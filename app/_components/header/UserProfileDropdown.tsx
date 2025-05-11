import { useLanguage } from "@/app/_contexts/LanguageContext";
import { useAuthContext } from "@/app/_providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function UserProfileDropdown() {
  const { user, logout } = useAuthContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const goToSetting = () => {
    router.push("/settings");
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`flex items-center gap-2 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 h-8 md:h-9 px-1 sm:px-2 md:px-3 ${
          isDropdownOpen ? "bg-blue-100 dark:bg-blue-900/50" : ""
        }`}
      >
        <div className="h-6 w-6 md:h-7 md:w-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 flex items-center justify-center text-white font-medium text-sm shadow-sm">
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <span className="hidden md:inline max-w-[100px] truncate">
          {user?.name || t("user")}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {isDropdownOpen && (
        <div
          className={`absolute ${
            isRTL ? "left-0" : "right-0"
          } mt-2 w-64 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-lg shadow-lg py-2 z-50 border border-blue-100 dark:border-blue-900 transform origin-top-${
            isRTL ? "left" : "right"
          } transition-all duration-200 animate-in fade-in-50 slide-in-from-top-5`}
        >
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>

          <Link
            href="/profile"
            className="flex items-center px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            onClick={() => setIsDropdownOpen(false)}
          >
            <User className="h-4 w-4 mx-2 text-blue-600 dark:text-blue-400" />
            {t("profile")}
          </Link>

          <button
            className="flex w-full items-center px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            onClick={goToSetting}
          >
            <Settings className="h-4 w-4 mx-2 text-blue-600 dark:text-blue-400" />
            {t("settings")}
          </button>

          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

          <button
            className="flex w-full items-center px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => {
              setIsDropdownOpen(false);
              handleLogout();
            }}
          >
            <LogOut className="h-4 w-4 mx-2" />
            {t("logout")}
          </button>
        </div>
      )}
    </div>
  );
}
