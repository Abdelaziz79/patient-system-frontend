"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { useAuthContext } from "@/app/_providers/AuthProvider";
import { useNotification } from "@/app/_hooks/notification/useNotification";
import { useSystemNotification } from "@/app/_hooks/systemNotification/useSystemNotification";
import { INotification } from "@/app/_hooks/notification/notificationApi";
import {
  ISystemNotification,
  NotificationType,
} from "@/app/_hooks/systemNotification/systemNotificationApi";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Calendar, Filter, InfoIcon, Loader2 } from "lucide-react";
import {
  AppointmentNotificationCard,
  SystemNotificationCard,
  EmptyState,
  NotificationSummaryFooter,
  SystemNotificationFooter,
} from "./";

export const NotificationsView = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("appointments");
  const [filterDays, setFilterDays] = useState<number>(7);
  const [systemFilterRead, setSystemFilterRead] = useState<string>("all");

  // Initialize notification hooks
  const {
    notifications,
    notificationSummary,
    isNotificationsLoading,
    isNotificationSummaryLoading,
    refetchNotifications,
    refetchNotificationSummary,
    updateDaysFilter,
  } = useNotification({ initialDays: filterDays });

  const {
    systemNotifications,
    isSystemNotificationsLoading,
    unreadCount,
    markAsRead,
    refetchSystemNotifications,
    refetchUnreadCount,
    updateFilters,
  } = useSystemNotification();

  // Update days filter for appointment notifications
  useEffect(() => {
    updateDaysFilter(filterDays);
  }, [filterDays, updateDaysFilter]);

  // Update read filter for system notifications
  useEffect(() => {
    if (systemFilterRead === "all") {
      updateFilters({ initialIsRead: undefined });
    } else if (systemFilterRead === "unread") {
      updateFilters({ initialIsRead: false });
    } else if (systemFilterRead === "read") {
      updateFilters({ initialIsRead: true });
    }
  }, [systemFilterRead, updateFilters]);

  // Refresh notifications on initial load
  useEffect(() => {
    if (isAuthenticated) {
      refetchNotifications();
      refetchNotificationSummary();
      refetchSystemNotifications();
      refetchUnreadCount();
    }
  }, [
    isAuthenticated,
    refetchNotifications,
    refetchNotificationSummary,
    refetchSystemNotifications,
    refetchUnreadCount,
  ]);

  // Handle appointment notification click
  const handleAppointmentClick = (notification: INotification) => {
    router.push(
      `/patients/${notification.patientId}?visitId=${notification.id}`
    );
  };

  // Handle system notification click
  const handleSystemNotificationClick = async (
    notification: ISystemNotification
  ) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    // Navigate based on notification type
    if (notification.type === NotificationType.SUBSCRIPTION_EXPIRING) {
      router.push("/settings/subscription");
    }
  };

  // Handle marking a notification as read
  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    await markAsRead(id);
    refetchSystemNotifications();
    refetchUnreadCount();
  };

  // Count total unread notifications
  const totalUnreadCount =
    (notificationSummary?.total || 0) + (unreadCount?.unreadCount || 0);

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    if (systemNotifications && unreadCount && unreadCount.unreadCount > 0) {
      Promise.all(
        systemNotifications
          .filter((n: ISystemNotification) => !n.isRead)
          .map((n: ISystemNotification) => markAsRead(n._id))
      ).then(() => {
        refetchSystemNotifications();
        refetchUnreadCount();
      });
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container px-4 sm:px-6 mx-auto py-4 sm:py-6 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-blue-100 dark:border-blue-900 shadow-xl overflow-hidden rounded-xl">
          <CardHeader className="px-4 sm:px-6 pb-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                  <Bell className={`h-5 w-5 ${isRTL ? "mx-1" : "mx-1"}`} />
                  {t("notifications")}
                  {totalUnreadCount > 0 && (
                    <Badge
                      variant="secondary"
                      className={`${
                        isRTL ? "mx-2" : "mx-2"
                      } bg-blue-600 text-white`}
                    >
                      {totalUnreadCount}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400 mt-1">
                  {t("manageNotifications")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 pt-2">
            <Tabs
              defaultValue="appointments"
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between sm:items-center border-b border-gray-200 dark:border-gray-700 pb-4">
                <TabsList className="mb-2 sm:mb-0">
                  <TabsTrigger value="appointments" className="px-3 sm:px-4">
                    {t("appointments")}
                    {notificationSummary && notificationSummary.total > 0 && (
                      <Badge
                        variant="secondary"
                        className={`${
                          isRTL ? "mx-2" : "mx-2"
                        } bg-green-600 text-white`}
                      >
                        {notificationSummary.total}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="system" className="px-3 sm:px-4">
                    {t("system")}
                    {unreadCount && unreadCount.unreadCount > 0 && (
                      <Badge
                        variant="secondary"
                        className={`${
                          isRTL ? "mx-2" : "mx-2"
                        } bg-blue-600 text-white`}
                      >
                        {unreadCount.unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                {/* Filters */}
                <div className="flex items-center">
                  <Filter className="h-4 w-4 text-gray-400 mx-2" />
                  {activeTab === "appointments" ? (
                    <Select
                      value={String(filterDays)}
                      onValueChange={(value) => setFilterDays(Number(value))}
                    >
                      <SelectTrigger
                        className="w-full sm:w-[160px] h-8 text-sm"
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        <SelectValue placeholder={t("filterPeriod")} />
                      </SelectTrigger>
                      <SelectContent dir={isRTL ? "rtl" : "ltr"}>
                        <SelectItem value="7">{t("next7Days")}</SelectItem>
                        <SelectItem value="14">{t("next14Days")}</SelectItem>
                        <SelectItem value="30">{t("next30Days")}</SelectItem>
                        <SelectItem value="90">{t("next3Months")}</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select
                      value={systemFilterRead}
                      onValueChange={setSystemFilterRead}
                    >
                      <SelectTrigger
                        className="w-full sm:w-[160px] h-8 text-sm"
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        <SelectValue placeholder={t("filterStatus")} />
                      </SelectTrigger>
                      <SelectContent dir={isRTL ? "rtl" : "ltr"}>
                        <SelectItem value="all">
                          {t("allNotifications")}
                        </SelectItem>
                        <SelectItem value="unread">
                          {t("unreadOnly")}
                        </SelectItem>
                        <SelectItem value="read">{t("readOnly")}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Appointment Notifications Tab */}
              <TabsContent value="appointments" className="mt-4 sm:mt-6">
                {isNotificationsLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-10 w-10 animate-spin text-green-500" />
                  </div>
                ) : !notifications || notifications.length === 0 ? (
                  <EmptyState
                    icon={
                      <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                    }
                    title={t("noAppointmentsFound")}
                    description={t("noUpcomingAppointments")}
                  />
                ) : (
                  <ScrollArea className="h-[calc(100vh-360px)] sm:h-[calc(100vh-320px)] px-2 sm:px-4">
                    <div className="space-y-3 sm:space-y-4 pb-4">
                      {notifications.map(
                        (notification: INotification, index: number) => (
                          <AppointmentNotificationCard
                            key={`${notification.patientId}-${notification.id}`}
                            notification={notification}
                            onClick={handleAppointmentClick}
                            index={index}
                          />
                        )
                      )}
                    </div>
                  </ScrollArea>
                )}

                {/* Summary footer */}
                {!isNotificationSummaryLoading &&
                  notificationSummary &&
                  notificationSummary.total > 0 && (
                    <NotificationSummaryFooter
                      notificationSummary={notificationSummary}
                      onViewAll={() => router.push("/appointments")}
                    />
                  )}
              </TabsContent>

              {/* System Notifications Tab */}
              <TabsContent value="system" className="mt-4 sm:mt-6">
                {isSystemNotificationsLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                  </div>
                ) : !systemNotifications || systemNotifications.length === 0 ? (
                  <EmptyState
                    icon={
                      <InfoIcon className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                    }
                    title={t("noNotificationsFound")}
                    description={
                      systemFilterRead === "all"
                        ? t("noSystemNotifications")
                        : systemFilterRead === "unread"
                        ? t("noUnreadNotifications")
                        : t("noReadNotifications")
                    }
                  />
                ) : (
                  <ScrollArea className="h-[calc(100vh-360px)] sm:h-[calc(100vh-320px)] px-2 sm:px-4">
                    <div className="space-y-3 sm:space-y-4 pb-4">
                      {systemNotifications.map(
                        (notification: ISystemNotification, index: number) => (
                          <SystemNotificationCard
                            key={notification._id}
                            notification={notification}
                            onClick={handleSystemNotificationClick}
                            onMarkAsRead={handleMarkAsRead}
                            index={index}
                          />
                        )
                      )}
                    </div>
                  </ScrollArea>
                )}

                {/* System notifications footer */}
                {!isSystemNotificationsLoading &&
                  systemNotifications &&
                  systemNotifications.length > 0 && (
                    <SystemNotificationFooter
                      unreadCount={unreadCount}
                      onMarkAllAsRead={handleMarkAllAsRead}
                    />
                  )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
