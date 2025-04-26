"use client";
import {
  Facebook,
  Github,
  HeartPulseIcon,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-t border-blue-100 dark:border-blue-900 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <HeartPulseIcon className="h-6 w-6" />
              <span className="font-bold text-xl">Patient System</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              Integrated platform for patient and medical appointment management
              designed to streamline healthcare workflows.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Help section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-blue-700 dark:text-blue-400 text-lg">
              Help
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors inline-flex items-center"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors inline-flex items-center"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors inline-flex items-center"
                >
                  Technical Support
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors inline-flex items-center"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-blue-700 dark:text-blue-400 text-lg">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors inline-flex items-center"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/patients"
                  className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors inline-flex items-center"
                >
                  Patients
                </Link>
              </li>
              <li>
                <Link
                  href="/appointments"
                  className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors inline-flex items-center"
                >
                  Appointments
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-blue-700 dark:text-blue-400 text-lg">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400"
                />
                <span>123 Medical Center Blvd, Healthcare City, HC 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone
                  size={18}
                  className="flex-shrink-0 text-blue-600 dark:text-blue-400"
                />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail
                  size={18}
                  className="flex-shrink-0 text-blue-600 dark:text-blue-400"
                />
                <span>support@patientsystem.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-blue-100 dark:border-blue-900 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            © {new Date().getFullYear()} Patient System - All Rights Reserved
          </p>
          <div className="mt-4 md:mt-0 flex gap-6">
            <Link
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
