import { useLanguage } from "@/app/_contexts/LanguageContext";
import { IUnreadCount } from "@/app/_hooks/systemNotification/systemNotificationApi";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";

interface SystemNotificationFooterProps {
  unreadCount: IUnreadCount | undefined;
  onMarkAllAsRead: () => void;
}

export const SystemNotificationFooter: React.FC<
  SystemNotificationFooterProps
> = ({ unreadCount, onMarkAllAsRead }) => {
  const { t, isRTL } = useLanguage();

  const getUnreadMessage = () => {
    if (!unreadCount || unreadCount.unreadCount === 0) {
      return t("allCaughtUp");
    }

    return `${unreadCount.unreadCount} ${t("unreadNotification")}${
      unreadCount.unreadCount !== 1 ? "s" : ""
    }`;
  };

  const isDisabled = !unreadCount || unreadCount.unreadCount === 0;

  return (
    <div
      className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-3 sm:pt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0">
        {getUnreadMessage()}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className={`text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
          isDisabled ? "opacity-50" : ""
        }`}
        onClick={onMarkAllAsRead}
        disabled={isDisabled}
      >
        <CheckCheck className={`h-4 w-4 ${isRTL ? "mx-1.5" : "mx-1.5"}`} />
        {t("markAllAsRead")}
      </Button>
    </div>
  );
};
