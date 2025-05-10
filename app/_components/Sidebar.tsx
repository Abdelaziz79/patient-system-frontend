"use client";

import { useLanguage } from "@/app/_contexts/LanguageContext";
import useMobileView from "@/app/_hooks/useMobileView";
import { useThemeMode } from "@/app/_hooks/useThemeMode";
import { useAuthContext } from "@/app/_providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  Calendar,
  ChevronLeft,
  Database,
  FileText,
  HeartPulseIcon,
  Home,
  LogOut,
  Moon,
  NotebookText,
  Settings,
  Sun,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useState } from "react";

// Define props type
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Define group names type
type GroupName =
  | "Main"
  | "Clinical"
  | "Management"
  | "Admin"
  | "System"
  | "Other";

// Define navigation item structure
interface NavItem {
  href: string;
  icon: React.ReactElement;
  title: string;
  group: GroupName;
}

// Simple tooltip implementation
const Tooltip = ({
  children,
  content,
}: {
  children: ReactNode;
  content: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute left-full mx-2 px-2 py-1 bg-white dark:bg-slate-800 text-sm rounded shadow-lg border border-blue-100 dark:border-blue-900 whitespace-nowrap z-50"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const pathname = usePathname();
  const { theme, toggleTheme, mounted } = useThemeMode();
  const { logout, isLoading, isAuthenticated, user } = useAuthContext();
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const { isMobileView } = useMobileView();

  const goToSetting = () => {
    router.push("/settings");
  };

  const goToLogin = () => {
    router.push("/login");
  };

  // Check if user is an admin or super_admin
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  // Check if user is super_admin
  const isSuperAdmin = user?.role === "super_admin";

  // Navigation links with grouping
  const navItems: NavItem[] = [
    {
      href: "/",
      icon: <Home size={20} />,
      title: t("home"),
      group: "Main" as GroupName,
    },
    ...(isAuthenticated
      ? [
          {
            href: "/profile",
            icon: <User size={20} />,
            title: t("profile"),
            group: "Main" as GroupName,
          },
          {
            href: "/patients",
            icon: <Users size={20} />,
            title: t("patients"),
            group: "Clinical" as GroupName,
          },
          {
            href: "/appointments",
            icon: <Calendar size={20} />,
            title: t("appointments"),
            group: "Clinical" as GroupName,
          },
          {
            href: "/notifications",
            icon: <Bell size={20} />,
            title: t("notifications"),
            group: "Clinical" as GroupName,
          },
          ...(isAdmin
            ? [
                {
                  href: "/reports",
                  icon: <FileText size={20} />,
                  title: t("reports"),
                  group: "Management" as GroupName,
                },
                {
                  href: "/templates",
                  icon: <NotebookText size={20} />,
                  title: t("templates"),
                  group: "Admin" as GroupName,
                },
                {
                  href: "/admin/",
                  icon: <BarChart3 size={20} />,
                  title: t("userStats"),
                  group: "Admin" as GroupName,
                },
                ...(isSuperAdmin
                  ? [
                      {
                        href: "/admin/notifications",
                        icon: <Bell size={20} />,
                        title: t("systemNotifications"),
                        group: "Admin" as GroupName,
                      },
                      {
                        href: "/admin/backups",
                        icon: <Database size={20} />,
                        title: t("backups"),
                        group: "Admin" as GroupName,
                      },
                    ]
                  : []),
              ]
            : []),
        ]
      : []),
  ];

  // Group navigation items by category
  const groupedNavItems = navItems.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {} as Record<GroupName, NavItem[]>);

  // Order of groups
  const groupOrder: GroupName[] = [
    "Main",
    "Clinical",
    "Management",
    "Admin",
    "System",
    "Other",
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Only render the sidebar on large screens or when explicitly toggled on mobile */}
      {(!isMobileView || isOpen) && (
        <motion.aside
          initial={{ x: isRTL ? "100%" : "-100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-0 ${
            isRTL ? "right-0" : "left-0"
          } h-full z-40 py-4 px-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-xl border-r border-blue-100 dark:border-blue-900 transition-all duration-300 ease-in-out ${
            isOpen ? "w-60" : isMobileView ? "w-0" : "w-[70px]"
          } ${
            isOpen
              ? "translate-x-0"
              : isMobileView
              ? isRTL
                ? "translate-x-full"
                : "-translate-x-full"
              : "translate-x-0"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between mb-6 px-2">
              {isOpen ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <HeartPulseIcon className="h-6 w-6 text-blue-700 dark:text-blue-400" />
                  <span className="text-xl font-bold text-blue-700 dark:text-blue-400">
                    {t("patient")}
                  </span>
                </motion.div>
              ) : (
                !isMobileView && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mx-auto"
                  >
                    <HeartPulseIcon className="h-6 w-6 text-blue-700 dark:text-blue-400" />
                  </motion.div>
                )
              )}
            </div>

            {/* User info when sidebar is open */}
            {isOpen && isAuthenticated && user && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-100 dark:border-blue-800"
              >
                <p className="font-medium text-blue-700 dark:text-blue-400">
                  {user.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                  {user.role}
                </p>
              </motion.div>
            )}

            {/* Navigation Links - Grouped */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden px-1 custom-scrollbar">
              <div className="space-y-4">
                {groupOrder.map((groupName) => {
                  const groupItems = groupedNavItems[groupName];
                  if (!groupItems || groupItems.length === 0) return null;

                  return (
                    <motion.div
                      key={groupName}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-1"
                    >
                      {isOpen && (
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-1">
                          {t(groupName.toLowerCase() as keyof typeof t)}
                        </p>
                      )}

                      <ul className="space-y-1">
                        {groupItems.map((link) => {
                          const isActive = pathname === link.href;
                          const isAdminLink = link.href.startsWith("/admin");

                          return (
                            <motion.li
                              key={link.href}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {isOpen ? (
                                <Link
                                  href={link.href}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                                    isActive
                                      ? isAdminLink
                                        ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400"
                                        : "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400"
                                      : isAdminLink
                                      ? "text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                                      : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                  }`}
                                >
                                  <span
                                    className={`flex-shrink-0 ${
                                      isAdminLink && !isActive
                                        ? "text-indigo-600 dark:text-indigo-400"
                                        : ""
                                    }`}
                                  >
                                    {link.icon}
                                  </span>
                                  <span className="whitespace-nowrap">
                                    {link.title}
                                  </span>
                                </Link>
                              ) : (
                                !isMobileView && (
                                  <Tooltip content={link.title}>
                                    <Link
                                      href={link.href}
                                      className={`flex items-center justify-center w-10 h-10 mx-auto rounded-lg transition-all duration-200 ${
                                        isActive
                                          ? isAdminLink
                                            ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400"
                                            : "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400"
                                          : isAdminLink
                                          ? "text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                                          : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                      }`}
                                    >
                                      <span
                                        className={`flex-shrink-0 ${
                                          isAdminLink && !isActive
                                            ? "text-indigo-600 dark:text-indigo-400"
                                            : ""
                                        }`}
                                      >
                                        {link.icon}
                                      </span>
                                    </Link>
                                  </Tooltip>
                                )
                              )}
                            </motion.li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>
            </nav>

            {/* Footer actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              {isOpen ? (
                <>
                  {isAuthenticated ? (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full flex items-center justify-start mb-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-200"
                        onClick={goToSetting}
                      >
                        <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <span className="mx-2 whitespace-nowrap">
                          {t("settings")}
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full flex items-center justify-start mb-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-200"
                        onClick={toggleTheme}
                      >
                        {theme === "dark" ? (
                          <Sun className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        ) : (
                          <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        )}
                        <span className="mx-2 whitespace-nowrap">
                          {theme === "dark" ? t("lightMode") : t("darkMode")}
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full flex items-center justify-start hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                        onClick={handleLogout}
                        disabled={isLoading}
                      >
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        <span className="mx-2 whitespace-nowrap">
                          {t("logout")}
                        </span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full flex items-center justify-start mb-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-200"
                        onClick={toggleTheme}
                      >
                        {theme === "dark" ? (
                          <Sun className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        ) : (
                          <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        )}
                        <span className="mx-2 whitespace-nowrap">
                          {theme === "dark" ? t("lightMode") : t("darkMode")}
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full flex items-center justify-start hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                        onClick={goToLogin}
                      >
                        <User className="h-5 w-5 flex-shrink-0" />
                        <span className="mx-2 whitespace-nowrap">
                          {t("login")}
                        </span>
                      </Button>
                    </>
                  )}
                </>
              ) : (
                !isMobileView && (
                  <>
                    {isAuthenticated ? (
                      <>
                        <Tooltip content={t("settings")}>
                          <Button
                            variant="ghost"
                            className="w-full flex items-center justify-center mb-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-200 h-10"
                            onClick={goToSetting}
                          >
                            <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          </Button>
                        </Tooltip>
                        <Tooltip
                          content={
                            theme === "dark" ? t("lightMode") : t("darkMode")
                          }
                        >
                          <Button
                            variant="ghost"
                            className="w-full flex items-center justify-center mb-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-200 h-10"
                            onClick={toggleTheme}
                          >
                            {theme === "dark" ? (
                              <Sun className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            ) : (
                              <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            )}
                          </Button>
                        </Tooltip>
                        <Tooltip content={t("logout")}>
                          <Button
                            variant="ghost"
                            className="w-full flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 h-10"
                            onClick={handleLogout}
                            disabled={isLoading}
                          >
                            <LogOut className="h-5 w-5 flex-shrink-0" />
                          </Button>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip
                          content={
                            theme === "dark" ? t("lightMode") : t("darkMode")
                          }
                        >
                          <Button
                            variant="ghost"
                            className="w-full flex items-center justify-center mb-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-200 h-10"
                            onClick={toggleTheme}
                          >
                            {theme === "dark" ? (
                              <Sun className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            ) : (
                              <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            )}
                          </Button>
                        </Tooltip>
                        <Tooltip content={t("login")}>
                          <Button
                            variant="ghost"
                            className="w-full flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 h-10"
                            onClick={goToLogin}
                          >
                            <User className="h-5 w-5 flex-shrink-0" />
                          </Button>
                        </Tooltip>
                      </>
                    )}
                  </>
                )
              )}
            </motion.div>
          </div>
        </motion.aside>
      )}

      {/* Toggle button positioned in the middle of the sidebar edge - only on desktop */}
      {!isMobileView && (
        <motion.button
          onClick={toggleSidebar}
          className={`fixed z-50 top-1/2 -translate-y-1/2 items-center justify-center rounded-full w-8 h-8 bg-white dark:bg-slate-800 shadow-md border border-blue-100 dark:border-blue-900 transition-all duration-300 ease-in-out hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:scale-110 hidden lg:flex
            ${
              isOpen
                ? isRTL
                  ? "right-[14.1rem]"
                  : "left-[14.1rem]"
                : isRTL
                ? "right-[3.6rem]"
                : "left-[3.6rem]"
            }`}
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            className={`h-4 w-4 text-blue-700 dark:text-blue-400 transition-transform duration-300 ${
              isOpen ? (isRTL ? "rotate-180" : "") : isRTL ? "" : "rotate-180"
            }`}
          />
        </motion.button>
      )}
    </>
  );
};

export default Sidebar;
