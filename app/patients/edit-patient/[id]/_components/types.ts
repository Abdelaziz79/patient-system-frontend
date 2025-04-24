import { IStatus } from "@/app/_types/Patient";

export interface PatientFormData {
  patientStatus?: string;
  patientStatusData?: IStatus;
  [key: string]: any;
}

export interface EditableField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  description?: string;
  options?: string[];
  value?: any;
}

export interface EditableSection {
  name: string;
  label: string;
  fields: EditableField[];
  description?: string;
}

export interface EditableTemplate {
  id: string;
  name: string;
  sections: EditableSection[];
  statusOptions: Array<{
    name: string;
    label: string;
    color: string;
    isDefault: boolean;
  }>;
  description?: string;
}
