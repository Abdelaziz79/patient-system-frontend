"use client";

import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Calendar,
  ChevronLeft,
  FileText,
  HeartPulseIcon,
  Home,
  LogOut,
  Menu,
  Moon,
  NotebookText,
  Settings,
  Sun,
  User,
  UserCircle,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useThemeMode } from "../_hooks/useThemeMode";
import { useAuthContext } from "../_providers/AuthProvider";
import React, { ReactNode, useState } from "react";

// Define props type
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Define navigation item structure
interface NavItem {
  href: string;
  icon: React.ReactElement;
  title: string;
  group?: string;
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
      {isVisible && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-white dark:bg-slate-800 text-sm rounded shadow-lg border border-blue-100 dark:border-blue-900 whitespace-nowrap z-50">
          {content}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const pathname = usePathname();
  const { theme, toggleTheme, mounted } = useThemeMode();
  const { logout, isLoading, isAuthenticated, user } = useAuthContext();
  const router = useRouter();

  const goToSetting = () => {
    router.push("/settings");
  };
  // Check if user is an admin or super_admin
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  // Navigation links with grouping
  const navItems: NavItem[] = [
    { href: "/", icon: <Home size={20} />, title: "Home", group: "Main" },
    {
      href: "/profile",
      icon: <User size={20} />,
      title: "Profile",
      group: "Main",
    },
    {
      href: "/patients",
      icon: <Users size={20} />,
      title: "Patients",
      group: "Clinical",
    },
    {
      href: "/appointments",
      icon: <Calendar size={20} />,
      title: "Appointments",
      group: "Clinical",
    },
    {
      href: "/doctors",
      icon: <UserCircle size={20} />,
      title: "Doctors",
      group: "Clinical",
    },
    {
      href: "/registration",
      icon: <UserPlus size={20} />,
      title: "Registration",
      group: "Clinical",
    },
    {
      href: "/reports",
      icon: <FileText size={20} />,
      title: "Reports",
      group: "Management",
    },
    {
      href: "/analytics",
      icon: <Activity size={20} />,
      title: "Analytics",
      group: "Management",
    },
    {
      href: "/alerts",
      icon: <AlertCircle size={20} />,
      title: "Alerts",
      group: "Management",
    },
    ...(isAdmin
      ? [
          {
            href: "/admin/",
            icon: <BarChart3 size={20} />,
            title: "User Stats",
            group: "Admin",
          },
          {
            href: "/templates",
            icon: <NotebookText size={20} />,
            title: "Templates",
            group: "Admin",
          },
        ]
      : []),
  ];

  // Group navigation items by category
  const groupedNavItems = navItems.reduce((acc, item) => {
    const group = item.group || "Other";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  // Order of groups
  const groupOrder = [
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

  if (!isAuthenticated || !mounted) return null;

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-full z-40 py-4 px-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-xl border-r border-blue-100 dark:border-blue-900 transition-all duration-300 ease-in-out ${
          isOpen ? "w-60" : "w-[70px]"
        } ${isOpen ? "translate-x-0" : "lg:translate-x-0 -translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-6 px-2">
            {isOpen ? (
              <div className="flex items-center gap-2">
                <HeartPulseIcon className="h-6 w-6 text-blue-700 dark:text-blue-400" />
                <span className="text-xl font-bold text-blue-700 dark:text-blue-400">
                  Patient
                </span>
              </div>
            ) : (
              <div className="mx-auto">
                <HeartPulseIcon className="h-6 w-6 text-blue-700 dark:text-blue-400" />
              </div>
            )}
          </div>

          {/* User info when sidebar is open */}
          {isOpen && user && (
            <div className="mb-6 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="font-medium text-blue-700 dark:text-blue-400">
                {user.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                {user.role}
              </p>
            </div>
          )}

          {/* Navigation Links - Grouped */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar">
            <div className="space-y-4">
              {groupOrder.map((groupName) => {
                const groupItems = groupedNavItems[groupName];
                if (!groupItems || groupItems.length === 0) return null;

                return (
                  <div key={groupName} className="space-y-1">
                    {isOpen && (
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-1">
                        {groupName}
                      </p>
                    )}

                    <ul className="space-y-1">
                      {groupItems.map((link) => {
                        const isActive = pathname === link.href;
                        const isAdminLink = link.href.startsWith("/admin");

                        return (
                          <li key={link.href}>
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
                              <Tooltip content={link.title}>
                                <Link
                                  href={link.href}
                                  className={`flex items-center justify-center py-2 rounded-lg transition-all duration-200 ${
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
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Footer actions */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            {isOpen ? (
              <>
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-start mb-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-200"
                  onClick={goToSetting}
                >
                  <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="ml-2 whitespace-nowrap">Setting</span>
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
                  <span className="ml-2 whitespace-nowrap">
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-start hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  <span className="ml-2 whitespace-nowrap">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Tooltip content="settings">
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center mb-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-200"
                    onClick={goToSetting}
                  >
                    <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  </Button>
                </Tooltip>
                <Tooltip
                  content={theme === "dark" ? "Light Mode" : "Dark Mode"}
                >
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center mb-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-200"
                    onClick={toggleTheme}
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    ) : (
                      <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    )}
                  </Button>
                </Tooltip>
                <Tooltip content="Logout">
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                  </Button>
                </Tooltip>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Toggle button positioned in the middle of the sidebar edge as a circle */}
      <button
        onClick={toggleSidebar}
        className={`fixed z-50 top-1/2 -translate-y-1/2  items-center justify-center rounded-full w-8 h-8 bg-white dark:bg-slate-800 shadow-md border border-blue-100 dark:border-blue-900 transition-all duration-300 ease-in-out hidden lg:flex hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:scale-110
          ${isOpen ? "left-[14.1rem]" : "left-[3.6rem]"}`}
        aria-label="Toggle sidebar"
      >
        <ChevronLeft
          className={`h-4 w-4 text-blue-700 dark:text-blue-400 transition-transform duration-300 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>
    </>
  );
};

export default Sidebar;
