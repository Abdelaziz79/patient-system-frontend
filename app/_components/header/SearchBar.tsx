import { useLanguage } from "@/app/_contexts/LanguageContext";
import { usePatient } from "@/app/_hooks/patient/usePatient";
import useMobileView from "@/app/_hooks/useMobileView";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import SearchResults from "../SearchResults";

interface SearchBarProps {
  isSearchExpanded: boolean;
  setIsSearchExpanded: (value: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function SearchBar({
  isSearchExpanded,
  setIsSearchExpanded,
  inputRef,
}: SearchBarProps) {
  const { t, isRTL } = useLanguage();
  const { isMobileView: isMobile } = useMobileView();
  const localInputRef = useRef<HTMLInputElement>(null);

  // Use the provided ref or fall back to the local one
  const searchInputRef = inputRef || localInputRef;

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMounted = useRef(true);

  // Initialize usePatient hook for search functionality
  const { performSearch } = usePatient();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isComponentMounted.current = false;
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Handle focus on search input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // Memoize the search function to prevent recreating it on every render
  const performSearchQuery = useCallback(
    async (query: string) => {
      if (!isComponentMounted.current || query.trim().length === 0) return;

      // Only search if query is at least 3 characters long
      if (query.trim().length < 3) {
        setSearchResults([]);
        setShowSearchResults(true);
        setIsSearching(false);
        // Show "minimum length" message through empty results
        return;
      }

      setIsSearching(true);
      setShowSearchResults(true); // Show loading spinner immediately

      // Add a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        if (isComponentMounted.current) {
          setIsSearching(false);
          setSearchResults([]);
        }
      }, 8000); // 8 seconds timeout

      try {
        // Use the performSearch function from usePatient hook
        const results = await performSearch({ query });

        if (!isComponentMounted.current) {
          clearTimeout(timeoutId);
          return;
        }

        // Process data (when successful)
        let resultsArray = [];

        if (results) {
          if (Array.isArray(results)) {
            resultsArray = results;
          } else if (typeof results === "object" && results !== null) {
            // Check if data has a results property that's an array
            if (results.results && Array.isArray(results.results)) {
              resultsArray = results.results;
            } else if (results.data && Array.isArray(results.data)) {
              resultsArray = results.data;
            } else {
              resultsArray = [results];
            }
          }
        }

        if (isComponentMounted.current) {
          setSearchResults(resultsArray);
          setShowSearchResults(resultsArray.length > 0);
          setIsSearching(false);
        }
      } catch (error: any) {
        if (isComponentMounted.current) {
          console.error("[SEARCH] ERROR:", error?.message || error);
          setSearchResults([]);
          setIsSearching(false);
        }
      } finally {
        clearTimeout(timeoutId);
      }
    },
    [performSearch]
  );

  // Handle search input changes with improved debounce
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchValue(query);

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      setIsSearching(false);
      return;
    }

    // Set new timeout
    searchTimeoutRef.current = setTimeout(() => {
      performSearchQuery(query);
    }, 500); // Increased to 500ms to reduce frequency of API calls
  };

  const closeSearchResults = () => {
    setShowSearchResults(false);
  };

  return (
    <div
      className={`${
        isMobile
          ? isSearchExpanded
            ? "flex fixed left-0 right-0 top-0 p-3 bg-white/95 dark:bg-slate-900/95 z-40"
            : "hidden"
          : "flex"
      } flex-1 max-w-md mx-4 transition-all duration-300 ease-in-out relative`}
    >
      <div className="relative w-full">
        <input
          ref={searchInputRef}
          type="text"
          placeholder={t("search")}
          className={`w-full py-2 px-8 rounded-full bg-blue-50/70 dark:bg-blue-900/30 text-gray-700 dark:text-gray-200 border border-blue-100 dark:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all duration-300`}
          onChange={handleSearch}
          value={searchValue}
          onFocus={() => {
            if (searchValue.trim().length > 0 && searchResults.length > 0) {
              setShowSearchResults(true);
            }
          }}
        />
        <Search
          className={`absolute ${
            isRTL ? "right-3" : "left-3"
          } top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400`}
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="icon"
            className={`absolute ${isRTL ? "left-8" : "right-8"} top-1.5`}
            onClick={() => {
              setSearchValue("");
              setSearchResults([]);
              setShowSearchResults(false);
              if (searchInputRef.current) {
                searchInputRef.current.focus();
              }
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {isMobile && isSearchExpanded && (
          <Button
            variant="ghost"
            size="icon"
            className={`absolute ${isRTL ? "left-2" : "right-2"} top-1.5`}
            onClick={() => {
              setIsSearchExpanded(false);
              setShowSearchResults(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* Search Results Dropdown - Improved positioning for mobile */}
        {isSearchExpanded && isMobile ? (
          <div className="fixed left-0 right-0 top-[56px] px-3">
            <SearchResults
              results={searchResults}
              onClose={closeSearchResults}
              isVisible={showSearchResults}
              isLoading={isSearching}
              searchQuery={searchValue}
            />
          </div>
        ) : (
          <SearchResults
            results={searchResults}
            onClose={closeSearchResults}
            isVisible={showSearchResults}
            isLoading={isSearching}
            searchQuery={searchValue}
          />
        )}
      </div>
    </div>
  );
}
