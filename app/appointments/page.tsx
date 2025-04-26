"use client";

import { IUpcomingAppointment } from "@/app/_api/appointmentApi";
import { useAppointment } from "@/app/_hooks/useAppointment";
import useMobileView from "@/app/_hooks/useMobileView";
import { useNotification } from "@/app/_hooks/useNotification";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  Clock,
  FilterIcon,
  Loader2,
  SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Component for mobile view of appointments
const MobileAppointmentCard = ({
  appointment,
  onViewDetails,
}: {
  appointment: IUpcomingAppointment;
  onViewDetails: (appointmentId: string, patientId: string) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-3 border border-green-100 dark:border-green-900"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200">
            <span className="text-lg font-bold">
              {appointment.patientName.charAt(0).toUpperCase()}
            </span>
          </Avatar>
          <div className="ml-3">
            <h3 className="font-semibold text-green-700 dark:text-green-300">
              {appointment.patientName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {appointment.patientPhone}
            </p>
          </div>
        </div>
        <Badge
          variant={
            appointment.daysUntilFollowUp === 0
              ? "destructive"
              : appointment.daysUntilFollowUp <= 1
              ? "secondary"
              : "secondary"
          }
          className={`text-xs px-2 py-1 ${
            appointment.daysUntilFollowUp <= 1 &&
            appointment.daysUntilFollowUp > 0
              ? "bg-amber-500 hover:bg-amber-600"
              : ""
          }`}
        >
          {appointment.daysUntilFollowUp === 0
            ? "Today"
            : appointment.daysUntilFollowUp === 1
            ? "Tomorrow"
            : `In ${appointment.daysUntilFollowUp} days`}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
          <span className="dark:text-gray-300">
            {format(parseISO(appointment.followUpDate), "MMM dd, yyyy")}
          </span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
          <span className="dark:text-gray-300">
            {format(parseISO(appointment.followUpDate), "hh:mm a")}
          </span>
        </div>
      </div>
      <div className="flex items-center mb-3">
        <Badge variant="outline" className="text-xs">
          {appointment.visitType}
        </Badge>
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
          Ref: {appointment.visitTitle}
        </span>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full mt-2 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900"
        onClick={() =>
          onViewDetails(appointment.visitId, appointment.patientId)
        }
      >
        View Details
      </Button>
    </motion.div>
  );
};

// Component for desktop view of appointments
const AppointmentTable = ({
  appointments,
  onViewDetails,
}: {
  appointments: IUpcomingAppointment[];
  onViewDetails: (appointmentId: string, patientId: string) => void;
}) => {
  return (
    <div className="overflow-x-auto rounded-md border border-green-100 dark:border-green-900">
      <table className="min-w-full divide-y divide-green-100 dark:divide-green-900">
        <thead className="bg-green-50 dark:bg-green-900/30">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider"
            >
              Patient
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider"
            >
              Date & Time
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider"
            >
              Type
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800 divide-y divide-green-100 dark:divide-green-900">
          {appointments.map((appointment, index) => (
            <tr
              key={appointment.visitId}
              className={
                index % 2 === 0
                  ? "bg-white dark:bg-slate-800"
                  : "bg-green-50/50 dark:bg-slate-800/80"
              }
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200">
                    <span className="text-sm font-bold">
                      {appointment.patientName.charAt(0).toUpperCase()}
                    </span>
                  </Avatar>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {appointment.patientName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {appointment.patientPhone}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {format(parseISO(appointment.followUpDate), "MMM dd, yyyy")}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {format(parseISO(appointment.followUpDate), "hh:mm a")}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant="outline" className="text-xs">
                  {appointment.visitType}
                </Badge>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ref: {appointment.visitTitle}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge
                  variant={
                    appointment.daysUntilFollowUp === 0
                      ? "destructive"
                      : "secondary"
                  }
                  className={`text-xs ${
                    appointment.daysUntilFollowUp <= 1 &&
                    appointment.daysUntilFollowUp > 0
                      ? "bg-amber-500 hover:bg-amber-600"
                      : ""
                  }`}
                >
                  {appointment.daysUntilFollowUp === 0
                    ? "Today"
                    : appointment.daysUntilFollowUp === 1
                    ? "Tomorrow"
                    : `In ${appointment.daysUntilFollowUp} days`}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900"
                  onClick={() =>
                    onViewDetails(appointment.visitId, appointment.patientId)
                  }
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function AppointmentsPage() {
  const router = useRouter();
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
          appointment.visitType
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
    router.push("/patients/add-event");
  };

  return (
    <div className="min-h-screen dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-green-100 dark:border-green-900 shadow-xl">
            <CardHeader className="px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-300">
                    Appointments
                  </CardTitle>
                  <CardDescription className="text-green-600 dark:text-green-400 mt-1 text-sm">
                    Manage upcoming patient appointments
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {!isNotificationSummaryLoading && notificationSummary && (
                    <div className="flex items-center gap-1 mr-2">
                      <Badge variant="destructive" className="text-xs">
                        {notificationSummary.today} Today
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-xs bg-amber-500 hover:bg-amber-600"
                      >
                        {notificationSummary.tomorrow} Tomorrow
                      </Badge>
                    </div>
                  )}
                  <Button
                    onClick={handleAddAppointment}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white transition-all duration-200"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Add Appointment</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400" />
                  <Input
                    placeholder="Search appointments..."
                    className="pl-10 focus:ring-green-500 focus:border-green-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <div className="relative sm:w-1/4">
                  <div className="relative">
                    <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400" />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400" />
                    <select
                      className="w-full rounded-md border pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white appearance-none"
                      onChange={(e) => setFilterDays(Number(e.target.value))}
                      value={filterDays}
                    >
                      <option value={7}>Next 7 days</option>
                      <option value={14}>Next 14 days</option>
                      <option value={30}>Next 30 days</option>
                      <option value={90}>Next 3 months</option>
                    </select>
                  </div>
                </div>
              </div>

              {isUpcomingAppointmentsLoading ? (
                <div className="py-12 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                  <Loader2 className="h-8 w-8 animate-spin mb-2" />
                  <p>Loading appointments...</p>
                </div>
              ) : upcomingAppointmentsError ? (
                <div className="py-12 flex flex-col items-center justify-center text-red-500">
                  <p>Error loading appointments. Please try again.</p>
                </div>
              ) : filteredAppointments && filteredAppointments.length > 0 ? (
                isMobileView ? (
                  <div className="mt-4">
                    {filteredAppointments.map((appointment) => (
                      <MobileAppointmentCard
                        key={appointment.visitId}
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
                <div className="py-12 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                  <Calendar className="h-12 w-12 mb-2 opacity-30" />
                  <p className="mb-1">No appointments found</p>
                  <p className="text-sm">
                    There are no upcoming appointments in the selected time
                    range
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
