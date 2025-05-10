import { Input } from "@/components/ui/input";
import { ChevronDown, FilterIcon, SearchIcon } from "lucide-react";

interface UserFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  roles: string[];
  isRTL?: boolean;
}

export function UserFilters({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  roles,
  isRTL,
}: UserFiltersProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
  };

  return (
    <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
      <div className="relative flex-1">
        <SearchIcon
          className={`absolute ${
            isRTL ? "right-3" : "left-3"
          } top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400`}
        />
        <Input
          placeholder="Search for users..."
          className={`${
            isRTL ? "px-10" : "px-10"
          } focus:ring-green-500 focus:border-green-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white`}
          value={searchQuery}
          onChange={handleSearch}
          dir={isRTL ? "rtl" : "ltr"}
        />
      </div>
      <div className="relative sm:w-1/4">
        <div className="relative">
          <FilterIcon
            className={`absolute ${
              isRTL ? "right-3" : "left-3"
            } top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400`}
          />
          <ChevronDown
            className={`absolute ${
              isRTL ? "left-3" : "right-3"
            } top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400`}
          />
          <select
            className={`w-full rounded-md border px-10 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white appearance-none`}
            value={roleFilter}
            onChange={handleRoleChange}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
