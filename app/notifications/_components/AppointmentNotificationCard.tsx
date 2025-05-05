import { useMemo } from "react";
import { INotification } from "@/app/_hooks/notification/notificationApi";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Video, Stethoscope } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { motion } from "framer-motion";

interface AppointmentNotificationCardProps {
  notification: INotification;
  onClick: (notification: INotification) => void;
  index: number;
}

export const AppointmentNotificationCard = ({
  notification,
  onClick,
  index,
}: AppointmentNotificationCardProps) => {
  const { t, isRTL, language } = useLanguage();

  // Get the appropriate locale for date formatting
  const dateLocale = useMemo(() => (language === "ar" ? ar : enUS), [language]);

  const getBadgeStatus = () => {
    if (notification.daysUntil === 0) return "destructive";
    if (notification.daysUntil === 1) return "secondary";
    return "secondary";
  };

  const getBadgeText = () => {
    if (notification.daysUntil === 0) return t("today");
    if (notification.daysUntil === 1) return t("tomorrow");
    return `${t("in")} ${notification.daysUntil} ${t("days")}`;
  };

  const getBadgeClass = () => {
    if (notification.daysUntil === 1) return "bg-amber-500 hover:bg-amber-600";
    return "";
  };

  const getStatusColor = () => {
    if (notification.daysUntil === 0) return "bg-red-500";
    if (notification.daysUntil === 1) return "bg-amber-500";
    return "bg-green-500";
  };

  const formattedDate = useMemo(() => {
    return format(parseISO(notification.followUpDate), "MMM dd, yyyy", {
      locale: dateLocale,
    });
  }, [notification.followUpDate, dateLocale]);

  const formattedTime = useMemo(() => {
    return format(parseISO(notification.followUpDate), "hh:mm a", {
      locale: dateLocale,
    });
  }, [notification.followUpDate, dateLocale]);

  const getAppointmentTypeIcon = () => {
    const type = notification.appointmentType?.toLowerCase() || "";

    if (
      type.includes("video") ||
      type.includes("remote") ||
      type.includes("online")
    ) {
      return <Video className="h-3.5 w-3.5" />;
    } else if (type.includes("check") || type.includes("exam")) {
      return <Stethoscope className="h-3.5 w-3.5" />;
    } else {
      return <User className="h-3.5 w-3.5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="p-3 sm:p-4 border rounded-lg bg-white dark:bg-slate-800 hover:bg-green-50 dark:hover:bg-green-900/10 cursor-pointer transition-colors border-green-100 dark:border-green-900 shadow-sm"
      onClick={() => onClick(notification)}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className={`w-3 h-3 mt-1.5 rounded-full flex-shrink-0 ${getStatusColor()}`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2 text-sm sm:text-base">
              {notification.message}
            </h3>
            <Badge
              variant={getBadgeStatus()}
              className={`text-xs ${getBadgeClass()} whitespace-nowrap self-start`}
            >
              {getBadgeText()}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar
                className={`h-3.5 w-3.5 ${
                  isRTL ? "mx-1.5" : "mx-1.5"
                } text-green-600 dark:text-green-400`}
              />
              {formattedDate}
            </div>
            <div className="flex items-center">
              <Clock
                className={`h-3.5 w-3.5 ${
                  isRTL ? "mx-1.5" : "mx-1.5"
                } text-green-600 dark:text-green-400`}
              />
              {formattedTime}
            </div>
            <div className="flex items-center">
              <User
                className={`h-3.5 w-3.5 ${
                  isRTL ? "mx-1.5" : "mx-1.5"
                } text-green-600 dark:text-green-400`}
              />
              <span className="truncate max-w-[150px]">
                {notification.patientName}
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-xs px-2 truncate max-w-[100px]"
            >
              {notification.appointmentType}
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
