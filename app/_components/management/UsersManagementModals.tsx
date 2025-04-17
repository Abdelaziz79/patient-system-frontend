import { User } from "@/app/_types/User";
import { UserFormModal } from "@/app/_components/profile/UserFormModal";
import { PasswordResetModal } from "./PasswordResetModal";
import { BulkPasswordResetModal } from "./BulkPasswordResetModal";
import { SubscriptionUpdateModal } from "./SubscriptionUpdateModal";
import AlertDialogComp from "./AlertDialogComp";

interface UsersManagementModalsProps {
  isUserModalOpen: boolean;
  setIsUserModalOpen: (open: boolean) => void;
  userModalMode: "create" | "update";
  selectedUser: User | null;
  isCreating: boolean;
  isUpdating: boolean;
  onSubmitUserForm: (userData: any) => Promise<void>;
  isPasswordChangeModalOpen: boolean;
  setIsPasswordChangeModalOpen: (open: boolean) => void;
  isResettingPassword: boolean;
  onResetPassword: (
    userId: string,
    newPassword: string
  ) => Promise<{ success: boolean; message: string }>;
  isBulkPasswordResetModalOpen: boolean;
  setIsBulkPasswordResetModalOpen: (open: boolean) => void;
  isBulkResettingPassword: boolean;
  onBulkResetPassword: (newPassword: string) => Promise<void>;
  selectedUserIds: Set<string>;
  isSubscriptionModalOpen: boolean;
  setIsSubscriptionModalOpen: (open: boolean) => void;
  isUpdatingSubscription: boolean;
  onUpdateSubscription: (
    userId: string,
    subscription: any
  ) => Promise<{ success: boolean; message: string; user?: User }>;
  isStatusConfirmOpen: boolean;
  setIsStatusConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirmStatusChange: () => Promise<void>;
  isSuperAdmin: boolean;
}

export function UsersManagementModals({
  isUserModalOpen,
  setIsUserModalOpen,
  userModalMode,
  selectedUser,
  isCreating,
  isUpdating,
  onSubmitUserForm,
  isPasswordChangeModalOpen,
  setIsPasswordChangeModalOpen,
  isResettingPassword,
  onResetPassword,
  isBulkPasswordResetModalOpen,
  setIsBulkPasswordResetModalOpen,
  isBulkResettingPassword,
  onBulkResetPassword,
  selectedUserIds,
  isSubscriptionModalOpen,
  setIsSubscriptionModalOpen,
  isUpdatingSubscription,
  onUpdateSubscription,
  isStatusConfirmOpen,
  setIsStatusConfirmOpen,
  onConfirmStatusChange,
  isSuperAdmin,
}: UsersManagementModalsProps) {
  return (
    <>
      {/* User Form Modal (handles both create and update) */}
      <UserFormModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSubmit={onSubmitUserForm}
        isSubmitting={userModalMode === "create" ? isCreating : isUpdating}
        user={selectedUser}
        mode={userModalMode}
      />

      {/* Password Change Modal */}
      <PasswordResetModal
        isOpen={isPasswordChangeModalOpen}
        onClose={() => setIsPasswordChangeModalOpen(false)}
        userId={selectedUser?.id || ""}
        userName={selectedUser?.name || ""}
        onReset={onResetPassword}
        isResetting={isResettingPassword}
      />

      {/* Bulk Password Reset Modal */}
      <BulkPasswordResetModal
        isOpen={isBulkPasswordResetModalOpen}
        onClose={() => setIsBulkPasswordResetModalOpen(false)}
        selectedUserCount={selectedUserIds.size}
        onReset={onBulkResetPassword}
        isResetting={isBulkResettingPassword}
      />

      {/* Subscription Update Modal - Only for super_admin */}
      {isSuperAdmin && (
        <SubscriptionUpdateModal
          isOpen={isSubscriptionModalOpen}
          onClose={() => setIsSubscriptionModalOpen(false)}
          userId={selectedUser?.id || ""}
          userName={selectedUser?.name || ""}
          currentSubscription={selectedUser?.subscription}
          onUpdate={onUpdateSubscription}
          isUpdating={isUpdatingSubscription}
        />
      )}

      {/* Status Confirmation Modal */}
      <AlertDialogComp
        isStatusConfirmOpen={isStatusConfirmOpen}
        setIsStatusConfirmOpen={setIsStatusConfirmOpen}
        selectedUser={selectedUser}
        handleConfirmStatusChange={onConfirmStatusChange}
      />
    </>
  );
}
