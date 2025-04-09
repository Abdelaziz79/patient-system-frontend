"use client";

// import DoctorDashboardPage from "@/app/_components/DoctorDashboard";
import PatientDashboardPage from "@/app/_components/PatientDashboard";
import { useAuthContext } from "./_providers/AuthProvider";
import Loading from "./_components/Loading";
import ErrorComp from "./_components/ErrorComp";

function Page() {
  const { isAuthenticated, isLoading } = useAuthContext();
  if (isLoading) return <Loading />;
  if (!isAuthenticated) {
    return <ErrorComp message="You are not authenticated. Please log in." />;
  }
  return (
    <div>
      {/* <DoctorDashboardPage /> */}
      <PatientDashboardPage />
    </div>
  );
}

export default Page;
