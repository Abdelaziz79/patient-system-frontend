"use client";
import { User } from "@/app/_types/User";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/app/_contexts/LanguageContext";

type Props = {
  isStatusConfirmOpen: boolean;
  setIsStatusConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUser: User | null;
  handleConfirmStatusChange: () => void;
  isRTL?: boolean;
};

function AlertDialogComp({
  isStatusConfirmOpen,
  setIsStatusConfirmOpen,
  selectedUser,
  handleConfirmStatusChange,
  isRTL,
}: Props) {
  const { t } = useLanguage();

  return (
    <AlertDialog
      open={isStatusConfirmOpen}
      onOpenChange={setIsStatusConfirmOpen}
    >
      <AlertDialogContent dir={isRTL ? "rtl" : "ltr"}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {selectedUser?.isActive !== false
              ? t("inactiveUsers")
              : t("activeUsers")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {selectedUser?.isActive !== false
              ? `Are you sure you want to deactivate ${selectedUser?.name}? They will no longer be able to access the system. This action can be reversed.`
              : `Are you sure you want to reactivate ${selectedUser?.name}? They will regain access to the system.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={isRTL ? "flex-row-reverse" : ""}>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmStatusChange}
            className={
              selectedUser?.isActive !== false
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }
          >
            {selectedUser?.isActive !== false
              ? "Yes, Deactivate User"
              : "Yes, Reactivate User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlertDialogComp;
