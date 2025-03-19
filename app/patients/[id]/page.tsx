"use client";

import Loading from "@/app/_components/Loading";
import CriticalConditionsComponent from "@/app/_components/patinetInfo/CriticalConditions";
import DiagnosisAndTreatmentTab from "@/app/_components/patinetInfo/DiagnosisAndTreatmentTab";
import ImagingResultsTab from "@/app/_components/patinetInfo/ImagingResultsTab";
import LaboratoryResultsTab from "@/app/_components/patinetInfo/LaboratoryResultsTab";
import MedicalConditions from "@/app/_components/patinetInfo/MedicalConditions";
import OverviewTab from "@/app/_components/patinetInfo/OverviewTab";
import { PatientDashboardTabs } from "@/app/_components/patinetInfo/PatientDashboardTabs";
import PatientNotFound from "@/app/_components/patinetInfo/PatientNotFound";
import VitalSigns from "@/app/_components/patinetInfo/VitalSigns";
import { Patient } from "@/app/_types/Patient";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { ArrowLeftIcon, CalendarIcon, ClipboardEditIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PatientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Simulate API call to fetch patient data
    setIsLoading(true);
    setTimeout(() => {
      // This would typically come from an API
      const patientData: Patient = {
        id,
        personalInfo: {
          bloodType: "A+",
          patientName: "Abdo",
          age: "20",
          gender: "Male",
          address: "Mean ABC Street, City",
          phone: "123456789",
          date: new Date(),
          companion: "Ahmed",
          companionPhone: "987654321",
          isSmoker: true,
          smokingDetails: "10 cigarettes per day for 5 years",
        },
        medicalConditions: {
          htn: true,
          dm: true,
          ihd: false,
          hf: false,
          arrhythmia: false,
          liver: false,
          kidney: false,
          chest: true,
          thyroid: false,
          cns: false,
          cancer: false,
          surgery: false,
        },
        medicalNotes: {
          htnNotes: "Hypertension diagnosed 2 years ago, on medication.",
          dmNotes: "Type 2 Diabetes, controlled with oral medication.",
          ihdNotes: "No history of ischemic heart disease.",
          hfNotes: "No history of heart failure.",
          arrhythmiaNotes: "No known arrhythmia.",
          liverNotes: "No known liver disease.",
          kidneyNotes: "No known kidney issues.",
          chestNotes: "History of chronic bronchitis due to smoking.",
          thyroidNotes: "No thyroid dysfunction.",
          cnsNotes: "No neurological disorders.",
          cancerNotes: "No history of cancer.",
          surgeryNotes: "No past surgical history.",
          others: "No other significant medical conditions.",
          complaints: "Cough and shortness of breath for 1 week.",
        },
        vitalSigns: {
          rbs: "150 mg/dL",
          o2Sat: "94%",
          hr: "80 bpm",
          bp: "130/85 mmHg",
          temp: "37.2°C",
          gcs: "15/15",
          rr: "18 breaths per minute",
          uop: "Normal",
          intake: "2L/day",
          balance: "Positive by 200mL",
          cvp: "8 mmHg",
          ivc: "Normal",
          diuretic: "Not on diuretics",
          examination: "Bilateral wheezing on auscultation.",
        },
        labResults: {
          tlc: "7.5 x10^9/L",
          hb: "14.2 g/dL",
          plt: "250 x10^9/L",
          crp: "5 mg/L",
          urea: "30 mg/dL",
          creat: "0.9 mg/dL",
          na: "140 mmol/L",
          k: "4.2 mmol/L",
          ca: "9.5 mg/dL",
          alt: "25 U/L",
          ast: "22 U/L",
          alb: "4.3 g/dL",
          ck: "Normal",
          ckmb: "Normal",
          trop: "Negative",
          ph: "7.4",
          co2: "40 mmHg",
          hco3: "24 mmol/L",
          lactate: "1.2 mmol/L",
          o2sat: "94%",
          pt: "12 sec",
          ptt: "30 sec",
          inr: "1.0",
        },
        imagingResults: {
          ctBrain: "Normal",
          ctChest: "Mild bronchial wall thickening",
          cxr: "Hyperinflation, no infiltrates",
          us: "No abnormalities detected",
          dupplex: "No evidence of DVT",
          ecg: "Normal sinus rhythm",
          echo: "Normal cardiac function",
          mpi: "Not performed",
          ctAngio: "Not indicated",
          others: "No additional imaging required",
        },
        diagnosisAndTreatment: {
          diagnosis: "Acute Exacerbation of Chronic Bronchitis",
          differentialDiagnosis: "Pneumonia, Asthma Exacerbation",
          treatmentApproach:
            "Supportive care, inhalers, and lifestyle modification",
          currentMedications: "Metformin, Lisinopril, Salbutamol inhaler",
          ivFluids: "Maintenance fluids as needed",
          antibiotics: "Amoxicillin-Clavulanate 875/125 mg BID",
          oxygenTherapy: "Nasal cannula if O₂ saturation drops below 92%",
          treatmentPlans: [
            {
              plan: "Inhaled corticosteroids, nasal steroid inhalers",
              planNumber: 1,
              reminder: new Date(),
            },
          ],
          // followUpPlan: "Re-evaluate in 1 week, smoking cessation counseling",
          notes: "Encourage smoking cessation and pulmonary rehabilitation",
          problemList: "Cough, shortness of breath, chest pain",
          solutionList: "Inhaled corticosteroids, nasal steroid inhalers",
          infusions: "None",
          sedations: "None",
        },
      };

      setPatient(patientData);
      setIsLoading(false);
    }, 500); // Added a short delay to simulate API call
  }, [id]);

  const handleEdit = () => {
    router.push(`/patients/edit-patient/${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  const handleAddEvent = () => {
    router.push(`/patients/add-event/${id}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!patient) {
    return <PatientNotFound />;
  }

  // Get critical medical conditions
  const criticalConditions = [];
  if (patient.medicalConditions.htn) criticalConditions.push("Hypertension");
  if (patient.medicalConditions.dm) criticalConditions.push("Diabetes");
  if (patient.medicalConditions.ihd)
    criticalConditions.push("Ischemic Heart Disease");
  if (patient.medicalConditions.hf) criticalConditions.push("Heart Failure");
  if (patient.medicalConditions.chest)
    criticalConditions.push("Chest Condition");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-6 max-w-6xl"
    >
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-blue-100 dark:border-blue-900 shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <div>
              <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                {patient.personalInfo.patientName}
              </CardTitle>
              <CardDescription className="text-blue-600 dark:text-blue-400">
                Patient ID: {patient.id} | {patient.personalInfo.age} years |{" "}
                {patient.personalInfo.gender} | Blood Type:{" "}
                {patient.personalInfo.bloodType}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              <span>Go Back</span>
            </Button>
          </div>

          {/* Critical Information Alert - Always visible */}
          {criticalConditions.length > 0 && (
            <CriticalConditionsComponent
              criticalConditions={criticalConditions}
              isSmoker={patient.personalInfo.isSmoker}
              smokingDetails={patient.personalInfo.smokingDetails}
            />
          )}

          {/* Tabs Navigation */}
          <Tabs
            defaultValue="overview"
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <PatientDashboardTabs />

            {/* Tab Contents */}
            <CardContent className="pt-6">
              {/* Overview Tab */}
              <OverviewTab
                personalInfo={patient.personalInfo}
                diagnosis={patient.diagnosisAndTreatment.diagnosis}
                complaints={patient.medicalNotes.complaints}
                id={patient?.id || "N/A"}
              />
              {/* Vital Signs Tab */}
              <VitalSigns vitalSigns={patient.vitalSigns} />

              {/* Medical Conditions Tab */}
              <MedicalConditions
                medicalConditions={patient.medicalConditions}
                medicalNotes={patient.medicalNotes}
              />
              {/* Laboratory Results Tab */}
              <LaboratoryResultsTab labResults={patient.labResults} />

              {/* Imaging Results Tab */}
              <ImagingResultsTab imagingResults={patient.imagingResults} />

              {/* Diagnosis and Treatment Tab */}
              <DiagnosisAndTreatmentTab
                diagnosisAndTreatment={patient.diagnosisAndTreatment}
              />
            </CardContent>
          </Tabs>
        </CardHeader>

        <CardFooter className="flex justify-between gap-4 pt-6 flex-wrap">
          <Button
            onClick={handleEdit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ClipboardEditIcon className="mr-2 h-4 w-4" />
            Edit Patient Information
          </Button>
          <Button
            onClick={handleAddEvent}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Add New Event
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
