import { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Backups | Admin",
  description: "Manage system database backups",
};

export default function BackupsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
