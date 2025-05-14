export interface IStatusHistory {
  name: string;
  label: string;
  date: Date;
  notes?: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStatus {
  name: string;
  label: string;
  date: Date;
  notes?: string;
  color?: string;
}

export interface IPatientStatusOption {
  name: string;
  label: string;
  color: string;
  description?: string;
  isDefault: boolean;
  order: number;
}

// Personal info interface
export interface IPersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  gender?: "male" | "female";
  contactNumber?: string;
  email?: string;
  address?: string;
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
  medicalRecordNumber?: string;
  insuranceInfo?: {
    provider?: string;
    policyNumber?: string;
    groupNumber?: string;
  };
}

export interface IVisit {
  _id: string;
  date: string;
  title?: string;
  notes?: string;
  sectionData: Map<string, any>;
  createdBy: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Type for adding a new visit
export interface IVisitInput {
  date?: Date;
  title?: string;
  notes?: string;
  sectionData?: Record<string, any> | Map<string, any>;
  createdBy: string;
}

// Event interface
export interface IEvent {
  _id: string;
  date: Date;
  title: string;
  eventType:
    | "medication"
    | "procedure"
    | "lab_result"
    | "diagnosis"
    | "referral"
    | "appointment"
    | "other";
  importance: "low" | "medium" | "high" | "critical";
  sectionData: Map<string, any>;
  createdBy: string;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Type for adding a new event
export interface IEventInput {
  date?: Date;
  title: string;
  eventType?:
    | "medication"
    | "procedure"
    | "lab_result"
    | "diagnosis"
    | "referral"
    | "appointment"
    | "other";
  importance?: "low" | "medium" | "high" | "critical";
  sectionData?: Record<string, any> | Map<string, any>;
  createdBy: string;
}

// Type for updating status
export interface IStatusUpdate {
  name: string;
  label: string;
  date?: Date;
  notes?: string;
  color?: string;
}

// Create or update the IPatient interface to include notes
export interface INote {
  _id?: string;
  id?: string;
  name: string;
  content: string;
  category?: "general" | "clinical" | "administrative" | "follow_up" | "other";
  priority?: "low" | "medium" | "high";
  isPinned?: boolean;
  attachments?: Array<{
    name?: string;
    url: string;
    type?: string;
  }>;
  createdBy?: any;
  updatedBy?: any;
  deletedAt?: Date;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define Patient interface with instance methods
export interface IPatient {
  id: string;
  templateId?: any;
  adminId?: string;
  personalInfo: IPersonalInfo;
  sectionData?: Record<string, any>;
  status: IStatus;
  statusHistory?: IStatusHistory[];
  statusOptions?: IPatientStatusOption[];
  isActive: boolean;
  visits?: IVisit[];
  events?: IEvent[];
  notes?: INote[];
  createdBy?: any;
  lastUpdatedBy?: any;
  createdAt: string | Date;
  updatedAt: string | Date;
  tags?: string[];

  // Instance methods
  addVisit(visitData: IVisitInput): Promise<IPatient>;
  getActiveVisits(): IVisit[];
  updatePatientStatus(
    statusData: IStatusUpdate,
    updatedBy: string
  ): Promise<IPatient>;
  getStatusHistory(): IStatusHistory[];
  searchVisits(query: string): IVisit[];
  softDeleteVisit(visitId: string): Promise<IPatient>;
  restoreVisit(visitId: string): Promise<IPatient>;

  // New event methods
  addEvent(eventData: IEventInput): Promise<IPatient>;
  getActiveEvents(): IEvent[];
  searchEvents(query: string): IEvent[];
  softDeleteEvent(eventId: string): Promise<IPatient>;
  restoreEvent(eventId: string): Promise<IPatient>;

  // Personal info methods
  updatePersonalInfo(personalInfo: Partial<IPersonalInfo>): Promise<IPatient>;

  // Status option methods
  addStatusOption(statusOption: IPatientStatusOption): Promise<IPatient>;
  removeStatusOption(statusName: string): Promise<IPatient>;
  getDefaultStatusOption(): IPatientStatusOption | null;

  // Tag methods
  addTag(tag: string): Promise<IPatient>;
  removeTag(tag: string): Promise<IPatient>;
}
