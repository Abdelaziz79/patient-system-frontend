import { UserUtils } from "@/app/_components/management/UserUtils";
import { User } from "@/app/_types/User";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDownIcon,
  ArrowUpDown,
  ArrowUpIcon,
  CreditCardIcon,
  EditIcon,
  KeyIcon,
  MoreHorizontalIcon,
  SearchIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";

interface UserTableProps {
  users: User[];
  currentPage: number;
  itemsPerPage: number;
  sortField: keyof User;
  sortDirection: string;
  onSort: (field: keyof User) => void;
  onResetPassword: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onEditUser: (user: User) => void;
  onUpdateSubscription?: (user: User) => void;
  // New bulk selection props
  bulkSelectMode: boolean;
  selectedUserIds: Set<string>;
  onToggleUserSelection: (userId: string) => void;
  onToggleAllUsers: () => void;
}

export function UserTable({
  users,
  currentPage,
  itemsPerPage,
  sortField,
  sortDirection,
  onSort,
  onResetPassword,
  onDeleteUser,
  onEditUser,
  onUpdateSubscription,
  // Bulk selection props
  bulkSelectMode,
  selectedUserIds,
  onToggleUserSelection,
  onToggleAllUsers,
}: UserTableProps) {
  const { getStatusBadge, getRoleBadge, formatDate } = UserUtils();

  // Get sort indicator
  const getSortIndicator = (field: keyof User) => {
    if (sortField === field) {
      return sortDirection === "asc" ? (
        <ArrowUpIcon className="ml-1 h-3 w-3" />
      ) : (
        <ArrowDownIcon className="ml-1 h-3 w-3" />
      );
    }
    return <ArrowUpDown className="ml-1 h-3 w-3 opacity-30" />;
  };

  // Check if all visible users are selected
  const allSelected =
    users.length > 0 && users.every((user) => selectedUserIds.has(user.id));

  // Check if some (but not all) visible users are selected
  const someSelected =
    users.some((user) => selectedUserIds.has(user.id)) && !allSelected;

  return (
    <div className="rounded-md border dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-green-50 dark:bg-slate-700">
            <TableRow>
              {bulkSelectMode && (
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    ref={(el) => {
                      if (el) {
                        (el as HTMLInputElement).indeterminate = someSelected;
                      }
                    }}
                    onCheckedChange={onToggleAllUsers}
                    aria-label="Select all users"
                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                </TableHead>
              )}
              <TableHead className="font-semibold text-green-800 dark:text-green-300 w-12">
                #
              </TableHead>
              <TableHead
                className="font-semibold text-green-800 dark:text-green-300 cursor-pointer hover:bg-green-100 dark:hover:bg-slate-600 transition-colors"
                onClick={() => onSort("name")}
              >
                <div className="flex items-center">
                  Name
                  {getSortIndicator("name")}
                </div>
              </TableHead>
              <TableHead
                className="font-semibold text-green-800 dark:text-green-300 cursor-pointer hover:bg-green-100 dark:hover:bg-slate-600 transition-colors"
                onClick={() => onSort("email")}
              >
                <div className="flex items-center">
                  Email
                  {getSortIndicator("email")}
                </div>
              </TableHead>
              <TableHead className="font-semibold text-green-800 dark:text-green-300">
                Role
              </TableHead>
              <TableHead className="font-semibold text-green-800 dark:text-green-300">
                Status
              </TableHead>
              <TableHead className="font-semibold text-green-800 dark:text-green-300 hidden md:table-cell">
                Specialization
              </TableHead>
              <TableHead className="font-semibold text-green-800 dark:text-green-300 hidden lg:table-cell">
                Subscription
              </TableHead>
              <TableHead
                className="font-semibold text-green-800 dark:text-green-300 cursor-pointer hover:bg-green-100 dark:hover:bg-slate-600 transition-colors"
                onClick={() => onSort("createdAt")}
              >
                <div className="flex items-center">
                  Created
                  {getSortIndicator("createdAt")}
                </div>
              </TableHead>
              <TableHead className="font-semibold text-green-800 dark:text-green-300 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={`
                    hover:bg-green-50 dark:hover:bg-slate-700 transition-colors
                    ${
                      selectedUserIds.has(user.id)
                        ? "bg-green-50 dark:bg-slate-800"
                        : ""
                    }
                    ${user.isActive === false ? "opacity-70" : ""}
                  `}
                >
                  {bulkSelectMode && (
                    <TableCell className="p-2 pl-4">
                      <Checkbox
                        checked={selectedUserIds.has(user.id)}
                        onCheckedChange={() => onToggleUserSelection(user.id)}
                        aria-label={`Select ${user.name}`}
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link
                      href={`/users/${user.id}`}
                      className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:underline flex items-center"
                    >
                      {user.name}
                      {/* {user.isNew && (
                        <Badge className="ml-2 bg-blue-500 text-white text-xs">
                          New
                        </Badge>
                      )} */}
                    </Link>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    {getStatusBadge(user.isActive !== false)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.specialization || "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {user.subscription ? (
                      <div className="flex items-center">
                        <span
                          className={`font-medium ${
                            user.subscription.type === "enterprise"
                              ? "text-purple-600 dark:text-purple-400"
                              : user.subscription.type === "premium"
                              ? "text-amber-600 dark:text-amber-400"
                              : user.subscription.type === "basic"
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {user.subscription.type || "Free"}
                        </span>
                        {user.subscription.isActive !== undefined && (
                          <span
                            className={`ml-2 text-xs ${
                              user.subscription.isActive
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            (
                            {user.subscription.isActive ? "Active" : "Inactive"}
                            )
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">
                        ___
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt ?? "")}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="border-green-100 dark:border-green-900 bg-white dark:bg-slate-800 shadow-lg min-w-[180px]"
                      >
                        <Link href={`/users/${user.id}`} passHref>
                          <DropdownMenuItem className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 cursor-pointer">
                            <SearchIcon className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          onClick={() => onResetPassword(user.id)}
                          className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer"
                        >
                          <KeyIcon className="mr-2 h-4 w-4" />
                          <span>Reset Password</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEditUser(user)}
                          className="text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 cursor-pointer"
                        >
                          <EditIcon className="mr-2 h-4 w-4" />
                          <span>Edit User</span>
                        </DropdownMenuItem>
                        {onUpdateSubscription && user.role === "admin" && (
                          <DropdownMenuItem
                            onClick={() => onUpdateSubscription(user)}
                            className="text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer"
                          >
                            <CreditCardIcon className="mr-2 h-4 w-4" />
                            <span>Update Subscription</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => onDeleteUser(user.id)}
                          className={`${
                            user.isActive !== false
                              ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                              : "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
                          } cursor-pointer`}
                        >
                          {user.isActive !== false ? (
                            <>
                              <TrashIcon className="mr-2 h-4 w-4" />
                              <span>Deactivate</span>
                            </>
                          ) : (
                            <>
                              <UserIcon className="mr-2 h-4 w-4" />
                              <span>Reactivate</span>
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={bulkSelectMode ? 10 : 9}
                  className="text-center py-12 text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center p-4">
                    <SearchIcon className="h-8 w-8 mb-2 text-gray-400 dark:text-gray-500" />
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
