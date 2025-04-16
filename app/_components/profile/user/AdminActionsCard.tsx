import { User } from "@/app/_types/User";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard, Edit3, Trash, UserCog } from "lucide-react";

interface AdminActionsCardProps {
  user: User;
  isSuperAdmin: boolean;
  onEditUser: () => void;
  onResetPassword: () => void;
  onUpdateSubscription: () => void;
  onToggleUserStatus: () => void;
  deleteConfirmOpen: boolean;
  onCloseDeleteConfirm: () => void;
  onConfirmStatusChange: () => void;
}

export function AdminActionsCard({
  user,
  isSuperAdmin,
  onEditUser,
  onResetPassword,
  onUpdateSubscription,
  onToggleUserStatus,
  deleteConfirmOpen,
  onCloseDeleteConfirm,
  onConfirmStatusChange,
}: AdminActionsCardProps) {
  return (
    <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
          Admin Actions
        </CardTitle>
        <CardDescription className="text-green-600 dark:text-green-400">
          Manage this user account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={onEditUser}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors"
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Edit User Details
          </Button>
          <Button
            onClick={onResetPassword}
            className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-white transition-colors"
          >
            <UserCog className="mr-2 h-4 w-4" />
            Reset Password
          </Button>
          {/* Subscription button - only visible for super_admin */}
          {isSuperAdmin && user.subscription && (
            <Button
              onClick={onUpdateSubscription}
              className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white transition-colors"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Update Subscription
            </Button>
          )}
          {user?.isActive ? (
            <Button
              onClick={onToggleUserStatus}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white transition-colors"
            >
              <Trash className="mr-2 h-4 w-4" />
              Deactivate User
            </Button>
          ) : (
            <Button
              onClick={onToggleUserStatus}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white transition-colors"
            >
              <UserCog className="mr-2 h-4 w-4" />
              Reactivate User
            </Button>
          )}
        </div>
      </CardContent>
      {deleteConfirmOpen && (
        <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div
            className={`w-full ${
              user?.isActive
                ? "bg-red-50 dark:bg-red-900/10"
                : "bg-green-50 dark:bg-green-900/10"
            } p-4 rounded-md`}
          >
            <p
              className={`${
                user?.isActive
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              } font-medium mb-4`}
            >
              {user?.isActive
                ? "Are you sure you want to deactivate this user? This action can be reversed later."
                : "Are you sure you want to reactivate this user?"}
            </p>
            <div className="flex gap-4">
              <Button
                onClick={onCloseDeleteConfirm}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirmStatusChange}
                variant={user?.isActive ? "destructive" : "default"}
                className={`flex-1 ${
                  !user?.isActive
                    ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
                    : ""
                }`}
              >
                {user?.isActive
                  ? "Confirm Deactivation"
                  : "Confirm Reactivation"}
              </Button>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
