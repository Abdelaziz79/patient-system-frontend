"use client";

import ErrorComp from "@/app/_components/ErrorComp";
import Loading from "@/app/_components/Loading";
import { useUserAdmin } from "@/app/_hooks/useUserAdmin"; // Updated hook import
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns"; // For relative dates
import { motion } from "framer-motion";
import {
  ArrowRight, // Keep for Inactive users
  LogIn, // Keep for recent logins maybe
  // Filter, // Removed as time filter is gone
  // PieChart, // Removed for specialization
  Shield, // Keep for Admin role
  Sparkles, // Generic User icon
  UserCheck, // Keep for Active users
  UserCog, // Added for Recent Logins
  UserPlus, // Keep for Doctor/Staff/Nurse roles
  Users, // Keep for Total users
  UserX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UsersStatsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Keep local loading for initial fetch trigger
  const [error, setError] = useState<string | null>(null);

  // Use the updated hook
  const {
    fetchUserStats,
    isLoadingStats, // Use hook's loading state for stats
    userStats,
    getRoleDistribution, // Use helper if needed, or access stats directly
    getSubscriptionStats, // Use helper if needed, or access stats directly
    getRecentUsers, // Use helper for recent users list
    getRecentLogins, // Use helper for recent logins list
  } = useUserAdmin();

  console.log("New userStats structure:", userStats);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true); // Start local loading
        await fetchUserStats(); // Fetch data using the hook function
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load user statistics"
        );
        console.error("Error loading statistics:", error);
      } finally {
        setLoading(false); // End local loading
      }
    };

    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // fetchUserStats is stable, so no need to add it as dependency

  // Handle return to users list
  const handleGoToUsers = () => {
    router.push("/admin/users");
  };

  // Get derived data using new hook's helpers or direct access
  const roleDistribution = userStats ? getRoleDistribution() : null;
  const subscriptionStats = userStats ? getSubscriptionStats() : null; // May be null if not Super Admin
  const recentUsers = userStats ? getRecentUsers() : [];
  const recentLogins = userStats ? getRecentLogins() : [];

  // Combined loading state
  const showLoading = loading || isLoadingStats;

  if (showLoading) {
    return <Loading message="Loading user statistics..." />;
  }

  if (error || !userStats) {
    return <ErrorComp message={error || "Failed to load user statistics."} />;
  }

  // Calculate total for role progress bar (handle potentially undefined admin count)
  const totalRolesCounted =
    (roleDistribution?.admin ?? 0) +
    (roleDistribution?.doctor ?? 0) +
    (roleDistribution?.nurse ?? 0) +
    (roleDistribution?.staff ?? 0);
  // Note: This might not equal userStats.totalUsers if there are other roles not explicitly counted

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-300">
              User Statistics
            </h1>
            <p className="text-green-600 dark:text-green-400 mt-1">
              Overview of user accounts and activities
            </p>
          </div>
          <div className="flex gap-3">
            {/* Removed Time Filter Select */}
            <Button
              onClick={handleGoToUsers}
              variant="outline"
              size="sm"
              className="bg-green-50 hover:bg-green-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-green-800 dark:text-green-300 transition-colors"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Go to Users
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full sm:w-auto sm:inline-grid grid-cols-3 gap-2">
            {" "}
            {/* Adjusted grid cols */}
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roles">Roles & Subscriptions</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>{" "}
            {/* Renamed Tab */}
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Main stats grid - Simplified */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {/* Total users */}
              <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Users
                      </p>
                      <h3 className="text-3xl font-bold text-green-800 dark:text-green-300 mt-1">
                        {userStats.totalUsers}
                      </h3>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active users */}
              <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Active Users
                      </p>
                      <h3 className="text-3xl font-bold text-green-800 dark:text-green-300 mt-1">
                        {userStats.activeUsers}
                      </h3>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Inactive users */}
              <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Inactive Users
                      </p>
                      <h3 className="text-3xl font-bold text-green-800 dark:text-green-300 mt-1">
                        {userStats.inactiveUsers}
                      </h3>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Removed New Users, Growth, Retention cards */}
            </div>

            {/* Active vs Inactive Chart */}
            <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md">
              <CardHeader>
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
                      <div className="flex-1">
                        <Progress
                          value={
                            (userStats.activeUsers / userStats.totalUsers) * 100
                          }
                          className="h-4"
                        />
                      </div>
                      <span className="ml-4 text-sm font-medium">
                        {Math.round(
                          (userStats.activeUsers / userStats.totalUsers) * 100
                        )}
                        % Active
                      </span>
                    </div>
                    <div className="grid grid-cols-2 text-center">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          Active Users
                        </span>
                        <span className="text-xl font-bold">
                          {userStats.activeUsers}
                        </span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-red-500 dark:text-red-400">
                          Inactive Users
                        </span>
                        <span className="text-xl font-bold">
                          {userStats.inactiveUsers}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No user data available.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ROLES AND SUBSCRIPTIONS TAB */}
          <TabsContent value="roles" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Users by role */}
              <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md">
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
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-4">
                              <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <span className="font-medium">Admin</span>
                          </div>
                          <span className="font-bold">
                            {roleDistribution.admin ?? 0}
                          </span>
                        </div>
                      )}
                      {/* Doctor */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                            <UserCog className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-medium">Doctor</span>
                        </div>
                        <span className="font-bold">
                          {roleDistribution.doctor ?? 0}
                        </span>
                      </div>
                      {/* Nurse */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4">
                            <UserCog className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="font-medium">Nurse</span>
                        </div>
                        <span className="font-bold">
                          {roleDistribution.nurse ?? 0}
                        </span>
                      </div>
                      {/* Staff */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-md bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-4">
                            <UserCog className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          </div>
                          <span className="font-medium">Staff</span>
                        </div>
                        <span className="font-bold">
                          {roleDistribution.staff ?? 0}
                        </span>
                      </div>

                      {/* Role Distribution Bar (simplified) */}
                      {userStats.totalUsers > 0 && totalRolesCounted > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                          <div className="relative w-full h-6 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
                            {/* Admin */}
                            {(roleDistribution.admin ?? 0) > 0 && (
                              <div
                                title={`Admin: ${roleDistribution.admin}`}
                                className="h-full bg-red-500 dark:bg-red-600 hover:brightness-110 transition-all"
                                style={{
                                  width: `${
                                    ((roleDistribution.admin ?? 0) /
                                      userStats.totalUsers) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            )}
                            {/* Doctor */}
                            {(roleDistribution.doctor ?? 0) > 0 && (
                              <div
                                title={`Doctor: ${roleDistribution.doctor}`}
                                className="h-full bg-blue-500 dark:bg-blue-600 hover:brightness-110 transition-all"
                                style={{
                                  width: `${
                                    ((roleDistribution.doctor ?? 0) /
                                      userStats.totalUsers) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            )}
                            {/* Nurse */}
                            {(roleDistribution.nurse ?? 0) > 0 && (
                              <div
                                title={`Nurse: ${roleDistribution.nurse}`}
                                className="h-full bg-green-500 dark:bg-green-600 hover:brightness-110 transition-all"
                                style={{
                                  width: `${
                                    ((roleDistribution.nurse ?? 0) /
                                      userStats.totalUsers) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            )}
                            {/* Staff */}
                            {(roleDistribution.staff ?? 0) > 0 && (
                              <div
                                title={`Staff: ${roleDistribution.staff}`}
                                className="h-full bg-yellow-500 dark:bg-yellow-600 hover:brightness-110 transition-all"
                                style={{
                                  width: `${
                                    ((roleDistribution.staff ?? 0) /
                                      userStats.totalUsers) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            )}
                            {/* Remainder (if roles don't sum to total) */}
                            {userStats.totalUsers - totalRolesCounted > 0 && (
                              <div
                                title={`Other/Unspecified: ${
                                  userStats.totalUsers - totalRolesCounted
                                }`}
                                className="h-full bg-gray-300 dark:bg-gray-500 hover:brightness-110 transition-all"
                                style={{
                                  width: `${
                                    ((userStats.totalUsers -
                                      totalRolesCounted) /
                                      userStats.totalUsers) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      Role distribution data not available.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Subscription stats (Conditional based on availability) */}
              {subscriptionStats && (
                <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
                      Subscription Overview
                    </CardTitle>
                    <CardDescription className="text-green-600 dark:text-green-400">
                      User subscription types (Super Admin view)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Free Trial */}
                      <div className="flex items-center justify-between">
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-medium">Basic</span>
                        </div>
                        <span className="font-bold">
                          {subscriptionStats.basic ?? 0}
                        </span>
                      </div>
                      {/* Premium */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4">
                            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <span className="font-medium">Premium</span>
                        </div>
                        <span className="font-bold">
                          {subscriptionStats.premium ?? 0}
                        </span>
                      </div>
                      {/* Enterprise */}
                      <div className="flex items-center justify-between">
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
                        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg text-center">
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
              )}
              {!subscriptionStats && (
                <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md flex items-center justify-center lg:col-span-1">
                  <CardContent className="pt-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      Subscription details available for Super Admins.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
            {/* Removed Subscription Expiration Insights Card */}
          </TabsContent>

          {/* RECENT ACTIVITY TAB (Formerly Growth & Trends) */}
          <TabsContent value="activity" className="space-y-6">
            {/* Recent Registrations */}
            <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300 flex items-center">
                  <UserPlus className="mr-2 h-5 w-5" /> Recent Registrations
                </CardTitle>
                <CardDescription className="text-green-600 dark:text-green-400">
                  Users who joined recently
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentUsers.length > 0 ? (
                  <ul className="space-y-3 max-h-96 overflow-y-auto">
                    {recentUsers.map((user, index) => (
                      <li
                        key={user.email + index}
                        className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700/50"
                      >
                        <div>
                          <span className="font-medium">{user.name}</span>
                          <span className="text-gray-500 dark:text-gray-400 ml-2">
                            ({user.role})
                          </span>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {user.email}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(new Date(user.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No recent registrations found.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Logins */}
            <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300 flex items-center">
                  <LogIn className="mr-2 h-5 w-5" /> Recent Logins
                </CardTitle>
                <CardDescription className="text-green-600 dark:text-green-400">
                  Users who logged in recently
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentLogins.length > 0 ? (
                  <ul className="space-y-3 max-h-96 overflow-y-auto">
                    {recentLogins.map((login, index) => (
                      <li
                        key={login.email + index}
                        className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700/50"
                      >
                        <div>
                          <span className="font-medium">{login.name}</span>
                          <span className="text-gray-500 dark:text-gray-400 ml-2">
                            ({login.role})
                          </span>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {login.email}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {login.lastLogin
                            ? formatDistanceToNow(new Date(login.lastLogin), {
                                addSuffix: true,
                              })
                            : "Never"}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No recent login data found.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Removed Growth Chart, Specialization, Activity Metrics */}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
