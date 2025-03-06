"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  Calendar,
  ChevronRight,
  FileText,
  Home,
  LogOut, // Changed from ChevronLeft for RTL
  Menu,
  Moon,
  Settings,
  Sun,
  UserCircle,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useThemeMode } from "../_hooks/useThemeMode";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
  isSidebarOpen: boolean;
  onClick?: () => void;
}

const SidebarLink = ({
  href,
  icon,
  title,
  isActive,
  isSidebarOpen,
  onClick,
}: SidebarLinkProps) => {
  return (
    <Link
      href={href}
      className={`flex items-center p-3 my-1 rounded-lg transition-all duration-200 group ${
        isActive
          ? "bg-blue-600 text-white"
          : "hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-200"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div
          className={`${
            isActive
              ? "text-white"
              : "text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300"
          }`}
        >
          {icon}
        </div>
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="whitespace-nowrap overflow-hidden"
            >
              {title}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </Link>
  );
};

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
    { href: "/", icon: <Home size={20} />, title: "الرئيسية" },
    { href: "/patients", icon: <Users size={20} />, title: "المرضى" },
    { href: "/appointments", icon: <Calendar size={20} />, title: "المواعيد" },
    { href: "/doctors", icon: <UserCircle size={20} />, title: "الأطباء" },
    { href: "/registration", icon: <UserPlus size={20} />, title: "التسجيل" },
    { href: "/reports", icon: <FileText size={20} />, title: "التقارير" },
    { href: "/analytics", icon: <Activity size={20} />, title: "الإحصائيات" },
    { href: "/alerts", icon: <AlertCircle size={20} />, title: "التنبيهات" },
    { href: "/settings", icon: <Settings size={20} />, title: "الإعدادات" },
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
        className="fixed top-4 right-4 z-50 lg:hidden bg-white dark:bg-slate-800 p-2 rounded-lg shadow-md"
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
        initial={{ x: isMobile ? "100%" : 0 }}
        animate={{
          x: isSidebarOpen ? 0 : isMobile ? "100%" : "calc(100% - 70px)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 right-0 h-full z-50 py-4 px-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-xl border-l border-blue-100 dark:border-blue-900 ${className}`}
        style={{
          width: isSidebarOpen ? 240 : 70,
        }}
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
                    نظام إدارة المرضى
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 p-0 mr-auto text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                onClick={toggleSidebar}
              >
                <ChevronRight
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isSidebarOpen ? "" : "rotate-180"
                  }`}
                />
              </Button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto">
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
              className={`w-full justify-${
                isSidebarOpen ? "start" : "center"
              } mb-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-200`}
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-blue-600 dark:text-blue-400 ml-1" />
              ) : (
                <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400 ml-1" />
              )}
              <AnimatePresence initial={false}>
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-${
                isSidebarOpen ? "start" : "center"
              } hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400`}
            >
              <LogOut className="h-5 w-5 ml-1" />
              <AnimatePresence initial={false}>
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    تسجيل الخروج
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
