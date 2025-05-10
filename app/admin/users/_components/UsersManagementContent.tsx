import { User } from "@/app/_types/User";
import { CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { BulkActionBar } from "./BulkActionBar";
import { UserCards } from "./UserCards";
import { UserFilters } from "./UserFilters";
import { UserPagination } from "./UserPagination";
import UserSkeletons from "./UserSkeletons";
import { UserTable } from "./UserTable";

interface UsersManagementContentProps {
  isLoading: boolean;
  isMobileView: boolean;
  isFiltering: boolean;
  filtersExpanded: boolean;
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
  totalPages: number;
  onPageChange: (page: number) => void;
  totalUsers: number;
  filteredUsersCount: number;
  onClearSelection: () => void;
  onToggleBulkMode: () => void;
  onBulkDeactivate: () => void;
  onBulkReactivate: () => void;
  onBulkResetPassword: () => void;
  isRTL?: boolean;
}

export function UsersManagementContent({
  isLoading,
  isMobileView,
  isFiltering,
  filtersExpanded,
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
  totalPages,
  onPageChange,
  totalUsers,
  filteredUsersCount,
  onClearSelection,
  onToggleBulkMode,
  onBulkDeactivate,
  onBulkReactivate,
  onBulkResetPassword,
  isRTL,
}: UsersManagementContentProps) {
  return (
    <CardContent className="px-3 sm:px-6">
      {/* Search and Filters Component */}
      <div className="mb-3">
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
                isRTL={isRTL}
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
          isRTL={isRTL}
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
              isRTL={isRTL}
            />
          ) : (
            /* Desktop View - Table Layout */
            <UserTable
              users={paginatedUsers}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
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
              isRTL={isRTL}
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
                isRTL={isRTL}
              />
            )}
          </div>
        </>
      )}
    </CardContent>
  );
}
