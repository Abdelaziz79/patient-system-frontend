import { useLanguage } from "@/app/_contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, parseISO } from "date-fns";
import { CalendarDays, Clock, Phone, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface PatientData {
  _id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    contactNumber: string;
    email: string;
    address: string;
    medicalRecordNumber: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
    insuranceInfo: {
      provider: string;
      policyNumber: string;
      groupNumber: string;
    };
    _id: string;
  };
  status: {
    name: string;
    label: string;
    color: string;
    date: string;
  };
  isActive: boolean;
}

interface SearchResultsProps {
  results: PatientData[];
  onClose: () => void;
  isVisible: boolean;
  isLoading?: boolean;
  searchQuery?: string;
}

export default function SearchResults({
  results,
  onClose,
  isVisible,
  isLoading = false,
  searchQuery = "",
}: SearchResultsProps) {
  const { t, isRTL } = useLanguage();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Ensure results is always an array
  const safeResults = Array.isArray(results) ? results : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, onClose]);

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch (error) {
      console.error(error);
      return "N/A";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    }
  };

  if (!isVisible) {
    return null;
  }

  // Container to be used for both loading and results
  const containerClass = `absolute ${
    isRTL ? "right-0" : "left-0"
  } top-full mt-1 w-full bg-white dark:bg-slate-800 shadow-lg rounded-lg border border-blue-100 dark:border-blue-900 z-50`;

  // Show loading spinner when searching but no results yet
  if (isLoading) {
    return (
      <div ref={resultsRef} className={`${containerClass} p-6`}>
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("searching")}
          </p>
        </div>
      </div>
    );
  }

  // Check if search query is too short
  if (
    searchQuery &&
    searchQuery.trim().length > 0 &&
    searchQuery.trim().length < 3
  ) {
    return (
      <div ref={resultsRef} className={`${containerClass} p-6`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>
            {t("noResultsFound")} -{" "}
            {isRTL
              ? "الرجاء إدخال 3 أحرف على الأقل للبحث"
              : "Please enter at least 3 characters"}
          </p>
        </div>
      </div>
    );
  }

  // If not loading and there are no results, show no results message
  if (safeResults.length === 0) {
    return (
      <div ref={resultsRef} className={`${containerClass} p-6`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>{t("noResultsFound")}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={resultsRef}
      className={containerClass}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h4 className="font-medium text-blue-700 dark:text-blue-400">
          {safeResults.length} {t("searchResults")}
        </h4>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      <ScrollArea className="max-h-[400px]">
        {safeResults.map((patient) => (
          <Link
            href={`/patients/${patient._id}`}
            key={patient._id}
            className="block border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150"
            onClick={onClose}
          >
            <div className="p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mx-3">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {patient.personalInfo.firstName}{" "}
                      {patient.personalInfo.lastName}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      <CalendarDays className="h-3.5 w-3.5 mx-1" />
                      <span className="mx-2">
                        {formatDate(patient.personalInfo.dateOfBirth)}
                      </span>
                      <span className="mx-2">•</span>
                      {patient.personalInfo.gender && (
                        <span className="capitalize">
                          {t(patient.personalInfo.gender as "male" | "female")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      patient.status.name
                    )}`}
                  >
                    {patient.status.label}
                  </span>
                </div>
              </div>

              {patient.personalInfo.contactNumber && (
                <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-3.5 w-3.5 mx-1" />
                  <span>{patient.personalInfo.contactNumber}</span>
                </div>
              )}

              <div className="mt-2 flex justify-between">
                <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center">
                  <Clock className="h-3.5 w-3.5 mx-1" />
                  <span>
                    {t("lastUpdate")}: {formatDate(patient.status.date)}
                  </span>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  {t("viewPatient")} →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </ScrollArea>
    </div>
  );
}
