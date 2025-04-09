export type PersonalInfo = {
  dateOfBirth: Date | undefined;
  patientName: string;
  gender: string;
  address: string;
  phone: string;
  date: Date | undefined;
  companion: string;
  companionPhone: string;
  isSmoker: boolean;
  smokingDetails: string;
  bloodType: string;
};

export type MedicalConditions = {
  htn: boolean;
  dm: boolean;
  ihd: boolean;
  hf: boolean;
  arrhythmia: boolean;
  liver: boolean;
  kidney: boolean;
  chest: boolean;
  thyroid: boolean;
  cns: boolean;
  cancer: boolean;
  surgery: boolean;
};

export type MedicalNotes = {
  htnNotes: string;
  dmNotes: string;
  ihdNotes: string;
  hfNotes: string;
  arrhythmiaNotes: string;
  liverNotes: string;
  kidneyNotes: string;
  chestNotes: string;
  thyroidNotes: string;
  cnsNotes: string;
  cancerNotes: string;
  surgeryNotes: string;
  others: string;
  complaints: string;
};

export type VitalSigns = {
  rbs: string;
  o2Sat: string;
  hr: string;
  bp: string;
  temp: string;
  gcs: string;
  rr: string;
  uop: string;
  intake: string;
  balance: string;
  cvp: string;
  ivc: string;
  diuretic: string;
  examination: string;
};

export type labResults = {
  // CBC
  tlc: string;
  hb: string;
  plt: string;
  crp: string;

  // Chemistry
  urea: string;
  creat: string;
  na: string;
  k: string;
  ca: string;
  alt: string;
  ast: string;
  alb: string;

  // Cardiac enzymes
  ck: string;
  ckmb: string;
  trop: string;

  // ABG
  ph: string;
  co2: string;
  hco3: string;
  lactate: string;
  o2sat: string;

  // Coagulation
  pt: string;
  ptt: string;
  inr: string;
};

export type ImagingResults = {
  ctBrain: string;
  ctChest: string;
  cxr: string;
  us: string;
  dupplex: string;
  ecg: string;
  echo: string;
  mpi: string;
  ctAngio: string;
  others: string;
};

export type TreatmentPlan = {
  planNumber: number;
  plan: string;
  reminder: Date | undefined;
};

export type DiagnosisAndTreatment = {
  diagnosis: string;
  differentialDiagnosis: string;
  treatmentApproach: string;
  currentMedications: string;
  ivFluids: string;
  antibiotics: string;
  oxygenTherapy: string;
  treatmentPlans: TreatmentPlan[];
  notes: string;
  problemList: string;
  solutionList: string;
  infusions: string;
  sedations: string;
};

export type Patient = {
  id?: string;
  personalInfo: PersonalInfo;
  medicalConditions: MedicalConditions;
  medicalNotes: MedicalNotes;
  vitalSigns: VitalSigns;
  labResults: labResults;
  imagingResults: ImagingResults;
  diagnosisAndTreatment: DiagnosisAndTreatment;
};
