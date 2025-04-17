import { User } from "@/app/_types/User";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { UserCards } from "./UserCards";
import { UserTable } from "./UserTable";
import { UserFilters } from "./UserFilters";
import { UserPagination } from "./UserPagination";
import { BulkActionBar } from "./BulkActionBar";
import UserSkeletons from "./UserSkeletons";
import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UsersManagementContentProps {
  isLoading: boolean;
  isMobileView: boolean;
  isFiltering: boolean;
  filtersExpanded: boolean;
  setFiltersExpanded: (expanded: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  roles: string[];
  paginatedUsers: User[];
  bulkSelectMode: boolean;
  selectedUserIds: Set<string>;
  onToggleUserSelection: (userId: string) => void;
  onToggleAllUsers: () => void;
  onResetPassword: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onEditUser: (user: User) => void;
  onUpdateSubscription: (user: User) => void;
  isSuperAdmin: boolean;
  currentPage: number;
  itemsPerPage: number;
  sortField: keyof User;
  sortDirection: string;
  onSort: (field: keyof User) => void;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalUsers: number;
  filteredUsersCount: number;
  onClearSelection: () => void;
  onToggleBulkMode: () => void;
  onBulkDeactivate: () => void;
  onBulkReactivate: () => void;
  onBulkResetPassword: () => void;
  onBulkInvite: () => void;
}

export function UsersManagementContent({
  isLoading,
  isMobileView,
  isFiltering,
  filtersExpanded,
  setFiltersExpanded,
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  roles,
  paginatedUsers,
  bulkSelectMode,
  selectedUserIds,
  onToggleUserSelection,
  onToggleAllUsers,
  onResetPassword,
  onDeleteUser,
  onEditUser,
  onUpdateSubscription,
  isSuperAdmin,
  currentPage,
  itemsPerPage,
  sortField,
  sortDirection,
  onSort,
  totalPages,
  onPageChange,
  totalUsers,
  filteredUsersCount,
  onClearSelection,
  onToggleBulkMode,
  onBulkDeactivate,
  onBulkReactivate,
  onBulkResetPassword,
  onBulkInvite,
}: UsersManagementContentProps) {
  return (
    <CardContent className="px-3 sm:px-6">
      {/* Search and Filters Component */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Filters
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className="h-8 px-2 text-gray-500 dark:text-gray-400"
          >
            <FilterIcon className="h-4 w-4 mr-1" />
            {filtersExpanded ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        <AnimatePresence>
          {(filtersExpanded || isFiltering) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <UserFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                roles={roles}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bulk Actions Bar */}
      <div>
        <BulkActionBar
          selectedCount={selectedUserIds.size}
          onClearSelection={onClearSelection}
          onToggleBulkMode={onToggleBulkMode}
          bulkSelectMode={bulkSelectMode}
          onBulkDeactivate={onBulkDeactivate}
          onBulkReactivate={onBulkReactivate}
          onBulkResetPassword={onBulkResetPassword}
          onBulkInvite={onBulkInvite}
        />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <UserSkeletons />
      ) : (
        <>
          {/* Mobile View - Card Layout */}
          {isMobileView ? (
            <UserCards
              users={paginatedUsers}
              onResetPassword={onResetPassword}
              onDeleteUser={onDeleteUser}
              onEditUser={onEditUser}
              onUpdateSubscription={
                isSuperAdmin ? onUpdateSubscription : undefined
              }
              bulkSelectMode={bulkSelectMode}
              onToggleUserSelection={onToggleUserSelection}
              selectedUserIds={selectedUserIds}
            />
          ) : (
            /* Desktop View - Table Layout */
            <UserTable
              users={paginatedUsers}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={onSort}
              onResetPassword={onResetPassword}
              onDeleteUser={onDeleteUser}
              onEditUser={onEditUser}
              onUpdateSubscription={
                isSuperAdmin ? onUpdateSubscription : undefined
              }
              bulkSelectMode={bulkSelectMode}
              selectedUserIds={selectedUserIds}
              onToggleUserSelection={onToggleUserSelection}
              onToggleAllUsers={onToggleAllUsers}
            />
          )}

          {/* Pagination */}
          <div className="mt-4 items-center text-sm text-gray-500 dark:text-gray-400">
            {totalPages > 1 && (
              <UserPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                totalUsers={totalUsers}
                isFiltering={isFiltering}
                filteredCount={filteredUsersCount}
                itemsPerPage={itemsPerPage}
              />
            )}
          </div>
        </>
      )}
    </CardContent>
  );
}
