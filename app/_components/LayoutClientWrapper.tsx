"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutClientWrapperProps {
  children: React.ReactNode;
}

export default function LayoutClientWrapper({
  children,
}: LayoutClientWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      // Auto-close sidebar on mobile
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
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

  return (
    <div className="font-inter min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-slate-900 relative">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Mobile overlay */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden backdrop-blur-sm transition-opacity duration-300 ease-in-out"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content container - adjust margin for sidebar */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen && !isMobile ? "lg:ml-60" : "lg:ml-[70px]"
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
