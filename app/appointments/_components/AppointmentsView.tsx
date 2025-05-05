import { IUpcomingAppointment } from "@/app/_hooks/appointment/appointmentApi";
import { useAppointment } from "@/app/_hooks/appointment/useAppointment";
import { useNotification } from "@/app/_hooks/notification/useNotification";
import useMobileView from "@/app/_hooks/useMobileView";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  Clock,
  FilterIcon,
  Loader2,
  SearchIcon,
  Plus,
  CalendarDays,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileAppointmentCard } from "./MobileAppointmentCard";
import { AppointmentTable } from "./AppointmentTable";

export const AppointmentsView = () => {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const { isMobileView } = useMobileView();
  const [filterDays, setFilterDays] = useState<number>(7);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState<
    IUpcomingAppointment[]
  >([]);

  // Initialize hooks
  const {
    upcomingAppointments,
    isUpcomingAppointmentsLoading,
    upcomingAppointmentsError,
    days,
    updateFilters,
  } = useAppointment({
    initialDays: filterDays,
  });

  const { notificationSummary, isNotificationSummaryLoading } =
    useNotification();

  // Filter appointments based on search query
  useEffect(() => {
    if (!upcomingAppointments) return;

    if (searchQuery.trim() === "") {
      setFilteredAppointments(upcomingAppointments);
    } else {
      const filtered = upcomingAppointments.filter(
        (appointment: IUpcomingAppointment) =>
          appointment.patientName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          appointment.patientPhone.includes(searchQuery) ||
          appointment.appointmentType
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
      setFilteredAppointments(filtered);
    }
  }, [upcomingAppointments, searchQuery]);

  // Update filter days
  useEffect(() => {
    updateFilters({ initialDays: filterDays });
  }, [filterDays, updateFilters]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleViewDetails = (appointmentId: string, patientId: string) => {
    router.push(`/patients/${patientId}?visitId=${appointmentId}`);
  };

  const handleAddAppointment = () => {
    router.push("/patients/");
  };

  // Card entrance animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full"
        >
          <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-xl rounded-xl overflow-hidden">
            <CardHeader
              className={`px-5 sm:px-8 py-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-b border-green-100 dark:border-green-900 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <motion.div variants={itemVariants}>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-300 flex items-center">
                    <CalendarDays
                      className={`${
                        isRTL ? "mx-2" : "mx-2"
                      } h-6 w-6 text-green-600 dark:text-green-400`}
                    />
                    {t("appointments")}
                  </CardTitle>
                  <CardDescription className="text-green-600 dark:text-green-400 mt-1 text-sm">
                    {t("managePatientRecords")}
                  </CardDescription>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-2"
                >
                  {!isNotificationSummaryLoading && notificationSummary && (
                    <div className="flex items-center gap-2 mx-3">
                      <Badge
                        variant="destructive"
                        className="text-xs font-medium py-1"
                      >
                        {notificationSummary.today} {t("today")}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs font-medium py-1 bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
                      >
                        {notificationSummary.tomorrow} {t("tomorrow")}
                      </Badge>
                    </div>
                  )}
                  <Button
                    onClick={handleAddAppointment}
                    className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-700 dark:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 text-white transition-all duration-200 rounded-full px-4 py-2 shadow-sm"
                  >
                    <Plus className={`${isRTL ? "mx-1" : "mx-1"} h-4 w-4`} />
                    <span>{t("addNewAppointment")}</span>
                  </Button>
                </motion.div>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-8 py-6">
              <motion.div
                variants={itemVariants}
                className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <div className="relative flex-1">
                  <SearchIcon
                    className={`absolute ${
                      isRTL ? "right-3" : "left-3"
                    } top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400`}
                  />
                  <Input
                    placeholder={t("searchAppointments")}
                    className={`${
                      isRTL ? "px-10 text-right" : "px-10"
                    } h-11 focus:ring-green-500 focus:border-green-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white rounded-lg shadow-sm`}
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <div className="relative sm:w-1/4">
                  <div className="relative">
                    <FilterIcon
                      className={`absolute ${
                        isRTL ? "right-3" : "left-3"
                      } top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400`}
                    />
                    <ChevronDown
                      className={`absolute ${
                        isRTL ? "left-3" : "right-3"
                      } top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400`}
                    />
                    <select
                      className={`w-full h-11 rounded-lg border ${
                        isRTL ? "px-10 px-10 text-right" : "px-10 px-10"
                      } py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white appearance-none shadow-sm`}
                      onChange={(e) => setFilterDays(Number(e.target.value))}
                      value={filterDays}
                    >
                      <option value={7}>{t("next7Days")}</option>
                      <option value={14}>{t("next14Days")}</option>
                      <option value={30}>{t("next30Days")}</option>
                      <option value={90}>{t("next3Months")}</option>
                    </select>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                {isUpcomingAppointmentsLoading ? (
                  <div className="py-16 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <Loader2 className="h-10 w-10 animate-spin mb-3 text-green-500 dark:text-green-400" />
                    <p className="text-base">{t("loadingAppointments")}</p>
                  </div>
                ) : upcomingAppointmentsError ? (
                  <div className="py-16 flex flex-col items-center justify-center text-red-500">
                    <p className="text-base font-medium">
                      {t("errorLoadingAppointments")}
                    </p>
                    <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
                      {upcomingAppointmentsError.message || t("tryAgainLater")}
                    </p>
                  </div>
                ) : filteredAppointments && filteredAppointments.length > 0 ? (
                  isMobileView ? (
                    <div className="mt-4 space-y-1">
                      {filteredAppointments.map((appointment) => (
                        <MobileAppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  ) : (
                    <AppointmentTable
                      appointments={filteredAppointments}
                      onViewDetails={handleViewDetails}
                    />
                  )
                ) : (
                  <div className="py-16 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-full mb-4">
                      <Calendar className="h-14 w-14 text-green-400 dark:text-green-500 opacity-70" />
                    </div>
                    <p className="mb-2 text-lg font-medium text-green-700 dark:text-green-300">
                      {t("noAppointmentsFound")}
                    </p>
                    <p className="text-sm text-center max-w-md">
                      {t("noUpcomingAppointments")}
                    </p>
                    <Button
                      onClick={handleAddAppointment}
                      variant="outline"
                      className="mt-6 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30"
                    >
                      <Plus className={`${isRTL ? "mx-1" : "mx-1"} h-4 w-4`} />
                      {t("scheduleAppointment")}
                    </Button>
                  </div>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
