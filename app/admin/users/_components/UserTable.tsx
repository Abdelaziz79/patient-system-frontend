import { UserUtils } from "@/app/admin/users/_components/UserUtils";
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
  CreditCardIcon,
  EditIcon,
  KeyIcon,
  MoreHorizontalIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/app/_contexts/LanguageContext";

interface UserTableProps {
  users: User[];
  currentPage: number;
  itemsPerPage: number;
  onResetPassword: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onEditUser: (user: User) => void;
  onUpdateSubscription?: (user: User) => void;
  // New bulk selection props
  bulkSelectMode: boolean;
  selectedUserIds: Set<string>;
  onToggleUserSelection: (userId: string) => void;
  onToggleAllUsers: () => void;
  isRTL?: boolean;
}

export function UserTable({
  users,
  currentPage,
  itemsPerPage,
  onResetPassword,
  onDeleteUser,
  onEditUser,
  onUpdateSubscription,
  // Bulk selection props
  bulkSelectMode,
  selectedUserIds,
  onToggleUserSelection,
  onToggleAllUsers,
  isRTL,
}: UserTableProps) {
  const { getStatusBadge, getRoleBadge, formatDate } = UserUtils();
  const { t } = useLanguage();

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
              <TableHead className="font-semibold text-green-800 dark:text-green-300 w-12 text-start">
                #
              </TableHead>
              <TableHead className="font-semibold text-green-800 dark:text-green-300 text-start">
                {t("name")}
              </TableHead>
              <TableHead className="font-semibold text-green-800 dark:text-green-300 text-start">
                {t("emailAddress")}
              </TableHead>
              <TableHead className="font-semibold text-green-800 dark:text-green-300 text-start">
                {t("roles")}
              </TableHead>
              <TableHead className="font-semibold text-green-800 dark:text-green-300 text-start">
                {t("status")}
              </TableHead>
              <TableHead className="font-semibold text-green-800 dark:text-green-300 hidden md:table-cell text-start">
                {t("specialization")}
              </TableHead>
              <TableHead className="font-semibold text-green-800 dark:text-green-300 hidden lg:table-cell text-start">
                {t("subscriptionStatus")}
              </TableHead>
              <TableHead className="font-semibold text-green-800 dark:text-green-300 text-start">
                {t("created")}
              </TableHead>
              <TableHead
                className={`font-semibold text-green-800 dark:text-green-300 ${
                  isRTL ? "text-left" : "text-right"
                }`}
              >
                {t("actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={`
                    hover:bg-green-50 dark:hover:bg-slate-700 transition-colors dark:border-b-gray-700
                    ${
                      selectedUserIds.has(user.id)
                        ? "bg-green-50 dark:bg-slate-800"
                        : ""
                    }
                    ${user.isActive === false ? "opacity-70" : ""}
                  `}
                >
                  {bulkSelectMode && (
                    <TableCell className="p-2 px-4">
                      <Checkbox
                        checked={selectedUserIds.has(user.id)}
                        onCheckedChange={() => onToggleUserSelection(user.id)}
                        aria-label={`Select ${user.name}`}
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium text-start">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </TableCell>
                  <TableCell className="font-medium text-start">
                    <Link
                      href={`/users/${user.id}`}
                      className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:underline flex items-center"
                    >
                      {user.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-start">{user.email}</TableCell>
                  <TableCell className="text-start">
                    {getRoleBadge(user.role)}
                  </TableCell>
                  <TableCell className="text-start">
                    {getStatusBadge(user.isActive !== false)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-start">
                    {user.specialization || "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-start">
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
                            className={`${isRTL ? "mx-2" : "mx-2"} text-xs ${
                              user.subscription.isActive
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            (
                            {user.subscription.isActive
                              ? t("active")
                              : t("inactive")}
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
                  <TableCell className="text-start">
                    {formatDate(user.createdAt ?? "")}
                  </TableCell>
                  <TableCell className={isRTL ? "text-left" : "text-right"}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={isRTL ? "start" : "end"}>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditUser(user);
                          }}
                          className="cursor-pointer"
                        >
                          <EditIcon
                            className={`${isRTL ? "mx-2" : "mx-2"} h-4 w-4`}
                          />
                          <span>{t("edit")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onResetPassword(user.id);
                          }}
                          className="cursor-pointer"
                        >
                          <KeyIcon
                            className={`${isRTL ? "mx-2" : "mx-2"} h-4 w-4`}
                          />
                          <span>{t("changePassword")}</span>
                        </DropdownMenuItem>
                        {onUpdateSubscription && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateSubscription(user);
                            }}
                            className="cursor-pointer"
                          >
                            <CreditCardIcon
                              className={`${isRTL ? "mx-2" : "mx-2"} h-4 w-4`}
                            />
                            <span>{t("subscriptionStatus")}</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteUser(user.id);
                          }}
                          className={`cursor-pointer ${
                            user.isActive === false
                              ? "text-green-600 dark:text-green-500"
                              : "text-red-600 dark:text-red-500"
                          }`}
                        >
                          {user.isActive === false ? (
                            <>
                              <UserIcon
                                className={`${isRTL ? "mx-2" : "mx-2"} h-4 w-4`}
                              />
                              <span>{t("activeUsers")}</span>
                            </>
                          ) : (
                            <>
                              <TrashIcon
                                className={`${isRTL ? "mx-2" : "mx-2"} h-4 w-4`}
                              />
                              <span>{t("inactiveUsers")}</span>
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
                  colSpan={bulkSelectMode ? 9 : 8}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <UserIcon className="h-8 w-8 mb-3 opacity-20" />
                    <p>{t("noUsersAvailable")}</p>
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
