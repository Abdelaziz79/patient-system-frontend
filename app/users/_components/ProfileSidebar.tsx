import { User } from "@/app/_types/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Clock, Shield, Star } from "lucide-react";
import { useMemo } from "react";

interface ProfileSidebarProps {
  user: User;
}

export function ProfileSidebar({ user }: ProfileSidebarProps) {
  // Format date utility
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate days remaining in subscription
  const daysRemaining = useMemo(() => {
    if (!user?.subscription?.endDate) return 0;

    const endDate = new Date(user.subscription.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [user?.subscription?.endDate]);

  // Get subscription badge class
  const getSubscriptionBadge = (type: string) => {
    switch (type) {
      case "premium":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "pro":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "free_trial":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Get role badge class
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "doctor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "nurse":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "staff":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const roleBadge = getRoleBadge(user.role);
  const subscriptionBadge = user?.subscription?.type
    ? getSubscriptionBadge(user.subscription.type)
    : "";

  return (
    <>
      {/* User Profile Card */}
      <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 dark:from-green-700 dark:to-emerald-900 h-16"></div>
        <div className="px-6 pt-0 pb-6 -mt-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-white dark:bg-slate-700 border-4 border-white dark:border-slate-700 flex items-center justify-center shadow-md">
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span
                className={`absolute bottom-0 right-0 px-2 py-1 rounded-full text-xs font-medium ${roleBadge} shadow-sm border border-white dark:border-slate-700`}
              >
                {user.role}
              </span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <h3 className="text-xl font-bold">{user.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {user.email}
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
              {user.specialization}
            </p>

            <div className="mt-4 flex justify-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.isActive
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center text-sm">
              <Shield className="h-4 w-4 text-green-600 dark:text-green-400 mx-2" />
              <span className="text-gray-500 dark:text-gray-400 mx-2">
                Role:
              </span>
              <span className="font-medium capitalize">{user.role}</span>
            </div>
            <div className="flex items-center text-sm">
              <Star className="h-4 w-4 text-green-600 dark:text-green-400 mx-2" />
              <span className="text-gray-500 dark:text-gray-400 mx-2">
                Specialization:
              </span>
              <span className="font-medium">{user.specialization || "-"}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 text-green-600 dark:text-green-400 mx-2" />
              <span className="text-gray-500 dark:text-gray-400 mx-2">
                Created:
              </span>
              <span className="font-medium">
                {formatDate(user?.createdAt || "")}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 text-green-600 dark:text-green-400 mx-2" />
              <span className="text-gray-500 dark:text-gray-400 mx-2">
                Last Login:
              </span>
              <span className="font-medium">
                {user?.lastLogin
                  ? formatDistanceToNow(new Date(user.lastLogin), {
                      addSuffix: true,
                    })
                  : "-"}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Subscription Card */}
      {user.subscription && (
        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md mt-6">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold text-green-800 dark:text-green-300">
                Subscription
              </CardTitle>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${subscriptionBadge}`}
              >
                {user.subscription.type.replace("_", " ").toUpperCase()}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Status:
                </span>
                <span
                  className={`font-medium ${
                    user.subscription.isActive
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {user.subscription.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  End Date:
                </span>
                <span className="font-medium">
                  {formatDate(user.subscription.endDate)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Days Remaining:
                </span>
                <span
                  className={`font-medium ${
                    daysRemaining > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {daysRemaining > 0 ? `${daysRemaining} days` : "Expired"}
                </span>
              </div>

              <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <strong>Features:</strong>
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.subscription.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
