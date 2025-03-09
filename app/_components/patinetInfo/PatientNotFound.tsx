"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

function PatientNotFound() {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600">
            Patient Not Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">
            The requested patient does not exist or has been deleted
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleBack} className="w-full">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PatientNotFound;
