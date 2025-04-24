// Format date for display
export const formatDate = (dateString: string): string => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error";
  }
};

// Calculate age from birthdate
export const calculateAge = (birthdate: string): string => {
  if (!birthdate) return "N/A";

  try {
    const birth = new Date(birthdate);
    // Check if date is valid
    if (isNaN(birth.getTime())) return "Invalid date";

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    // If birth month is after current month or same month but birth day is after current day
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age.toString();
  } catch (error) {
    console.error("Error calculating age:", error);
    return "Error";
  }
};

// Format phone number
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return "N/A";

  // Simple formatting - add proper formatting based on your region/requirements
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
};
