import { User } from "@/app/_hooks/useAuth";
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
  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-green-800 dark:text-green-300">
          Account Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Account Created */}
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
            <CalendarIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium">Account Created</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(user.createdAt ?? "")} at{" "}
              {formatTime(user.createdAt ?? "")}
            </p>
          </div>
        </div>
        {/* Last Login */}
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
            <ClockIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium">Last Login</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(user.lastLogin ?? "")} at{" "}
              {formatTime(user.lastLogin ?? "")}
            </p>
          </div>
        </div>
        {/* Last Updated */}
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
            <KeyIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium">Last Updated</p>
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
