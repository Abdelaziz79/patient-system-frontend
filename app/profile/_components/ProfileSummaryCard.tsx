import { useLanguage } from "@/app/_contexts/LanguageContext";
import { User } from "@/app/_types/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { EditIcon, ShieldIcon, UserIcon } from "lucide-react";

interface ProfileSummaryCardProps {
  user: User; // Use the specific user type from your hook/context
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  roleBadge: {
    bg: string;
    text: string;
  };
}

export function ProfileSummaryCard({
  user,
  isEditing,
  setIsEditing,
  roleBadge,
}: ProfileSummaryCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-green-500 to-green-700 dark:from-green-700 dark:to-green-900"></div>
      <div className="flex justify-center -mt-12">
        <div className="rounded-full bg-white dark:bg-slate-700 p-2 shadow-lg border-2 border-white dark:border-slate-700">
          <div className="rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 p-4">
            <UserIcon className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>
      <CardContent className="pt-8 pb-4 text-center">
        <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
          {user.name}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {user.email}
        </p>
        <div className="flex justify-center mt-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${roleBadge.bg} ${roleBadge.text} shadow-sm border border-green-50 dark:border-green-900`}
          >
            <ShieldIcon className="mx-1 h-3 w-3" />
            {user.role.replace("_", " ").toUpperCase()}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pb-6 pt-0">
        {user.role === "admin" || user.role === "super_admin" ? (
          <Button
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-700 dark:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
            onClick={() => setIsEditing(!isEditing)}
          >
            <EditIcon className="mx-2 h-4 w-4" />
            {isEditing
              ? t("cancelEditing") || "Cancel Editing"
              : t("editProfile") || "Edit Profile"}
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
