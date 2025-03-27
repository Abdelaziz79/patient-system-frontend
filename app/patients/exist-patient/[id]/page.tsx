"use client";

import { Calendar, Mail, Phone, User } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

interface Patient {
  id: string;
  name: string;
  age: number;
  email: string;
  phoneNumber: string;
  lastVisit: string;
  status: "active" | "discharged" | "transferred" | "deceased";
  statusReason?: string;
  statusDate?: string;
}

function ExistPatient() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: "active" as Patient["status"],
    reason: "",
  });

  useEffect(() => {
    // In a real application, you would fetch patient data from your API
    const fetchPatient = async () => {
      try {
        setLoading(true);
        // Simulating API call - replace with actual API call
        // const response = await fetch(`/api/patients/${id}`);
        // if (!response.ok) throw new Error('Failed to fetch patient data');
        // const data = await response.json();

        // Simulated data for demonstration
        const mockPatient: Patient = {
          id: id as string,
          name: "John Doe",
          age: 45,
          email: "john.doe@example.com",
          phoneNumber: "(555) 123-4567",
          lastVisit: "2025-03-15",
          status: "active",
        };

        // Simulate network delay
        setTimeout(() => {
          setPatient(mockPatient);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to load patient information. Please try again.");
        setLoading(false);
        console.error("Error fetching patient:", err);
      }
    };

    if (id) {
      fetchPatient();
    }
  }, [id]);

  const handleStatusChange = (value: string) => {
    setStatusUpdate({
      ...statusUpdate,
      status: value as Patient["status"],
    });
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStatusUpdate({
      ...statusUpdate,
      reason: e.target.value,
    });
  };

  const updatePatientStatus = () => {
    if (patient) {
      const updatedPatient = {
        ...patient,
        status: statusUpdate.status,
        statusReason: statusUpdate.reason,
        statusDate: new Date().toISOString().split("T")[0],
      };
      setPatient(updatedPatient);
      setShowStatusModal(false);

      // In a real application, you would update the patient in your database
      // Example:
      // await fetch(`/api/patients/${id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: statusUpdate.status, statusReason: statusUpdate.reason })
      // });
    }
  };

  const getStatusBadgeClassName = () => {
    switch (patient?.status) {
      case "active":
        return "bg-green-100 text-green-800 border border-green-400 rounded-full px-3 py-1";
      case "discharged":
        return "bg-blue-100 text-blue-800 border border-blue-400 rounded-full px-3 py-1";
      case "transferred":
        return "bg-yellow-100 text-yellow-800 border border-yellow-400 rounded-full px-3 py-1";
      case "deceased":
        return "bg-red-100 text-red-800 border border-red-400 rounded-full px-3 py-1";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-400 rounded-full px-3 py-1";
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto dark:text-slate-100">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-64 dark:bg-slate-700" />
          <Skeleton className="h-6 w-24 dark:bg-slate-700" />
        </div>
        <Card className="dark:bg-slate-800 dark:border-slate-600">
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2 dark:bg-slate-700" />
            <Skeleton className="h-4 w-48 dark:bg-slate-700" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Skeleton className="h-20 w-full mb-4 dark:bg-slate-700" />
                <Skeleton className="h-4 w-3/4 mb-2 dark:bg-slate-700" />
              </div>
              <div>
                <Skeleton className="h-6 w-32 mb-4 dark:bg-slate-700" />
                <Skeleton className="h-4 w-full mb-2 dark:bg-slate-700" />
                <Skeleton className="h-4 w-full mb-2 dark:bg-slate-700" />
                <Skeleton className="h-4 w-full mb-2 dark:bg-slate-700" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full dark:bg-slate-700" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Alert
          variant="destructive"
          className="dark:border-red-800 dark:bg-red-950 dark:text-red-200"
        >
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto dark:text-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patient Information</h1>
        {patient && (
          <Badge variant={"outline"} className={`${getStatusBadgeClassName()}`}>
            {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
          </Badge>
        )}
      </div>

      {patient ? (
        <Card className="dark:bg-slate-800 dark:border-slate-600">
          <CardHeader className="dark:border-slate-700">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
                <User className="text-blue-500 dark:text-blue-300" size={24} />
              </div>
              <div>
                <CardTitle>{patient.name}</CardTitle>
                <p className="text-muted-foreground dark:text-slate-400">
                  ID: {patient.id}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Patient Personal Information */}
              <div className="col-span-1">
                <div className="pl-14">
                  <p className="text-muted-foreground dark:text-slate-400 mb-2">
                    Age: {patient.age}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="col-span-1">
                <h3 className="text-lg font-medium mb-3">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail
                      className="text-muted-foreground dark:text-slate-400 mr-2"
                      size={16}
                    />
                    <p className="text-muted-foreground dark:text-slate-400">
                      {patient.email}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Phone
                      className="text-muted-foreground dark:text-slate-400 mr-2"
                      size={16}
                    />
                    <p className="text-muted-foreground dark:text-slate-400">
                      {patient.phoneNumber}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Calendar
                      className="text-muted-foreground dark:text-slate-400 mr-2"
                      size={16}
                    />
                    <p className="text-muted-foreground dark:text-slate-400">
                      Last Visit: {patient.lastVisit}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Information (if patient has status details) */}
              {(patient.statusReason || patient.statusDate) && (
                <div className="col-span-1 md:col-span-1">
                  <h3 className="text-lg font-medium mb-3">
                    Status Information
                  </h3>
                  {patient.statusDate && (
                    <p className="text-muted-foreground dark:text-slate-400 mb-2">
                      Date: {patient.statusDate}
                    </p>
                  )}
                  {patient.statusReason && (
                    <p className="text-muted-foreground dark:text-slate-400">
                      Reason: {patient.statusReason}
                    </p>
                  )}
                </div>
              )}
            </div>

            <Separator className="my-6 dark:bg-slate-700" />

            <div className="flex flex-wrap gap-3">
              <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="flex items-center dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-100"
                  >
                    Update Status
                  </Button>
                </DialogTrigger>
                <DialogContent className="dark:bg-slate-800 dark:border-slate-600">
                  <DialogHeader>
                    <DialogTitle className="dark:text-slate-100">
                      Update Patient Status
                    </DialogTitle>
                    <DialogDescription className="dark:text-slate-400">
                      Change the patient&apos;s status and provide a reason for
                      the update.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="status" className="dark:text-slate-300">
                        Status
                      </Label>
                      <Select
                        value={statusUpdate.status}
                        onValueChange={handleStatusChange}
                      >
                        <SelectTrigger className="dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="dark:border-slate-600 dark:bg-slate-800">
                          <SelectItem
                            value="active"
                            className="dark:text-slate-200 dark:focus:bg-slate-700"
                          >
                            Active
                          </SelectItem>
                          <SelectItem
                            value="discharged"
                            className="dark:text-slate-200 dark:focus:bg-slate-700"
                          >
                            Discharged
                          </SelectItem>
                          <SelectItem
                            value="transferred"
                            className="dark:text-slate-200 dark:focus:bg-slate-700"
                          >
                            Transferred
                          </SelectItem>
                          <SelectItem
                            value="deceased"
                            className="dark:text-slate-200 dark:focus:bg-slate-700"
                          >
                            Deceased
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="reason" className="dark:text-slate-300">
                        Reason
                      </Label>
                      <Textarea
                        id="reason"
                        value={statusUpdate.reason}
                        onChange={handleReasonChange}
                        placeholder={`Provide reason for ${statusUpdate.status} status...`}
                        className="dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowStatusModal(false)}
                      className="dark:border-slate-600 dark:bg-transparent dark:hover:bg-slate-700 dark:text-slate-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={updatePatientStatus}
                      className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
                    >
                      Update Status
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Alert className="dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
          <AlertDescription>No patient found with ID: {id}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default ExistPatient;
