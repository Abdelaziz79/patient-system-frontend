import { User } from "@/app/_types/User";
import { UserUtils } from "@/app/admin/users/_components/UserUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRightIcon,
  BadgeIcon,
  CreditCardIcon,
  EditIcon,
  KeyIcon,
  MailIcon,
  PhoneIcon,
  SearchIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";

interface UserCardsProps {
  users: User[];
  onResetPassword: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onEditUser: (user: User) => void;
  onUpdateSubscription?: (user: User) => void;
  // Add bulk selection props
  bulkSelectMode?: boolean;
  selectedUserIds?: Set<string>;
  onToggleUserSelection?: (userId: string) => void;
  isRTL?: boolean;
}

export function UserCards({
  users,
  onResetPassword,
  onDeleteUser,
  onEditUser,
  onUpdateSubscription,
  // Bulk selection props with defaults
  bulkSelectMode = false,
  selectedUserIds = new Set(),
  onToggleUserSelection = () => {},
  isRTL,
}: UserCardsProps) {
  const { getRoleBadge, getStatusBadge } = UserUtils();

  if (users.length === 0) {
    return (
      <Card className="text-center p-4 sm:p-10 border-none shadow-md dark:bg-slate-900 dark:shadow-slate-900/30">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-slate-800 p-3 sm:p-4 mb-4 sm:mb-6">
            <SearchIcon className="h-7 w-7 sm:h-10 sm:w-10 text-slate-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-700 dark:text-slate-100 mb-2">
            No users found
          </h3>
          <p className="text-xs sm:text-sm max-w-sm text-gray-500 dark:text-slate-400">
            Try changing your search criteria or add new users
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {users.map((user) => (
        <Card
          key={user.id}
          className={`overflow-hidden transition-all duration-200 hover:shadow-lg border-none shadow-md dark:bg-slate-900 dark:shadow-slate-900/30 ${
            bulkSelectMode && selectedUserIds.has(user.id)
              ? "ring-2 ring-green-500 dark:ring-green-600"
              : ""
          }`}
        >
          <CardHeader className="p-3 sm:p-5 flex flex-row items-center justify-between space-y-0 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-start gap-2 sm:gap-3">
              {bulkSelectMode && (
                <div className="flex items-center h-8 sm:h-10 mx-1">
                  <Checkbox
                    checked={selectedUserIds.has(user.id)}
                    onCheckedChange={() => onToggleUserSelection(user.id)}
                    className="border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                  />
                </div>
              )}
              <div className="bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-medium text-sm sm:text-base">
                {user.name.charAt(0)}
              </div>
              <div className="max-w-[calc(100%-40px)]">
                <Link href={`/users/${user.id}`} className="group">
                  <h3 className="font-medium text-sm sm:text-base text-gray-800 dark:text-slate-100 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors truncate">
                    {user.name}
                  </h3>
                </Link>
                <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-0.5 sm:mt-1">
                  <MailIcon
                    className={`h-3 w-3 ${
                      isRTL ? "mx-1" : "mx-1"
                    } flex-shrink-0`}
                  />
                  <span className="truncate max-w-[180px] sm:max-w-[220px]">
                    {user.email}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-1 sm:gap-2 flex-shrink-0">
              {getStatusBadge(user.isActive !== false)}
              {getRoleBadge(user.role)}
            </div>
          </CardHeader>

          <CardContent className="p-3 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm mb-3 sm:mb-4">
              <div>
                <div className="flex items-center gap-1 sm:gap-1.5 text-gray-500 dark:text-slate-400 text-xs font-medium mb-0.5 sm:mb-1">
                  <BadgeIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <span>Specialization</span>
                </div>
                <p className="font-medium text-gray-800 dark:text-slate-200 truncate">
                  {user.specialization || "—"}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1 sm:gap-1.5 text-gray-500 dark:text-slate-400 text-xs font-medium mb-0.5 sm:mb-1">
                  <PhoneIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <span>Contact</span>
                </div>
                <p className="font-medium text-gray-800 dark:text-slate-200 truncate">
                  {user.contactNumber || "—"}
                </p>
              </div>
            </div>

            {/* Subscription info (if available) */}
            {user.subscription && (
              <div className="mt-2 mb-3 sm:mb-4">
                <div className="flex items-center gap-1 sm:gap-1.5 text-gray-500 dark:text-slate-400 text-xs font-medium mb-0.5 sm:mb-1">
                  <CreditCardIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <span>Subscription</span>
                </div>
                <p className="font-medium text-xs sm:text-sm text-gray-800 dark:text-slate-200">
                  {user.subscription.type || "Free"}
                  {user.subscription.isActive &&
                    ` • ${user.subscription.isActive ? "Active" : "Inactive"}`}
                </p>
              </div>
            )}

            <Separator className="my-3 sm:my-4 bg-gray-100 dark:bg-slate-800" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-1 sm:pt-2 gap-2 sm:gap-0">
              <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onResetPassword(user.id)}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:border-blue-600 text-xs h-7 sm:h-8"
                  disabled={bulkSelectMode}
                >
                  <KeyIcon
                    className={`h-3 w-3 sm:h-4 sm:w-4 ${
                      isRTL ? "mx-1" : "mx-1"
                    } sm:mx-1.5`}
                  />
                  <span className="sm:inline">Reset</span>
                </Button>

                {/* Subscription button (only shown if handler provided) */}
                {onUpdateSubscription && user.role === "admin" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateSubscription(user)}
                    className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:border-purple-600 text-xs h-7 sm:h-8"
                    disabled={bulkSelectMode}
                  >
                    <CreditCardIcon
                      className={`h-3 w-3 sm:h-4 sm:w-4 ${
                        isRTL ? "mx-1" : "mx-1"
                      } sm:mx-1.5`}
                    />
                    <span className="sm:inline">Plan</span>
                  </Button>
                )}
              </div>

              <div className="flex gap-1 sm:gap-2 w-full sm:w-auto justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditUser(user)}
                  className="text-gray-600 border-gray-200 hover:bg-gray-50 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white h-7 sm:h-8 w-7 sm:w-8 p-0"
                  disabled={bulkSelectMode}
                >
                  <EditIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>

                <Link
                  href={`/users/${user.id}`}
                  passHref
                  className={bulkSelectMode ? "pointer-events-none" : ""}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-600 border-gray-200 hover:bg-gray-50 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white h-7 sm:h-8 w-7 sm:w-8 p-0"
                    disabled={bulkSelectMode}
                  >
                    <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteUser(user.id)}
                  className={`border-gray-200 dark:border-slate-700 h-7 sm:h-8 w-7 sm:w-8 p-0 ${
                    user.isActive !== false
                      ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-800 dark:hover:border-red-600"
                      : "text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-slate-800 dark:hover:border-green-600"
                  }`}
                  disabled={bulkSelectMode}
                >
                  {user.isActive !== false ? (
                    <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  ) : (
                    <UserIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
