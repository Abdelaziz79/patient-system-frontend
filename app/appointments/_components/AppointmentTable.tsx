import { IUpcomingAppointment } from "@/app/_hooks/appointment/appointmentApi";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Eye, User } from "lucide-react";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";

interface AppointmentTableProps {
  appointments: IUpcomingAppointment[];
  onViewDetails: (appointmentId: string, patientId: string) => void;
}

export const AppointmentTable = ({
  appointments,
  onViewDetails,
}: AppointmentTableProps) => {
  const { t, isRTL } = useLanguage();

  // Function to determine badge variant and style based on days until follow-up
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
    return `${daysUntilFollowUp} ${isRTL ? t("daysFrom") : t("daysRemaining")}`;
  };

  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={tableVariants}
      className="overflow-x-auto rounded-xl border border-green-100 dark:border-green-900 shadow-sm"
      dir={isRTL ? "rtl" : "ltr"}
      style={{ textAlign: isRTL ? "right" : "left" }}
    >
      <table className="min-w-full divide-y divide-green-100 dark:divide-green-900">
        <thead className="bg-gradient-to-r from-green-50 to-green-100 dark:from-slate-700 dark:to-slate-700/80">
          <tr>
            <th
              scope="col"
              className="px-3 sm:px-6 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider"
            >
              {t("name")}
            </th>
            <th
              scope="col"
              className="px-3 sm:px-6 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider"
            >
              {t("dateAndTime")}
            </th>
            <th
              scope="col"
              className="px-3 sm:px-6 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider"
            >
              {t("appointmentType")}
            </th>
            <th
              scope="col"
              className="px-3 sm:px-6 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider"
            >
              {t("status")}
            </th>
            <th
              scope="col"
              className="px-3 sm:px-6 py-3 sm:py-4 text-start text-[10px] sm:text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider"
            >
              {t("actions")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800 divide-y divide-green-100 dark:divide-green-900">
          {appointments.map((appointment, index) => {
            const badgeProps = getBadgeProps(appointment.daysUntilFollowUp);

            return (
              <motion.tr
                key={appointment.id}
                variants={rowVariants}
                className={
                  index % 2 === 0
                    ? "bg-white dark:bg-slate-800 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors"
                    : "bg-green-50/50 dark:bg-slate-800/80 hover:bg-green-100/70 dark:hover:bg-green-900/20 transition-colors"
                }
              >
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-start">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-300" />
                    </div>
                    <div
                      className={`${isRTL ? "mx-2 sm:mx-3" : "mx-2 sm:mx-3"}`}
                    >
                      <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        {appointment.patientName}
                      </div>
                      {appointment.patientPhone !== "N/A" && (
                        <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          {appointment.patientPhone}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-start">
                  <div className="flex items-center gap-x-1 sm:gap-x-2">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 dark:text-green-400 flex-shrink-0" />
                    <div>
                      <div className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium">
                        {format(
                          parseISO(appointment.followUpDate),
                          "MMM dd, yyyy"
                        )}
                      </div>
                      <div className="flex items-center text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        <Clock
                          className={`h-2 w-2 sm:h-3 sm:w-3 ${
                            isRTL ? "mx-0.5 sm:mx-1" : "mx-0.5 sm:mx-1"
                          } text-green-500 dark:text-green-400`}
                        />
                        {format(parseISO(appointment.followUpDate), "hh:mm a")}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-start">
                  <Badge
                    variant="outline"
                    className="text-[10px] sm:text-xs bg-white dark:bg-slate-700 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300"
                  >
                    {appointment.appointmentType}
                  </Badge>
                  {appointment.title &&
                    appointment.title !== appointment.appointmentType && (
                      <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {appointment.title}
                      </div>
                    )}
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-start">
                  <Badge
                    variant={badgeProps.variant}
                    className={`text-[10px] sm:text-xs ${badgeProps.className}`}
                  >
                    {getDaysText(appointment.daysUntilFollowUp)}
                  </Badge>
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-start">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900 flex items-center gap-1 text-[10px] sm:text-xs py-1 h-7 sm:h-8"
                    onClick={() =>
                      onViewDetails(appointment.id, appointment.patientId)
                    }
                  >
                    <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span>{t("view")}</span>
                  </Button>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
};
