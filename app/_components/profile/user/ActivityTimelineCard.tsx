import { User } from "@/app/_types/User";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface ActivityTimelineCardProps {
  user: User;
}

export function ActivityTimelineCard({ user }: ActivityTimelineCardProps) {
  // Format date utility
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
          Account Activity
        </CardTitle>
        <CardDescription className="text-green-600 dark:text-green-400">
          User account timeline and recent activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-green-100 dark:bg-green-900/30"></div>

          <div className="space-y-6">
            <div className="relative flex ml-6">
              <div className="absolute -left-10 mt-1 h-4 w-4 rounded-full bg-green-500 dark:bg-green-400 border-2 border-white dark:border-slate-800"></div>
              <div>
                <p className="text-sm font-medium">Account Created</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatDate(user?.createdAt || "")}
                </p>
              </div>
            </div>

            {user?.lastLogin && (
              <div className="relative flex ml-6">
                <div className="absolute -left-10 mt-1 h-4 w-4 rounded-full bg-green-500 dark:bg-green-400 border-2 border-white dark:border-slate-800"></div>
                <div>
                  <p className="text-sm font-medium">Last Login</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(user.lastLogin), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            )}

            <div className="relative flex ml-6">
              <div className="absolute -left-10 mt-1 h-4 w-4 rounded-full bg-green-500 dark:bg-green-400 border-2 border-white dark:border-slate-800"></div>
              <div>
                <p className="text-sm font-medium">Account Updated</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(user?.updatedAt || ""), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
