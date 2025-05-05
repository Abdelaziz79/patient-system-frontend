import { NotificationType } from "@/app/_hooks/systemNotification/systemNotificationApi";
import {
  AlertTriangleIcon,
  AlertCircleIcon,
  MessageSquareIcon,
  InfoIcon,
  Bell,
  BellRing,
  Calendar,
} from "lucide-react";

interface NotificationIconProps {
  type: NotificationType;
  className?: string;
}

export const NotificationIcon = ({
  type,
  className = "h-5 w-5",
}: NotificationIconProps) => {
  switch (type) {
    case NotificationType.SUBSCRIPTION_EXPIRING:
      return <AlertTriangleIcon className={`${className} text-amber-500`} />;
    case NotificationType.SYSTEM_NOTIFICATION:
      return <BellRing className={`${className} text-blue-500`} />;
    case NotificationType.CUSTOM_MESSAGE:
      return <MessageSquareIcon className={`${className} text-green-500`} />;
    case NotificationType.PATIENT_EVENT:
      return <Calendar className={`${className} text-purple-500`} />;
    default:
      return <InfoIcon className={`${className} text-blue-500`} />;
  }
};
