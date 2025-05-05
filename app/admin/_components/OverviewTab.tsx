import StatCard from "@/app/admin/_components/StatCard";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { UserCheck, Users, UserX } from "lucide-react";

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

interface OverviewTabProps {
  userStats: UserStats;
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

export default function OverviewTab({ userStats }: OverviewTabProps) {
  const { t, isRTL, dir } = useLanguage();

  const getPercentage = (count: number) => {
    return userStats.totalUsers > 0
      ? Math.round((count / userStats.totalUsers) * 100)
      : 0;
  };

  return (
    <div style={{ direction: dir === "rtl" ? "rtl" : "ltr" }}>
      {/* Main stats grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pb-6"
        variants={staggerItems}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={itemAnimation}>
          <StatCard
            title={t("totalUsers")}
            value={userStats.totalUsers}
            icon={Users}
            color="green"
            isRTL={isRTL}
          />
        </motion.div>
        <motion.div variants={itemAnimation}>
          <StatCard
            title={t("activeUsers")}
            value={userStats.activeUsers}
            icon={UserCheck}
            color="blue"
            isRTL={isRTL}
          />
        </motion.div>
        <motion.div variants={itemAnimation}>
          <StatCard
            title={t("inactiveUsers")}
            value={userStats.inactiveUsers}
            icon={UserX}
            color="red"
            isRTL={isRTL}
          />
        </motion.div>
      </motion.div>

      {/* Active vs Inactive Chart */}
      <motion.div variants={fadeIn} initial="initial" animate="animate">
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
              {t("userActivityStatus")}
            </CardTitle>
            <CardDescription
              className={`text-green-600 dark:text-green-400 ${
                isRTL ? "text-right" : ""
              }`}
            >
              {t("activeVsInactive")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {userStats.totalUsers > 0 ? (
              <div className="flex flex-col space-y-5">
                <div
                  className={`flex items-center ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1 mx-4">
                    <div className="relative w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 transition-all duration-500 rounded-full ${
                          isRTL ? "float-right" : "float-left"
                        }`}
                        style={{
                          width: `${
                            (userStats.activeUsers / userStats.totalUsers) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full shadow-sm">
                    {getPercentage(userStats.activeUsers)}% {t("active")}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div
                    className={`flex flex-col items-center p-5 rounded-lg bg-blue-50/80 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-blue-100/80 dark:hover:bg-blue-900/30 ${
                      isRTL ? "order-2" : "order-1"
                    }`}
                  >
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {t("activeUsers")}
                    </span>
                    <span className="text-3xl font-bold mt-2 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                      {userStats.activeUsers}
                    </span>
                  </div>
                  <div
                    className={`flex flex-col items-center p-5 rounded-lg bg-red-50/80 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-red-100/80 dark:hover:bg-red-900/30 ${
                      isRTL ? "order-1" : "order-2"
                    }`}
                  >
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      {t("inactiveUsers")}
                    </span>
                    <span className="text-3xl font-bold mt-2 bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-600 bg-clip-text text-transparent">
                      {userStats.inactiveUsers}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>{t("noUserDataAvailable")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
