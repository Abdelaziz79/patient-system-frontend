import { useLanguage } from "@/app/_contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, UserPlusIcon } from "lucide-react";

interface UsersManagementHeaderProps {
  isFiltering: boolean;
  filteredUsersCount: number;
  totalUsers: number;
  onRefresh: () => void;
  isRefreshing: boolean;
  onClearFilters: () => void;
  onCreateUser: () => void;
}

export function UsersManagementHeader({
  isFiltering,
  filteredUsersCount,
  totalUsers,
  onRefresh,
  isRefreshing,
  onClearFilters,
  onCreateUser,
}: UsersManagementHeaderProps) {
  const { t } = useLanguage();

  return (
    <CardHeader className="px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center">
            <CardTitle className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-300">
              {t("manageUsers")}
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              className="mx-2 p-1 h-auto"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 text-green-600 dark:text-green-400 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
            </Button>
          </div>
          <CardDescription className="text-green-600 dark:text-green-400 mt-1 text-sm">
            {isFiltering
              ? `${t("filteredResults")}: ${filteredUsersCount} ${
                  filteredUsersCount !== 1 ? t("users") : t("user")
                }`
              : `${t("manageUsersDescription")} • ${totalUsers} ${
                  totalUsers !== 1 ? t("users") : t("user")
                }`}
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {isFiltering && (
            <Button
              onClick={onClearFilters}
              variant="outline"
              size="sm"
              className="border-green-200 text-green-700 dark:border-green-800 dark:text-green-400 w-full sm:w-auto"
            >
              {t("clearFilters")}
            </Button>
          )}
          <Button
            onClick={onCreateUser}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white transition-all duration-200"
          >
            <UserPlusIcon className="mx-2 h-4 w-4" />
            <span>{t("createNewUser")}</span>
          </Button>
        </div>
      </div>
    </CardHeader>
  );
}
