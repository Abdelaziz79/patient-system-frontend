"use client";

import ErrorComp from "@/app/_components/ErrorComp";
import Loading from "@/app/_components/Loading";
import { PasswordResetModal } from "@/app/_components/management/PasswordResetModal";
import { UserFormModal } from "@/app/_components/profile/UserFormModal";
import { User } from "@/app/_hooks/useAuth";
import { UserCreateData, useUserAdmin } from "@/app/_hooks/useUserAdmin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit3,
  Shield,
  Star,
  Trash,
  UserCog,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  // States
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // User admin hook for operations
  const {
    fetchUserById,
    updateUser,
    deleteUser,
    undeleteUser, // Add this
    resetUserPassword,
    isUpdating,
    isResettingPassword,
  } = useUserAdmin();
  // Fetch user data only once on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError("User ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchUserById(userId);
        if (response) {
          setUser(response);
        } else {
          setError(response || "Failed to load user data");
        }
      } catch (error) {
        setError("An unexpected error occurred while fetching user data");
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Format date utility
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  // Calculate days remaining in subscription
  const daysRemaining = useMemo(() => {
    if (!user?.subscription?.endDate) return 0;

    const endDate = new Date(user.subscription.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [user?.subscription?.endDate]);

  // Get subscription badge class
  const getSubscriptionBadge = useCallback((type: string) => {
    switch (type) {
      case "premium":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "pro":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "free_trial":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  }, []);

  // Get role badge class
  const getRoleBadge = useCallback((role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "doctor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "nurse":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "staff":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  }, []);

  // Memoize subscription badge and role badge to prevent recalculations
  const subscriptionBadge = useMemo(
    () =>
      user?.subscription?.type
        ? getSubscriptionBadge(user.subscription.type)
        : "",
    [user?.subscription?.type, getSubscriptionBadge]
  );

  const roleBadge = useMemo(
    () => (user?.role ? getRoleBadge(user.role) : ""),
    [user?.role, getRoleBadge]
  );

  // Handle user update form submission
  const handleUpdateUser = async (userData: User | UserCreateData) => {
    if (!user) return;

    try {
      const result = await updateUser(userId, userData as User);

      if (result.success) {
        toast.success(result.message);
        setIsUserModalOpen(false);

        // Update local state with new user data
        setUser((prevUser) =>
          prevUser
            ? {
                ...prevUser,
                ...userData,
                role: userData.role as
                  | "super_admin"
                  | "admin"
                  | "doctor"
                  | "nurse"
                  | "staff",
              }
            : null
        );
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update user");
      console.error("Error updating user:", error);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (userId: string, newPassword: string) => {
    try {
      const result = await resetUserPassword(userId, newPassword);

      if (result.success) {
        setIsPasswordChangeModalOpen(false);
      } else {
        toast.error(result.message);
      }

      return result;
    } catch (error) {
      toast.error("Failed to reset password");
      console.error("Error resetting password:", error);
      return { success: false, message: "An error occurred" };
    }
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!user) return;

    try {
      const result = await deleteUser(userId);

      if (result.success) {
        toast.success(result.message);

        // Update local state to reflect deletion (deactivation)
        setUser((prevUser) =>
          prevUser ? { ...prevUser, isActive: false } : null
        );

        // Navigate back to users management after short delay
        setTimeout(() => router.push("/users"), 1500);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete user");
      console.error("Error deleting user:", error);
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  const handleUndeleteUser = async () => {
    if (!user) return;

    try {
      const result = await undeleteUser(userId);

      if (result.success) {
        toast.success(result.message);

        // Update local state to reflect reactivation
        setUser((prevUser) =>
          prevUser ? { ...prevUser, isActive: true } : null
        );
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to reactivate user");
      console.error("Error reactivating user:", error);
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  // Return to users list
  const handleBackToList = useCallback(() => {
    router.push("/users");
  }, [router]);

  // Modal handlers
  const closeUserModal = useCallback(() => setIsUserModalOpen(false), []);
  const closePasswordModal = useCallback(
    () => setIsPasswordChangeModalOpen(false),
    []
  );
  const openUserModal = useCallback(() => setIsUserModalOpen(true), []);
  const openPasswordModal = useCallback(
    () => setIsPasswordChangeModalOpen(true),
    []
  );
  const openDeleteConfirm = useCallback(() => setDeleteConfirmOpen(true), []);
  const closeDeleteConfirm = useCallback(() => setDeleteConfirmOpen(false), []);

  if (loading) {
    return <Loading />;
  }

  if (error || !user) {
    return <ErrorComp message={error || "User not found"} />;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800 dark:text-green-300">
              User Profile
            </h1>
            <p className="text-green-600 dark:text-green-400 mt-1">
              View and manage user information
            </p>
          </div>
          <Button
            onClick={handleBackToList}
            variant="outline"
            size="sm"
            className="bg-green-50 hover:bg-green-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-green-800 dark:text-green-300 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Summary - 1st Column */}
          <div className="lg:col-span-1">
            <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 dark:from-green-700 dark:to-emerald-900 h-16"></div>
              <div className="px-6 pt-0 pb-6 -mt-8">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-white dark:bg-slate-700 border-4 border-white dark:border-slate-700 flex items-center justify-center shadow-md">
                      <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 px-2 py-1 rounded-full text-xs font-medium ${roleBadge} shadow-sm border border-white dark:border-slate-700`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    {user.email}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                    {user.specialization}
                  </p>

                  <div className="mt-4 flex justify-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm">
                    <Shield className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                    <span className="text-gray-500 dark:text-gray-400 mr-2">
                      Role:
                    </span>
                    <span className="font-medium capitalize">{user.role}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                    <span className="text-gray-500 dark:text-gray-400 mr-2">
                      Specialization:
                    </span>
                    <span className="font-medium">
                      {user.specialization || "-"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                    <span className="text-gray-500 dark:text-gray-400 mr-2">
                      Created:
                    </span>
                    <span className="font-medium">
                      {formatDate(user?.createdAt || "")}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                    <span className="text-gray-500 dark:text-gray-400 mr-2">
                      Last Login:
                    </span>
                    <span className="font-medium">
                      {user?.lastLogin
                        ? formatDistanceToNow(new Date(user.lastLogin), {
                            addSuffix: true,
                          })
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Subscription Card */}
            {user.subscription && (
              <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md mt-6">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-bold text-green-800 dark:text-green-300">
                      Subscription
                    </CardTitle>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${subscriptionBadge}`}
                    >
                      {user.subscription.type.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Status:
                      </span>
                      <span
                        className={`font-medium ${
                          user.subscription.isActive
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {user.subscription.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        End Date:
                      </span>
                      <span className="font-medium">
                        {formatDate(user.subscription.endDate)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Days Remaining:
                      </span>
                      <span
                        className={`font-medium ${
                          daysRemaining > 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {daysRemaining > 0
                          ? `${daysRemaining} days`
                          : "Expired"}
                      </span>
                    </div>

                    <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <strong>Features:</strong>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {user.subscription.features.map((feature, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 bg-green-50 dark:bg-green-900/20 
                          text-green-700 dark:text-green-300 rounded text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content - Columns 2-4 */}
          <div className="lg:col-span-3 space-y-6">
            {/* Account Information */}
            <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
                  Account Information
                </CardTitle>
                <CardDescription className="text-green-600 dark:text-green-400">
                  Detailed user information and privileges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Full Name
                      </label>
                      <p className="font-medium mt-1">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Email Address
                      </label>
                      <p className="font-medium mt-1">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Contact Number
                      </label>
                      <p className="font-medium mt-1">
                        {user.contactNumber || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        User ID
                      </label>
                      <p className="font-medium mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {user.id}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Created By Admin
                      </label>
                      <p className="font-medium mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {user.createdBy}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Account Status
                      </label>
                      <p className="font-medium mt-1">
                        {user.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                            Inactive
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
                  Account Activity
                </CardTitle>
                <CardDescription className="text-green-600 dark:text-green-400">
                  User account timeline and recent activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-green-100 dark:bg-green-900/30"></div>

                  <div className="space-y-6">
                    <div className="relative flex ml-6">
                      <div className="absolute -left-10 mt-1 h-4 w-4 rounded-full bg-green-500 dark:bg-green-400 border-2 border-white dark:border-slate-800"></div>
                      <div>
                        <p className="text-sm font-medium">Account Created</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(user?.createdAt || "")}
                        </p>
                      </div>
                    </div>

                    {user?.lastLogin && (
                      <div className="relative flex ml-6">
                        <div className="absolute -left-10 mt-1 h-4 w-4 rounded-full bg-green-500 dark:bg-green-400 border-2 border-white dark:border-slate-800"></div>
                        <div>
                          <p className="text-sm font-medium">Last Login</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatDistanceToNow(new Date(user.lastLogin), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="relative flex ml-6">
                      <div className="absolute -left-10 mt-1 h-4 w-4 rounded-full bg-green-500 dark:bg-green-400 border-2 border-white dark:border-slate-800"></div>
                      <div>
                        <p className="text-sm font-medium">Account Updated</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDistanceToNow(
                            new Date(user?.updatedAt || ""),
                            {
                              addSuffix: true,
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Actions */}
            <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-green-100 dark:border-green-900 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
                  Admin Actions
                </CardTitle>
                <CardDescription className="text-green-600 dark:text-green-400">
                  Manage this user account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={openUserModal}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors"
                  >
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit User Details
                  </Button>
                  <Button
                    onClick={openPasswordModal}
                    className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-white transition-colors"
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    Reset Password
                  </Button>
                  {user?.isActive ? (
                    <Button
                      onClick={openDeleteConfirm}
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white transition-colors"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Deactivate User
                    </Button>
                  ) : (
                    <Button
                      onClick={openDeleteConfirm}
                      className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white transition-colors"
                    >
                      <UserCog className="mr-2 h-4 w-4" />
                      Reactivate User
                    </Button>
                  )}
                </div>
              </CardContent>
              {deleteConfirmOpen && (
                <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div
                    className={`w-full ${
                      user?.isActive
                        ? "bg-red-50 dark:bg-red-900/10"
                        : "bg-green-50 dark:bg-green-900/10"
                    } p-4 rounded-md`}
                  >
                    <p
                      className={`${
                        user?.isActive
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      } font-medium mb-4`}
                    >
                      {user?.isActive
                        ? "Are you sure you want to deactivate this user? This action can be reversed later."
                        : "Are you sure you want to reactivate this user?"}
                    </p>
                    <div className="flex gap-4">
                      <Button
                        onClick={closeDeleteConfirm}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={
                          user?.isActive ? handleDeleteUser : handleUndeleteUser
                        }
                        variant={user?.isActive ? "destructive" : "default"}
                        className={`flex-1 ${
                          !user?.isActive
                            ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
                            : ""
                        }`}
                      >
                        {user?.isActive
                          ? "Confirm Deactivation"
                          : "Confirm Reactivation"}
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </motion.div>

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isUserModalOpen}
        onClose={closeUserModal}
        onSubmit={handleUpdateUser}
        isSubmitting={isUpdating}
        user={user}
        mode="update"
      />

      {/* Password Reset Modal */}
      <PasswordResetModal
        isOpen={isPasswordChangeModalOpen}
        onClose={closePasswordModal}
        userId={user.id}
        userName={user.name}
        onReset={handlePasswordReset}
        isResetting={isResettingPassword}
      />
    </div>
  );
}
