import { IPatient } from "@/app/_types/Patient";

export interface BasePatientTabProps {
  patient: IPatient;
  formatDate: (date: string | Date) => string;
}

export type PatientInfoTabProps = BasePatientTabProps;

export interface PatientVisitsTabProps extends BasePatientTabProps {
  handleDeleteVisit: (visitId: string) => void;
  handleRestoreVisit: (visitId: string) => void;
  isDeletingVisit: boolean;
  setIsVisitDialogOpen: (value: boolean) => void;
}

export type PatientStatusTabProps = BasePatientTabProps;

export type PatientTreatmentTabProps = BasePatientTabProps;
