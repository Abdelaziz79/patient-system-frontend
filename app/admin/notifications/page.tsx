"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useSystemNotification } from "@/app/_hooks/useSystemNotification";
import {
  ISystemNotification,
  NotificationType,
} from "@/app/_api/systemNotificationApi";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  Bell,
  InfoIcon,
  MessageSquareIcon,
  PlusCircle,
  RefreshCw,
  Users,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthContext } from "@/app/_providers/AuthProvider";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { useUserAdmin } from "@/app/_hooks/useUserAdmin";

// Form schema for notification creation
const notificationFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(500),
  type: z.enum([
    NotificationType.SYSTEM_NOTIFICATION,
    NotificationType.CUSTOM_MESSAGE,
  ]),
  targetAll: z.boolean(),
  selectedUsers: z.array(z.string()).optional(),
  expiryDays: z.coerce.number().int().min(1).max(90),
});

type NotificationFormValues = z.infer<typeof notificationFormSchema>;

// Component to display the icon for each notification type
const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case NotificationType.SUBSCRIPTION_EXPIRING:
      return <AlertTriangleIcon className="h-5 w-5 text-amber-500" />;
    case NotificationType.SYSTEM_NOTIFICATION:
      return <AlertCircleIcon className="h-5 w-5 text-blue-500" />;
    case NotificationType.CUSTOM_MESSAGE:
      return <MessageSquareIcon className="h-5 w-5 text-green-500" />;
    default:
      return <InfoIcon className="h-5 w-5 text-blue-500" />;
  }
};

export default function AdminNotificationsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedType, setSelectedType] = useState<
    NotificationType | undefined
  >(undefined);
  const [isCheckingSubscriptions, setIsCheckingSubscriptions] = useState(false);
  const [checkResult, setCheckResult] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  const {
    systemNotifications,
    isSystemNotificationsLoading,
    unreadCount,
    markAsRead,
    sendAdminNotification,
    checkSubscriptionExpirations,
    refetchSystemNotifications,
    updateFilters,
  } = useSystemNotification();

  // Get user list for targeting specific users
  const { users, isLoading: isUsersLoading } = useUserAdmin();

  // Form setup
  const form = useForm({
    // @ts-ignore - resolver type issues
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      title: "",
      message: "",
      type: NotificationType.SYSTEM_NOTIFICATION,
      targetAll: true,
      selectedUsers: [],
      expiryDays: 30,
    },
  });

  // Check if user is super admin
  useEffect(() => {
    if (isAuthenticated && user && user.role !== "super_admin") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  // Update filter when tab changes
  useEffect(() => {
    if (activeTab === "all") {
      updateFilters({ initialType: undefined });
    } else if (activeTab === "unread") {
      updateFilters({ initialIsRead: false });
    } else if (activeTab === "type") {
      updateFilters({ initialType: selectedType });
    }
  }, [activeTab, selectedType, updateFilters]);

  // Handle form submission
  const onSubmit = async (values: any) => {
    try {
      const recipients = values.targetAll ? undefined : values.selectedUsers;

      await sendAdminNotification({
        title: values.title,
        message: values.message,
        type: values.type,
        recipients,
        expiryDays: values.expiryDays,
      });

      form.reset();
      setDialogOpen(false);
      refetchSystemNotifications();
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };

  // Handle checking for subscription expirations
  const handleCheckSubscriptions = async () => {
    setIsCheckingSubscriptions(true);
    setCheckResult({});

    try {
      const result = await checkSubscriptionExpirations();
      refetchSystemNotifications();
      setCheckResult({
        success: true,
        message: "Subscription check completed successfully",
      });
      console.log("Subscription check result:", result);
    } catch (error) {
      console.error("Failed to check subscriptions:", error);
      setCheckResult({
        success: false,
        message: "Failed to check subscriptions",
      });
    } finally {
      setIsCheckingSubscriptions(false);
      // Auto-clear message after 3 seconds
      setTimeout(() => setCheckResult({}), 3000);
    }
  };

  if (isAuthenticated && user?.role !== "super_admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300">
              System Notifications
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage system notifications for all users
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleCheckSubscriptions}
              disabled={isCheckingSubscriptions}
            >
              {isCheckingSubscriptions ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-1" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Check Subscriptions
                </>
              )}
            </Button>
            {checkResult.message && (
              <span
                className={`text-sm ${
                  checkResult.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {checkResult.message}
              </span>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                  <PlusCircle className="h-4 w-4" />
                  Create Notification
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Create System Notification</DialogTitle>
                  <DialogDescription>
                    Send a notification to all users or specific individuals.
                    This will appear in their notifications panel.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Notification title"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Notification message"
                              {...field}
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem
                                  value={NotificationType.SYSTEM_NOTIFICATION}
                                >
                                  System
                                </SelectItem>
                                <SelectItem
                                  value={NotificationType.CUSTOM_MESSAGE}
                                >
                                  Custom
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="expiryDays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expires After (days)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                max={90}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="targetAll"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Send to all users</FormLabel>
                            <FormDescription>
                              When unchecked, you can select specific users to
                              receive this notification
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    {!form.watch("targetAll") && (
                      <FormField
                        control={form.control}
                        name="selectedUsers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Users</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  const currentValues = field.value || [];
                                  if (!currentValues.includes(value)) {
                                    field.onChange([...currentValues, value]);
                                  }
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select users" />
                                </SelectTrigger>
                                <SelectContent>
                                  {users?.map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                      {user.name} ({user.role})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {field.value?.map((userId) => {
                                const user = users?.find(
                                  (u) => u.id === userId
                                );
                                return (
                                  <Badge
                                    key={userId}
                                    variant="secondary"
                                    className="px-2 py-1 flex items-center gap-1"
                                  >
                                    {user?.name}
                                    <button
                                      type="button"
                                      className="text-gray-400 hover:text-gray-600"
                                      onClick={() => {
                                        field.onChange(
                                          field.value?.filter(
                                            (id) => id !== userId
                                          )
                                        );
                                      }}
                                    >
                                      ×
                                    </button>
                                  </Badge>
                                );
                              })}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    <DialogFooter>
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Send Notification
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs
          defaultValue="all"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="flex justify-between items-center">
            <TabsList className="mb-4">
              <TabsTrigger value="all" className="px-4">
                All Notifications
              </TabsTrigger>
              <TabsTrigger value="unread" className="px-4">
                Unread
                {unreadCount && unreadCount.unreadCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-blue-600 text-white"
                  >
                    {unreadCount.unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="type" className="px-4">
                By Type
              </TabsTrigger>
            </TabsList>

            {activeTab === "type" && (
              <Select
                value={selectedType}
                onValueChange={(value) =>
                  setSelectedType(value as NotificationType)
                }
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Select notification type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NotificationType.SYSTEM_NOTIFICATION}>
                    System Notification
                  </SelectItem>
                  <SelectItem value={NotificationType.CUSTOM_MESSAGE}>
                    Custom Message
                  </SelectItem>
                  <SelectItem value={NotificationType.SUBSCRIPTION_EXPIRING}>
                    Subscription Alert
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <Card>
            <CardContent className="p-6">
              {isSystemNotificationsLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : !systemNotifications || systemNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Bell className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">
                    No notifications found
                  </h3>
                  <p className="text-gray-400 dark:text-gray-500 mt-2">
                    {activeTab === "all"
                      ? "There are no system notifications yet"
                      : activeTab === "unread"
                      ? "There are no unread notifications"
                      : "No notifications of the selected type"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {systemNotifications.map(
                    (notification: ISystemNotification) => (
                      <div
                        key={notification._id}
                        className={`p-4 border rounded-lg transition-colors ${
                          !notification.isRead
                            ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                            : "bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            <NotificationIcon type={notification.type} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3
                                className={`font-medium ${
                                  !notification.isRead
                                    ? "text-blue-700 dark:text-blue-400"
                                    : "text-gray-800 dark:text-gray-200"
                                }`}
                              >
                                {notification.title}
                              </h3>
                              <div className="flex items-center gap-2">
                                {!notification.isRead && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs border-blue-500 text-blue-600 dark:text-blue-400"
                                  >
                                    Unread
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {notification.type ===
                                  NotificationType.SUBSCRIPTION_EXPIRING
                                    ? "Subscription"
                                    : notification.type ===
                                      NotificationType.SYSTEM_NOTIFICATION
                                    ? "System"
                                    : "Custom"}
                                </Badge>
                              </div>
                            </div>
                            <p className="mt-1 text-gray-600 dark:text-gray-400">
                              {notification.message}
                            </p>
                            <div className="flex justify-between mt-3">
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                                {notification.targetAll ? (
                                  <Badge
                                    variant="outline"
                                    className="text-xs flex items-center gap-1"
                                  >
                                    <Users className="h-3 w-3" />
                                    All Users
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">
                                    {notification.recipients.length}{" "}
                                    Recipient(s)
                                  </Badge>
                                )}
                                <span>•</span>
                                <span>
                                  Expires:{" "}
                                  {format(
                                    parseISO(notification.expiresAt),
                                    "MMM dd, yyyy"
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8"
                                  onClick={() => markAsRead(notification._id)}
                                  disabled={notification.isRead}
                                >
                                  {notification.isRead
                                    ? "Read"
                                    : "Mark as Read"}
                                </Button>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              Created by:{" "}
                              {notification.createdBy?.name || "System"} •{" "}
                              {format(
                                parseISO(notification.createdAt),
                                "MMM dd, yyyy HH:mm"
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </Tabs>
      </motion.div>
    </div>
  );
}
