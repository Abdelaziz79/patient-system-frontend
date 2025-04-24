import { IPatient } from "@/app/_types/Patient";
import { Field, PatientStatusOption, Section } from "@/app/_types/Template";

/**
 * Creates a template from patient data when a proper template is unavailable
 */
export function createTemplateFromPatientData(patientData: IPatient) {
  const sections: Section[] = [];

  // Create sections from patient data
  Object.entries(patientData.sectionData || {}).forEach(
    ([sectionName, sectionData], sectionIndex) => {
      const fields: Field[] = [];

      // Create fields for each section
      Object.entries(sectionData as Record<string, any>).forEach(
        ([fieldName, fieldValue], fieldIndex) => {
          // Determine field type based on value
          let fieldType = "text";
          if (typeof fieldValue === "number") fieldType = "number";
          else if (typeof fieldValue === "boolean") fieldType = "boolean";
          else if (
            fieldValue instanceof Date ||
            (typeof fieldValue === "string" && !isNaN(Date.parse(fieldValue)))
          ) {
            fieldType = "date";
          }

          fields.push({
            name: fieldName,
            label:
              fieldName.charAt(0).toUpperCase() +
              fieldName.slice(1).replace(/([A-Z])/g, " $1"),
            type: fieldType,
            required: false,
            default: fieldValue,
            order: fieldIndex,
          });
        }
      );

      sections.push({
        name: sectionName,
        label:
          sectionName.charAt(0).toUpperCase() +
          sectionName.slice(1).replace(/([A-Z])/g, " $1"),
        fields,
        order: sectionIndex,
      });
    }
  );

  // Create status options from current status
  const statusOptions: PatientStatusOption[] = [];
  if (patientData.status) {
    statusOptions.push({
      name: patientData.status.name,
      label: patientData.status.label || "Unknown",
      color: patientData.status.color || "#4CAF50", // Default color
      isDefault: true,
    });
  }

  // Return template from patient data
  return {
    id: patientData.id || "",
    name: "Patient Template",
    sections,
    statusOptions,
    isPrivate: false,
    isDefault: false,
    createdBy: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
