"use client";

import { useLanguage } from "@/app/_contexts/LanguageContext";
import { useThemeMode } from "@/app/_hooks/useThemeMode";
import { motion } from "framer-motion";
import {
  Facebook,
  Github,
  HeartPulse,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import Link from "next/link";

function Footer() {
  const { t, isRTL } = useLanguage();
  const { mounted } = useThemeMode();
  const currentYear = new Date().getFullYear();

  // If we're server-side rendering or the theme context is not yet mounted, return null
  if (!mounted) return null;

  const socialLinks = [
    { icon: <Github size={18} />, href: "https://github.com" },
    { icon: <Twitter size={18} />, href: "https://twitter.com" },
    { icon: <Facebook size={18} />, href: "https://facebook.com" },
    { icon: <Instagram size={18} />, href: "https://instagram.com" },
    { icon: <Linkedin size={18} />, href: "https://linkedin.com" },
  ];

  return (
    <footer className="w-full backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-t border-blue-100 dark:border-blue-900 z-10 shadow-sm mt-auto">
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {/* Logo and description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <HeartPulse className="h-6 w-6" />
              <span className="font-bold text-xl">{t("patientSystem")}</span>
            </div>
            <p
              className={`text-sm text-gray-600 dark:text-gray-400 max-w-xs ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("platformDescription")}
            </p>
            <div
              className={`flex ${
                isRTL ? "gap-x-reverse gap-x-4" : "gap-x-4"
              } pt-2`}
            >
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors hover:scale-110"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Help section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3
              className={`font-semibold text-blue-700 dark:text-blue-400 text-lg ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("help")}
            </h3>
            <ul
              className={`space-y-2 text-gray-600 dark:text-gray-400 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors inline-flex items-center hover:translate-x-1 rtl:hover:-translate-x-1"
                >
                  {t("faq")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors inline-flex items-center hover:translate-x-1 rtl:hover:-translate-x-1"
                >
                  {t("contactUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors inline-flex items-center hover:translate-x-1 rtl:hover:-translate-x-1"
                >
                  {t("technicalSupport")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors inline-flex items-center hover:translate-x-1 rtl:hover:-translate-x-1"
                >
                  {t("documentation")}
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3
              className={`font-semibold text-blue-700 dark:text-blue-400 text-lg ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("quickLinks")}
            </h3>
            <ul
              className={`space-y-2 text-gray-600 dark:text-gray-400 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors inline-flex items-center hover:translate-x-1 rtl:hover:-translate-x-1"
                >
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/patients"
                  className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors inline-flex items-center hover:translate-x-1 rtl:hover:-translate-x-1"
                >
                  {t("patients")}
                </Link>
              </li>
              <li>
                <Link
                  href="/appointments"
                  className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors inline-flex items-center hover:translate-x-1 rtl:hover:-translate-x-1"
                >
                  {t("appointments")}
                </Link>
              </li>
              <li>
                <Link
                  href="/settings"
                  className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors inline-flex items-center hover:translate-x-1 rtl:hover:-translate-x-1"
                >
                  {t("settings")}
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <h3
              className={`font-semibold text-blue-700 dark:text-blue-400 text-lg ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {t("contactUs")}
            </h3>
            <ul
              className={`space-y-3 text-sm text-gray-600 dark:text-gray-400 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <li
                className={`flex items-start gap-3 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <MapPin
                  size={18}
                  className={`flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400 ${
                    isRTL ? "mx-1" : "mx-1"
                  }`}
                />
                <span>{t("address")}</span>
              </li>
              <li
                className={`flex items-center gap-3 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Phone
                  size={18}
                  className={`flex-shrink-0 text-blue-600 dark:text-blue-400 ${
                    isRTL ? "mx-1" : "mx-1"
                  }`}
                />
                <span dir="ltr">{t("phone")}</span>
              </li>
              <li
                className={`flex items-center gap-3 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <Mail
                  size={18}
                  className={`flex-shrink-0 text-blue-600 dark:text-blue-400 ${
                    isRTL ? "mx-1" : "mx-1"
                  }`}
                />
                <span dir="ltr">{t("email")}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 pt-6 border-t border-blue-100 dark:border-blue-900 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400"
        >
          <p
            className={`${
              isRTL ? "text-right" : "text-left"
            } text-center md:text-left`}
          >
            © {currentYear} {t("patientSystem")} - {t("allRightsReserved")}
          </p>
          <div
            className={`mt-4 md:mt-0 flex gap-4 md:gap-6 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
          >
            <Link
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors hover:underline"
            >
              {t("privacyPolicy")}
            </Link>
            <Link
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors hover:underline"
            >
              {t("termsOfService")}
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
