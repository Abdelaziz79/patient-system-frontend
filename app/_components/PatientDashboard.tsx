"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  FileTextIcon,
  ListIcon,
  TrendingUpIcon,
  UserPlusIcon,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define patient demographics interface
interface PatientDemographics {
  category: string;
  count: number;
  color: string;
}

// Define patient conditions interface
interface CommonCondition {
  condition: string;
  count: number;
  percentage: number;
  color: string;
}

// Define monthly mortality interface
interface MonthlyMortality {
  month: string;
  deaths: number;
  rate: number;
}

export default function PatientDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [patientDemographics, setPatientDemographics] = useState<
    PatientDemographics[]
  >([]);
  const [commonConditions, setCommonConditions] = useState<CommonCondition[]>(
    []
  );
  const [monthlyMortality, setMonthlyMortality] = useState<MonthlyMortality[]>(
    []
  );
  const [totalPatients, setTotalPatients] = useState(0);
  const [newPatients, setNewPatients] = useState(0);
  const [currentMortalityRate, setCurrentMortalityRate] = useState(0);

  useEffect(() => {
    // Simulate API call to fetch patient data
    setIsLoading(true);
    setTimeout(() => {
      // Mock data - in a real application, you would fetch this from your API
      const mockPatientDemographics: PatientDemographics[] = [
        { category: "Elderly (60+)", count: 1245, color: "bg-blue-500" },
        { category: "Adults (30-59)", count: 3782, color: "bg-green-500" },
        {
          category: "Young Adults (18-29)",
          count: 1560,
          color: "bg-purple-500",
        },
        { category: "Teenagers (13-17)", count: 542, color: "bg-yellow-500" },
        { category: "Children (0-12)", count: 1874, color: "bg-pink-500" },
      ];

      const mockCommonConditions: CommonCondition[] = [
        {
          condition: "Hypertension",
          count: 2450,
          percentage: 27.3,
          color: "bg-red-500",
        },
        {
          condition: "Diabetes",
          count: 1860,
          percentage: 20.7,
          color: "bg-blue-500",
        },
        {
          condition: "Heart Disease",
          count: 945,
          percentage: 10.5,
          color: "bg-purple-500",
        },
        {
          condition: "Asthma",
          count: 830,
          percentage: 9.2,
          color: "bg-yellow-500",
        },
        {
          condition: "High Cholesterol",
          count: 1240,
          percentage: 13.8,
          color: "bg-green-500",
        },
        {
          condition: "Depression & Anxiety",
          count: 765,
          percentage: 8.5,
          color: "bg-indigo-500",
        },
        {
          condition: "Arthritis",
          count: 890,
          percentage: 9.9,
          color: "bg-orange-500",
        },
      ];

      const mockMonthlyMortality: MonthlyMortality[] = [
        { month: "January", deaths: 12, rate: 0.13 },
        { month: "February", deaths: 9, rate: 0.1 },
        { month: "March", deaths: 11, rate: 0.12 },
        { month: "April", deaths: 8, rate: 0.09 },
        { month: "May", deaths: 10, rate: 0.11 },
        { month: "June", deaths: 7, rate: 0.08 },
      ];

      setPatientDemographics(mockPatientDemographics);
      setCommonConditions(mockCommonConditions);
      setMonthlyMortality(mockMonthlyMortality);
      setTotalPatients(
        mockPatientDemographics.reduce((sum, item) => sum + item.count, 0)
      );
      setNewPatients(34);
      setCurrentMortalityRate(0.11);
      setIsLoading(false);
    }, 0);
  }, []);

  const handleAddPatient = () => {
    router.push("/patients/add-patient");
  };

  const handleViewPatients = () => {
    router.push("/patients");
  };

  const handleViewAnalytics = () => {
    router.push("/analytics");
  };

  return (
    <div className="flex items-center justify-center p-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-6xl"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-300">
            Patient Dashboard
          </h1>
          <p className="text-green-600 dark:text-green-400">
            Patient Management and Medical Records
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-green-800 dark:text-green-300">
                  {isLoading ? "-" : totalPatients.toLocaleString()}
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Monthly Mortality Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-green-800 dark:text-green-300">
                  {isLoading ? "-" : `${currentMortalityRate}%`}
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full">
                  <TrendingUpIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                New Patients (This Month)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-green-800 dark:text-green-300">
                  {isLoading ? "-" : newPatients}
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full">
                  <UserPlusIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Actions */}
          <div className="space-y-4">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white transition-all duration-200"
                  onClick={handleAddPatient}
                >
                  <UserPlusIcon className="mr-2 h-5 w-5" />
                  <span>Add New Patient</span>
                </Button>
                <Button
                  className="w-full justify-start bg-green-50 hover:bg-green-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-green-800 dark:text-green-300 transition-all duration-200"
                  variant="outline"
                  onClick={handleViewPatients}
                >
                  <ListIcon className="mr-2 h-5 w-5" />
                  <span>View Patient List</span>
                </Button>
                <Button
                  className="w-full justify-start bg-green-50 hover:bg-green-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-green-800 dark:text-green-300 transition-all duration-200"
                  variant="outline"
                  onClick={handleViewAnalytics}
                >
                  <TrendingUpIcon className="mr-2 h-5 w-5" />
                  <span>Mortality Analysis</span>
                </Button>
                <Button
                  className="w-full justify-start bg-green-50 hover:bg-green-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-green-800 dark:text-green-300 transition-all duration-200"
                  variant="outline"
                >
                  <FileTextIcon className="mr-2 h-5 w-5" />
                  <span>Medical Forms</span>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
                  Monthly Mortality Rate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {monthlyMortality.map((item) => (
                  <div key={item.month} className="flex items-start space-x-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <TrendingUpIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.month}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Deaths: {item.deaths} | Rate: {item.rate}%
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  variant="link"
                  className="w-full text-green-600 dark:text-green-400"
                >
                  View Complete Analysis
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Middle Column - Patient Demographics */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
                Patient Demographics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {patientDemographics.map((item) => (
                    <div key={item.category} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium dark:text-gray-200">
                          {item.category}
                        </span>
                        <span className="text-sm font-medium dark:text-gray-300">
                          {item.count.toLocaleString()} patients
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className={`${item.color} h-2.5 rounded-full`}
                          style={{
                            width: `${(item.count / totalPatients) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="link"
                className="w-full text-green-600 dark:text-green-400"
              >
                View Full Analysis
              </Button>
            </CardFooter>
          </Card>

          {/* Right Column - Common Conditions */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-green-100 dark:border-green-900 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300">
                Common Medical Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {commonConditions.map((item) => (
                    <div key={item.condition} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium dark:text-gray-200">
                          {item.condition}
                        </span>
                        <span className="text-sm font-medium dark:text-gray-300">
                          {item.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className={`${item.color} h-2.5 rounded-full`}
                          style={{
                            width: `${item.percentage}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="link"
                className="w-full text-green-600 dark:text-green-400"
              >
                View All Conditions
              </Button>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
