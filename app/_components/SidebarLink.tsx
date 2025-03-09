"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

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
      className={`  flex items-center p-3 my-1 rounded-lg transition-all duration-200 group ${
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

export default SidebarLink;
