import { UserUtils } from "@/app/_components/management/UserUtils";
import { User } from "@/app/_types/User";
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
}: UserCardsProps) {
  const { getRoleBadge, getStatusBadge } = UserUtils();

  if (users.length === 0) {
    return (
      <Card className="text-center p-10 border-none shadow-md dark:bg-slate-900 dark:shadow-slate-900/30">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-slate-800 p-4 mb-6">
            <SearchIcon className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 dark:text-slate-100 mb-2">
            No users found
          </h3>
          <p className="text-sm max-w-sm text-gray-500 dark:text-slate-400">
            Try changing your search criteria or add new users
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {users.map((user) => (
        <Card
          key={user.id}
          className={`overflow-hidden transition-all duration-200 hover:shadow-lg border-none shadow-md dark:bg-slate-900 dark:shadow-slate-900/30 ${
            bulkSelectMode && selectedUserIds.has(user.id)
              ? "ring-2 ring-green-500 dark:ring-green-600"
              : ""
          }`}
        >
          <CardHeader className="p-5 flex flex-row items-center justify-between space-y-0 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-start gap-3">
              {bulkSelectMode && (
                <div className="flex items-center h-10 mr-1">
                  <Checkbox
                    checked={selectedUserIds.has(user.id)}
                    onCheckedChange={() => onToggleUserSelection(user.id)}
                    className="border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:text-white"
                  />
                </div>
              )}
              <div className="bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 w-10 h-10 rounded-full flex items-center justify-center text-white font-medium">
                {user.name.charAt(0)}
              </div>
              <div>
                <Link href={`/users/${user.id}`} className="group">
                  <h3 className="font-medium text-base text-gray-800 dark:text-slate-100 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                    {user.name}
                  </h3>
                </Link>
                <div className="flex items-center text-sm text-gray-500 dark:text-slate-400 mt-1">
                  <MailIcon className="h-3 w-3 mr-1.5 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {getStatusBadge(user.isActive !== false)}
              {getRoleBadge(user.role)}
            </div>
          </CardHeader>

          <CardContent className="p-5">
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-slate-400 text-xs font-medium mb-1">
                  <BadgeIcon className="h-3 w-3" />
                  <span>Specialization</span>
                </div>
                <p className="font-medium text-gray-800 dark:text-slate-200 truncate">
                  {user.specialization || "—"}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-slate-400 text-xs font-medium mb-1">
                  <PhoneIcon className="h-3 w-3" />
                  <span>Contact</span>
                </div>
                <p className="font-medium text-gray-800 dark:text-slate-200 truncate">
                  {user.contactNumber || "—"}
                </p>
              </div>
            </div>

            {/* Subscription info (if available) */}
            {user.subscription && (
              <div className="mt-2 mb-4">
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-slate-400 text-xs font-medium mb-1">
                  <CreditCardIcon className="h-3 w-3" />
                  <span>Subscription</span>
                </div>
                <p className="font-medium text-gray-800 dark:text-slate-200">
                  {user.subscription.type || "Free"}
                  {user.subscription.isActive &&
                    ` • ${user.subscription.isActive ? "Active" : "Inactive"}`}
                </p>
              </div>
            )}

            <Separator className="my-4 bg-gray-100 dark:bg-slate-800" />

            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onResetPassword(user.id)}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:border-blue-600"
                  disabled={bulkSelectMode}
                >
                  <KeyIcon className="h-4 w-4 mr-1.5" />
                  Reset
                </Button>

                {/* Subscription button (only shown if handler provided) */}
                {onUpdateSubscription && user.role === "admin" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateSubscription(user)}
                    className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:border-purple-600"
                    disabled={bulkSelectMode}
                  >
                    <CreditCardIcon className="h-4 w-4 mr-1.5" />
                    Plan
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditUser(user)}
                  className="text-gray-600 border-gray-200 hover:bg-gray-50 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                  disabled={bulkSelectMode}
                >
                  <EditIcon className="h-4 w-4" />
                </Button>

                <Link
                  href={`/users/${user.id}`}
                  passHref
                  className={bulkSelectMode ? "pointer-events-none" : ""}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-600 border-gray-200 hover:bg-gray-50 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                    disabled={bulkSelectMode}
                  >
                    <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteUser(user.id)}
                  className={`border-gray-200 dark:border-slate-700 ${
                    user.isActive !== false
                      ? "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-800 dark:hover:border-red-600"
                      : "text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-slate-800 dark:hover:border-green-600"
                  }`}
                  disabled={bulkSelectMode}
                >
                  {user.isActive !== false ? (
                    <TrashIcon className="h-4 w-4" />
                  ) : (
                    <UserIcon className="h-4 w-4" />
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
