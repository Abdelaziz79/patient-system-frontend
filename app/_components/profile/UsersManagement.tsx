"use client";
import { User } from "@/app/_hooks/useAuth";
import { useUserAdmin } from "@/app/_hooks/useUserAdmin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  CalendarIcon,
  ChevronDown,
  EditIcon,
  FilterIcon,
  KeyIcon,
  Loader2,
  MoreHorizontalIcon,
  SearchIcon,
  TrashIcon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CreateUserModal } from "./CreateUserModal";
import { PasswordChangeModal } from "./PasswordChangeModal";

export default function UsersManagement() {
  const {
    users,
    totalUsers,
    currentPage,
    limit,
    isLoading,
    isCreating,
    isUpdating,
    isResettingPassword,
    fetchUsers,
    createUser,
    updateUser,
    resetUserPassword,
    deleteUser,
  } = useUserAdmin();

  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortField, setSortField] = useState<keyof User>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isMobileView, setIsMobileView] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    // Check for mobile view
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    // Initial check
    checkMobileView();

    // Add resize listener
    window.addEventListener("resize", checkMobileView);

    return () => {
      window.removeEventListener("resize", checkMobileView);
    };
  }, []);

  useEffect(() => {
    // Load users when component mounts
    fetchUsers().catch((error) => {
      toast.error(error.message || "Failed to load users");
    });
  }, []);

  // Filter and sort users
  useEffect(() => {
    if (!users) return;

    let result = [...users];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter) {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      const valueA = a[sortField]?.toString().toLowerCase() || "";
      const valueB = b[sortField]?.toString().toLowerCase() || "";

      if (sortDirection === "asc") {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });

    setFilteredUsers(result);
  }, [searchQuery, roleFilter, users, sortField, sortDirection]);

  const handleCreateUserClick = () => {
    setIsCreateUserModalOpen(true);
  };

  const handleCloseCreateUserModal = () => {
    setIsCreateUserModalOpen(false);
  };

  const handleSubmitCreateUser = async (userData: any) => {
    try {
      const result = await createUser(userData);
      if (result.success) {
        toast.success(result.message);
        setIsCreateUserModalOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to create user");
      console.error("Error creating user:", error);
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      setSelectedUser(users.find((user) => user.id === userId) || null);
      setIsPasswordChangeModalOpen(true);
    } catch (error) {
      toast.error("Failed to open password reset");
    }
  };

  const handlePasswordChange = async (passwordData: any) => {
    try {
      if (!selectedUser) return;

      const result = await resetUserPassword(selectedUser.id);
      if (result.success) {
        toast.success(result.message);
        setIsPasswordChangeModalOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to reset password");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    // Confirm before deleting
    if (window.confirm("Are you sure you want to deactivate this user?")) {
      try {
        const result = await deleteUser(userId);
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const handlePageChange = (page: number) => {
    fetchUsers(page).catch((error) => {
      toast.error(error.message || "Failed to load users");
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
  };

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge
        variant="outline"
        className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
      >
        Active
      </Badge>
    ) : (
      <Badge
        variant="outline"
        className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
      >
        Inactive
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, string> = {
      admin:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
      doctor:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
      nurse:
        "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
      staff:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    };

    return (
      <Badge variant="outline" className={badges[role] || badges.staff}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get unique roles for filter dropdown
  const roles =
    users && users.length > 0
      ? Array.from(new Set(users.map((user) => user.role))).sort()
      : ["admin", "doctor", "nurse", "staff"];

  return (
    <div className="min-h-screen dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-green-100 dark:border-green-900 shadow-xl">
            <CardHeader className="px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-300">
                    User Management
                  </CardTitle>
                  <CardDescription className="text-green-600 dark:text-green-400 mt-1 text-sm">
                    Manage system users, roles and permissions
                  </CardDescription>
                </div>
                <Button
                  onClick={handleCreateUserClick}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white transition-all duration-200"
                >
                  <UserPlusIcon className="mr-2 h-4 w-4" />
                  <span>Add New User</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400" />
                  <Input
                    placeholder="Search for users..."
                    className="pl-10 focus:ring-green-500 focus:border-green-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <div className="relative sm:w-1/4">
                  <div className="relative">
                    <FilterIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400" />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500 dark:text-green-400" />
                    <select
                      className="w-full rounded-md border pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white appearance-none"
                      value={roleFilter}
                      onChange={handleRoleChange}
                    >
                      <option value="">All Roles</option>
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8 sm:py-12">
                  <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <>
                  {/* Mobile View - Card Layout */}
                  {isMobileView ? (
                    <div className="space-y-1">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user, index) => (
                          <div
                            key={user.id}
                            className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-3 cursor-pointer hover:bg-green-50 dark:hover:bg-slate-700 transition-colors border border-green-100 dark:border-slate-700"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span>{getRoleBadge(user.role)}</span>
                              <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                                #{index + 1}
                              </span>
                            </div>

                            <h3 className="text-lg font-bold mb-2 text-green-800 dark:text-green-300">
                              {user.name}
                            </h3>

                            <div className="grid grid-cols-1 gap-2">
                              <div className="flex items-center text-sm">
                                <UserIcon className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="truncate">{user.email}</span>
                              </div>

                              <div className="flex items-center text-sm">
                                <CalendarIcon className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span>{formatDate(user.createdAt)}</span>
                              </div>
                            </div>

                            {user.specialization && (
                              <div className="mt-2 bg-blue-50 dark:bg-blue-900/30 p-2 rounded text-sm">
                                <span className="font-medium">
                                  Specialization:
                                </span>{" "}
                                {user.specialization}
                              </div>
                            )}

                            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Status:{" "}
                                {getStatusBadge(user.isActive !== false)}
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleResetPassword(user.id)}
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1"
                                >
                                  <KeyIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 dark:text-green-400 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 p-1"
                                >
                                  <EditIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 dark:text-red-400 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 p-1"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-lg border dark:border-gray-700 p-8 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <SearchIcon className="h-12 w-12 mb-2 opacity-20" />
                            <p className="text-lg font-medium">
                              No users found
                            </p>
                            <p className="text-sm">
                              Try changing your search criteria or add new users
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Desktop View - Table Layout */
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
                                onClick={() => handleSort("name")}
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
                                onClick={() => handleSort("email")}
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
                                onClick={() => handleSort("createdAt")}
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
                            {filteredUsers.length > 0 ? (
                              filteredUsers?.map((user, index) => (
                                <TableRow
                                  key={user.id}
                                  className="hover:bg-green-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                  <TableCell className="font-medium">
                                    {index + 1}
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {user.name}
                                  </TableCell>
                                  <TableCell>{user.email}</TableCell>
                                  <TableCell>
                                    {getRoleBadge(user.role)}
                                  </TableCell>
                                  <TableCell>
                                    {getStatusBadge(user.isActive !== false)}
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell">
                                    {user.specialization || "—"}
                                  </TableCell>
                                  <TableCell>
                                    {formatDate(user.createdAt)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          className="h-8 w-8 p-0"
                                        >
                                          <span className="sr-only">
                                            Open menu
                                          </span>
                                          <MoreHorizontalIcon className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        align="end"
                                        className="border-green-100 dark:border-green-900 bg-white dark:bg-slate-800"
                                      >
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleResetPassword(user.id)
                                          }
                                          className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer"
                                        >
                                          <KeyIcon className="mr-2 h-4 w-4" />
                                          <span>Reset Password</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 cursor-pointer">
                                          <EditIcon className="mr-2 h-4 w-4" />
                                          <span>Edit User</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleDeleteUser(user.id)
                                          }
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
                                <TableCell
                                  colSpan={8}
                                  className="h-32 text-center"
                                >
                                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                    <SearchIcon className="h-12 w-12 mb-2 opacity-20" />
                                    <p className="text-lg font-medium">
                                      No users found
                                    </p>
                                    <p className="text-sm">
                                      Try changing your search criteria or add
                                      new users
                                    </p>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                  <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <div>
                      Total users:{" "}
                      <span className="font-medium">
                        {filteredUsers.length}
                      </span>{" "}
                      of <span className="font-medium">{totalUsers}</span>
                    </div>
                    {users?.length > 0 && totalUsers > limit && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(totalUsers / limit)}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={handleCloseCreateUserModal}
        onSubmit={handleSubmitCreateUser}
        isSubmitting={isCreating}
      />

      {/* Password Change Modal */}
      {selectedUser && (
        <PasswordChangeModal
          isOpen={isPasswordChangeModalOpen}
          onClose={() => setIsPasswordChangeModalOpen(false)}
          onSubmit={handlePasswordChange}
          isSubmitting={isResettingPassword}
        />
      )}
    </div>
  );
}
