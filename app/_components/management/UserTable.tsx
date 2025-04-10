import { UserUtils } from "@/app/_components/management/UserUtils";
import { User } from "@/app/_hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpDown,
  CalendarIcon,
  EditIcon,
  KeyIcon,
  MoreHorizontalIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";

interface UserTableProps {
  users: User[];
  currentPage: number;
  itemsPerPage: number;
  sortField: keyof User;
  sortDirection: string;
  onSort: (field: keyof User) => void;
  onResetPassword: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onEditUser: (user: User) => void; // New prop for edit action
}

export function UserTable({
  users,
  currentPage,
  itemsPerPage,
  sortField,
  sortDirection,
  onSort,
  onResetPassword,
  onDeleteUser,
  onEditUser,
}: UserTableProps) {
  const { getStatusBadge, getRoleBadge, formatDate } = UserUtils();

  return (
    <div className="rounded-md border dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-green-50 dark:bg-slate-700">
            <TableRow>
              <TableHead className="font-bold text-green-800 dark:text-green-300 w-12">
                #
              </TableHead>
              <TableHead
                className="font-bold text-green-800 dark:text-green-300 cursor-pointer"
                onClick={() => onSort("name")}
              >
                <div className="flex items-center">
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                  {sortField === "name" && (
                    <span className="ml-1 text-xs">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead
                className="font-bold text-green-800 dark:text-green-300 cursor-pointer"
                onClick={() => onSort("email")}
              >
                <div className="flex items-center">
                  Email
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                  {sortField === "email" && (
                    <span className="ml-1 text-xs">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300">
                Role
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300">
                Status
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 hidden md:table-cell">
                Specialization
              </TableHead>
              <TableHead
                className="font-bold text-green-800 dark:text-green-300 cursor-pointer"
                onClick={() => onSort("createdAt")}
              >
                <div className="flex items-center">
                  Created
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                  {sortField === "createdAt" && (
                    <span className="ml-1 text-xs">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead className="font-bold text-green-800 dark:text-green-300 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-green-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <TableCell className="font-medium">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    {getStatusBadge(user.isActive !== false)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.specialization || "—"}
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt ?? "")}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="border-green-100 dark:border-green-900 bg-white dark:bg-slate-800"
                      >
                        <DropdownMenuItem
                          onClick={() => onResetPassword(user.id)}
                          className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer"
                        >
                          <KeyIcon className="mr-2 h-4 w-4" />
                          <span>Reset Password</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEditUser(user)}
                          className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 cursor-pointer"
                        >
                          <EditIcon className="mr-2 h-4 w-4" />
                          <span>Edit User</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteUser(user.id)}
                          className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer"
                        >
                          <TrashIcon className="mr-2 h-4 w-4" />
                          <span>Deactivate User</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 cursor-pointer">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          <span>Manage Subscription</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <SearchIcon className="h-12 w-12 mb-2 opacity-20" />
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm">
                      Try changing your search criteria or add new users
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
