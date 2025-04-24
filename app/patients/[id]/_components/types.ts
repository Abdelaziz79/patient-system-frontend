import { IPatient } from "@/app/_types/Patient";

export interface PatientPageProps {
  patientId: string;
}

export interface PatientActionsProps {
  patient: IPatient;
  isExportingToPdf: boolean;
  isExportingToCsv: boolean;
  isGeneratingReport: boolean;
  handleExportToPdf: () => Promise<void>;
  handleExportToCsv: () => Promise<void>;
  handleGoBack: () => void;
  handleEditPatient: () => void;
  handlePrintPatient: () => void;
  setIsShareDialogOpen: (isOpen: boolean) => void;
  setIsReportDialogOpen: (isOpen: boolean) => void;
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
  handleDeleteVisit: (visitId: string) => Promise<void>;
  handleRestoreVisit: (visitId: string) => Promise<void>;
  isDeletingVisit: boolean;
  setIsVisitDialogOpen: (isOpen: boolean) => void;
}

export interface ReportDialogProps {
  isReportDialogOpen: boolean;
  setIsReportDialogOpen: (isOpen: boolean) => void;
  reportOptions: {
    includeVisits: boolean;
    includeHistory: boolean;
    customTitle: string;
  };
  setReportOptions: (options: {
    includeVisits: boolean;
    includeHistory: boolean;
    customTitle: string;
  }) => void;
  handleGenerateReport: () => Promise<void>;
  isGeneratingReport: boolean;
}

export interface ShareDialogProps {
  isShareDialogOpen: boolean;
  setIsShareDialogOpen: (isOpen: boolean) => void;
  recipientEmail: string;
  setRecipientEmail: (email: string) => void;
  emailMessage: string;
  setEmailMessage: (message: string) => void;
  includeAttachment: boolean;
  setIncludeAttachment: (include: boolean) => void;
  handleShareViaEmail: () => Promise<void>;
  isSharingViaEmail: boolean;
}

export interface VisitDialogProps {
  isVisitDialogOpen: boolean;
  setIsVisitDialogOpen: (isOpen: boolean) => void;
  newVisit: {
    title: string;
    date: Date;
    notes: string;
    sectionData: Record<string, any>;
  };
  setNewVisit: (visit: {
    title: string;
    date: Date;
    notes: string;
    sectionData: Record<string, any>;
  }) => void;
  handleAddVisit: () => Promise<void>;
  isAddingVisit: boolean;
  patient: IPatient;
}

export interface FooterActionsProps {
  handleGoBack: () => void;
  handlePrintPatient: () => void;
  handleExportToPdf: () => Promise<void>;
  isExportingToPdf: boolean;
  handleEditPatient: () => void;
  setIsShareDialogOpen: (isOpen: boolean) => void;
  setIsVisitDialogOpen: (isOpen: boolean) => void;
}
