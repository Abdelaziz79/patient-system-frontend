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
    <div className="container mx-auto py-6 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="flex justify-between items-center mb-6"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div>
            <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300">
              {t("systemNotifications")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t("manageSystemNotifications")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-end">
            {checkResult.message && (
              <span
                className={`text-sm ${
                  checkResult.success ? "text-green-600" : "text-red-600"
                } mt-2 lg:mt-0 w-full lg:w-auto text-right`}
              >
                {checkResult.message}
              </span>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleCheckSubscriptions}
                disabled={isCheckingSubscriptions}
              >
                {isCheckingSubscriptions ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                    {t("checking")}
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    {t("checkSubscriptions")}
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleCheckUpcomingEvents}
                disabled={isCheckingEvents}
              >
                {isCheckingEvents ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                    {t("checking")}
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4" />
                    {t("checkEvents")}
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
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">
                {t("filterStatus")}:
              </span>
              <Select value={readStatus} onValueChange={setReadStatus}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder={t("allNotifications")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allNotifications")}</SelectItem>
                  <SelectItem value="unread">
                    {t("unreadOnly")}
                    {unreadCount && unreadCount.unreadCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="mx-2 bg-blue-600 text-white"
                      >
                        {unreadCount.unreadCount}
                      </Badge>
                    )}
                  </SelectItem>
                  <SelectItem value="read">{t("readOnly")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">{t("type")}:</span>
              <Select
                value={selectedType}
                onValueChange={(value) => setSelectedType(value)}
              >
                <SelectTrigger className="w-[160px]">
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
              className="flex items-center gap-2 h-9 text-blue-600 dark:text-blue-400"
              onClick={handleMarkAllAsRead}
            >
              <CheckSquare className="h-4 w-4" />
              {t("markAllAsRead")}
            </Button>
          )}
        </div>

        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-blue-100 dark:border-blue-900 shadow-xl overflow-hidden rounded-xl">
          <CardContent className="p-6">
            {isSystemNotificationsLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : !systemNotifications || systemNotifications.length === 0 ? (
              <EmptyNotificationState
                icon={
                  <Bell className="h-16 w-16 text-gray-300 dark:text-gray-600" />
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
              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto px-2">
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
