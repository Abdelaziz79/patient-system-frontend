"use client";

import Header from "@/app/_components/Header";
import Sidebar from "@/app/_components/Sidebar";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { useEffect, useState } from "react";
import Loading from "./Loading";

interface LayoutClientWrapperProps {
  children: React.ReactNode;
}

export default function LayoutClientWrapper({
  children,
}: LayoutClientWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isRTL, loading } = useLanguage();

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      // Auto-close sidebar on mobile when resizing to mobile
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        // Default sidebar to open on desktop
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener("resize", checkMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  if (loading) return <Loading />;
  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-slate-900 relative`}
    >
      {/* Sidebar - handled within Sidebar component now */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Mobile overlay - only when sidebar is open on mobile */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/30 z-30 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content container - adjust margin for sidebar on desktop */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen && !isMobile
            ? isRTL
              ? "lg:mr-60"
              : "lg:ml-60"
            : !isMobile
            ? isRTL
              ? "lg:mr-[70px]"
              : "lg:ml-[70px]"
            : ""
        }`}
      >
        {/* Header */}
        <Header isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main content with smooth transitions */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 ease-in-out">
          <div
            className={`transition-all duration-300 ease-in-out max-w-7xl mx-auto ${
              isMobile ? "pt-12" : "pt-2"
            }`}
          >
            {children}
          </div>
        </main>

        {/* Footer can remain outside if it doesn't need sidebar state */}
        {/* <Footer /> We will add it back in layout.tsx */}
      </div>
    </div>
  );
}
