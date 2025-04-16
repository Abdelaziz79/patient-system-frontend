// src/app/admin/users/stats/components/OverviewTab.tsx
import React from "react";
import { Users, UserCheck, UserX } from "lucide-react";
import StatCard from "./StatCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

interface OverviewTabProps {
  userStats: UserStats;
}

export default function OverviewTab({ userStats }: OverviewTabProps) {
  const getPercentage = (count: number) => {
    return userStats.totalUsers > 0
      ? Math.round((count / userStats.totalUsers) * 100)
      : 0;
  };

  return (
    <>
      {/* Main stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard
          title="Total Users"
          value={userStats.totalUsers}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Active Users"
          value={userStats.activeUsers}
          icon={UserCheck}
          color="blue"
        />
        <StatCard
          title="Inactive Users"
          value={userStats.inactiveUsers}
          icon={UserX}
          color="red"
        />
      </div>

      {/* Active vs Inactive Chart */}
      <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md transition-shadow hover:shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
            User Activity Status
          </CardTitle>
          <CardDescription className="text-green-600 dark:text-green-400">
            Active vs Inactive user distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userStats.totalUsers > 0 ? (
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <div className="flex-1 mr-4">
                  <div className="relative w-full h-5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 dark:bg-blue-600 transition-all"
                      style={{
                        width: `${
                          (userStats.activeUsers / userStats.totalUsers) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full">
                  {getPercentage(userStats.activeUsers)}% Active
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col items-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/20">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Active Users
                  </span>
                  <span className="text-2xl font-bold mt-1 text-blue-800 dark:text-blue-300">
                    {userStats.activeUsers}
                  </span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-red-50 dark:bg-red-900/10 transition-colors hover:bg-red-100 dark:hover:bg-red-900/20">
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    Inactive Users
                  </span>
                  <span className="text-2xl font-bold mt-1 text-red-800 dark:text-red-300">
                    {userStats.inactiveUsers}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No user data available.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
