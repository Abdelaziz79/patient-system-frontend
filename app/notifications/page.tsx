import { Metadata } from "next";
import { NotificationsView } from "./_components/NotificationsView";

// Export metadata for better SEO and responsiveness
export const metadata: Metadata = {
  title: "Notifications | Patient Management System",
  description: "Manage your appointment notifications and system messages",
};

export default function NotificationsPage() {
  return <NotificationsView />;
}
