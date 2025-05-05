import RoleItem from "@/app/admin/_components/RoleItem";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Shield, Sparkles, UserCog } from "lucide-react";
import React from "react";

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

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const staggerItems = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function RolesSubscriptionsTab({
  roleDistribution,
  subscriptionStats,
  userStats,
}: RolesSubscriptionsTabProps): React.ReactElement {
  const { t, isRTL, dir } = useLanguage();

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
    <div
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      style={{ direction: dir === "rtl" ? "rtl" : "ltr" }}
    >
      {/* Users by role */}
      <motion.div variants={fadeIn} initial="initial" animate="animate">
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
          <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
              {t("usersByRole")}
            </CardTitle>
            <CardDescription
              className={`text-green-600 dark:text-green-400 ${
                isRTL ? "text-right" : ""
              }`}
            >
              {t("roleDistribution")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {roleDistribution ? (
              <motion.div
                className="space-y-4"
                variants={staggerItems}
                initial="initial"
                animate="animate"
              >
                {/* Admin */}
                {userStats.totalAdmins !== undefined && (
                  <motion.div variants={itemAnimation}>
                    <RoleItem
                      title={t("admin")}
                      count={roleDistribution.admin ?? 0}
                      icon={Shield}
                      color="red"
                      isRTL={isRTL}
                    />
                  </motion.div>
                )}

                {/* Doctor */}
                <motion.div variants={itemAnimation}>
                  <RoleItem
                    title={t("doctor")}
                    count={roleDistribution.doctor ?? 0}
                    icon={UserCog}
                    color="blue"
                    isRTL={isRTL}
                  />
                </motion.div>

                {/* Nurse */}
                <motion.div variants={itemAnimation}>
                  <RoleItem
                    title={t("nurse")}
                    count={roleDistribution.nurse ?? 0}
                    icon={UserCog}
                    color="green"
                    isRTL={isRTL}
                  />
                </motion.div>

                {/* Staff */}
                <motion.div variants={itemAnimation}>
                  <RoleItem
                    title={t("staff")}
                    count={roleDistribution.staff ?? 0}
                    icon={UserCog}
                    color="yellow"
                    isRTL={isRTL}
                  />
                </motion.div>

                {/* Role Distribution Bar */}
                {userStats.totalUsers > 0 && totalRolesCounted > 0 && (
                  <RoleDistributionBar
                    roleDistribution={roleDistribution}
                    userStats={userStats}
                    totalRolesCounted={totalRolesCounted}
                    roleColors={roleColors}
                    getPercentage={getPercentage}
                    isRTL={isRTL}
                  />
                )}
              </motion.div>
            ) : (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                <UserCog className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>{t("roleDistributionNotAvailable")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Subscription stats */}
      {subscriptionStats ? (
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
        >
          <SubscriptionCard
            subscriptionStats={subscriptionStats}
            isRTL={isRTL}
          />
        </motion.div>
      ) : (
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center h-full">
            <CardContent className="pt-6 text-center py-12">
              <Shield className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-500 opacity-30" />
              <p className="text-gray-500 dark:text-gray-400">
                {t("subscriptionDetailsSuperAdmins")}
              </p>
            </CardContent>
          </Card>
        </motion.div>
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
  isRTL: boolean;
}

interface SubscriptionCardProps {
  subscriptionStats: SubscriptionStats;
  isRTL: boolean;
}

// Sub-component for role distribution bar
function RoleDistributionBar({
  roleDistribution,
  userStats,
  totalRolesCounted,
  roleColors,
  getPercentage,
  isRTL,
}: RoleDistributionBarProps): React.ReactElement {
  const { t } = useLanguage();

  return (
    <motion.div
      className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <p
        className={`text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 ${
          isRTL ? "text-right" : ""
        }`}
      >
        {t("roleDistribution")}
      </p>
      <div
        className="relative w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex shadow-inner"
        style={{ direction: "ltr" }}
      >
        {/* Admin */}
        {(roleDistribution.admin ?? 0) > 0 && (
          <div
            title={`Admin: ${roleDistribution.admin}`}
            className={`h-full ${roleColors.admin.bg} transition-all relative group`}
            style={{
              width: `${
                ((roleDistribution.admin ?? 0) / userStats.totalUsers) * 100
              }%`,
              float: isRTL ? "right" : "left",
            }}
          >
            <div className="opacity-0 group-hover:opacity-100 absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-lg text-xs font-medium transition-opacity z-10 border border-gray-100 dark:border-gray-700 whitespace-nowrap">
              {t("admin")}: {roleDistribution.admin} (
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
              float: isRTL ? "right" : "left",
            }}
          >
            <div className="opacity-0 group-hover:opacity-100 absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-lg text-xs font-medium transition-opacity z-10 border border-gray-100 dark:border-gray-700 whitespace-nowrap">
              {t("doctor")}: {roleDistribution.doctor} (
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
              float: isRTL ? "right" : "left",
            }}
          >
            <div className="opacity-0 group-hover:opacity-100 absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-lg text-xs font-medium transition-opacity z-10 border border-gray-100 dark:border-gray-700 whitespace-nowrap">
              {t("nurse")}: {roleDistribution.nurse} (
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
              float: isRTL ? "right" : "left",
            }}
          >
            <div className="opacity-0 group-hover:opacity-100 absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-lg text-xs font-medium transition-opacity z-10 border border-gray-100 dark:border-gray-700 whitespace-nowrap">
              {t("staff")}: {roleDistribution.staff} (
              {getPercentage(roleDistribution.staff ?? 0)}%)
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Sub-component for subscription stats
function SubscriptionCard({
  subscriptionStats,
  isRTL,
}: SubscriptionCardProps): React.ReactElement {
  const { t } = useLanguage();

  // Calculate totals
  const total =
    (subscriptionStats.freeTrials ?? 0) +
    (subscriptionStats.basic ?? 0) +
    (subscriptionStats.premium ?? 0) +
    (subscriptionStats.enterprise ?? 0) +
    (subscriptionStats.expired ?? 0);

  // Calculate percentages
  const getPercentage = (count: number): number => {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
      <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
          {t("subscriptionStats")}
        </CardTitle>
        <CardDescription
          className={`text-green-600 dark:text-green-400 ${
            isRTL ? "text-right" : ""
          }`}
        >
          {t("usersSubscriptionTiers")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <motion.div
          className="space-y-5"
          variants={staggerItems}
          initial="initial"
          animate="animate"
        >
          {/* Free Trials */}
          <motion.div variants={itemAnimation}>
            <div className="space-y-2">
              <div
                className={`flex justify-between items-center ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <span
                  className={`text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Sparkles
                    className={`h-4 w-4 ${
                      isRTL ? "mx-1.5" : "mx-1.5"
                    } text-purple-500 dark:text-purple-400`}
                  />
                  {t("freeTrials")}
                </span>
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400 whitespace-nowrap">
                  {subscriptionStats.freeTrials} (
                  {getPercentage(subscriptionStats.freeTrials ?? 0)}%)
                </span>
              </div>
              <div
                className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden shadow-inner"
                style={{ direction: "ltr" }}
              >
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-full transition-all duration-500"
                  style={{
                    width: `${getPercentage(
                      subscriptionStats.freeTrials ?? 0
                    )}%`,
                    float: isRTL ? "right" : "left",
                  }}
                ></div>
              </div>
            </div>
          </motion.div>

          {/* Basic */}
          <motion.div variants={itemAnimation}>
            <div className="space-y-2">
              <div
                className={`flex justify-between items-center ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <span
                  className={`text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Sparkles
                    className={`h-4 w-4 ${
                      isRTL ? "mx-1.5" : "mx-1.5"
                    } text-blue-500 dark:text-blue-400`}
                  />
                  {t("basicPlan")}
                </span>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">
                  {subscriptionStats.basic} (
                  {getPercentage(subscriptionStats.basic ?? 0)}%)
                </span>
              </div>
              <div
                className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden shadow-inner"
                style={{ direction: "ltr" }}
              >
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-full transition-all duration-500"
                  style={{
                    width: `${getPercentage(subscriptionStats.basic ?? 0)}%`,
                    float: isRTL ? "right" : "left",
                  }}
                ></div>
              </div>
            </div>
          </motion.div>

          {/* Premium */}
          <motion.div variants={itemAnimation}>
            <div className="space-y-2">
              <div
                className={`flex justify-between items-center ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <span
                  className={`text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Sparkles
                    className={`h-4 w-4 ${
                      isRTL ? "mx-1.5" : "mx-1.5"
                    } text-green-500 dark:text-green-400`}
                  />
                  {t("premiumPlan")}
                </span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400 whitespace-nowrap">
                  {subscriptionStats.premium} (
                  {getPercentage(subscriptionStats.premium ?? 0)}%)
                </span>
              </div>
              <div
                className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden shadow-inner"
                style={{ direction: "ltr" }}
              >
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-full transition-all duration-500"
                  style={{
                    width: `${getPercentage(subscriptionStats.premium ?? 0)}%`,
                    float: isRTL ? "right" : "left",
                  }}
                ></div>
              </div>
            </div>
          </motion.div>

          {/* Enterprise */}
          <motion.div variants={itemAnimation}>
            <div className="space-y-2">
              <div
                className={`flex justify-between items-center ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <span
                  className={`text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Sparkles
                    className={`h-4 w-4 ${
                      isRTL ? "mx-1.5" : "mx-1.5"
                    } text-yellow-500 dark:text-yellow-400`}
                  />
                  {t("enterprisePlan")}
                </span>
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400 whitespace-nowrap">
                  {subscriptionStats.enterprise} (
                  {getPercentage(subscriptionStats.enterprise ?? 0)}%)
                </span>
              </div>
              <div
                className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden shadow-inner"
                style={{ direction: "ltr" }}
              >
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700 rounded-full transition-all duration-500"
                  style={{
                    width: `${getPercentage(
                      subscriptionStats.enterprise ?? 0
                    )}%`,
                    float: isRTL ? "right" : "left",
                  }}
                ></div>
              </div>
            </div>
          </motion.div>

          {/* Expired */}
          <motion.div variants={itemAnimation}>
            <div className="space-y-2">
              <div
                className={`flex justify-between items-center ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <span
                  className={`text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Sparkles
                    className={`h-4 w-4 ${
                      isRTL ? "mx-1.5" : "mx-1.5"
                    } text-red-500 dark:text-red-400`}
                  />
                  {t("expiredPlans")}
                </span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400 whitespace-nowrap">
                  {subscriptionStats.expired} (
                  {getPercentage(subscriptionStats.expired ?? 0)}%)
                </span>
              </div>
              <div
                className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden shadow-inner"
                style={{ direction: "ltr" }}
              >
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-full transition-all duration-500"
                  style={{
                    width: `${getPercentage(subscriptionStats.expired ?? 0)}%`,
                    float: isRTL ? "right" : "left",
                  }}
                ></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
