import { User } from "@/app/_types/User";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AccountInfoCardProps {
  user: User;
}

export function AccountInfoCard({ user }: AccountInfoCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
          {t("accountInformation")}
        </CardTitle>
        <CardDescription className="text-green-600 dark:text-green-400">
          {t("viewManageAccount")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("fullName")}
              </label>
              <p className="font-medium mt-1">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("emailAddress")}
              </label>
              <p className="font-medium mt-1">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("contactNumber")}
              </label>
              <p className="font-medium mt-1">{user.contactNumber || "-"}</p>
            </div>
          </div>
          <div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("user")} ID
              </label>
              <p className="font-medium mt-1 text-sm text-gray-600 dark:text-gray-300">
                {user.id}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("createdBy")}
              </label>
              <p className="font-medium mt-1 text-sm text-gray-600 dark:text-gray-300">
                {user?.createdBy?.name || t("notAvailable")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("status")}
              </label>
              <p className="font-medium mt-1">
                {user.isActive ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    {t("active")}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                    {t("inactive")}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
