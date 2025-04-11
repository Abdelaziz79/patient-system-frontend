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
  Settings,
  Sun,
  User,
  UserCircle,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useThemeMode } from "../_hooks/useThemeMode";
import { useAuthContext } from "../_providers/AuthProvider";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const { theme, toggleTheme, mounted } = useThemeMode();
  const { logout, isLoading, isAuthenticated, user } = useAuthContext();

  // Check if user is an admin or super_admin
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  // Basic navigation links
  const baseLinks = [
    { href: "/", icon: <Home size={20} />, title: "Home" },
    { href: "/profile", icon: <User size={20} />, title: "Profile" },
    { href: "/patients", icon: <Users size={20} />, title: "Patients" },
    {
      href: "/appointments",
      icon: <Calendar size={20} />,
      title: "Appointments",
    },
    { href: "/doctors", icon: <UserCircle size={20} />, title: "Doctors" },
    {
      href: "/registration",
      icon: <UserPlus size={20} />,
      title: "Registration",
    },
    { href: "/reports", icon: <FileText size={20} />, title: "Reports" },
    { href: "/analytics", icon: <Activity size={20} />, title: "Analytics" },
    { href: "/alerts", icon: <AlertCircle size={20} />, title: "Alerts" },
  ];

  // Admin specific links
  const adminLinks = [
    {
      href: "/admin/",
      icon: <BarChart3 size={20} />,
      title: "User Stats",
    },
  ];

  // Common links for all users
  const commonLinks = [
    { href: "/settings", icon: <Settings size={20} />, title: "Settings" },
  ];

  // Combine links based on user role
  const links = [...baseLinks, ...(isAdmin ? adminLinks : []), ...commonLinks];

  const toggleSidebar = () => setIsOpen(!isOpen);

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
      {/* Mobile overlay & toggle button */}
      <div className="lg:hidden">
        <button
          className="fixed top-4 left-4 z-50 bg-white dark:bg-slate-800 p-2 rounded-lg shadow-md"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          ) : (
            <Menu className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          )}
        </button>

        {isOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 py-4 px-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-xl border-r border-blue-100 dark:border-blue-900 transition-all duration-300 ${
          isOpen ? "w-60" : "w-[70px]"
        } ${isOpen ? "translate-x-0" : "lg:translate-x-0 -translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-6 px-2">
            {isOpen && (
              <div className="flex items-center gap-2">
                <HeartPulseIcon className="h-6 w-6 text-blue-700 dark:text-blue-400" />
                <span className="text-xl font-bold text-blue-700 dark:text-blue-400">
                  Patient
                </span>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 p-0 ml-auto text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 hidden lg:flex"
              onClick={toggleSidebar}
            >
              <ChevronLeft
                className={`h-5 w-5 transition-transform duration-200 ${
                  isOpen ? "" : "rotate-180"
                }`}
              />
            </Button>
          </div>

          {/* User info when sidebar is open */}
          {isOpen && user && (
            <div className="mb-4 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="font-medium text-blue-700 dark:text-blue-400">
                {user.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                {user.role}
              </p>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                // Highlight admin links with a different style
                const isAdminLink = link.href.startsWith("/admin");

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? isAdminLink
                            ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400"
                            : "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400"
                          : isAdminLink
                          ? "text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                          : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      }`}
                      onClick={() => {
                        if (window.innerWidth < 1024) setIsOpen(false);
                      }}
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
                      {isOpen && (
                        <span className="whitespace-nowrap">{link.title}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer actions */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              className={`w-full flex items-center ${
                isOpen ? "justify-start" : "justify-center"
              } mb-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-200`}
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              ) : (
                <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              )}
              {isOpen && (
                <span className="ml-2 whitespace-nowrap">
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              className={`w-full flex items-center ${
                isOpen ? "justify-start" : "justify-center"
              } hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400`}
              onClick={handleLogout}
              disabled={isLoading}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span className="ml-2 whitespace-nowrap">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
