"use client";

import ErrorComp from "@/app/_components/ErrorComp";
import Loading from "@/app/_components/Loading";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { useThemeMode } from "@/app/_hooks/useThemeMode";
import { useAuthContext } from "@/app/_providers/AuthProvider";
import { AppearanceSettings } from "@/app/settings/_components/AppearanceSettings";
import { ExportSettings } from "@/app/settings/_components/ExportSettings";
import { LanguageSettings } from "@/app/settings/_components/LanguageSettings";
import { SettingsHeader } from "@/app/settings/_components/SettingsHeader";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuthContext();
  const { isRTL, language } = useLanguage();
  const { theme, mounted } = useThemeMode();

  if (isLoading || !mounted) {
    return <Loading />;
  }

  if (!isAuthenticated || !user) {
    return (
      <ErrorComp message="User not authenticated. Please log in to view your settings." />
    );
  }

  return (
    <div className="flex items-center justify-center p-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-6xl"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SettingsHeader />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Left Column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <AppearanceSettings currentTheme={theme} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <LanguageSettings currentLanguage={language} />
            </motion.div>
          </div>

          {/* Right Column */}
          {user.role === "admin" || user.role === "super_admin" ? (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <ExportSettings />
              </motion.div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
