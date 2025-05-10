import { useLanguage } from "@/app/_contexts/LanguageContext";
import {
  ISystemNotification,
  NotificationType,
} from "@/app/_hooks/systemNotification/systemNotificationApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { motion } from "framer-motion";
import { Bell, CheckCircle, User, Users } from "lucide-react";
import { useMemo } from "react";
import { NotificationIcon } from "./NotificationIcon";

interface AdminNotificationCardProps {
  notification: ISystemNotification;
  onMarkAsRead: () => void;
  index: number;
}

export const AdminNotificationCard = ({
  notification,
  onMarkAsRead,
  index,
}: AdminNotificationCardProps) => {
  const { t, isRTL, language } = useLanguage();

  // Get the appropriate locale for date formatting
  const dateLocale = useMemo(() => (language === "ar" ? ar : enUS), [language]);

  // Format dates
  const formattedCreatedAt = useMemo(() => {
    try {
      const date = parseISO(notification.createdAt);
      return format(date, "MMM dd, yyyy HH:mm", { locale: dateLocale });
    } catch (error) {
      console.error("Error formatting createdAt:", error);
      return "";
    }
  }, [notification.createdAt, dateLocale]);

  const formattedExpiresAt = useMemo(() => {
    try {
      const date = parseISO(notification.expiresAt);
      return format(date, "MMM dd, yyyy", { locale: dateLocale });
    } catch (error) {
      console.error("Error formatting expiresAt:", error);
      return "";
    }
  }, [notification.expiresAt, dateLocale]);

  // Get relative time for created date
  const timeAgo = useMemo(() => {
    try {
      return formatDistanceToNow(parseISO(notification.createdAt), {
        addSuffix: true,
        locale: dateLocale,
      });
    } catch (error) {
      console.error("Error formatting timeAgo:", error);
      return "";
    }
  }, [notification.createdAt, dateLocale]);

  // Get color styles based on notification properties
  const getCardStyles = () => {
    if (!notification.isRead) {
      return "bg-blue-50 dark:bg-blue-900/15 border-blue-200 dark:border-blue-800 shadow-md";
    }
    return "bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700";
  };

  // Get notification type text
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`p-4 border rounded-lg transition-all ${getCardStyles()}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1 flex-shrink-0">
          <NotificationIcon type={notification.type} className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap md:flex-nowrap justify-between gap-2 items-start">
            <h3
              className={`font-medium ${
                !notification.isRead
                  ? "text-blue-700 dark:text-blue-400"
                  : "text-gray-800 dark:text-gray-200"
              }`}
            >
              {notification.title}
            </h3>

            <div className="flex flex-wrap gap-2">
              {!notification.isRead && (
                <Badge
                  variant="outline"
                  className="text-xs border-blue-500 text-blue-600 dark:text-blue-400"
                >
                  {t("unreadNotification")}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {getNotificationTypeText(notification.type)}
              </Badge>
            </div>
          </div>

          <p className="mt-1.5 text-gray-600 dark:text-gray-400">
            {notification.message}
          </p>

          <div className="flex flex-wrap justify-between items-center mt-3">
            <div className="flex items-center flex-wrap gap-x-3 gap-y-2 text-sm text-gray-500 dark:text-gray-500">
              {notification.targetAll ? (
                <Badge
                  variant="outline"
                  className="text-xs flex items-center gap-1"
                >
                  <Users className="h-3 w-3" />
                  {t("allUsers")}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-xs flex items-center gap-1"
                >
                  <User className="h-3 w-3" />
                  {notification.recipients.length}{" "}
                  {notification.recipients.length === 1
                    ? t("recipient")
                    : t("recipients")}
                </Badge>
              )}
              <span className="inline-flex items-center gap-1">
                <Bell className="h-3 w-3 text-gray-400" />
                {t("expires")}: {formattedExpiresAt}
              </span>
            </div>

            <div className="flex items-center mt-2 sm:mt-0">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead();
                }}
                disabled={notification.isRead}
              >
                {notification.isRead ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {t("read")}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {t("markAsRead")}
                  </span>
                )}
              </Button>
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-2">
            {t("createdBy")}: {notification.createdBy?.name || t("system")} •{" "}
            {formattedCreatedAt} ({timeAgo})
          </div>
        </div>
      </div>
    </motion.div>
  );
};
