// src/app/admin/users/stats/components/PageHeader.tsx
import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actionButton?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  actionButton,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-300">
          {title}
        </h1>
        <p className="text-green-600 dark:text-green-400 mt-1">{subtitle}</p>
      </div>
      {actionButton}
    </div>
  );
}
