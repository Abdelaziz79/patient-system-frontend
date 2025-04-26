"use client";

import { INotification } from "@/app/_api/notificationApi";
import {
  ISystemNotification,
  NotificationType,
} from "@/app/_api/systemNotificationApi";
import { useNotification } from "@/app/_hooks/useNotification";
import { useSystemNotification } from "@/app/_hooks/useSystemNotification";
import { useAuthContext } from "@/app/_providers/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  InfoIcon,
  MessageSquareIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Component to display the icon for each notification type
const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case NotificationType.SUBSCRIPTION_EXPIRING:
      return <AlertTriangleIcon className="h-5 w-5 text-amber-500" />;
    case NotificationType.SYSTEM_NOTIFICATION:
      return <AlertCircleIcon className="h-5 w-5 text-blue-500" />;
    case NotificationType.CUSTOM_MESSAGE:
      return <MessageSquareIcon className="h-5 w-5 text-green-500" />;
    default:
      return <InfoIcon className="h-5 w-5 text-blue-500" />;
  }
};

export default function NotificationsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
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
      `/patients/${notification.patientId}?visitId=${notification.visitId}`
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

  // Count total unread notifications
  const totalUnreadCount =
    (notificationSummary?.total || 0) + (unreadCount?.unreadCount || 0);

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-blue-100 dark:border-blue-900 shadow-xl overflow-hidden">
          <CardHeader className="px-6 pb-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                  {totalUnreadCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-blue-600 text-white"
                    >
                      {totalUnreadCount}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400 mt-1">
                  Manage your appointments and system notifications
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-2">
            <Tabs
              defaultValue="appointments"
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
                <TabsList>
                  <TabsTrigger value="appointments" className="px-4">
                    Appointments
                    {notificationSummary && notificationSummary.total > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-green-600 text-white"
                      >
                        {notificationSummary.total}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="system" className="px-4">
                    System
                    {unreadCount && unreadCount.unreadCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-blue-600 text-white"
                      >
                        {unreadCount.unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                {/* Filters */}
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  {activeTab === "appointments" ? (
                    <Select
                      value={String(filterDays)}
                      onValueChange={(value) => setFilterDays(Number(value))}
                    >
                      <SelectTrigger className="w-[160px] h-8 text-sm">
                        <SelectValue placeholder="Filter period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Next 7 days</SelectItem>
                        <SelectItem value="14">Next 14 days</SelectItem>
                        <SelectItem value="30">Next 30 days</SelectItem>
                        <SelectItem value="90">Next 3 months</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select
                      value={systemFilterRead}
                      onValueChange={setSystemFilterRead}
                    >
                      <SelectTrigger className="w-[160px] h-8 text-sm">
                        <SelectValue placeholder="Filter status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All notifications</SelectItem>
                        <SelectItem value="unread">Unread only</SelectItem>
                        <SelectItem value="read">Read only</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Appointment Notifications Tab */}
              <TabsContent value="appointments" className="mt-6">
                {isNotificationsLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
                  </div>
                ) : !notifications || notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">
                      No appointments found
                    </h3>
                    <p className="text-gray-400 dark:text-gray-500 mt-2">
                      There are no upcoming appointments for the selected time
                      period
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100vh-320px)] pr-4">
                    <div className="space-y-4 pb-4">
                      {notifications.map((notification: INotification) => (
                        <div
                          key={`${notification.patientId}-${notification.visitId}`}
                          className="p-4 border rounded-lg bg-white dark:bg-slate-800 hover:bg-green-50 dark:hover:bg-green-900/10 cursor-pointer transition-colors border-green-100 dark:border-green-900"
                          onClick={() => handleAppointmentClick(notification)}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-3 h-3 mt-1.5 rounded-full flex-shrink-0 ${
                                notification.daysUntil === 0
                                  ? "bg-red-500"
                                  : notification.daysUntil === 1
                                  ? "bg-amber-500"
                                  : "bg-green-500"
                              }`}
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                                {notification.message}
                              </h3>
                              <div className="flex flex-wrap gap-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1.5 text-green-600 dark:text-green-400" />
                                  {format(
                                    parseISO(notification.followUpDate),
                                    "MMM dd, yyyy"
                                  )}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1.5 text-green-600 dark:text-green-400" />
                                  {format(
                                    parseISO(notification.followUpDate),
                                    "hh:mm a"
                                  )}
                                </div>
                                <div className="flex items-center">
                                  <Badge
                                    variant="outline"
                                    className="text-xs px-2"
                                  >
                                    {notification.visitType}
                                  </Badge>
                                </div>
                              </div>
                              <div className="mt-2">
                                <Badge
                                  variant={
                                    notification.daysUntil === 0
                                      ? "destructive"
                                      : notification.daysUntil === 1
                                      ? "secondary"
                                      : "secondary"
                                  }
                                  className={`text-xs ${
                                    notification.daysUntil === 1
                                      ? "bg-amber-500 hover:bg-amber-600"
                                      : ""
                                  }`}
                                >
                                  {notification.daysUntil === 0
                                    ? "Today"
                                    : notification.daysUntil === 1
                                    ? "Tomorrow"
                                    : `In ${notification.daysUntil} days`}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}

                {/* Summary footer */}
                {!isNotificationSummaryLoading &&
                  notificationSummary &&
                  notificationSummary.total > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-2">
                        {notificationSummary.today > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {notificationSummary.today} Today
                          </Badge>
                        )}
                        {notificationSummary.tomorrow > 0 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-amber-500 hover:bg-amber-600"
                          >
                            {notificationSummary.tomorrow} Tomorrow
                          </Badge>
                        )}
                        {notificationSummary.thisWeek > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {notificationSummary.thisWeek} This week
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-700 dark:hover:bg-green-900/20"
                        onClick={() => router.push("/appointments")}
                      >
                        View All Appointments
                      </Button>
                    </div>
                  )}
              </TabsContent>

              {/* System Notifications Tab */}
              <TabsContent value="system" className="mt-6">
                {isSystemNotificationsLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : !systemNotifications || systemNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <InfoIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">
                      No notifications found
                    </h3>
                    <p className="text-gray-400 dark:text-gray-500 mt-2">
                      {systemFilterRead === "all"
                        ? "You don't have any system notifications"
                        : systemFilterRead === "unread"
                        ? "You don't have any unread system notifications"
                        : "You don't have any read system notifications"}
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100vh-320px)] pr-4">
                    <div className="space-y-4 pb-4">
                      {systemNotifications.map(
                        (notification: ISystemNotification) => (
                          <div
                            key={notification._id}
                            className={`p-4 border rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer transition-colors ${
                              !notification.isRead
                                ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                                : "bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700"
                            }`}
                            onClick={() =>
                              handleSystemNotificationClick(notification)
                            }
                          >
                            <div className="flex items-start gap-4">
                              <div className="mt-1">
                                <NotificationIcon type={notification.type} />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <h3
                                    className={`font-medium ${
                                      !notification.isRead
                                        ? "text-blue-700 dark:text-blue-400"
                                        : "text-gray-800 dark:text-gray-200"
                                    }`}
                                  >
                                    {notification.title}
                                  </h3>
                                  <Badge variant="outline" className="text-xs">
                                    {notification.type ===
                                    NotificationType.SUBSCRIPTION_EXPIRING
                                      ? "Subscription"
                                      : notification.type ===
                                        NotificationType.SYSTEM_NOTIFICATION
                                      ? "System"
                                      : "Message"}
                                  </Badge>
                                </div>
                                <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
                                  {notification.message}
                                </p>
                                <div className="flex justify-between mt-3">
                                  <div className="text-xs text-gray-500">
                                    {format(
                                      parseISO(notification.createdAt),
                                      "MMM dd, yyyy"
                                    )}
                                  </div>
                                  <div>
                                    {!notification.isRead ? (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          markAsRead(notification._id);
                                        }}
                                      >
                                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                        Mark as read
                                      </Button>
                                    ) : (
                                      <Badge
                                        variant="outline"
                                        className="text-xs text-gray-500 dark:text-gray-400"
                                      >
                                        Read
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </ScrollArea>
                )}

                {/* Summary footer */}
                {!isSystemNotificationsLoading &&
                  systemNotifications &&
                  systemNotifications.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {unreadCount && unreadCount.unreadCount > 0
                          ? `${unreadCount.unreadCount} unread notification${
                              unreadCount.unreadCount !== 1 ? "s" : ""
                            }`
                          : "All caught up!"}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        onClick={() => {
                          // Mark all as read
                          if (
                            systemNotifications &&
                            unreadCount &&
                            unreadCount.unreadCount > 0
                          ) {
                            Promise.all(
                              systemNotifications
                                .filter((n: ISystemNotification) => !n.isRead)
                                .map((n: ISystemNotification) =>
                                  markAsRead(n._id)
                                )
                            ).then(() => {
                              refetchSystemNotifications();
                              refetchUnreadCount();
                            });
                          }
                        }}
                        disabled={!unreadCount || unreadCount.unreadCount === 0}
                      >
                        Mark all as read
                      </Button>
                    </div>
                  )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
