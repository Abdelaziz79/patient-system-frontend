"use client";

import { useLanguage } from "@/app/_contexts/LanguageContext";
import { INotification } from "@/app/_hooks/notification/notificationApi";
import { useNotification } from "@/app/_hooks/notification/useNotification";
import {
  ISystemNotification,
  NotificationType,
} from "@/app/_hooks/systemNotification/systemNotificationApi";
import { useSystemNotification } from "@/app/_hooks/systemNotification/useSystemNotification";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO } from "date-fns";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Calendar,
  Clock,
  Info,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// System notification icon by type
const getSystemNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.SUBSCRIPTION_EXPIRING:
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case NotificationType.SYSTEM_NOTIFICATION:
      return <AlertCircle className="h-4 w-4 text-blue-500" />;
    case NotificationType.CUSTOM_MESSAGE:
      return <MessageSquare className="h-4 w-4 text-green-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

export default function NotificationDropdown() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeNotificationTab, setActiveNotificationTab] =
    useState("appointments");
  const notificationRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t, isRTL } = useLanguage();

  // Initialize notification hooks
  const {
    notifications,
    notificationSummary,
    isNotificationsLoading,
    isNotificationSummaryLoading,
    refetchNotifications,
    refetchNotificationSummary,
  } = useNotification({ initialDays: 7 });

  const {
    systemNotifications,
    isSystemNotificationsLoading,
    unreadCount,
    refetchSystemNotifications,
    refetchUnreadCount,
    markAsRead,
  } = useSystemNotification();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Refetch notifications on mount
  useEffect(() => {
    refetchNotifications();
    refetchNotificationSummary();
    refetchSystemNotifications();
    refetchUnreadCount();
  }, [
    refetchNotifications,
    refetchNotificationSummary,
    refetchSystemNotifications,
    refetchUnreadCount,
  ]);

  const handleAppointmentNotificationClick = (notification: INotification) => {
    router.push(
      `/patients/${notification.patientId}?visitId=${notification.id}`
    );
    setIsNotificationOpen(false);
  };

  const handleSystemNotificationClick = async (
    notification: ISystemNotification
  ) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    // Handle different notification types
    if (notification.type === NotificationType.SUBSCRIPTION_EXPIRING) {
      router.push("/settings/subscription");
    }

    setIsNotificationOpen(false);
  };

  const getTotalNotificationCount = (): number => {
    let count = 0;

    if (notificationSummary) {
      count += notificationSummary.total;
    }

    if (unreadCount) {
      count += unreadCount.unreadCount;
    }

    return count;
  };

  const hasUrgentNotifications = (): boolean => {
    if (notificationSummary && notificationSummary.today > 0) {
      return true;
    }

    if (unreadCount && unreadCount.unreadCount > 0 && systemNotifications) {
      return systemNotifications.some(
        (n: ISystemNotification) =>
          n.type === NotificationType.SUBSCRIPTION_EXPIRING && !n.isRead
      );
    }

    return false;
  };

  return (
    <div className="relative" ref={notificationRef}>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 md:h-9 md:w-9 relative text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        aria-label={t("notifications")}
      >
        <Bell className="h-4 w-4 md:h-5 md:w-5" />
        {getTotalNotificationCount() > 0 && (
          <span
            className={`absolute -top-1 -right-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full text-[10px] md:text-xs text-white
            ${hasUrgentNotifications() ? "bg-red-500" : "bg-amber-500"}`}
          >
            {getTotalNotificationCount() > 99
              ? "99+"
              : getTotalNotificationCount()}
          </span>
        )}
      </Button>

      {/* Notification Dropdown with Tabs */}
      {isNotificationOpen && (
        <div
          className={`absolute ${
            isRTL ? "left-0" : "right-0"
          } mt-2 w-[280px] sm:w-80 md:w-96 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-lg shadow-lg py-2 z-50 border border-blue-100 dark:border-blue-900 transform origin-top-${
            isRTL ? "left" : "right"
          } transition-all duration-200 animate-in fade-in-50 slide-in-from-top-5`}
        >
          <Tabs
            defaultValue="appointments"
            className="w-full"
            value={activeNotificationTab}
            onValueChange={setActiveNotificationTab}
          >
            <div className="flex flex-col md:flex-row justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-blue-700 dark:text-blue-400">
                {t("notifications")}
              </h3>
              <TabsList className="grid grid-cols-2 w-[250px]">
                <TabsTrigger value="appointments" className="text-xs">
                  {t("appointments")}
                  {notificationSummary && notificationSummary.total > 0 && (
                    <span className="mx-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-xs rounded-full px-1.5">
                      {notificationSummary.total}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="system" className="text-xs">
                  {t("system")}
                  {unreadCount && unreadCount.unreadCount > 0 && (
                    <span className="mx-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-xs rounded-full px-1.5">
                      {unreadCount.unreadCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="appointments" className="mt-0">
              {isNotificationsLoading ? (
                <div className="py-8 flex justify-center items-center">
                  <div className="animate-spin h-5 w-5 mx-2 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("loadingNotifications")}
                  </p>
                </div>
              ) : !notifications || notifications.length === 0 ? (
                <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">{t("noAppointmentNotifications")}</p>
                </div>
              ) : (
                <>
                  <ScrollArea className="h-[300px]">
                    {notifications.map((notification: INotification) => (
                      <div
                        key={`${notification.patientId}-${notification.id}`}
                        className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors duration-150"
                        onClick={() =>
                          handleAppointmentNotificationClick(notification)
                        }
                      >
                        <div className="flex items-start">
                          <div
                            className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                              isRTL ? "mx-2" : "mx-2"
                            }
                            ${
                              notification.daysUntil === 0
                                ? "bg-red-500"
                                : notification.daysUntil === 1
                                ? "bg-amber-500"
                                : "bg-blue-500"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                              {notification.message}
                            </p>
                            <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="h-3 w-3 mx-1" />
                              <span>
                                {format(
                                  parseISO(notification.followUpDate),
                                  "MMM dd, yyyy"
                                )}
                              </span>
                              <span className="mx-1">•</span>
                              <Clock className="h-3 w-3 mx-1" />
                              <span>
                                {format(
                                  parseISO(notification.followUpDate),
                                  "hh:mm a"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>

                  {!isNotificationSummaryLoading && notificationSummary && (
                    <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 mt-1">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          {notificationSummary.today > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {notificationSummary.today} {t("today")}
                            </Badge>
                          )}
                          {notificationSummary.tomorrow > 0 && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-amber-500 hover:bg-amber-600"
                            >
                              {notificationSummary.tomorrow} {t("tomorrow")}
                            </Badge>
                          )}
                        </div>
                        <Link
                          href="/appointments"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          onClick={() => setIsNotificationOpen(false)}
                        >
                          {t("viewAll")}
                        </Link>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="system" className="mt-0">
              {isSystemNotificationsLoading ? (
                <div className="py-8 flex justify-center items-center">
                  <div className="animate-spin h-5 w-5 mx-2 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("loadingSystemNotifications")}
                  </p>
                </div>
              ) : !systemNotifications || systemNotifications.length === 0 ? (
                <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                  <Info className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">{t("noSystemNotifications")}</p>
                </div>
              ) : (
                <>
                  <ScrollArea className="h-[300px]">
                    {systemNotifications.map(
                      (notification: ISystemNotification) => (
                        <div
                          key={notification._id}
                          className={`px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors duration-150 ${
                            !notification.isRead
                              ? "bg-blue-50/50 dark:bg-blue-900/10"
                              : ""
                          }`}
                          onClick={() =>
                            handleSystemNotificationClick(notification)
                          }
                        >
                          <div className="flex items-start">
                            <div
                              className={`flex-shrink-0 mt-0.5 ${
                                isRTL ? "mx-3" : "mx-3"
                              }`}
                            >
                              {getSystemNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <p
                                className={`text-sm font-medium ${
                                  !notification.isRead
                                    ? "text-blue-700 dark:text-blue-400"
                                    : "text-gray-800 dark:text-gray-200"
                                }`}
                              >
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="mt-1.5 flex items-center justify-between">
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                                  {notification.createdBy ? (
                                    <span>
                                      {t("from")}: {notification.createdBy.name}
                                    </span>
                                  ) : (
                                    <span>{t("system")}</span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-500">
                                  {format(
                                    parseISO(notification.createdAt),
                                    "MMM dd, yyyy"
                                  )}
                                </div>
                              </div>
                            </div>
                            {!notification.isRead && (
                              <div
                                className={`w-2 h-2 rounded-full bg-blue-500 mt-1.5 ${
                                  isRTL ? "mx-2" : "mx-2"
                                }`}
                              ></div>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </ScrollArea>

                  <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 mt-1">
                    <div className="flex justify-end">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {unreadCount && unreadCount.unreadCount > 0
                          ? `${unreadCount.unreadCount} ${t("unreadMessage")}${
                              unreadCount.unreadCount !== 1 ? "s" : ""
                            }`
                          : t("allCaughtUp")}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
