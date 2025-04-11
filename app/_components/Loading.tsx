"use client";
import React from "react";

function Loading({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>

      {message && (
        <div className="mt-4 text-center">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 animate-pulse">
            {message}
          </p>
        </div>
      )}
    </div>
  );
}

export default Loading;
