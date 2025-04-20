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

export interface IVisit {
  _id: string;
  date: Date;
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

// Type for updating status
export interface IStatusUpdate {
  name: string;
  label: string;
  date?: Date;
  notes?: string;
  color?: string;
}

// Define Patient interface with instance methods
export interface IPatient {
  templateId: string;
  sectionData: Map<string, any>;
  status: IStatus;
  statusHistory: IStatusHistory[];
  isActive: boolean;
  visits: IVisit[];
  createdBy: string;
  lastUpdatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];

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
  addTag(tag: string): Promise<IPatient>;
  removeTag(tag: string): Promise<IPatient>;
}
