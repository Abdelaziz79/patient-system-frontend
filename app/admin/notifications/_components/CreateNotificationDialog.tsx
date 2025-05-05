import { useState, useEffect } from "react";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { NotificationType } from "@/app/_hooks/systemNotification/systemNotificationApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Badge } from "@/components/ui/badge";

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
    NotificationType.PATIENT_EVENT,
    NotificationType.SUBSCRIPTION_EXPIRING,
  ]),
  targetAll: z.boolean(),
  selectedUsers: z.array(z.string()).optional(),
  expiryDays: z.coerce.number().int().min(1).max(90),
  // Optional patient event fields
  patientId: z.string().optional(),
  eventId: z.string().optional(),
});

type NotificationFormValues = z.infer<typeof notificationFormSchema>;

interface CreateNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<any>;
  onSuccess: () => void;
  users?: any[];
  isLoading?: boolean;
}

export const CreateNotificationDialog = ({
  open,
  onOpenChange,
  onSubmit,
  onSuccess,
  users = [],
  isLoading = false,
}: CreateNotificationDialogProps) => {
  const { t, isRTL } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      title: "",
      message: "",
      type: NotificationType.SYSTEM_NOTIFICATION,
      targetAll: true,
      selectedUsers: [],
      expiryDays: 30,
      patientId: "",
      eventId: "",
    },
  });

  // Get current selected notification type
  const selectedType = form.watch("type");

  // Set default expiry days based on notification type
  useEffect(() => {
    if (selectedType === NotificationType.PATIENT_EVENT) {
      form.setValue("expiryDays", 7); // Default to 7 days for patient events
    } else if (selectedType === NotificationType.SUBSCRIPTION_EXPIRING) {
      form.setValue("expiryDays", 15); // Default to 15 days for subscription alerts
    } else {
      form.setValue("expiryDays", 30); // Default to 30 days for other types
    }
  }, [selectedType, form]);

  // Handle form submission
  const handleSubmit = async (values: NotificationFormValues) => {
    setIsSubmitting(true);
    try {
      const recipients = values.targetAll ? undefined : values.selectedUsers;

      // Build data based on notification type
      const submitData: any = {
        title: values.title,
        message: values.message,
        type: values.type,
        recipients,
        expiryDays: values.expiryDays,
      };

      // Add patient event specific fields if needed
      if (
        values.type === NotificationType.PATIENT_EVENT &&
        values.patientId &&
        values.eventId
      ) {
        submitData.patientId = values.patientId;
        submitData.eventId = values.eventId;
      }

      await onSubmit(submitData);

      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Failed to send notification:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="h-4 w-4" />
          {t("createNotification")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle>{t("createSystemNotification")}</DialogTitle>
          <DialogDescription>
            {t("notificationDialogDescription")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("type")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectType")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NotificationType.SYSTEM_NOTIFICATION}>
                        {t("systemNotification")}
                      </SelectItem>
                      <SelectItem value={NotificationType.CUSTOM_MESSAGE}>
                        {t("customMessage")}
                      </SelectItem>
                      <SelectItem value={NotificationType.PATIENT_EVENT}>
                        {t("patientEvent")}
                      </SelectItem>
                      <SelectItem
                        value={NotificationType.SUBSCRIPTION_EXPIRING}
                      >
                        {t("subscriptionAlert")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {field.value === NotificationType.PATIENT_EVENT
                      ? t("patientEventDescription")
                      : t("notificationTypeDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("title")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("notificationTitle")} {...field} />
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
                  <FormLabel>{t("message")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("notificationMessage")}
                      {...field}
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedType === NotificationType.PATIENT_EVENT && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("patientId")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("enterPatientId")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("eventId")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("enterEventId")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("expiresAfterDays")}</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={90} {...field} />
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
                <FormItem className="flex flex-row items-start gap-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("sendToAllUsers")}</FormLabel>
                    <FormDescription>
                      {t("targetUsersDescription")}
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
                    <FormLabel>{t("selectUsers")}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          const currentValues = field.value || [];
                          if (!currentValues.includes(value)) {
                            field.onChange([...currentValues, value]);
                          }
                        }}
                        disabled={isLoading || users.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoading
                                ? t("loadingUsers")
                                : users.length === 0
                                ? t("noUsersAvailable")
                                : t("selectUsers")
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name} ({user.role})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value?.map((userId) => {
                        const user = users?.find((u) => u.id === userId);
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
                                  field.value?.filter((id) => id !== userId)
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
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="mx-2"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("sending") : t("sendNotification")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
