import { UserUtils } from "@/app/_components/management/UserUtils";
import { User } from "@/app/_hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  EditIcon,
  KeyIcon,
  MailIcon,
  PhoneIcon,
  TrashIcon,
} from "lucide-react";

interface UserCardsProps {
  users: User[];
  currentPage: number;
  itemsPerPage: number;
  onResetPassword: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onEditUser: (user: User) => void; // New prop for edit action
}

export function UserCards({
  users,
  currentPage,
  itemsPerPage,
  onResetPassword,
  onDeleteUser,
  onEditUser,
}: UserCardsProps) {
  const { getRoleBadge, getStatusBadge } = UserUtils();

  // Get users for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, users.length);
  const displayedUsers = users.slice(startIndex, endIndex);

  return (
    <div className="grid grid-cols-1 gap-4">
      {displayedUsers.length > 0 ? (
        displayedUsers.map((user) => (
          <Card
            key={user.id}
            className="overflow-hidden border-green-100 dark:border-green-900"
          >
            <CardContent className="p-0">
              <div className="bg-green-50 dark:bg-green-900/30 p-3 flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="font-bold text-green-800 dark:text-green-300">
                    {user.name}
                  </h3>
                  <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                    <MailIcon className="h-3 w-3 mr-1" />
                    {user.email}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {getStatusBadge(user.isActive !== false)}
                  {getRoleBadge(user.role)}
                </div>
              </div>

              <div className="p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Specialization:
                    </span>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {user.specialization || "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Contact:
                    </span>
                    <p className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                      {user.contactNumber ? (
                        <>
                          <PhoneIcon className="h-3 w-3 mr-1" />
                          {user.contactNumber}
                        </>
                      ) : (
                        "—"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="dark:bg-gray-700" />

              <div className="p-3 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onResetPassword(user.id)}
                  className="text-blue-600 border-blue-300 dark:text-blue-400 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <KeyIcon className="h-4 w-4 mr-1" />
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditUser(user)}
                  className="text-green-600 border-green-300 dark:text-green-400 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <EditIcon className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteUser(user.id)}
                  className="text-red-600 border-red-300 dark:text-red-400 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Deactivate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="p-8 text-center text-gray-500 dark:text-gray-400 border-green-100 dark:border-green-900">
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-4 opacity-20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-lg font-medium">No users found</p>
            <p className="text-sm mt-1">
              Try changing your search criteria or add new users
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
