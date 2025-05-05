import { useLanguage } from "@/app/_contexts/LanguageContext";
import { User } from "@/app/_types/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheckIcon } from "lucide-react";

interface SubscriptionStatusCardProps {
  user: User;
  subscriptionBadge: {
    bg: string;
    text: string;
  };
  daysRemaining: number;
  formatDate: (dateString: string) => string;
}

export function SubscriptionStatusCard({
  user,
  subscriptionBadge,
  daysRemaining,
  formatDate,
}: SubscriptionStatusCardProps) {
  const { t } = useLanguage();

  const progressPercentage = Math.max(
    (daysRemaining / 30) * 100, // Assuming 30 days subscription cycle
    5 // minimum width for visibility
  );

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
          {t("subscriptionStatus")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center gap-x-2">
          <div className={`p-2 rounded-full ${subscriptionBadge.bg} shadow-sm`}>
            <BadgeCheckIcon className={`h-5 w-5 ${subscriptionBadge.text}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {user?.subscription?.type.replace("_", " ").toUpperCase()}
            </p>
            <p
              className={`text-xs ${
                daysRemaining <= 3
                  ? "text-red-500 dark:text-red-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {daysRemaining} {t("daysRemaining")}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">
              {t("startDate")}
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {formatDate(user?.subscription?.startDate || "")}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 dark:text-gray-400">
              {t("endDate")}
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {formatDate(user?.subscription?.endDate || "")}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className={`${
                daysRemaining <= 2
                  ? "bg-red-500"
                  : "bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-500"
              } h-2.5 rounded-full transition-all duration-500`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
