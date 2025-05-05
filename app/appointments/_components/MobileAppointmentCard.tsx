import { useLanguage } from "@/app/_contexts/LanguageContext";
import { IUpcomingAppointment } from "@/app/_hooks/appointment/appointmentApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { Calendar, Clock, Eye, User } from "lucide-react";

interface MobileAppointmentCardProps {
  appointment: IUpcomingAppointment;
  onViewDetails: (appointmentId: string, patientId: string) => void;
}

export const MobileAppointmentCard = ({
  appointment,
  onViewDetails,
}: MobileAppointmentCardProps) => {
  const { t, isRTL } = useLanguage();

  // Determine badge variant and styling based on days until follow-up
  const getBadgeProps = (daysUntilFollowUp: number) => {
    if (daysUntilFollowUp === 0) {
      return {
        variant: "destructive" as const,
        className: "text-xs font-medium py-1",
      };
    }
    if (daysUntilFollowUp === 1) {
      return {
        variant: "outline" as const,
        className:
          "text-xs font-medium py-1 bg-amber-500 border-amber-500 text-white hover:bg-amber-600",
      };
    }
    return {
      variant: "secondary" as const,
      className: "text-xs font-medium py-1",
    };
  };

  // Determine text for days remaining
  const getDaysText = (daysUntilFollowUp: number) => {
    if (daysUntilFollowUp === 0) return t("today");
    if (daysUntilFollowUp === 1) return t("tomorrow");
    return `${isRTL ? t("in") : t("in")} ${daysUntilFollowUp} ${t("days")}`;
  };

  const badgeProps = getBadgeProps(appointment.daysUntilFollowUp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-md mb-4 overflow-hidden border border-green-100 dark:border-green-900 hover:shadow-lg transition-all duration-200"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ textAlign: isRTL ? "right" : "left" }}
    >
      {/* Header Section - Status Badge */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-slate-700 dark:to-slate-700/80 px-4 py-2 border-b border-green-100 dark:border-green-800 flex justify-between items-center">
        <Badge variant={badgeProps.variant} className={badgeProps.className}>
          {getDaysText(appointment.daysUntilFollowUp)}
        </Badge>
        <Badge
          variant="outline"
          className="text-xs bg-white dark:bg-slate-700 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300"
        >
          {appointment.appointmentType}
        </Badge>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Patient Info */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 flex items-center justify-center bg-green-100 dark:bg-green-800 rounded-full">
            <User className="h-5 w-5 text-green-600 dark:text-green-300" />
          </div>
          <div className={`${isRTL ? "mx-3" : "mx-3"}`}>
            <h3 className="font-medium text-base text-gray-800 dark:text-gray-200">
              {appointment.patientName}
            </h3>
            {appointment.patientPhone !== "N/A" && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {appointment.patientPhone}
              </p>
            )}
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2.5 flex items-center">
            <Calendar
              className={`h-4 w-4 ${
                isRTL ? "mx-2" : "mx-2"
              } text-green-600 dark:text-green-400 flex-shrink-0`}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
              {format(parseISO(appointment.followUpDate), "MMM dd, yyyy")}
            </span>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2.5 flex items-center">
            <Clock
              className={`h-4 w-4 ${
                isRTL ? "mx-2" : "mx-2"
              } text-green-600 dark:text-green-400 flex-shrink-0`}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
              {format(parseISO(appointment.followUpDate), "hh:mm a")}
            </span>
          </div>
        </div>

        {/* Appointment Title/Description */}
        {appointment.title &&
          appointment.title !== appointment.appointmentType && (
            <div className="mb-3 px-2.5 py-2 bg-gray-50 dark:bg-slate-700/30 rounded-lg border border-gray-100 dark:border-slate-700">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {appointment.title}
              </span>
            </div>
          )}
      </div>

      {/* Action Button */}
      <div className="border-t border-gray-100 dark:border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          className="w-full rounded-none h-11 flex items-center justify-center text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors gap-2 font-medium"
          onClick={() => onViewDetails(appointment.id, appointment.patientId)}
        >
          <Eye className="h-4 w-4" />
          <span>{t("viewDetails")}</span>
        </Button>
      </div>
    </motion.div>
  );
};
