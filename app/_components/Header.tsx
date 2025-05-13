"use client";

import { useLanguage } from "@/app/_contexts/LanguageContext";
import useMobileView from "@/app/_hooks/useMobileView";
import { useThemeMode } from "@/app/_hooks/useThemeMode";
import { useAuthContext } from "@/app/_providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRef, useState } from "react";
import AuthButtons from "./header/AuthButtons";
import HeaderLogo from "./header/HeaderLogo";
import NotificationDropdown from "./header/NotificationDropdown";
import SearchBar from "./header/SearchBar";
import ThemeLanguageToggles from "./header/ThemeLanguageToggles";
import UserProfileDropdown from "./header/UserProfileDropdown";

// Local component to handle mobile search toggle
function MobileSearchButton({
  setIsSearchExpanded,
  inputRef,
}: {
  setIsSearchExpanded: (value: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        setIsSearchExpanded(true);
        // Focus is handled in the SearchBar component with useEffect
      }}
      className="h-8 w-8 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
      aria-label="Open search"
    >
      <Search className="h-4 w-4 md:h-5 md:w-5" />
    </Button>
  );
}

interface HeaderProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Header({ isOpen, toggleSidebar }: HeaderProps) {
  const { mounted } = useThemeMode();
  const { isAuthenticated } = useAuthContext();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { isMobileView: isMobile } = useMobileView();
  const { dir } = useLanguage();

  const searchInputRef = useRef<HTMLInputElement>(null);

  // No longer tracking click-outside - removed the useEffect

  if (!mounted) return null;

  return (
    <header
      dir={dir}
      className="sticky top-0 w-full py-2 md:py-3 px-3 md:px-4 backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-blue-100 dark:border-blue-900 z-30 transition-all duration-300 shadow-sm"
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and sidebar toggle - hidden when search is expanded on mobile */}
        <div
          className={`${
            isMobile && isSearchExpanded ? "hidden" : "flex items-center"
          }`}
        >
          <HeaderLogo isOpen={isOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* Search bar - Pass the ref and control props */}
        {isAuthenticated && (
          <SearchBar
            isSearchExpanded={isSearchExpanded}
            setIsSearchExpanded={setIsSearchExpanded}
            inputRef={searchInputRef}
          />
        )}

        {/* Actions - right aligned - hidden when search is expanded on mobile */}
        <div
          className={`flex items-center gap-1 md:gap-2 ${
            isMobile && isSearchExpanded ? "hidden" : "flex"
          }`}
        >
          {/* Mobile search toggle */}
          {isMobile && isAuthenticated && (
            <MobileSearchButton
              setIsSearchExpanded={setIsSearchExpanded}
              inputRef={searchInputRef}
            />
          )}

          {/* Language and Theme toggles */}
          <ThemeLanguageToggles />

          {/* Notifications - only when authenticated */}
          {isAuthenticated && <NotificationDropdown />}

          {/* User profile or login/register */}
          {isAuthenticated ? <UserProfileDropdown /> : <AuthButtons />}
        </div>
      </div>
    </header>
  );
}
