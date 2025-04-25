"use client";

import ErrorComp from "@/app/_components/ErrorComp";
import Loading from "@/app/_components/Loading";
import PatientDashboardPage from "@/app/_components/PatientDashboard";
import { useAuthContext } from "@/app/_providers/AuthProvider";

function Page() {
  const { isAuthenticated, isLoading } = useAuthContext();
  if (isLoading) return <Loading />;
  if (!isAuthenticated) {
    return <ErrorComp message="You are not authenticated. Please log in." />;
  }
  return (
    <div>
      <PatientDashboardPage />
    </div>
  );
}

export default Page;

// TODO : add multi gemini api key support to backend
// TODO : fix private and public templates
