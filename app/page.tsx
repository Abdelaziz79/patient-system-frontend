import DoctorDashboardPage from "./_components/DoctorDashboard";
import PatientDashboardPage from "./_components/PatientDashboard";

function page() {
  return (
    <div>
      <DoctorDashboardPage />
      <PatientDashboardPage />
    </div>
  );
}

export default page;
