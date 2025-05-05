import { useLanguage } from "@/app/_contexts/LanguageContext";
import { useUserAdmin } from "@/app/_hooks/userAdmin/useUserAdmin";
import { User, UserCreateData } from "@/app/_types/User";
import { PasswordChangeModal } from "@/app/profile/_components/PasswordChangeModal";
import { UserFormModal } from "@/app/profile/_components/UserFormModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyIcon, LogOutIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ProfileActionsProps {
  user: User | null;
  isChangingPassword: boolean;
  setIsChangingPassword: (isChangingPassword: boolean) => void;
  onLogout: () => void;
}

export function ProfileActions({
  user,
  isChangingPassword,
  setIsChangingPassword,
  onLogout,
}: ProfileActionsProps) {
  const router = useRouter();
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const { t } = useLanguage();

  // Use the admin hook only if user has admin privileges
  const { createUser, isCreating } = useUserAdmin();

  // Check if user is an admin or super_admin
  const isAdminUser = user?.role === "admin" || user?.role === "super_admin";
  // Password change handlers
  const handlePasswordChangeClick = () => {
    setIsChangingPassword(true);
  };

  const handleClosePasswordModal = () => {
    setIsChangingPassword(false);
  };

  // Admin action handlers
  const handleCreateUserClick = () => {
    setIsCreateUserModalOpen(true);
  };

  const handleCloseCreateUserModal = () => {
    setIsCreateUserModalOpen(false);
  };

  const handleSubmitCreateUser = async (userData: UserCreateData) => {
    try {
      const result = await createUser(userData);
      if (result.success) {
        toast.success(result.message);
        setIsCreateUserModalOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to create user");
      console.error("Create user error:", error);
    }
  };

  const handleManageUsersClick = () => {
    router.push("/admin/users");
  };

  return (
    <>
      {/* Admin Actions Card - Only shown to admin users */}
      {isAdminUser && (
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300 mb-4">
          <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
              {t("admin")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
              onClick={handleCreateUserClick}
            >
              <UserPlusIcon className="mx-2 h-4 w-4 text-green-600 dark:text-green-400" />
              <span>{t("createNewUser") || "Create New User"}</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
              onClick={handleManageUsersClick}
            >
              <UsersIcon className="mx-2 h-4 w-4 text-green-600 dark:text-green-400" />
              <span>{t("manageUsers") || "Manage Users"}</span>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Security Card - Shown to all users */}
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
            {t("accountSettings")}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <Button
            className="w-full justify-start bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
            variant="outline"
            onClick={handlePasswordChangeClick}
          >
            <KeyIcon className="mx-2 h-4 w-4 text-green-600 dark:text-green-400" />
            <span>{t("changePassword")}</span>
          </Button>

          <Button
            variant="outline"
            onClick={onLogout}
            className="w-full justify-start bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <LogOutIcon className="mx-2 h-4 w-4 text-red-500 dark:text-red-400" />
            <span>{t("logoutButton")}</span>
          </Button>
        </CardContent>
      </Card>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={isChangingPassword}
        onClose={handleClosePasswordModal}
      />

      {/* Create User Modal - Only for admin users */}
      {isAdminUser && (
        <UserFormModal
          mode="create"
          isOpen={isCreateUserModalOpen}
          onClose={handleCloseCreateUserModal}
          onSubmit={handleSubmitCreateUser}
          isSubmitting={isCreating}
        />
      )}
    </>
  );
}
