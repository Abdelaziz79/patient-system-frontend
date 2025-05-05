import { useLanguage } from "@/app/_contexts/LanguageContext";
import { User } from "@/app/_types/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ClockIcon, KeyIcon } from "lucide-react";

interface AccountActivityCardProps {
  user: User;
  formatDate: (dateString: string) => string;
  formatTime: (dateString: string) => string;
}

export function AccountActivityCard({
  user,
  formatDate,
  formatTime,
}: AccountActivityCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
          {t("accountActivity")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Account Created */}
        <div className="flex items-start gap-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full shadow-sm">
            <CalendarIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {t("accountCreated")}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(user.createdAt ?? "")} at{" "}
              {formatTime(user.createdAt ?? "")}
            </p>
          </div>
        </div>
        {/* Last Login */}
        <div className="flex items-start gap-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full shadow-sm">
            <ClockIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {t("lastLogin")}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(user.lastLogin ?? "")} at{" "}
              {formatTime(user.lastLogin ?? "")}
            </p>
          </div>
        </div>
        {/* Last Updated */}
        <div className="flex items-start gap-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full shadow-sm">
            <KeyIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {t("lastUpdated")}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(user.updatedAt ?? "")} at{" "}
              {formatTime(user.updatedAt ?? "")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
