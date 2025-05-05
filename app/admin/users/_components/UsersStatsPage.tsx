"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  ShieldCheck,
  UserPlusIcon,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Components
import ErrorComp from "@/app/_components/ErrorComp";
import Loading from "@/app/_components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Custom Components
import ActivityTab from "@/app/admin/_components/ActivityTab";
import OverviewTab from "@/app/admin/_components/OverviewTab";
import RolesSubscriptionsTab from "@/app/admin/_components/RolesSubscriptionsTab";

// Hooks
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { useUserAdmin } from "@/app/_hooks/userAdmin/useUserAdmin";

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function UsersStatsPage() {
  const router = useRouter();
  const { t, dir, isRTL } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    fetchUserStats,
    isLoadingStats,
    userStats,
    getRoleDistribution,
    getSubscriptionStats,
    getRecentUsers,
    getRecentLogins,
  } = useUserAdmin();

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        await fetchUserStats();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load user statistics"
        );
        console.error("Error loading statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoToUsers = () => {
    router.push("/admin/users");
  };

  const showLoading = loading || isLoadingStats;

  if (showLoading) {
    return <Loading message={t("loading") || "Loading user statistics..."} />;
  }

  if (error || !userStats) {
    return (
      <ErrorComp
        message={
          error ||
          t("failedToLoadUserStatistics") ||
          "Failed to load user statistics."
        }
      />
    );
  }

  // Calculate recent users and role distribution counts
  const recentUsersCount = getRecentUsers()?.length || 0;
  const recentLoginsCount = getRecentLogins()?.length || 0;
  const roleDistribution = getRoleDistribution();
  const roleCount = Object.keys(roleDistribution || {}).length || 0;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto" dir={dir}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="mb-8 space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent"
          >
            {t("userStats")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-green-600 dark:text-green-400 text-lg"
          >
            {t("manageUsers")}
          </motion.p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("totalUsers")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                    {userStats?.totalUsers?.toLocaleString() || 0}
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("newUsers")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                    {recentUsersCount}
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full">
                    <UserPlusIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("roles")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                    {roleCount}
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full">
                    <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("lastLogin")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
                    {recentLoginsCount}
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-6"
        >
          <Button
            onClick={handleGoToUsers}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-700 dark:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <ArrowRight
              className={`mx-2 h-4 w-4 ${
                dir === "rtl" ? "transform rotate-180" : ""
              }`}
            />
            {t("manageUsers")}
          </Button>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div dir={dir}>
            <TabsList
              className={`  dark:border-green-800 grid grid-cols-3 sm:w-auto sm:inline-grid gap-2 bg-green-50 dark:bg-slate-800 p-1 rounded-lg ${
                isRTL ? "flex-row-reverse" : ""
              } `}
            >
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800 dark:data-[state=active]:bg-green-900/30 dark:data-[state=active]:text-green-300"
              >
                {t("overview")}
              </TabsTrigger>
              <TabsTrigger
                value="roles"
                className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800 dark:data-[state=active]:bg-green-900/30 dark:data-[state=active]:text-green-300"
              >
                {t("rolesAndSubscriptions")}
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800 dark:data-[state=active]:bg-green-900/30 dark:data-[state=active]:text-green-300"
              >
                {t("recentActivity")}
              </TabsTrigger>
            </TabsList>
          </div>
          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <motion.div initial="initial" animate="animate" variants={fadeIn}>
              <OverviewTab userStats={userStats} />
            </motion.div>
          </TabsContent>

          {/* ROLES AND SUBSCRIPTIONS TAB */}
          <TabsContent value="roles" className="space-y-6">
            <motion.div initial="initial" animate="animate" variants={fadeIn}>
              <RolesSubscriptionsTab
                roleDistribution={getRoleDistribution()}
                subscriptionStats={getSubscriptionStats()}
                userStats={userStats}
              />
            </motion.div>
          </TabsContent>

          {/* RECENT ACTIVITY TAB */}
          <TabsContent value="activity" className="space-y-6">
            <motion.div initial="initial" animate="animate" variants={fadeIn}>
              <ActivityTab
                recentUsers={getRecentUsers()}
                recentLogins={getRecentLogins()}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
