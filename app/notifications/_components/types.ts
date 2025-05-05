/**
 * This file contains type definitions shared across components
 */

import {
  NotificationType,
  ISystemNotification,
} from "@/app/_hooks/systemNotification/systemNotificationApi";
import { INotification } from "@/app/_hooks/notification/notificationApi";
import React from "react";

// Re-export types from API files for easier imports
export type { INotification } from "@/app/_hooks/notification/notificationApi";

export interface NotificationSummary {
  total: number;
  today: number;
  tomorrow: number;
  thisWeek: number;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

// Common notification component props
export interface NotificationIconProps {
  type: NotificationType;
  className?: string;
}

export interface SystemNotificationCardProps {
  notification: ISystemNotification;
  onClick: (notification: ISystemNotification) => void;
  onMarkAsRead: (id: string, e: React.MouseEvent) => void;
  index: number;
}

export interface AppointmentNotificationCardProps {
  notification: INotification;
  onClick: (notification: INotification) => void;
  index: number;
}

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}
