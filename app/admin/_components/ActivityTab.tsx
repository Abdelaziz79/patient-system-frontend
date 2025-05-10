import { useLanguage } from "@/app/_contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Clock, LogIn, Mail, UserCircle, UserPlus } from "lucide-react";

interface User {
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

interface Login {
  name: string;
  email: string;
  role: string;
  lastLogin?: string;
}

interface ActivityTabProps {
  recentUsers: User[];
  recentLogins: Login[];
}

// Animation variants
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

// Get role badge styles
const getRoleBadgeStyle = (role: string) => {
  const styles = {
    admin:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-900/30",
    doctor:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-900/30",
    nurse:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-900/30",
    staff:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-900/30",
    default:
      "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600",
  };

  return styles[role.toLowerCase() as keyof typeof styles] || styles.default;
};

// Get role border style
const getRoleBorderStyle = (role: string) => {
  const styles = {
    admin: "border-l-4 border-l-red-500 dark:border-l-red-600",
    doctor: "border-l-4 border-l-blue-500 dark:border-l-blue-600",
    nurse: "border-l-4 border-l-green-500 dark:border-l-green-600",
    staff: "border-l-4 border-l-amber-500 dark:border-l-amber-600",
    default: "border-l-4 border-l-gray-400 dark:border-l-gray-500",
  };

  return styles[role.toLowerCase() as keyof typeof styles] || styles.default;
};

// Component to display user items in lists
const UserListItem = ({
  user,
  timestamp,
  timestampLabel,
  isRTL,
}: {
  user: {
    name: string;
    email: string;
    role: string;
  };
  timestamp?: string;
  timestampLabel?: string;
  isRTL: boolean;
}) => (
  <motion.div
    variants={itemAnimation}
    className="group relative"
    style={{ direction: isRTL ? "rtl" : "ltr" }}
  >
    <div
      className={`relative p-4 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border ${
        isRTL ? "border-r-0 px-0" : "border-l-0 px-0"
      } border-green-100/50 dark:border-green-900/30 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${
        isRTL ? "border-r-4" : getRoleBorderStyle(user.role)
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-900/10 dark:to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative flex flex-col z-10 mx-4">
        {/* Name and Role */}
        <div className="flex items-center flex-wrap gap-2 mb-1.5">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            {user.name}
          </h3>
          <span
            className={`text-xs py-0.5 px-2 rounded-full ${getRoleBadgeStyle(
              user.role
            )} border shadow-sm inline-flex items-center gap-1`}
          >
            <UserCircle className="h-3 w-3" />
            <span>{user.role}</span>
          </span>
        </div>

        {/* Email */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <Mail className="h-3.5 w-3.5 mx-1.5 flex-shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>

        {/* Timestamp */}
        <div className="flex items-center text-xs text-green-600 dark:text-green-400 font-medium">
          <Clock className="h-3.5 w-3.5 mx-1.5 flex-shrink-0" />
          <span>
            {timestamp
              ? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
              : timestampLabel || "Never"}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function ActivityTab({
  recentUsers,
  recentLogins,
}: ActivityTabProps) {
  const { t, isRTL, dir } = useLanguage();

  return (
    <div className="space-y-8" dir={dir}>
      {/* Recent Registrations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
              <UserPlus
                className={`${
                  isRTL ? "mx-2" : "mx-2"
                } h-5 w-5 text-green-600 dark:text-green-400`}
              />
              {t("recentRegistrations") || "Recent Registrations"}
            </CardTitle>
            <CardDescription
              className={`text-green-600 dark:text-green-400 ${
                isRTL ? "text-right" : ""
              }`}
            >
              {t("usersWhoJoinedRecently") || "Users who joined recently"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {recentUsers?.length > 0 ? (
              <motion.div
                className="grid gap-3 max-h-[28rem] overflow-y-auto px-2"
                variants={staggerItems}
                initial="initial"
                animate="animate"
              >
                {recentUsers.map((user, index) => (
                  <UserListItem
                    key={user.email + index}
                    user={user}
                    timestamp={user.createdAt}
                    timestampLabel={t("neverJoined") || "Never joined"}
                    isRTL={isRTL}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                <UserPlus className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>
                  {t("noRecentRegistrations") ||
                    "No recent registrations found."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Logins */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
              <LogIn
                className={`${
                  isRTL ? "mx-2" : "mx-2"
                } h-5 w-5 text-green-600 dark:text-green-400`}
              />
              {t("recentLogins") || "Recent Logins"}
            </CardTitle>
            <CardDescription
              className={`text-green-600 dark:text-green-400 ${
                isRTL ? "text-right" : ""
              }`}
            >
              {t("usersWhoLoggedInRecently") || "Users who logged in recently"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {recentLogins?.length > 0 ? (
              <motion.div
                className="grid gap-3 max-h-[28rem] overflow-y-auto px-2"
                variants={staggerItems}
                initial="initial"
                animate="animate"
              >
                {recentLogins.map((login, index) => (
                  <UserListItem
                    key={login.email + index}
                    user={login}
                    timestamp={login.lastLogin}
                    timestampLabel={t("neverLoggedIn") || "Never logged in"}
                    isRTL={isRTL}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                <LogIn className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>
                  {t("noRecentLoginData") || "No recent login data available."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
