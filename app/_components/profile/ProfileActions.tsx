import { UserFormModal } from "@/app/_components/profile/UserFormModal";
import { PasswordChangeModal } from "@/app/_components/profile/PasswordChangeModal";
import { User } from "@/app/_hooks/useAuth";
import { UserCreateData, useUserAdmin } from "@/app/_hooks/useUserAdmin";
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
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg mb-4">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
              Admin Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start bg-green-50 hover:bg-green-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-green-800 dark:text-green-300 transition-all duration-200"
              onClick={handleCreateUserClick}
            >
              <UserPlusIcon className="mr-2 h-5 w-5" />
              <span>Create New User</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-green-50 hover:bg-green-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-green-800 dark:text-green-300 transition-all duration-200"
              onClick={handleManageUsersClick}
            >
              <UsersIcon className="mr-2 h-5 w-5" />
              <span>Manage Users</span>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Security Card - Shown to all users */}
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
            Security & Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start bg-green-50 hover:bg-green-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-green-800 dark:text-green-300 transition-all duration-200"
            onClick={handlePasswordChangeClick}
          >
            <KeyIcon className="mr-2 h-5 w-5" />
            <span>Change Password</span>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 transition-all duration-200"
            onClick={onLogout}
          >
            <LogOutIcon className="mr-2 h-5 w-5" />
            <span>Sign Out</span>
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
