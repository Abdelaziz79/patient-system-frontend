import { IStatus } from "@/app/_types/Patient";
import { PatientTemplate } from "@/app/_types/Template";
import { IPersonalInfo } from "@/app/_types/Patient";

export interface PatientFormData {
  patientStatus?: string;
  patientStatusData?: IStatus;
  personalInfo?: IPersonalInfo;
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

export interface ExtendedPatientTemplate extends PatientTemplate {
  statusOptions?: Array<{
    name: string;
    label: string;
    color: string;
    isDefault: boolean;
  }>;
}

export const createTemplateFromPatientData = (
  patientData: any
): ExtendedPatientTemplate => {
  const sections = Object.keys(patientData.sectionData || {}).map(
    (sectionName, index) => {
      const sectionData = patientData.sectionData[sectionName];

      const fields = Object.keys(sectionData || {}).map(
        (fieldName, fieldIndex) => {
          const fieldValue = sectionData[fieldName];
          const fieldType =
            typeof fieldValue === "boolean"
              ? "boolean"
              : typeof fieldValue === "number"
              ? "number"
              : "text";

          return {
            _id: `field-${fieldIndex}`,
            name: fieldName,
            label: fieldName
              .replace(/([A-Z])/g, " $1")
              .replace(/_/g, " ")
              .replace(/^\w/, (c) => c.toUpperCase()),
            type: fieldType,
            required: false,
            options: [],
            description: "",
            order: fieldIndex,
          };
        }
      );

      return {
        _id: `section-${index}`,
        name: sectionName,
        label: sectionName
          .replace(/([A-Z])/g, " $1")
          .replace(/_/g, " ")
          .replace(/^\w/, (c) => c.toUpperCase()),
        description: "",
        fields,
        order: index,
      };
    }
  );

  if (sections.length === 0) {
    sections.push({
      _id: "section-default",
      name: "default",
      label: "Default Section",
      description: "",
      fields: [],
      order: 0,
    });
  }

  const statusOptions = patientData.status
    ? [
        {
          name: patientData.status.name,
          label: patientData.status.label || patientData.status.name,
          color: patientData.status.color || "#4CAF50",
          isDefault: true,
        },
      ]
    : [];

  return {
    id: patientData.templateId?.id || "generated",
    name: patientData.templateId?.name || "Generated Template",
    description: "Template generated from patient data",
    sections,
    isPrivate: true,
    isDefault: false,
    createdBy: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    statusOptions,
  };
};
