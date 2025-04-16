// src/app/admin/users/stats/components/RolesSubscriptionsTab.tsx
import React from "react";
import { Shield, UserCog, Sparkles } from "lucide-react";
import RoleItem from "./RoleItem";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface RoleDistribution {
  admin?: number;
  doctor?: number;
  nurse?: number;
  staff?: number;
}

export interface SubscriptionStats {
  freeTrials?: number;
  basic?: number;
  premium?: number;
  enterprise?: number;
  expired?: number;
}

export interface UserStats {
  totalUsers: number;
  totalAdmins?: number;
}

interface RolesSubscriptionsTabProps {
  roleDistribution: RoleDistribution | null;
  subscriptionStats: SubscriptionStats | null;
  userStats: UserStats;
}

interface RoleColorScheme {
  bg: string;
  color: string;
}

interface RoleColorMap {
  [key: string]: RoleColorScheme;
}

export default function RolesSubscriptionsTab({
  roleDistribution,
  subscriptionStats,
  userStats,
}: RolesSubscriptionsTabProps): React.ReactElement {
  // Calculate total for role progress bar
  const totalRolesCounted = roleDistribution
    ? (roleDistribution.admin ?? 0) +
      (roleDistribution.doctor ?? 0) +
      (roleDistribution.nurse ?? 0) +
      (roleDistribution.staff ?? 0)
    : 0;

  // Calculate percentages for role distribution
  const getPercentage = (roleCount: number): number => {
    return userStats.totalUsers > 0
      ? Math.round((roleCount / userStats.totalUsers) * 100)
      : 0;
  };

  // Role color map
  const roleColors: RoleColorMap = {
    admin: {
      bg: "bg-red-500 dark:bg-red-600",
      color: "red",
    },
    doctor: {
      bg: "bg-blue-500 dark:bg-blue-600",
      color: "blue",
    },
    nurse: {
      bg: "bg-green-500 dark:bg-green-600",
      color: "green",
    },
    staff: {
      bg: "bg-yellow-500 dark:bg-yellow-600",
      color: "yellow",
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Users by role */}
      <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md transition-shadow hover:shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
            Users by Role
          </CardTitle>
          <CardDescription className="text-green-600 dark:text-green-400">
            Distribution of users across different roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {roleDistribution ? (
            <div className="space-y-4">
              {/* Admin */}
              {userStats.totalAdmins !== undefined && (
                <RoleItem
                  title="Admin"
                  count={roleDistribution.admin ?? 0}
                  icon={Shield}
                  color="red"
                />
              )}

              {/* Doctor */}
              <RoleItem
                title="Doctor"
                count={roleDistribution.doctor ?? 0}
                icon={UserCog}
                color="blue"
              />

              {/* Nurse */}
              <RoleItem
                title="Nurse"
                count={roleDistribution.nurse ?? 0}
                icon={UserCog}
                color="green"
              />

              {/* Staff */}
              <RoleItem
                title="Staff"
                count={roleDistribution.staff ?? 0}
                icon={UserCog}
                color="yellow"
              />

              {/* Role Distribution Bar */}
              {userStats.totalUsers > 0 && totalRolesCounted > 0 && (
                <RoleDistributionBar
                  roleDistribution={roleDistribution}
                  userStats={userStats}
                  totalRolesCounted={totalRolesCounted}
                  roleColors={roleColors}
                  getPercentage={getPercentage}
                />
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <UserCog className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Role distribution data not available.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription stats */}
      {subscriptionStats ? (
        <SubscriptionCard subscriptionStats={subscriptionStats} />
      ) : (
        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md flex items-center justify-center lg:col-span-1">
          <CardContent className="pt-6 text-center py-12">
            <Shield className="h-12 w-12 mx-auto mb-3 text-gray-400 dark:text-gray-500 opacity-30" />
            <p className="text-gray-500 dark:text-gray-400">
              Subscription details available for Super Admins only.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Sub-component types
interface RoleDistributionBarProps {
  roleDistribution: RoleDistribution;
  userStats: UserStats;
  totalRolesCounted: number;
  roleColors: RoleColorMap;
  getPercentage: (roleCount: number) => number;
}

interface SubscriptionCardProps {
  subscriptionStats: SubscriptionStats;
}

// Sub-component for role distribution bar
function RoleDistributionBar({
  roleDistribution,
  userStats,
  totalRolesCounted,
  roleColors,
  getPercentage,
}: RoleDistributionBarProps): React.ReactElement {
  return (
    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        Role distribution
      </p>
      <div className="relative w-full h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex">
        {/* Admin */}
        {(roleDistribution.admin ?? 0) > 0 && (
          <div
            title={`Admin: ${roleDistribution.admin}`}
            className={`h-full ${roleColors.admin.bg} transition-all relative group`}
            style={{
              width: `${
                ((roleDistribution.admin ?? 0) / userStats.totalUsers) * 100
              }%`,
            }}
          >
            <div className="opacity-0 group-hover:opacity-100 absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-white dark:bg-slate-800 rounded shadow-lg text-xs transition-opacity z-10">
              Admin: {roleDistribution.admin} (
              {getPercentage(roleDistribution.admin ?? 0)}%)
            </div>
          </div>
        )}
        {/* Doctor */}
        {(roleDistribution.doctor ?? 0) > 0 && (
          <div
            title={`Doctor: ${roleDistribution.doctor}`}
            className={`h-full ${roleColors.doctor.bg} transition-all relative group`}
            style={{
              width: `${
                ((roleDistribution.doctor ?? 0) / userStats.totalUsers) * 100
              }%`,
            }}
          >
            <div className="opacity-0 group-hover:opacity-100 absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-white dark:bg-slate-800 rounded shadow-lg text-xs transition-opacity z-10">
              Doctor: {roleDistribution.doctor} (
              {getPercentage(roleDistribution.doctor ?? 0)}%)
            </div>
          </div>
        )}
        {/* Nurse */}
        {(roleDistribution.nurse ?? 0) > 0 && (
          <div
            title={`Nurse: ${roleDistribution.nurse}`}
            className={`h-full ${roleColors.nurse.bg} transition-all relative group`}
            style={{
              width: `${
                ((roleDistribution.nurse ?? 0) / userStats.totalUsers) * 100
              }%`,
            }}
          >
            <div className="opacity-0 group-hover:opacity-100 absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-white dark:bg-slate-800 rounded shadow-lg text-xs transition-opacity z-10">
              Nurse: {roleDistribution.nurse} (
              {getPercentage(roleDistribution.nurse ?? 0)}%)
            </div>
          </div>
        )}
        {/* Staff */}
        {(roleDistribution.staff ?? 0) > 0 && (
          <div
            title={`Staff: ${roleDistribution.staff}`}
            className={`h-full ${roleColors.staff.bg} transition-all relative group`}
            style={{
              width: `${
                ((roleDistribution.staff ?? 0) / userStats.totalUsers) * 100
              }%`,
            }}
          >
            <div className="opacity-0 group-hover:opacity-100 absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-white dark:bg-slate-800 rounded shadow-lg text-xs transition-opacity z-10">
              Staff: {roleDistribution.staff} (
              {getPercentage(roleDistribution.staff ?? 0)}%)
            </div>
          </div>
        )}
        {/* Remainder */}
        {userStats.totalUsers - totalRolesCounted > 0 && (
          <div
            title={`Other/Unspecified: ${
              userStats.totalUsers - totalRolesCounted
            }`}
            className="h-full bg-gray-300 dark:bg-gray-500 transition-all relative group"
            style={{
              width: `${
                ((userStats.totalUsers - totalRolesCounted) /
                  userStats.totalUsers) *
                100
              }%`,
            }}
          >
            <div className="opacity-0 group-hover:opacity-100 absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-white dark:bg-slate-800 rounded shadow-lg text-xs transition-opacity z-10">
              Other: {userStats.totalUsers - totalRolesCounted} (
              {getPercentage(userStats.totalUsers - totalRolesCounted)}
              %)
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 text-xs">
        {(roleDistribution.admin ?? 0) > 0 && (
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full ${roleColors.admin.bg} mr-1`}
            ></div>
            <span>Admin</span>
          </div>
        )}
        {(roleDistribution.doctor ?? 0) > 0 && (
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full ${roleColors.doctor.bg} mr-1`}
            ></div>
            <span>Doctor</span>
          </div>
        )}
        {(roleDistribution.nurse ?? 0) > 0 && (
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full ${roleColors.nurse.bg} mr-1`}
            ></div>
            <span>Nurse</span>
          </div>
        )}
        {(roleDistribution.staff ?? 0) > 0 && (
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full ${roleColors.staff.bg} mr-1`}
            ></div>
            <span>Staff</span>
          </div>
        )}
        {userStats.totalUsers - totalRolesCounted > 0 && (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-500 mr-1"></div>
            <span>Other</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-component for subscription card
function SubscriptionCard({
  subscriptionStats,
}: SubscriptionCardProps): React.ReactElement {
  return (
    <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md transition-shadow hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
          Subscription Overview
        </CardTitle>
        <CardDescription className="text-green-600 dark:text-green-400">
          User subscription types (Super Admin view)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Free Trial */}
          <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-all">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-4">
                <Sparkles className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
              <span className="font-medium">Free Trial</span>
            </div>
            <span className="font-bold">
              {subscriptionStats.freeTrials ?? 0}
            </span>
          </div>

          {/* Basic */}
          <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-all">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium">Basic</span>
            </div>
            <span className="font-bold">{subscriptionStats.basic ?? 0}</span>
          </div>

          {/* Premium */}
          <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-all">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="font-medium">Premium</span>
            </div>
            <span className="font-bold">{subscriptionStats.premium ?? 0}</span>
          </div>

          {/* Enterprise */}
          <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-all">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-4">
                <Sparkles className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="font-medium">Enterprise</span>
            </div>
            <span className="font-bold">
              {subscriptionStats.enterprise ?? 0}
            </span>
          </div>

          {/* Expired */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg text-center transition-colors hover:bg-red-100 dark:hover:bg-red-900/20">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Expired Subscriptions
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                {subscriptionStats.expired ?? 0}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
