// Define template interface based on your model
export interface Field {
  _id?: string;
  id?: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  default?: any;
  description?: string;
  order: number;
}

export interface Section {
  _id?: string;
  id?: string;
  name: string;
  label: string;
  description?: string;
  fields: Field[];
  order: number;
}

// This interface is kept for backward compatibility
// It's now managed globally instead of per template
export interface PatientStatusOption {
  _id?: string;
  id?: string;
  name: string;
  label: string;
  color: string;
  description?: string;
  isDefault: boolean;
}

// User type for template creator
export interface TemplateCreator {
  id?: string;
  _id?: string;
  name: string;
  email?: string;
}

export interface PatientTemplate {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  sections: Section[];
  isPrivate: boolean;
  isDefault: boolean;
  createdBy: string | TemplateCreator;
  lastUpdatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Field type options
export const fieldTypes = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "boolean", label: "Boolean" },
  { value: "select", label: "Select" },
  { value: "textarea", label: "Text Area" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
];
