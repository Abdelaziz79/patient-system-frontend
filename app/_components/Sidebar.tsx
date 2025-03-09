"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  Calendar,
  ChevronLeft,
  FileText,
  Home,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  UserCircle,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useThemeMode } from "../_hooks/useThemeMode";
import SidebarLink from "./SidebarLink";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className = "" }: SidebarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme, mounted } = useThemeMode();

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    checkMobile();

    // Listen for resize events
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  if (!mounted) return null;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Navigation links
  const links = [
    { href: "/", icon: <Home size={20} />, title: "Home" },
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
    { href: "/settings", icon: <Settings size={20} />, title: "Settings" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={closeSidebarOnMobile}
        ></div>
      )}

      {/* Sidebar toggle button - visible on mobile only */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-white dark:bg-slate-800 p-2 rounded-lg shadow-md"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        ) : (
          <Menu className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        )}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: isMobile ? "-100%" : 0 }}
        animate={{
          x: isSidebarOpen ? 0 : isMobile ? "-100%" : "calc(-100% + 70px)",
          width: isSidebarOpen ? 240 : 70,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          // Make sure all properties animate together
          width: { type: "spring", stiffness: 300, damping: 30 },
        }}
        className={`fixed top-0 left-0 h-full z-50 py-4 px-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-xl border-r border-blue-100 dark:border-blue-900 ${className}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-6 px-2">
            <AnimatePresence initial={false}>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center overflow-hidden"
                >
                  <span className="text-xl font-bold text-blue-700 dark:text-blue-400">
                    Patient
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 p-0 ml-auto text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                onClick={toggleSidebar}
              >
                <ChevronLeft
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isSidebarOpen ? "" : "rotate-180"
                  }`}
                />
              </Button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <SidebarLink
                    href={link.href}
                    icon={link.icon}
                    title={link.title}
                    isActive={pathname === link.href}
                    isSidebarOpen={isSidebarOpen}
                    onClick={closeSidebarOnMobile}
                  />
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer actions */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              className={`w-full flex items-center ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } mb-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-200`}
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              ) : (
                <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              )}
              <AnimatePresence initial={false}>
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="ml-2 overflow-hidden whitespace-nowrap"
                  >
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
            <Button
              variant="ghost"
              className={`w-full flex items-center ${
                isSidebarOpen ? "justify-start" : "justify-center"
              } hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400`}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <AnimatePresence initial={false}>
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="ml-2 overflow-hidden whitespace-nowrap"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
