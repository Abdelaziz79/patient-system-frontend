"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import {
  Activity,
  CalendarIcon,
  ClipboardList,
  FileText,
  Heart,
  ImageIcon,
  ListChecks,
  Pill,
  User,
  UserPlus,
  FilePlus,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define patient interface
interface PatientDetailData {
  personalInfo: {
    patientName: string;
    age: string;
    gender: string;
    address: string;
    phone: string;
    date: string;
    companion: string;
    companionPhone: string;
    isSmoker: boolean;
    smokingDetails: string;
  };
  medicalConditions: {
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
  medicalNotes: {
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
  vitalSigns: {
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
  labResults: Record<string, string>;
  imagingResults: {
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
  diagnosisAndTreatment: {
    diagnosis: string;
    differentialDiagnosis: string;
    treatmentApproach: string;
    currentMedications: string;
    ivFluids: string;
    antibiotics: string;
    oxygenTherapy: string;
    treatmentPlan: string;
    followUpPlan: string;
    notes: string;
  };
}

export default function PatientDetailPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [patientData, setPatientData] = useState<PatientDetailData | null>(
    null
  );

  useEffect(() => {
    // Simulate API call to fetch patient data
    setIsLoading(true);
    setTimeout(() => {
      // Mock data - in a real application, you would fetch this from your API
      const mockPatientData: PatientDetailData = {
        personalInfo: {
          patientName: "Abdo",
          age: "20",
          gender: "Male",
          address: "Mean ABC",
          phone: "123456789",
          date: "2025-03-10",
          companion: "Ahmed",
          companionPhone: "987654321",
          isSmoker: true,
          smokingDetails: "30 years of smoking",
        },
        medicalConditions: {
          htn: true,
          dm: true,
          ihd: true,
          hf: true,
          arrhythmia: true,
          liver: true,
          kidney: true,
          chest: true,
          thyroid: true,
          cns: true,
          cancer: true,
          surgery: true,
        },
        medicalNotes: {
          htnNotes: "Hypertension notes",
          dmNotes: "Diabetes mellitus notes",
          ihdNotes: "Ischemic heart disease notes",
          hfNotes: "Heart failure notes",
          arrhythmiaNotes: "Arrhythmia notes",
          liverNotes: "Liver condition notes",
          kidneyNotes: "Kidney condition notes",
          chestNotes: "Chest condition notes",
          thyroidNotes: "Thyroid condition notes",
          cnsNotes: "CNS condition notes",
          cancerNotes: "Cancer notes",
          surgeryNotes: "Previous surgeries",
          others: "Other medical conditions",
          complaints: "Patient complaints",
        },
        vitalSigns: {
          rbs: "120 mg/dL",
          o2Sat: "98%",
          hr: "75 bpm",
          bp: "130/80 mmHg",
          temp: "37.0°C",
          gcs: "15",
          rr: "16/min",
          uop: "1200 mL/day",
          intake: "2000 mL/day",
          balance: "+800 mL",
          cvp: "8 cmH2O",
          ivc: "Normal",
          diuretic: "Lasix 40mg",
          examination: "Normal physical examination",
        },
        labResults: {
          tlc: "8.5 x10³/µL",
          hb: "14.5 g/dL",
          plt: "250 x10³/µL",
          crp: "3 mg/L",
          urea: "25 mg/dL",
          creat: "0.9 mg/dL",
          na: "138 mEq/L",
          k: "4.2 mEq/L",
          ca: "9.5 mg/dL",
          alt: "35 U/L",
          ast: "32 U/L",
          alb: "4.2 g/dL",
          ck: "150 U/L",
          ckmb: "3 ng/mL",
          trop: "0.01 ng/mL",
          ph: "7.38",
          co2: "40 mmHg",
          hco3: "24 mEq/L",
          lactate: "1.2 mmol/L",
          o2sat: "98%",
          pt: "12 sec",
          ptt: "30 sec",
          inr: "1.0",
        },
        imagingResults: {
          ctBrain: "Normal CT Brain findings",
          ctChest: "Normal CT Chest findings",
          cxr: "Clear lung fields",
          us: "Normal abdominal ultrasound",
          dupplex: "Normal vascular duplex",
          ecg: "Normal sinus rhythm",
          echo: "EF 60%, no wall motion abnormalities",
          mpi: "Normal perfusion",
          ctAngio: "No significant stenosis",
          others: "No other imaging studies",
        },
        diagnosisAndTreatment: {
          diagnosis: "Essential Hypertension, Type 2 Diabetes Mellitus",
          differentialDiagnosis: "Secondary Hypertension, Metabolic Syndrome",
          treatmentApproach: "Medical management, lifestyle modifications",
          currentMedications: "Metformin 1000mg BID, Lisinopril 20mg daily",
          ivFluids: "NS 1L over 8 hours",
          antibiotics: "None",
          oxygenTherapy: "None",
          treatmentPlan: "Continue current medications, follow-up in 2 weeks",
          followUpPlan: "Cardiology follow-up, HbA1c monitoring",
          notes: "Patient education provided regarding diet and exercise",
        },
      };

      setPatientData(mockPatientData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleBackToPatients = () => {
    router.push("/patients");
  };

  // Render a medical condition list with checkmarks
  const renderConditionsList = () => {
    if (!patientData) return null;

    const conditions = [
      {
        key: "htn",
        label: "Hypertension",
        note: patientData.medicalNotes.htnNotes,
      },
      {
        key: "dm",
        label: "Diabetes Mellitus",
        note: patientData.medicalNotes.dmNotes,
      },
      {
        key: "ihd",
        label: "Ischemic Heart Disease",
        note: patientData.medicalNotes.ihdNotes,
      },
      {
        key: "hf",
        label: "Heart Failure",
        note: patientData.medicalNotes.hfNotes,
      },
      {
        key: "arrhythmia",
        label: "Arrhythmia",
        note: patientData.medicalNotes.arrhythmiaNotes,
      },
      {
        key: "liver",
        label: "Liver Disease",
        note: patientData.medicalNotes.liverNotes,
      },
      {
        key: "kidney",
        label: "Kidney Disease",
        note: patientData.medicalNotes.kidneyNotes,
      },
      {
        key: "chest",
        label: "Respiratory Disease",
        note: patientData.medicalNotes.chestNotes,
      },
      {
        key: "thyroid",
        label: "Thyroid Disease",
        note: patientData.medicalNotes.thyroidNotes,
      },
      {
        key: "cns",
        label: "Neurological Disease",
        note: patientData.medicalNotes.cnsNotes,
      },
      {
        key: "cancer",
        label: "Cancer",
        note: patientData.medicalNotes.cancerNotes,
      },
      {
        key: "surgery",
        label: "Previous Surgery",
        note: patientData.medicalNotes.surgeryNotes,
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conditions.map((condition) => (
          <div
            key={condition.key}
            className="flex items-start p-3 border rounded-md bg-gray-50"
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                patientData.medicalConditions[
                  condition.key as keyof typeof patientData.medicalConditions
                ]
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {patientData.medicalConditions[
                condition.key as keyof typeof patientData.medicalConditions
              ] && "✓"}
            </div>
            <div className="flex-1">
              <div className="font-medium">{condition.label}</div>
              {condition.note && (
                <div className="text-sm text-gray-600 mt-1">
                  {condition.note}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderVitalSigns = () => {
    if (!patientData) return null;

    const criticalVitals = [
      { key: "bp", label: "Blood Pressure", value: patientData.vitalSigns.bp },
      { key: "hr", label: "Heart Rate", value: patientData.vitalSigns.hr },
      {
        key: "rr",
        label: "Respiratory Rate",
        value: patientData.vitalSigns.rr,
      },
      { key: "temp", label: "Temperature", value: patientData.vitalSigns.temp },
      {
        key: "o2Sat",
        label: "O₂ Saturation",
        value: patientData.vitalSigns.o2Sat,
      },
      { key: "rbs", label: "Blood Sugar", value: patientData.vitalSigns.rbs },
      { key: "gcs", label: "GCS", value: patientData.vitalSigns.gcs },
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {criticalVitals.map((vital) => (
          <div key={vital.key} className="p-4 border rounded-md bg-blue-50">
            <div className="text-sm text-blue-700 font-medium">
              {vital.label}
            </div>
            <div className="text-xl font-semibold mt-1">{vital.value}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderKeyLabResults = () => {
    if (!patientData) return null;

    const keyLabs = [
      { key: "hb", label: "Hemoglobin", value: patientData.labResults.hb },
      { key: "tlc", label: "WBC Count", value: patientData.labResults.tlc },
      { key: "plt", label: "Platelets", value: patientData.labResults.plt },
      {
        key: "creat",
        label: "Creatinine",
        value: patientData.labResults.creat,
      },
      { key: "na", label: "Sodium", value: patientData.labResults.na },
      { key: "k", label: "Potassium", value: patientData.labResults.k },
      { key: "alt", label: "ALT", value: patientData.labResults.alt },
      { key: "crp", label: "CRP", value: patientData.labResults.crp },
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {keyLabs.map((lab) => (
          <div key={lab.key} className="p-3 border rounded-md">
            <div className="text-sm text-gray-600">{lab.label}</div>
            <div className="text-lg font-medium mt-1">{lab.value}</div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Patient Not Found</h2>
          <p className="text-gray-600 mb-4">
            The requested patient data could not be loaded.
          </p>
          <Button onClick={handleBackToPatients}>
            Return to Patients List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="outline"
          onClick={handleBackToPatients}
          className="mb-4 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patients
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Patient Header Card */}
          <Card className="mb-6 border-blue-200 shadow-md">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <CardTitle className="text-2xl font-bold text-blue-800">
                    {patientData.personalInfo.patientName}
                  </CardTitle>
                  <CardDescription className="text-blue-600 mt-1">
                    {patientData.personalInfo.age} years •{" "}
                    {patientData.personalInfo.gender} • Patient ID: P-
                    {Math.floor(10000 + Math.random() * 90000)}
                  </CardDescription>
                </div>
                <div className="mt-3 md:mt-0 flex items-center space-x-3">
                  <div className="text-sm text-gray-600">
                    <CalendarIcon className="inline-block h-4 w-4 mr-1" />
                    Visit:{" "}
                    {new Date(
                      patientData.personalInfo.date
                    ).toLocaleDateString()}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300"
                  >
                    <FilePlus className="mr-2 h-4 w-4" />
                    New Visit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-800 flex items-center">
                    <User className="mr-2 h-4 w-4 text-blue-500" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600">Address:</div>
                    <div>{patientData.personalInfo.address}</div>
                    <div className="text-gray-600">Phone:</div>
                    <div>{patientData.personalInfo.phone}</div>
                    <div className="text-gray-600">Smoking:</div>
                    <div>
                      {patientData.personalInfo.isSmoker ? "Yes" : "No"}
                    </div>
                    {patientData.personalInfo.isSmoker && (
                      <>
                        <div className="text-gray-600">Smoking Details:</div>
                        <div>{patientData.personalInfo.smokingDetails}</div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-gray-800 flex items-center">
                    <UserPlus className="mr-2 h-4 w-4 text-blue-500" />
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600">Name:</div>
                    <div>{patientData.personalInfo.companion}</div>
                    <div className="text-gray-600">Phone:</div>
                    <div>{patientData.personalInfo.companionPhone}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-gray-800 flex items-center">
                    <ListChecks className="mr-2 h-4 w-4 text-blue-500" />
                    Primary Diagnosis
                  </h3>
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-100 text-blue-800">
                    {patientData.diagnosisAndTreatment.diagnosis}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for different sections */}
          <Tabs defaultValue="vitals" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
              <TabsTrigger
                value="vitals"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
              >
                <Activity className="mr-2 h-4 w-4" />
                Vitals
              </TabsTrigger>
              <TabsTrigger
                value="conditions"
                className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
              >
                <Heart className="mr-2 h-4 w-4" />
                Conditions
              </TabsTrigger>
              <TabsTrigger
                value="labs"
                className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800"
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                Lab Results
              </TabsTrigger>
              <TabsTrigger
                value="imaging"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Imaging
              </TabsTrigger>
              <TabsTrigger
                value="treatment"
                className="data-[state=active]:bg-red-100 data-[state=active]:text-red-800"
              >
                <Pill className="mr-2 h-4 w-4" />
                Treatment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vitals">
              <Card>
                <CardHeader className="bg-blue-50">
                  <CardTitle className="text-xl text-blue-800">
                    Vital Signs & Examination
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {renderVitalSigns()}

                  <div className="mt-6 border-t pt-4">
                    <h3 className="font-medium text-gray-800 mb-3">
                      Fluid Status
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 border rounded-md">
                        <div className="text-sm text-gray-600">Intake</div>
                        <div className="font-medium">
                          {patientData.vitalSigns.intake}
                        </div>
                      </div>
                      <div className="p-3 border rounded-md">
                        <div className="text-sm text-gray-600">Output</div>
                        <div className="font-medium">
                          {patientData.vitalSigns.uop}
                        </div>
                      </div>
                      <div className="p-3 border rounded-md">
                        <div className="text-sm text-gray-600">Balance</div>
                        <div className="font-medium">
                          {patientData.vitalSigns.balance}
                        </div>
                      </div>
                      <div className="p-3 border rounded-md">
                        <div className="text-sm text-gray-600">Diuretic</div>
                        <div className="font-medium">
                          {patientData.vitalSigns.diuretic}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <h3 className="font-medium text-gray-800 mb-3">
                      Physical Examination
                    </h3>
                    <div className="p-4 border rounded-md bg-gray-50">
                      {patientData.vitalSigns.examination}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="conditions">
              <Card>
                <CardHeader className="bg-green-50">
                  <CardTitle className="text-xl text-green-800">
                    Medical Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {renderConditionsList()}

                  <div className="mt-6 border-t pt-4">
                    <h3 className="font-medium text-gray-800 mb-3">
                      Chief Complaints
                    </h3>
                    <div className="p-4 border rounded-md bg-gray-50">
                      {patientData.medicalNotes.complaints}
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <h3 className="font-medium text-gray-800 mb-3">
                      Other Medical Conditions
                    </h3>
                    <div className="p-4 border rounded-md bg-gray-50">
                      {patientData.medicalNotes.others}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="labs">
              <Card>
                <CardHeader className="bg-amber-50">
                  <CardTitle className="text-xl text-amber-800">
                    Laboratory Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-800 mb-3">
                      Key Laboratory Values
                    </h3>
                    {renderKeyLabResults()}
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <h3 className="font-medium text-gray-800 mb-3">
                      Complete Laboratory Results
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-1/3">Test</TableHead>
                          <TableHead>Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(patientData.labResults).map(
                          ([key, value]) => (
                            <TableRow key={key}>
                              <TableCell className="font-medium">
                                {key.toUpperCase()}
                              </TableCell>
                              <TableCell>{value}</TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="imaging">
              <Card>
                <CardHeader className="bg-purple-50">
                  <CardTitle className="text-xl text-purple-800">
                    Imaging & Diagnostic Studies
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(patientData.imagingResults).map(
                      ([key, value]) => (
                        <div key={key} className="p-4 border rounded-md">
                          <div className="font-medium text-purple-800 mb-1">
                            {key === "ctBrain"
                              ? "CT Brain"
                              : key === "ctChest"
                              ? "CT Chest"
                              : key === "cxr"
                              ? "Chest X-Ray"
                              : key === "us"
                              ? "Ultrasound"
                              : key === "dupplex"
                              ? "Duplex"
                              : key === "ecg"
                              ? "ECG"
                              : key === "echo"
                              ? "Echocardiography"
                              : key === "mpi"
                              ? "Myocardial Perfusion Imaging"
                              : key === "ctAngio"
                              ? "CT Angiography"
                              : key === "others"
                              ? "Other Studies"
                              : key}
                          </div>
                          <div className="text-gray-700">{value}</div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="treatment">
              <Card>
                <CardHeader className="bg-red-50">
                  <CardTitle className="text-xl text-red-800">
                    Diagnosis & Treatment Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-3">
                        Diagnosis
                      </h3>
                      <div className="p-4 border rounded-md mb-4">
                        <div className="font-medium">Primary Diagnosis</div>
                        <div className="mt-1">
                          {patientData.diagnosisAndTreatment.diagnosis}
                        </div>
                      </div>

                      <div className="p-4 border rounded-md">
                        <div className="font-medium">
                          Differential Diagnosis
                        </div>
                        <div className="mt-1">
                          {
                            patientData.diagnosisAndTreatment
                              .differentialDiagnosis
                          }
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-800 mb-3">
                        Treatment Approach
                      </h3>
                      <div className="p-4 border rounded-md mb-4 bg-red-50">
                        {patientData.diagnosisAndTreatment.treatmentApproach}
                      </div>

                      <h3 className="font-medium text-gray-800 mb-3">
                        Current Medications
                      </h3>
                      <div className="p-4 border rounded-md bg-red-50">
                        {patientData.diagnosisAndTreatment.currentMedications}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <h3 className="font-medium text-gray-800 mb-3">
                      Treatment Plan
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-md">
                        <div className="font-medium">
                          IV Fluids & Electrolytes
                        </div>
                        <div className="mt-1">
                          {patientData.diagnosisAndTreatment.ivFluids}
                        </div>
                      </div>

                      <div className="p-4 border rounded-md">
                        <div className="font-medium">
                          Antibiotics/Antimicrobials
                        </div>
                        <div className="mt-1">
                          {patientData.diagnosisAndTreatment.antibiotics}
                        </div>
                      </div>

                      <div className="p-4 border rounded-md">
                        <div className="font-medium">
                          Respiratory Support/Oxygen
                        </div>
                        <div className="mt-1">
                          {patientData.diagnosisAndTreatment.oxygenTherapy}
                        </div>
                      </div>

                      <div className="p-4 border rounded-md">
                        <div className="font-medium">
                          Treatment Plan Details
                        </div>
                        <div className="mt-1">
                          {patientData.diagnosisAndTreatment.treatmentPlan}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <h3 className="font-medium text-gray-800 mb-3">
                      Follow-up
                    </h3>
                    <div className="p-4 border rounded-md bg-red-50">
                      <div className="font-medium">Follow-up Plan</div>
                      <div className="mt-1">
                        {patientData.diagnosisAndTreatment.followUpPlan}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <h3 className="font-medium text-gray-800 mb-3">
                      Additional Notes
                    </h3>
                    <div className="p-4 border rounded-md">
                      {patientData.diagnosisAndTreatment.notes}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-gray-500">
            <FileText className="inline-block h-4 w-4 mr-1" />
            Medical record last updated: {new Date().toLocaleDateString()}{" "}
            {new Date().toLocaleTimeString()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
