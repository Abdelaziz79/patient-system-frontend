// src/app/admin/users/stats/page.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Components
import ErrorComp from "@/app/_components/ErrorComp";
import Loading from "@/app/_components/Loading";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Custom Components
import ActivityTab from "@/app/_components/stats/ActivityTab";
import OverviewTab from "@/app/_components/stats/OverviewTab";
import PageHeader from "@/app/_components/stats/PageHeader";
import RolesSubscriptionsTab from "@/app/_components/stats/RolesSubscriptionsTab";

// Hooks
import { useUserAdmin } from "@/app/_hooks/useUserAdmin";

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function UsersStatsPage() {
  const router = useRouter();
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
    return <Loading message="Loading user statistics..." />;
  }

  if (error || !userStats) {
    return <ErrorComp message={error || "Failed to load user statistics."} />;
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <motion.div initial="initial" animate="animate" variants={fadeIn}>
        {/* Header */}
        <PageHeader
          title="User Statistics"
          subtitle="Overview of user accounts and activities"
          actionButton={
            <Button
              onClick={handleGoToUsers}
              variant="outline"
              size="sm"
              className="bg-green-50 hover:bg-green-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-green-800 dark:text-green-300 transition-all"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Go to Users
            </Button>
          }
        />

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-3 sm:w-auto sm:inline-grid gap-2 bg-green-50 dark:bg-slate-800 p-1 rounded-lg">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800 dark:data-[state=active]:bg-green-900/30 dark:data-[state=active]:text-green-300"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="roles"
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800 dark:data-[state=active]:bg-green-900/30 dark:data-[state=active]:text-green-300"
            >
              Roles & Subscriptions
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800 dark:data-[state=active]:bg-green-900/30 dark:data-[state=active]:text-green-300"
            >
              Recent Activity
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <OverviewTab userStats={userStats} />
          </TabsContent>

          {/* ROLES AND SUBSCRIPTIONS TAB */}
          <TabsContent value="roles" className="space-y-6">
            <RolesSubscriptionsTab
              roleDistribution={getRoleDistribution()}
              subscriptionStats={getSubscriptionStats()}
              userStats={userStats}
            />
          </TabsContent>

          {/* RECENT ACTIVITY TAB */}
          <TabsContent value="activity" className="space-y-6">
            <ActivityTab
              recentUsers={getRecentUsers()}
              recentLogins={getRecentLogins()}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
