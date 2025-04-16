// src/app/admin/users/stats/components/ActivityTab.tsx
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { UserPlus, LogIn } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

// Component to display user items in lists
const UserListItem = ({
  user,
  timestamp,
  timestampLabel,
}: {
  user: {
    name: string;
    email: string;
    role: string;
  };
  timestamp?: string;
  timestampLabel?: string;
}) => (
  <li className="flex items-center justify-between text-sm p-3 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <span className="font-medium">{user.name}</span>
        <span className="text-xs py-0.5 px-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300">
          {user.role}
        </span>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
        {user.email}
      </p>
    </div>
    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
      {timestamp
        ? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
        : timestampLabel || "Never"}
    </span>
  </li>
);

export default function ActivityTab({
  recentUsers,
  recentLogins,
}: ActivityTabProps) {
  return (
    <div className="space-y-6">
      {/* Recent Registrations */}
      <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md transition-shadow hover:shadow-lg">
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
                <UserListItem
                  key={user.email + index}
                  user={user}
                  timestamp={user.createdAt}
                  timestampLabel="Never joined"
                />
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No recent registrations found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Logins */}
      <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md transition-shadow hover:shadow-lg">
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
                <UserListItem
                  key={login.email + index}
                  user={login}
                  timestamp={login.lastLogin}
                  timestampLabel="Never logged in"
                />
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <LogIn className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No recent login data available.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
