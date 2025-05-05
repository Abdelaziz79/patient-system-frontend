import { INotificationSummary } from "@/app/_hooks/notification/notificationApi";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface NotificationSummaryFooterProps {
  notificationSummary: INotificationSummary;
  onViewAll: () => void;
}

export const NotificationSummaryFooter: React.FC<
  NotificationSummaryFooterProps
> = ({ notificationSummary, onViewAll }) => {
  const { t, isRTL } = useLanguage();

  return (
    <div
      className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-3 sm:pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex flex-wrap gap-2">
        {notificationSummary.today > 0 && (
          <Badge variant="destructive" className="text-xs whitespace-nowrap">
            {notificationSummary.today} {t("today")}
          </Badge>
        )}
        {notificationSummary.tomorrow > 0 && (
          <Badge
            variant="secondary"
            className="text-xs bg-amber-500 hover:bg-amber-600 whitespace-nowrap"
          >
            {notificationSummary.tomorrow} {t("tomorrow")}
          </Badge>
        )}
        {notificationSummary.thisWeek > 0 && (
          <Badge variant="outline" className="text-xs whitespace-nowrap">
            {notificationSummary.thisWeek} {t("thisWeek")}
          </Badge>
        )}
        {notificationSummary.highPriority > 0 && (
          <Badge
            variant="secondary"
            className="text-xs bg-purple-500 hover:bg-purple-600 text-white whitespace-nowrap"
          >
            {notificationSummary.highPriority} {t("highPriority")}
          </Badge>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="text-green-600 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-700 dark:hover:bg-green-900/20 self-end sm:self-auto"
        onClick={onViewAll}
      >
        <span className="truncate">{t("viewAllAppointments")}</span>
        <ExternalLink className="mx-1.5 h-3.5 w-3.5" />
      </Button>
    </div>
  );
};
