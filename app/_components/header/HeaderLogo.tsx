import { useLanguage } from "@/app/_contexts/LanguageContext";
import useMobileView from "@/app/_hooks/useMobileView";
import { Button } from "@/components/ui/button";
import { HeartPulse, Menu, X } from "lucide-react";
import Link from "next/link";

interface HeaderLogoProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function HeaderLogo({ isOpen, toggleSidebar }: HeaderLogoProps) {
  const { isMobileView: isMobile } = useMobileView();
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isOpen ? "default" : "ghost"}
        size="icon"
        className={`lg:hidden ${
          isOpen
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
        } 
          h-8 w-8 transition-all duration-200`}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </Button>

      {/* Logo - visible on all screens */}
      <Link
        href="/"
        className="flex items-center gap-2 text-blue-700 dark:text-blue-300"
      >
        <HeartPulse className="h-5 w-5 md:h-6 md:w-6" />
        <span
          className={`font-bold ${
            isMobile ? "text-lg" : "text-xl"
          } whitespace-nowrap`}
        >
          {isMobile ? "PMS" : t("patientSystem")}
        </span>
      </Link>
    </div>
  );
}
