import { User } from "@/app/_types/User";
import { useLanguage } from "@/app/_contexts/LanguageContext";
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
  const { t, dir } = useLanguage();

  return (
    <Card
      className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md"
      dir={dir}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
          {t("adminActions")}
        </CardTitle>
        <CardDescription className="text-green-600 dark:text-green-400">
          {t("manageUserAccount")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={onEditUser}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors"
          >
            <Edit3 className="mx-2 h-4 w-4" />
            {t("editUserDetails")}
          </Button>
          <Button
            onClick={onResetPassword}
            className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-white transition-colors"
          >
            <UserCog className="mx-2 h-4 w-4" />
            {t("passwordReset")}
          </Button>
          {/* Subscription button - only visible for super_admin */}
          {isSuperAdmin && user.subscription && (
            <Button
              onClick={onUpdateSubscription}
              className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white transition-colors"
            >
              <CreditCard className="mx-2 h-4 w-4" />
              {t("updateSubscription")}
            </Button>
          )}
          {user?.isActive ? (
            <Button
              onClick={onToggleUserStatus}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white transition-colors"
            >
              <Trash className="mx-2 h-4 w-4" />
              {t("deactivateUser")}
            </Button>
          ) : (
            <Button
              onClick={onToggleUserStatus}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white transition-colors"
            >
              <UserCog className="mx-2 h-4 w-4" />
              {t("reactivateUser")}
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
                ? t("deactivateUserConfirmation")
                : t("reactivateUserConfirmation")}
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button
                onClick={onCloseDeleteConfirm}
                variant="outline"
                className="flex-1"
              >
                {t("cancel")}
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
                  ? t("confirmDeactivation")
                  : t("confirmReactivation")}
              </Button>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
