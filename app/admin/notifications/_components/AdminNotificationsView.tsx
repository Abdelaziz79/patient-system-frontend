"use client";

import { useLanguage } from "@/app/_contexts/LanguageContext";
import {
  ISystemNotification,
  NotificationType,
} from "@/app/_hooks/systemNotification/systemNotificationApi";
import { useSystemNotification } from "@/app/_hooks/systemNotification/useSystemNotification";
import { useUserAdmin } from "@/app/_hooks/userAdmin/useUserAdmin";
import { useAuthContext } from "@/app/_providers/AuthProvider";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Calendar, CheckSquare, Filter, RefreshCw } from "lucide-react";

import { AccessDeniedCard } from "./AccessDeniedCard";
import { AdminNotificationCard } from "./AdminNotificationCard";
import { CreateNotificationDialog } from "./CreateNotificationDialog";
import { EmptyNotificationState } from "./EmptyNotificationState";

export const AdminNotificationsView = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthContext();
  const { t, isRTL } = useLanguage();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [readStatus, setReadStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isCheckingSubscriptions, setIsCheckingSubscriptions] = useState(false);
  const [isCheckingEvents, setIsCheckingEvents] = useState(false);
  const [checkResult, setCheckResult] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  const {
    systemNotifications,
    isSystemNotificationsLoading,
    unreadCount,
    markAsRead,
    sendAdminNotification,
    checkSubscriptionExpirations,
    checkUpcomingEvents,
    refetchSystemNotifications,
    refetchUnreadCount,
    updateFilters,
  } = useSystemNotification();

  // Get user list for targeting specific users
  const { users, isLoading: isUsersLoading } = useUserAdmin();

  // Check if user is super admin
  useEffect(() => {
    if (isAuthenticated && user && user.role !== "super_admin") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  // Update filter based on selection
  useEffect(() => {
    let isReadFilter: boolean | undefined;

    if (readStatus === "unread") {
      isReadFilter = false;
    } else if (readStatus === "read") {
      isReadFilter = true;
    } else {
      isReadFilter = undefined;
    }

    updateFilters({
      initialIsRead: isReadFilter,
      initialType:
        selectedType !== "all" ? (selectedType as NotificationType) : undefined,
    });
  }, [readStatus, selectedType, updateFilters]);

  // Auto-refresh notifications on initial load
  useEffect(() => {
    if (isAuthenticated && user?.role === "super_admin") {
      refetchSystemNotifications();
      refetchUnreadCount();
    }
  }, [isAuthenticated, user, refetchSystemNotifications, refetchUnreadCount]);

  // Handle checking for subscription expirations
  const handleCheckSubscriptions = async () => {
    setIsCheckingSubscriptions(true);
    setCheckResult({});

    try {
      await checkSubscriptionExpirations();
      refetchSystemNotifications();
      refetchUnreadCount();
      setCheckResult({
        success: true,
        message: t("subscriptionCheckSuccess"),
      });
    } catch (error) {
      console.error("Failed to check subscriptions:", error);
      setCheckResult({
        success: false,
        message: t("subscriptionCheckFailed"),
      });
    } finally {
      setIsCheckingSubscriptions(false);
      // Auto-clear message after 3 seconds
      setTimeout(() => setCheckResult({}), 3000);
    }
  };

  // Handle checking for upcoming events
  const handleCheckUpcomingEvents = async () => {
    setIsCheckingEvents(true);
    setCheckResult({});

    try {
      await checkUpcomingEvents();
      refetchSystemNotifications();
      refetchUnreadCount();
      setCheckResult({
        success: true,
        message: t("eventsCheckSuccess"),
      });
    } catch (error) {
      console.error("Failed to check upcoming events:", error);
      setCheckResult({
        success: false,
        message: t("eventsCheckFailed"),
      });
    } finally {
      setIsCheckingEvents(false);
      // Auto-clear message after 3 seconds
      setTimeout(() => setCheckResult({}), 3000);
    }
  };

  // Handle marking all as read
  const handleMarkAllAsRead = async () => {
    if (!systemNotifications || systemNotifications.length === 0) return;

    try {
      // Process unread notifications in parallel
      await Promise.all(
        systemNotifications
          .filter((notification: ISystemNotification) => !notification.isRead)
          .map((notification: ISystemNotification) =>
            markAsRead(notification._id)
          )
      );

      refetchSystemNotifications();
      refetchUnreadCount();

      setCheckResult({
        success: true,
        message: t("allNotificationsMarkedRead"),
      });

      // Auto-clear message after 3 seconds
      setTimeout(() => setCheckResult({}), 3000);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      setCheckResult({
        success: false,
        message: t("failedToMarkAllRead"),
      });
    }
  };

  if (isAuthenticated && user?.role !== "super_admin") {
    return <AccessDeniedCard />;
  }

  return (
    <div className="container mx-auto py-3 sm:py-6 px-3 sm:px-6 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 dark:text-blue-300">
              {t("systemNotifications")}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5 sm:mt-1">
              {t("manageSystemNotifications")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-start sm:justify-end w-full sm:w-auto">
            {checkResult.message && (
              <span
                className={`text-xs sm:text-sm ${
                  checkResult.success ? "text-green-600" : "text-red-600"
                } mt-1 sm:mt-2 lg:mt-0 w-full text-left sm:text-right`}
              >
                {checkResult.message}
              </span>
            )}
            <div className="flex flex-wrap xs:flex-nowrap gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 w-full xs:w-auto"
                onClick={handleCheckSubscriptions}
                disabled={isCheckingSubscriptions}
              >
                {isCheckingSubscriptions ? (
                  <>
                    <div className="animate-spin h-3 w-3 sm:h-4 sm:w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                    <span className="whitespace-nowrap">{t("checking")}</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="whitespace-nowrap">
                      {t("checkSubscriptions")}
                    </span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 w-full xs:w-auto"
                onClick={handleCheckUpcomingEvents}
                disabled={isCheckingEvents}
              >
                {isCheckingEvents ? (
                  <>
                    <div className="animate-spin h-3 w-3 sm:h-4 sm:w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                    <span className="whitespace-nowrap">{t("checking")}</span>
                  </>
                ) : (
                  <>
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="whitespace-nowrap">
                      {t("checkEvents")}
                    </span>
                  </>
                )}
              </Button>

              <CreateNotificationDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={sendAdminNotification}
                onSuccess={refetchSystemNotifications}
                users={users}
                isLoading={isUsersLoading}
              />
            </div>
          </div>
        </div>

        <div
          className="flex flex-col xs:flex-row flex-wrap items-start xs:items-center gap-2 sm:gap-4 mb-3 sm:mb-4"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1 sm:gap-2 w-full xs:w-auto">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
              <span className="text-xs sm:text-sm text-gray-500">
                {t("filterStatus")}:
              </span>
              <Select value={readStatus} onValueChange={setReadStatus}>
                <SelectTrigger className="w-full xs:w-[120px] sm:w-[130px] h-7 sm:h-9 text-xs sm:text-sm">
                  <SelectValue placeholder={t("allNotifications")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allNotifications")}</SelectItem>
                  <SelectItem value="unread">
                    {t("unreadOnly")}
                    {unreadCount && unreadCount.unreadCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="mx-1 sm:mx-2 bg-blue-600 text-white text-xs"
                      >
                        {unreadCount.unreadCount}
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="read">{t("readOnly")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 w-full xs:w-auto">
              <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
              <span className="text-xs sm:text-sm text-gray-500">
                {t("type")}:
              </span>
              <Select
                value={selectedType}
                onValueChange={(value) => setSelectedType(value)}
              >
                <SelectTrigger className="w-full xs:w-[140px] sm:w-[160px] h-7 sm:h-9 text-xs sm:text-sm">
                  <SelectValue placeholder={t("allNotifications")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allNotifications")}</SelectItem>
                  <SelectItem value={NotificationType.SYSTEM_NOTIFICATION}>
                    {t("systemNotification")}
                  </SelectItem>
                  <SelectItem value={NotificationType.CUSTOM_MESSAGE}>
                    {t("customMessage")}
                  </SelectItem>
                  <SelectItem value={NotificationType.SUBSCRIPTION_EXPIRING}>
                    {t("subscriptionAlert")}
                  </SelectItem>
                  <SelectItem value={NotificationType.PATIENT_EVENT}>
                    {t("patientEvent")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {unreadCount && unreadCount.unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 sm:gap-2 h-7 sm:h-9 text-xs sm:text-sm text-blue-600 dark:text-blue-400 w-full xs:w-auto"
              onClick={handleMarkAllAsRead}
            >
              <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4" />
              {t("markAllAsRead")}
            </Button>
          )}
        </div>

        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-blue-100 dark:border-blue-900 shadow-xl overflow-hidden rounded-xl">
          <CardContent className="p-3 sm:p-6">
            {isSystemNotificationsLoading ? (
              <div className="flex items-center justify-center py-6 sm:py-10">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : !systemNotifications || systemNotifications.length === 0 ? (
              <EmptyNotificationState
                icon={
                  <Bell className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 dark:text-gray-600" />
                }
                title={t("noNotificationsFound")}
                description={
                  readStatus === "unread"
                    ? t("noUnreadNotifications")
                    : readStatus === "read"
                    ? t("noReadNotifications")
                    : selectedType
                    ? t("noNotificationsOfType")
                    : t("noSystemNotifications")
                }
              />
            ) : (
              <div className="space-y-2 sm:space-y-4 max-h-[calc(100vh-260px)] sm:max-h-[calc(100vh-300px)] overflow-y-auto px-1 sm:px-2">
                {systemNotifications.map(
                  (notification: ISystemNotification, index: number) => (
                    <AdminNotificationCard
                      key={notification._id}
                      notification={notification}
                      onMarkAsRead={() => markAsRead(notification._id)}
                      index={index}
                    />
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
