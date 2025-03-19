"use client";

import {
  DiagnosisAndTreatment,
  ImagingResults,
  labResults,
  MedicalConditions,
  MedicalNotes,
  Patient,
  PersonalInfo,
  TreatmentPlan,
  VitalSigns,
} from "@/app/_types/Patient";
import React, { createContext, useContext, useReducer } from "react";

// Initial state organized by sections
const initialState: Patient = {
  // Personal information
  personalInfo: {
    patientName: "",
    age: "",
    gender: "",
    address: "",
    phone: "",
    date: new Date(),
    companion: "",
    companionPhone: "",
    isSmoker: false,
    smokingDetails: "",
    bloodType: "",
  },

  // Medical conditions (boolean flags)
  medicalConditions: {
    htn: false,
    dm: false,
    ihd: false,
    hf: false,
    arrhythmia: false,
    liver: false,
    kidney: false,
    chest: false,
    thyroid: false,
    cns: false,
    cancer: false,
    surgery: false,
  },

  // Medical conditions notes
  medicalNotes: {
    htnNotes: "",
    dmNotes: "",
    ihdNotes: "",
    hfNotes: "",
    arrhythmiaNotes: "",
    liverNotes: "",
    kidneyNotes: "",
    chestNotes: "",
    thyroidNotes: "",
    cnsNotes: "",
    cancerNotes: "",
    surgeryNotes: "",
    others: "",
    complaints: "",
  },

  // Vital signs
  vitalSigns: {
    rbs: "",
    o2Sat: "",
    hr: "",
    bp: "",
    temp: "",
    gcs: "",
    rr: "",
    uop: "",
    intake: "",
    balance: "",
    cvp: "",
    ivc: "",
    diuretic: "",
    examination: "",
  },

  // Lab results
  labResults: {
    // CBC
    tlc: "",
    hb: "",
    plt: "",
    crp: "",

    // Chemistry
    urea: "",
    creat: "",
    na: "",
    k: "",
    ca: "",
    alt: "",
    ast: "",
    alb: "",

    // Cardiac enzymes
    ck: "",
    ckmb: "",
    trop: "",

    // ABG
    ph: "",
    co2: "",
    hco3: "",
    lactate: "",
    o2sat: "",

    // Coagulation
    pt: "",
    ptt: "",
    inr: "",
  },

  // Imaging results
  imagingResults: {
    ctBrain: "",
    ctChest: "",
    cxr: "",
    us: "",
    dupplex: "",
    ecg: "",
    echo: "",
    mpi: "",
    ctAngio: "",
    others: "",
  },

  // Diagnosis and treatment
  diagnosisAndTreatment: {
    diagnosis: "",
    differentialDiagnosis: "",
    treatmentApproach: "",
    currentMedications: "",
    ivFluids: "",
    antibiotics: "",
    oxygenTherapy: "",
    treatmentPlans: [],
    notes: "",
    problemList: "",
    solutionList: "",
    infusions: "",
    sedations: "",
  },
};

// Action types
const UPDATE_PERSONAL_INFO = "UPDATE_PERSONAL_INFO";
const UPDATE_MEDICAL_CONDITION = "UPDATE_MEDICAL_CONDITION";
const UPDATE_MEDICAL_NOTE = "UPDATE_MEDICAL_NOTE";
const UPDATE_VITAL_SIGN = "UPDATE_VITAL_SIGN";
const UPDATE_LAB_RESULT = "UPDATE_LAB_RESULT";
const UPDATE_IMAGING_RESULT = "UPDATE_IMAGING_RESULT";
const UPDATE_DIAGNOSIS_TREATMENT = "UPDATE_DIAGNOSIS_TREATMENT";
const INITIALIZE_PATIENT_DATA = "INITIALIZE_PATIENT_DATA";

// Define action types with TypeScript
type PatientAction =
  | {
      type: typeof UPDATE_PERSONAL_INFO;
      field: keyof PersonalInfo;
      value: string | boolean | Date | undefined;
    }
  | {
      type: typeof UPDATE_MEDICAL_CONDITION;
      field: keyof MedicalConditions;
      value: boolean;
    }
  | {
      type: typeof UPDATE_MEDICAL_NOTE;
      field: keyof MedicalNotes;
      value: string;
    }
  | { type: typeof UPDATE_VITAL_SIGN; field: keyof VitalSigns; value: string }
  | { type: typeof UPDATE_LAB_RESULT; field: keyof labResults; value: string }
  | {
      type: typeof UPDATE_IMAGING_RESULT;
      field: keyof ImagingResults;
      value: string;
    }
  | {
      type: typeof UPDATE_DIAGNOSIS_TREATMENT;
      field: keyof DiagnosisAndTreatment;
      value: string | TreatmentPlan[];
    }
  | { type: typeof INITIALIZE_PATIENT_DATA; patientData: Patient };

// Reducer function
function patientReducer(state: Patient, action: PatientAction): Patient {
  switch (action.type) {
    case UPDATE_PERSONAL_INFO:
      return {
        ...state,
        personalInfo: {
          ...state.personalInfo,
          [action.field]: action.value,
        },
      };

    case UPDATE_MEDICAL_CONDITION:
      return {
        ...state,
        medicalConditions: {
          ...state.medicalConditions,
          [action.field]: action.value,
        },
      };

    case UPDATE_MEDICAL_NOTE:
      return {
        ...state,
        medicalNotes: {
          ...state.medicalNotes,
          [action.field]: action.value,
        },
      };

    case UPDATE_VITAL_SIGN:
      return {
        ...state,
        vitalSigns: {
          ...state.vitalSigns,
          [action.field]: action.value,
        },
      };

    case UPDATE_LAB_RESULT:
      return {
        ...state,
        labResults: {
          ...state.labResults,
          [action.field]: action.value,
        },
      };

    case UPDATE_IMAGING_RESULT:
      return {
        ...state,
        imagingResults: {
          ...state.imagingResults,
          [action.field]: action.value,
        },
      };

    case UPDATE_DIAGNOSIS_TREATMENT:
      return {
        ...state,
        diagnosisAndTreatment: {
          ...state.diagnosisAndTreatment,
          [action.field]: action.value,
        },
      };

    case INITIALIZE_PATIENT_DATA:
      return {
        ...action.patientData,
      };

    default:
      return state;
  }
}

// Create context
interface PatientContextType {
  state: Patient;
  dispatch: React.Dispatch<PatientAction>;
}

const PatientContext = createContext<PatientContextType>(
  {} as PatientContextType
);

// Provider component
export const PatientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(patientReducer, initialState);

  return (
    <PatientContext.Provider value={{ state, dispatch }}>
      {children}
    </PatientContext.Provider>
  );
};

// Custom hooks for each section
export const usePersonalInfo = () => {
  const { state, dispatch } = useContext(PatientContext);

  const updatePersonalInfo = (
    field: keyof PersonalInfo,
    value: string | boolean | Date | undefined
  ) => {
    dispatch({
      type: UPDATE_PERSONAL_INFO,
      field,
      value,
    });
  };

  return {
    personalInfo: state.personalInfo,
    updatePersonalInfo,
  };
};

export const useMedicalConditions = () => {
  const { state, dispatch } = useContext(PatientContext);

  const updateMedicalCondition = (
    field: keyof MedicalConditions,
    value: boolean
  ) => {
    dispatch({
      type: UPDATE_MEDICAL_CONDITION,
      field,
      value,
    });
  };

  return {
    medicalConditions: state.medicalConditions,
    updateMedicalCondition,
  };
};

export const useMedicalNotes = () => {
  const { state, dispatch } = useContext(PatientContext);

  const updateMedicalNote = (field: keyof MedicalNotes, value: string) => {
    dispatch({
      type: UPDATE_MEDICAL_NOTE,
      field,
      value,
    });
  };

  return {
    medicalNotes: state.medicalNotes,
    updateMedicalNote,
  };
};

export const useVitalSigns = () => {
  const { state, dispatch } = useContext(PatientContext);

  const updateVitalSign = (field: keyof VitalSigns, value: string) => {
    dispatch({
      type: UPDATE_VITAL_SIGN,
      field,
      value,
    });
  };

  return {
    vitalSigns: state.vitalSigns,
    updateVitalSign,
  };
};

export const useLabResults = () => {
  const { state, dispatch } = useContext(PatientContext);

  const updateLabResult = (field: keyof labResults, value: string) => {
    dispatch({
      type: UPDATE_LAB_RESULT,
      field,
      value,
    });
  };

  return {
    labResults: state.labResults,
    updateLabResult,
  };
};

export const useImagingResults = () => {
  const { state, dispatch } = useContext(PatientContext);

  const updateImagingResult = (field: keyof ImagingResults, value: string) => {
    dispatch({
      type: UPDATE_IMAGING_RESULT,
      field,
      value,
    });
  };

  return {
    imagingResults: state.imagingResults,
    updateImagingResult,
  };
};

export const useDiagnosisTreatment = () => {
  const { state, dispatch } = useContext(PatientContext);

  const updateDiagnosisTreatment = (
    field: keyof DiagnosisAndTreatment,
    value: string | TreatmentPlan[]
  ) => {
    dispatch({
      type: UPDATE_DIAGNOSIS_TREATMENT,
      field,
      value,
    });
  };

  return {
    diagnosisAndTreatment: state.diagnosisAndTreatment,
    updateDiagnosisTreatment,
  };
};

// General hook to access the entire state and add initialization
export const usePatientData = () => {
  const { state, dispatch } = useContext(PatientContext);

  // Add function to initialize patient data for editing
  const initializePatientData = (patientData: Patient) => {
    dispatch({
      type: INITIALIZE_PATIENT_DATA,
      patientData,
    });
  };

  return {
    ...state,
    initializePatientData,
  };
};
