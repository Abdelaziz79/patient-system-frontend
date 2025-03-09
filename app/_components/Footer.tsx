"use client";
import { HeartPulseIcon } from "lucide-react";

function Footer() {
  return (
    <footer className="w-full backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 border-t border-blue-100 dark:border-blue-900 z-10">
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo and description - stacked on mobile, left-aligned on desktop */}
          <div className="w-full md:w-auto text-center md:text-left order-2 md:order-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-blue-700 dark:text-blue-300 mb-2">
              <HeartPulseIcon className="h-5 w-5" />
              <span className="font-bold">Patient System</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Integrated platform for patient and medical appointment management
            </p>
          </div>
          {/* Links section - grid on mobile, flex on desktop */}
          <div className="w-full md:w-auto grid grid-cols-2 gap-6 md:flex md:gap-8 order-1 md:order-2">
            <div className="text-left">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                Help
              </h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    Technical Support
                  </a>
                </li>
              </ul>
            </div>
            <div className="text-left">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                Quick Links
              </h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    Our Services
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-6 md:mt-8 pt-4 border-t border-blue-100 dark:border-blue-900 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} Patient System - All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
