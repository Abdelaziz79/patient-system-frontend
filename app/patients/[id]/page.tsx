"use client";

import { usePatient } from "@/app/_hooks/usePatient";
import { IPatient, IVisitInput } from "@/app/_types/Patient";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FooterActions,
  PatientActions,
  PatientInfoCard,
  PatientLoader,
  PatientTabs,
  ReportDialog,
  ShareDialog,
  TagsSection,
  VisitDialog,
} from "./_components";

function PatientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [patient, setPatient] = useState<IPatient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [includeAttachment, setIncludeAttachment] = useState(true);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportOptions, setReportOptions] = useState({
    includeVisits: true,
    includeHistory: true,
    customTitle: "",
  });
  const [isVisitDialogOpen, setIsVisitDialogOpen] = useState(false);
  const [newVisit, setNewVisit] = useState<{
    title: string;
    date: Date;
    notes: string;
    sectionData: Record<string, any>;
  }>({
    title: "",
    date: new Date(),
    notes: "",
    sectionData: {},
  });

  const {
    getPatient,
    exportPatientToPdf,
    exportPatientToCsv,
    generateMedicalReport,
    sharePatientViaEmail,
    printPatientDetails,
    isExportingToPdf,
    isExportingToCsv,
    isGeneratingReport,
    isSharingViaEmail,
    addVisit,
    isAddingVisit,
    deleteVisit,
    isDeletingVisit,
    restoreVisit,
    isRestoringVisit,
  } = usePatient({
    initialFetch: false,
  });

  // Memoize the fetch function to avoid recreating it on every render
  useEffect(() => {
    const fetchPatientData = async () => {
      if (isFetched || !id) return;

      console.log("Fetching patient data for ID:", id);
      try {
        setLoading(true);
        console.log("Making getPatient API call...");
        const patientData = await getPatient(id);
        console.log("Patient data received");

        if (!patientData) {
          console.error("API returned empty patient data");
          setError("No patient data found");
        } else {
          setPatient(patientData);
        }
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError("Failed to load patient data");
      } finally {
        setLoading(false);
        setIsFetched(true);
      }
    };

    fetchPatientData();
  }, [getPatient, id, isFetched]);

  const handleGoBack = () => {
    router.back();
  };

  const handleEditPatient = () => {
    router.push(`/patients/edit-patient/${id}`);
  };

  const handleExportToPdf = async () => {
    const result = await exportPatientToPdf(id);
    if (result.success) {
      toast.success("Patient data exported to PDF");
    } else {
      toast.error(result.error || "Failed to export data");
    }
  };

  const handleExportToCsv = async () => {
    const result = await exportPatientToCsv(id);
    if (result.success) {
      toast.success("Patient data exported to CSV");
    } else {
      toast.error(result.error || "Failed to export data");
    }
  };

  const handleGenerateReport = async () => {
    setIsReportDialogOpen(false);
    const result = await generateMedicalReport(id, reportOptions);
    if (result.success) {
      toast.success("Medical report generated successfully");
    } else {
      toast.error(result.error || "Failed to generate report");
    }
  };

  const handlePrintPatient = () => {
    if (!patient) return;
    const result = printPatientDetails(patient);
    if (!result.success) {
      toast.error(result.error || "Failed to print patient details");
    }
  };

  const handleShareViaEmail = async () => {
    if (!recipientEmail) {
      toast.error("Recipient email is required");
      return;
    }

    setIsShareDialogOpen(false);
    const result = await sharePatientViaEmail(id, {
      recipientEmail,
      message: emailMessage,
      includeAttachment,
    });

    if (result.success) {
      toast.success("Patient data shared successfully");
      setRecipientEmail("");
      setEmailMessage("");
    } else {
      toast.error(result.error || "Failed to share patient data");
    }
  };

  // Handle adding a new visit
  const handleAddVisit = async () => {
    if (!patient || !newVisit.title) {
      toast.error("Visit title is required");
      return;
    }

    setIsVisitDialogOpen(false);

    const visitData: IVisitInput = {
      title: newVisit.title,
      date: newVisit.date,
      notes: newVisit.notes,
      sectionData: newVisit.sectionData,
      createdBy: "", // This will be filled by the server using the authenticated user
    };

    const result = await addVisit(id, visitData);

    if (result.success) {
      toast.success("Visit added successfully");
      // Refresh patient data to include the new visit
      const updatedPatient = await getPatient(id);
      setPatient(updatedPatient);

      // Reset form
      setNewVisit({
        title: "",
        date: new Date(),
        notes: "",
        sectionData: {},
      });
    } else {
      toast.error(result.error || "Failed to add visit");
    }
  };

  // Handle deleting a visit
  const handleDeleteVisit = async (visitId: string) => {
    if (!patient) return;

    if (window.confirm("Are you sure you want to delete this visit?")) {
      const result = await deleteVisit(id, visitId);

      if (result.success) {
        toast.success("Visit deleted successfully");
        // Refresh patient data
        const updatedPatient = await getPatient(id);
        setPatient(updatedPatient);
      } else {
        toast.error(result.error || "Failed to delete visit");
      }
    }
  };

  // Handle restoring a deleted visit
  const handleRestoreVisit = async (visitId: string) => {
    if (!patient) return;

    const result = await restoreVisit(id, visitId);

    if (result.success) {
      toast.success("Visit restored successfully");
      // Refresh patient data
      const updatedPatient = await getPatient(id);
      setPatient(updatedPatient);
    } else {
      toast.error(result.error || "Failed to restore visit");
    }
  };

  // Format date helper
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "PPP");
    } catch (e) {
      return "Invalid date";
    }
  };

  // First render the loader for loading, error, or no patient states
  if (loading || error || !patient) {
    return (
      <PatientLoader
        loading={loading}
        error={error}
        patient={patient}
        handleGoBack={handleGoBack}
      />
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto dark:text-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Actions Header */}
        <PatientActions
          patient={patient}
          isExportingToPdf={isExportingToPdf}
          isExportingToCsv={isExportingToCsv}
          isGeneratingReport={isGeneratingReport}
          handleExportToPdf={handleExportToPdf}
          handleExportToCsv={handleExportToCsv}
          handleGoBack={handleGoBack}
          handleEditPatient={handleEditPatient}
          handlePrintPatient={handlePrintPatient}
          setIsShareDialogOpen={setIsShareDialogOpen}
          setIsReportDialogOpen={setIsReportDialogOpen}
        />

        {/* Share dialog */}
        <ShareDialog
          isShareDialogOpen={isShareDialogOpen}
          setIsShareDialogOpen={setIsShareDialogOpen}
          recipientEmail={recipientEmail}
          setRecipientEmail={setRecipientEmail}
          emailMessage={emailMessage}
          setEmailMessage={setEmailMessage}
          includeAttachment={includeAttachment}
          setIncludeAttachment={setIncludeAttachment}
          handleShareViaEmail={handleShareViaEmail}
          isSharingViaEmail={isSharingViaEmail}
        />

        {/* Medical Report Dialog */}
        <ReportDialog
          isReportDialogOpen={isReportDialogOpen}
          setIsReportDialogOpen={setIsReportDialogOpen}
          reportOptions={reportOptions}
          setReportOptions={setReportOptions}
          handleGenerateReport={handleGenerateReport}
          isGeneratingReport={isGeneratingReport}
        />

        {/* Add Visit Dialog */}
        <VisitDialog
          isVisitDialogOpen={isVisitDialogOpen}
          setIsVisitDialogOpen={setIsVisitDialogOpen}
          newVisit={newVisit}
          setNewVisit={setNewVisit}
          handleAddVisit={handleAddVisit}
          isAddingVisit={isAddingVisit}
          patient={patient}
        />

        {/* Patient Info Card */}
        <PatientInfoCard patient={patient} formatDate={formatDate} />

        {/* Patient Tabs */}
        <PatientTabs
          patient={patient}
          formatDate={formatDate}
          handleDeleteVisit={handleDeleteVisit}
          handleRestoreVisit={handleRestoreVisit}
          isDeletingVisit={isDeletingVisit}
          setIsVisitDialogOpen={setIsVisitDialogOpen}
        />

        {/* Tags Section */}
        <TagsSection patient={patient} />

        {/* Footer Actions */}
        <FooterActions
          handleGoBack={handleGoBack}
          handlePrintPatient={handlePrintPatient}
          handleExportToPdf={handleExportToPdf}
          isExportingToPdf={isExportingToPdf}
          handleEditPatient={handleEditPatient}
          setIsShareDialogOpen={setIsShareDialogOpen}
          setIsVisitDialogOpen={setIsVisitDialogOpen}
        />
      </motion.div>
    </div>
  );
}

export default PatientPage;
