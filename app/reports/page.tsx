import { Metadata } from "next";
import ReportsViewWrapper from "./_components/ReportsViewWrapper";

// Export metadata for better SEO
export const metadata: Metadata = {
  title: "Reports & Analytics | Patient Management System",
  description:
    "Generate comprehensive reports and analytics with AI-powered insights",
};

export default function ReportsPage() {
  return <ReportsViewWrapper />;
}
