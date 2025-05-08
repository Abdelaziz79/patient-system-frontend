"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "../_contexts/LanguageContext";

interface ErrorProps {
  message: string;
  retryAction?: () => void;
  homeAction?: () => void;
}

export default function ErrorComp({
  message,
  retryAction,
  homeAction,
}: ErrorProps) {
  const { t, dir } = useLanguage();
  return (
    <div
      className="flex items-center justify-center p-4 py-6 h-screen"
      dir={dir}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md"
      >
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300 flex items-center">
              <AlertCircle className="mx-2 h-6 w-6 text-red-500" />
              {t("errorOccurred")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/40">
              <p className="text-red-700 dark:text-red-300">{message}</p>
            </div>

            <div className="flex flex-col space-y-2">
              {retryAction && (
                <Button
                  onClick={retryAction}
                  className="w-full justify-center bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white transition-all duration-200"
                >
                  {t("tryAgain")}
                </Button>
              )}

              {homeAction && (
                <Button
                  onClick={homeAction}
                  className="w-full justify-center bg-green-50 hover:bg-green-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-green-800 dark:text-green-300 transition-all duration-200"
                  variant="outline"
                >
                  {t("backToHome")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
