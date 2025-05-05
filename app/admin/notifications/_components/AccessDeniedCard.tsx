import React from "react";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const AccessDeniedCard = () => {
  const { t, isRTL } = useLanguage();
  const router = useRouter();

  return (
    <div
      className="flex items-center justify-center min-h-[calc(100vh-200px)]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Card className="w-[450px] border-red-200 dark:border-red-900 shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-red-600 dark:text-red-400" />
            <CardTitle className="text-red-600 dark:text-red-400">
              {t("accessDenied")}
            </CardTitle>
          </div>
          <CardDescription className="text-base">
            {t("noPermissionAdminPage")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="mt-2 w-full"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="mx-2 h-4 w-4" />
            {t("backToDashboard")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
