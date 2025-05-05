import { useEffect, useMemo } from "react";
import {
  ISystemNotification,
  NotificationType,
} from "@/app/_hooks/systemNotification/systemNotificationApi";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { motion } from "framer-motion";
import { NotificationIcon } from "./NotificationIcon";

interface SystemNotificationCardProps {
  notification: ISystemNotification;
  onClick: (notification: ISystemNotification) => void;
  onMarkAsRead: (id: string, e: React.MouseEvent) => void;
  index: number;
}

export const SystemNotificationCard = ({
  notification,
  onClick,
  onMarkAsRead,
  index,
}: SystemNotificationCardProps) => {
  const { t, isRTL, language } = useLanguage();

  // Get the appropriate locale for date formatting
  const dateLocale = useMemo(() => (language === "ar" ? ar : enUS), [language]);

  const getNotificationTypeText = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SUBSCRIPTION_EXPIRING:
        return t("subscription");
      case NotificationType.SYSTEM_NOTIFICATION:
        return t("system");
      case NotificationType.CUSTOM_MESSAGE:
        return t("message");
      case NotificationType.PATIENT_EVENT:
        return t("patient");
      default:
        return t("notification");
    }
  };

  const formattedDate = useMemo(() => {
    try {
      const date = parseISO(notification.createdAt);
      return {
        full: format(date, "PPP", { locale: dateLocale }),
        relative: formatDistanceToNow(date, {
          addSuffix: true,
          locale: dateLocale,
        }),
      };
    } catch (error) {
      return { full: "", relative: "" };
    }
  }, [notification.createdAt, dateLocale]);

  const getCardStyles = () => {
    if (!notification.isRead) {
      return "bg-blue-50 dark:bg-blue-900/15 border-blue-200 dark:border-blue-800 shadow-sm";
    }
    return "bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/10";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all ${getCardStyles()}`}
      onClick={() => onClick(notification)}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="mt-1 flex-shrink-0">
          <NotificationIcon
            type={notification.type}
            className="h-4 w-4 sm:h-5 sm:w-5"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
            <h3
              className={`font-medium text-sm sm:text-base truncate ${
                !notification.isRead
                  ? "text-blue-700 dark:text-blue-400"
                  : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {notification.title}
            </h3>
            <Badge
              variant="outline"
              className={`text-xs whitespace-nowrap self-start ${
                !notification.isRead
                  ? "border-blue-200 dark:border-blue-700"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              {getNotificationTypeText(notification.type)}
            </Badge>
          </div>
          <p className="mt-1 text-gray-600 dark:text-gray-400 text-xs sm:text-sm line-clamp-2">
            {notification.message}
          </p>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-2 sm:mt-3 gap-2">
            <div
              className="text-xs text-gray-500 dark:text-gray-400"
              title={formattedDate.full}
            >
              {formattedDate.relative}
            </div>
            <div>
              {!notification.isRead ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 sm:h-7 px-1.5 sm:px-2 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  onClick={(e) => onMarkAsRead(notification._id, e)}
                >
                  <CheckCircle
                    className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                      isRTL ? "mx-1" : "mx-1"
                    }`}
                  />
                  {t("markAsRead")}
                </Button>
              ) : (
                <Badge
                  variant="outline"
                  className="text-xs text-gray-500 dark:text-gray-400"
                >
                  {t("read")}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
