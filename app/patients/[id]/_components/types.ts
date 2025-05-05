import { IPatient, IVisit } from "@/app/_types/Patient";
import { Dispatch, SetStateAction } from "react";

export interface PatientPageProps {
  patientId: string;
}

export interface PatientActionsProps {
  patient: IPatient;
  handleGoBack: () => void;
  handleEditPatient: () => void;
  handlePrintPatient: () => void;
}

export interface PatientInfoCardProps {
  patient: IPatient;
  formatDate: (date: string | Date) => string;
}

export interface PatientLoaderProps {
  loading: boolean;
  error: string | null;
  patient: IPatient | null;
  handleGoBack: () => void;
}

export interface PatientTabsProps {
  patient: IPatient;
  formatDate: (date: string | Date) => string;
  handleDeleteVisit: (visitId: string) => void;
  handleRestoreVisit: (visitId: string) => void;
  isDeletingVisit: boolean;
  setIsVisitDialogOpen: (value: boolean) => void;
}

export interface VisitDialogProps {
  isVisitDialogOpen: boolean;
  setIsVisitDialogOpen: (value: boolean) => void;
  newVisit: {
    title: string;
    date: Date;
    notes: string;
    sectionData: Record<string, any>;
  };
  setNewVisit: Dispatch<
    SetStateAction<{
      title: string;
      date: Date;
      notes: string;
      sectionData: Record<string, any>;
    }>
  >;
  handleAddVisit: () => void;
  isAddingVisit: boolean;
  patient: IPatient;
  handleGenerateVisitNotes: (symptoms?: string, observations?: string) => void;
  isGeneratingNotes: boolean;
}

export interface FooterActionsProps {
  handleGoBack: () => void;
  handlePrintPatient: () => void;
  handleEditPatient: () => void;
  setIsVisitDialogOpen: (value: boolean) => void;
}

export interface TagsSectionProps {
  patient: IPatient;
}

export interface PatientStatusSectionProps {
  patient: IPatient;
  onStatusChange?: () => Promise<void>;
}

export interface VisitListItemProps {
  visit: IVisit;
  formatDate: (date: string | Date) => string;
  handleDeleteVisit: (visitId: string) => void;
  handleRestoreVisit: (visitId: string) => void;
  isDeletingVisit: boolean;
}
