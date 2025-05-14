"use client";

import { useLanguage } from "@/app/_contexts/LanguageContext";
import { VisitNotesInput } from "@/app/_hooks/AI/AIApi";
import { useAI } from "@/app/_hooks/AI/useAI";
import { usePatient } from "@/app/_hooks/patient/usePatient";
import { IVisitInput } from "@/app/_types/Patient";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FooterActions,
  PatientActions,
  PatientEventsSection,
  PatientInfoCard,
  PatientLoader,
  PatientNotesSection,
  PatientStatusSection,
  PatientTabs,
  TagsSection,
  VisitDialog,
} from "./_components";
function PatientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { language } = useLanguage();
  const [isVisitDialogOpen, setIsVisitDialogOpen] = useState(false);
  const [newVisit, setNewVisit] = useState<{
    title: string;
    date: Date | null;
    notes: string;
    sectionData: Record<string, any>;
  }>({
    title: "",
    date: new Date(),
    notes: "",
    sectionData: {},
  });
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);

  const {
    patientById: patient,
    isLoadingPatientById: loading,
    patientByIdError: error,
    refetchPatientById,
    printPatientDetails,
    addVisit,
    isAddingVisit,
    deleteVisit,
    isDeletingVisit,
    restoreVisit,
  } = usePatient({
    patientId: id,
  });

  const { generateVisitNotes } = useAI();

  const handleGoBack = () => {
    router.back();
  };

  const handleEditPatient = () => {
    router.push(`/patients/edit-patient/${id}`);
  };

  const handlePrintPatient = () => {
    if (!patient) return;
    const result = printPatientDetails(patient);
    if (!result.success) {
      toast.error(result.error || "Failed to print patient details");
    }
  };

  // Generate AI Visit Notes
  const handleGenerateVisitNotes = async (
    symptoms?: string,
    observations?: string
  ) => {
    if (!patient) return;

    setIsGeneratingNotes(true);

    try {
      const notesInput: VisitNotesInput = {
        symptoms: symptoms || "",
        observations: observations || "",
        patientId: id,
      };

      const result = await generateVisitNotes(
        notesInput,
        language === "ar" ? "arabic" : "english"
      );

      if (result.success && result.data) {
        // Update the notes field in the new visit form
        setNewVisit({
          ...newVisit,
          notes: result.data.notes || result.data,
        });
        toast.success("Visit notes generated successfully");
      } else {
        toast.error("Failed to generate visit notes");
      }
    } catch (error) {
      console.error("Error generating visit notes:", error);
      toast.error("An error occurred while generating visit notes");
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  // Handle adding a new visit
  const handleAddVisit = async () => {
    if (!patient || !newVisit.title || !newVisit.date) {
      toast.error(
        newVisit.date ? "Visit title is required" : "Visit date is required"
      );
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
      refetchPatientById();

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
        refetchPatientById();
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
      refetchPatientById();
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
      console.error("Error formatting date:", e);
      return "Invalid date";
    }
  };

  // First render the loader for loading, error, or no patient states
  if (loading || error || !patient) {
    return (
      <PatientLoader
        loading={loading}
        error={error ? error.toString() : null}
        patient={patient}
        handleGoBack={handleGoBack}
      />
    );
  }

  // Callback to refresh patient data after status change or other updates
  const refreshPatientData = async () => {
    refetchPatientById();
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-6xl mx-auto dark:text-slate-100 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-3 sm:space-y-6"
      >
        {/* Actions Header */}
        <PatientActions
          patient={patient}
          handleGoBack={handleGoBack}
          handleEditPatient={handleEditPatient}
          handlePrintPatient={handlePrintPatient}
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
          handleGenerateVisitNotes={handleGenerateVisitNotes}
          isGeneratingNotes={isGeneratingNotes}
        />

        {/* Patient Info Card */}
        <PatientInfoCard patient={patient} formatDate={formatDate} />

        {/* Patient Status Section */}
        <PatientStatusSection
          patient={patient}
          onStatusChange={refreshPatientData}
        />

        {/* Patient Events Section */}
        <PatientEventsSection
          patient={patient}
          onEventUpdate={refreshPatientData}
        />

        {/* Patient Notes Section */}
        <PatientNotesSection
          patient={patient}
          onNotesUpdate={refreshPatientData}
        />

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
          handleEditPatient={handleEditPatient}
          setIsVisitDialogOpen={setIsVisitDialogOpen}
        />
      </motion.div>
    </div>
  );
}

export default PatientPage;
