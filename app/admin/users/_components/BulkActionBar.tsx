import { useLanguage } from "@/app/_contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import {
  CheckSquare,
  ChevronDown,
  KeyRound,
  User,
  UserMinus,
  XSquare,
} from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onToggleBulkMode: () => void;
  bulkSelectMode: boolean;
  onBulkDeactivate: () => void;
  onBulkReactivate: () => void;
  onBulkResetPassword: () => void;
  isRTL?: boolean;
}

export function BulkActionBar({
  selectedCount,
  onClearSelection,
  onToggleBulkMode,
  bulkSelectMode,
  onBulkDeactivate,
  onBulkReactivate,
  onBulkResetPassword,
  isRTL,
}: BulkActionBarProps) {
  const { t } = useLanguage();

  if (!bulkSelectMode && selectedCount === 0) {
    return (
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleBulkMode}
          className={`${
            isRTL ? "mxauto" : "mxauto"
          } border-green-200 text-green-700 dark:border-green-800 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20`}
        >
          <CheckSquare className={`${isRTL ? "mx-2" : "mx-2"} h-4 w-4`} />
          Bulk Select
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-md shadow-md border border-green-100 dark:border-green-900 mb-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-center text-sm mx-2">
        <CheckSquare
          className={`h-4 w-4 ${
            isRTL ? "mx-1" : "mx-1"
          } text-green-600 dark:text-green-400`}
        />
        <span className="font-medium">
          {selectedCount} {selectedCount === 1 ? t("user") : t("users")}{" "}
          {t("selected")}
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="secondary"
            className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800"
          >
            {t("actions")}
            <ChevronDown className={`${isRTL ? "mx-2" : "mx-2"} h-4 w-4`} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={isRTL ? "end" : "start"}
          className="w-48 border-green-100 dark:border-green-900"
        >
          <DropdownMenuItem
            onClick={onBulkDeactivate}
            className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <UserMinus className={`${isRTL ? "mx-2" : "mx-2"} h-4 w-4`} />
            <span>{t("inactiveUsers")}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={onBulkReactivate}
            className="cursor-pointer text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <User className={`${isRTL ? "mx-2" : "mx-2"} h-4 w-4`} />
            <span>{t("activeUsers")}</span>
          </DropdownMenuItem>

          {onBulkResetPassword && (
            <DropdownMenuItem
              onClick={onBulkResetPassword}
              className="cursor-pointer text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <KeyRound className={`${isRTL ? "mx-2" : "mx-2"} h-4 w-4`} />
              <span>{t("changePassword")}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="sm"
        onClick={onClearSelection}
        className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <XSquare className={`${isRTL ? "mx-2" : "mx-2"} h-4 w-4`} />
        {t("clearFilters")}
      </Button>

      {bulkSelectMode && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleBulkMode}
          className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {t("exit")}
        </Button>
      )}
    </motion.div>
  );
}
