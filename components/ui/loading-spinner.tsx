"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "sm" | "lg";
  variant?: "default" | "secondary" | "ghost";
}

export function LoadingSpinner({
  size = "default",
  variant = "default",
  className,
  ...props
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        {
          "w-8 h-8": size === "default",
          "w-5 h-5": size === "sm",
          "w-12 h-12": size === "lg",
        },
        className
      )}
      {...props}
    >
      <Loader2
        className={cn(
          "animate-spin",
          {
            "text-primary": variant === "default",
            "text-secondary": variant === "secondary",
            "text-muted-foreground": variant === "ghost",
          },
          {
            "w-8 h-8": size === "default",
            "w-5 h-5": size === "sm",
            "w-12 h-12": size === "lg",
          }
        )}
      />
    </div>
  );
}
