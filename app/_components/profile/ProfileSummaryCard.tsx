import { User } from "@/app/_hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { EditIcon, ShieldIcon, UserIcon } from "lucide-react";

interface ProfileSummaryCardProps {
  user: User; // Use the specific user type from your hook/context
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  roleBadge: {
    bg: string;
    text: string;
  };
}

export function ProfileSummaryCard({
  user,
  isEditing,
  setIsEditing,
  roleBadge,
}: ProfileSummaryCardProps) {
  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-green-500 to-green-700 dark:from-green-700 dark:to-green-900"></div>
      <div className="flex justify-center -mt-12">
        <div className="rounded-full bg-white dark:bg-slate-700 p-2 shadow-lg">
          <div className="rounded-full bg-green-100 dark:bg-green-800 p-4">
            <UserIcon className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>
      <CardContent className="pt-8 pb-4 text-center">
        <h2 className="text-xl font-bold text-green-800 dark:text-green-300">
          {user.name}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
        <div className="flex justify-center mt-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadge.bg} ${roleBadge.text}`}
          >
            <ShieldIcon className="mr-1 h-3 w-3" />
            {user.role.replace("_", " ").toUpperCase()}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        {user.role === "admin" || user.role === "super_admin" ? (
          <Button
            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
            onClick={() => setIsEditing(!isEditing)}
          >
            <EditIcon className="mr-2 h-4 w-4" />
            {isEditing ? "Cancel Editing" : "Edit Profile"}
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
