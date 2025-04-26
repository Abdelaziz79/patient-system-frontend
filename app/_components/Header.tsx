"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO } from "date-fns";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  BellIcon,
  Calendar,
  ChevronDown,
  Clock,
  HeartPulseIcon,
  InfoIcon,
  Menu,
  MessageSquareIcon,
  MoonIcon,
  SunIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { INotification } from "../_api/notificationApi";
import {
  ISystemNotification,
  NotificationType,
} from "../_api/systemNotificationApi";
import useMobileView from "../_hooks/useMobileView";
import { useNotification } from "../_hooks/useNotification";
import { useSystemNotification } from "../_hooks/useSystemNotification";
import { useThemeMode } from "../_hooks/useThemeMode";
import { useAuthContext } from "../_providers/AuthProvider";

interface HeaderProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// System notification icon by type
const getSystemNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.SUBSCRIPTION_EXPIRING:
      return <AlertTriangleIcon className="h-4 w-4 text-amber-500" />;
    case NotificationType.SYSTEM_NOTIFICATION:
      return <AlertCircleIcon className="h-4 w-4 text-blue-500" />;
    case NotificationType.CUSTOM_MESSAGE:
      return <MessageSquareIcon className="h-4 w-4 text-green-500" />;
    default:
      return <InfoIcon className="h-4 w-4 text-blue-500" />;
  }
};

export default function Header({ isOpen, toggleSidebar }: HeaderProps) {
  const { mounted, theme, toggleTheme } = useThemeMode();
  const { user, isAuthenticated } = useAuthContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeNotificationTab, setActiveNotificationTab] =
    useState("appointments");
  const { isMobileView: isMobile } = useMobileView();
  const { logout } = useAuthContext();
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    isUnreadCountLoading,
    refetchSystemNotifications,
    refetchUnreadCount,
    markAsRead,
  } = useSystemNotification();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }

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

  // Handle focus on search input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // Refetch notifications on mount
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAppointmentNotificationClick = (notification: INotification) => {
    router.push(
      `/patients/${notification.patientId}?visitId=${notification.visitId}`
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

  if (!mounted) return null;

  return (
    <header className="sticky top-0 w-full p-3 md:p-4 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-blue-100 dark:border-blue-900 z-20 transition-all shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* Mobile Sidebar Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-2 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 h-8 w-8"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Logo - visible on all screens */}
        <Link href="/">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <HeartPulseIcon className="h-5 w-5 md:h-6 md:w-6" />
            <span
              className={`font-bold ${
                isMobile ? "text-lg" : "text-xl"
              } whitespace-nowrap`}
            >
              {isMobile ? "PMS" : "Patient System"}
            </span>
          </div>
        </Link>

        {/* Search bar - expandable on mobile, always visible on desktop */}
        <div
          className={`${
            isMobile
              ? isSearchExpanded
                ? "flex absolute left-0 right-0 top-0 p-3 bg-white/90 dark:bg-slate-900/90 z-30"
                : "hidden"
              : "flex"
          } flex-1 max-w-md px-4 transition-all duration-300 ease-in-out`}
        >
          <div className="relative w-full">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              className="w-full py-2 px-4 rounded-full bg-blue-50 dark:bg-blue-900/30 text-gray-700 dark:text-gray-200 border border-blue-100 dark:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all duration-300"
              onBlur={() => isMobile && setIsSearchExpanded(false)}
            />
            {isMobile && isSearchExpanded && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1.5"
                onClick={() => setIsSearchExpanded(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Actions - right aligned */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Mobile search toggle */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchExpanded(true)}
              className="h-8 w-8 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 md:h-5 md:w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Button>
          )}

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
          >
            {theme === "dark" ? (
              <SunIcon className="h-4 w-4 md:h-5 md:w-5" />
            ) : (
              <MoonIcon className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </Button>

          {/* Notifications - only when authenticated */}
          {isAuthenticated && (
            <div className="relative" ref={notificationRef}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 relative text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <BellIcon className="h-4 w-4 md:h-5 md:w-5" />
                {getTotalNotificationCount() > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white
                    ${
                      hasUrgentNotifications() ? "bg-red-500" : "bg-amber-500"
                    }`}
                  >
                    {getTotalNotificationCount() > 99
                      ? "99+"
                      : getTotalNotificationCount()}
                  </span>
                )}
              </Button>

              {/* Notification Dropdown with Tabs */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-2 z-50 border border-blue-100 dark:border-blue-900 transform origin-top-right transition-all duration-200 animate-in fade-in-50 slide-in-from-top-5">
                  <Tabs
                    defaultValue="appointments"
                    className="w-full"
                    value={activeNotificationTab}
                    onValueChange={setActiveNotificationTab}
                  >
                    <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-blue-700 dark:text-blue-300">
                        Notifications
                      </h3>
                      <TabsList className="grid grid-cols-2 w-[200px]">
                        <TabsTrigger value="appointments" className="text-xs">
                          Appointments
                          {notificationSummary &&
                            notificationSummary.total > 0 && (
                              <span className="ml-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-xs rounded-full px-1.5">
                                {notificationSummary.total}
                              </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="system" className="text-xs">
                          System
                          {unreadCount && unreadCount.unreadCount > 0 && (
                            <span className="ml-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-xs rounded-full px-1.5">
                              {unreadCount.unreadCount}
                            </span>
                          )}
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="appointments" className="mt-0">
                      {isNotificationsLoading ? (
                        <div className="py-8 flex justify-center items-center">
                          <div className="animate-spin h-5 w-5 mr-2 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Loading notifications...
                          </p>
                        </div>
                      ) : !notifications || notifications.length === 0 ? (
                        <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                          <Calendar className="h-12 w-12 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">
                            No appointment notifications
                          </p>
                        </div>
                      ) : (
                        <>
                          <ScrollArea className="h-[300px]">
                            {notifications.map(
                              (notification: INotification) => (
                                <div
                                  key={`${notification.patientId}-${notification.visitId}`}
                                  className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors duration-150"
                                  onClick={() =>
                                    handleAppointmentNotificationClick(
                                      notification
                                    )
                                  }
                                >
                                  <div className="flex items-start">
                                    <div
                                      className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 mr-2
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
                                        <Calendar className="h-3 w-3 mr-1" />
                                        <span>
                                          {format(
                                            parseISO(notification.followUpDate),
                                            "MMM dd, yyyy"
                                          )}
                                        </span>
                                        <span className="mx-1">•</span>
                                        <Clock className="h-3 w-3 mr-1" />
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
                              )
                            )}
                          </ScrollArea>

                          {!isNotificationSummaryLoading &&
                            notificationSummary && (
                              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 mt-1">
                                <div className="flex justify-between items-center">
                                  <div className="flex gap-2">
                                    {notificationSummary.today > 0 && (
                                      <Badge
                                        variant="destructive"
                                        className="text-xs"
                                      >
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
                                  </div>
                                  <Link
                                    href="/appointments"
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                    onClick={() => setIsNotificationOpen(false)}
                                  >
                                    View All
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
                          <div className="animate-spin h-5 w-5 mr-2 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Loading system notifications...
                          </p>
                        </div>
                      ) : !systemNotifications ||
                        systemNotifications.length === 0 ? (
                        <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                          <InfoIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
                          <p className="text-sm">No system notifications</p>
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
                                    <div className="flex-shrink-0 mt-0.5 mr-3">
                                      {getSystemNotificationIcon(
                                        notification.type
                                      )}
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
                                              From:{" "}
                                              {notification.createdBy.name}
                                            </span>
                                          ) : (
                                            <span>System</span>
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
                                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 ml-2"></div>
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
                                  ? `${unreadCount.unreadCount} unread message${
                                      unreadCount.unreadCount !== 1 ? "s" : ""
                                    }`
                                  : "All caught up!"}
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
          )}

          {/* User profile or login/register */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 h-8 px-2 md:px-3"
              >
                <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="hidden md:inline max-w-[100px] truncate">
                  {user?.name || "User"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-2 z-50 border border-blue-100 dark:border-blue-900 transform origin-top-right transition-all duration-200 animate-in fade-in-50 slide-in-from-top-5">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Settings
                  </Link>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button
                    className="flex w-full items-center px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5.707-5.707A1 1 0 009.586 2H3zm0 2v10h12V9h-3a2 2 0 01-2-2V4H3z"
                        clipRule="evenodd"
                      />
                      <path d="M14 6V4.5a.5.5 0 01.5-.5H16a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1h9.5a.5.5 0 01.5.5V6h-2z" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size={isMobile ? "sm" : "default"}
                  className="text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size={isMobile ? "sm" : "default"}
                  className="bg-blue-600 hover:bg-blue-700 text-white ml-1 md:ml-2"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
