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
  Mail,
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
  onBulkResetPassword?: () => void;
  onBulkInvite?: () => void;
}

export function BulkActionBar({
  selectedCount,
  onClearSelection,
  onToggleBulkMode,
  bulkSelectMode,
  onBulkDeactivate,
  onBulkReactivate,
  onBulkResetPassword,
  onBulkInvite,
}: BulkActionBarProps) {
  if (!bulkSelectMode && selectedCount === 0) {
    return (
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleBulkMode}
          className="ml-auto border-green-200 text-green-700 dark:border-green-800 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
        >
          <CheckSquare className="mr-2 h-4 w-4" />
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
      className=" flex flex-wrap items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-md shadow-md border border-green-100 dark:border-green-900 mb-4"
    >
      <div className="flex items-center text-sm mr-2">
        <CheckSquare className="h-4 w-4 mr-1 text-green-600 dark:text-green-400" />
        <span className="font-medium">
          {selectedCount} user{selectedCount !== 1 ? "s" : ""} selected
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="secondary"
            className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800"
          >
            Actions
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-48 border-green-100 dark:border-green-900"
        >
          <DropdownMenuItem
            onClick={onBulkDeactivate}
            className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <UserMinus className="mr-2 h-4 w-4" />
            Deactivate Users
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={onBulkReactivate}
            className="cursor-pointer text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <User className="mr-2 h-4 w-4" />
            Reactivate Users
          </DropdownMenuItem>

          {onBulkResetPassword && (
            <DropdownMenuItem
              onClick={onBulkResetPassword}
              className="cursor-pointer text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Reset Passwords
            </DropdownMenuItem>
          )}

          {onBulkInvite && (
            <DropdownMenuItem
              onClick={onBulkInvite}
              className="cursor-pointer text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Invitations
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
        <XSquare className="mr-2 h-4 w-4" />
        Clear Selection
      </Button>

      {bulkSelectMode && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleBulkMode}
          className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Exit Bulk Mode
        </Button>
      )}
    </motion.div>
  );
}
