import { useLanguage } from "@/app/_contexts/LanguageContext";
import useMobileView from "@/app/_hooks/useMobileView";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AuthButtons() {
  const { t } = useLanguage();
  const { isMobileView: isMobile } = useMobileView();

  return (
    <div className="flex items-center">
      <Link href="/login">
        <Button
          variant="ghost"
          size={isMobile ? "sm" : "default"}
          className="text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
        >
          {t("login")}
        </Button>
      </Link>

      <Button
        size={isMobile ? "sm" : "default"}
        className="bg-blue-600 hover:bg-blue-700 text-white mx-1 md:mx-2"
        onClick={(e) => {
          // Handle sign up
          e.preventDefault();
          toast.success(t("contactAdminForAccount"));
        }}
      >
        {t("register")}
      </Button>
    </div>
  );
}
