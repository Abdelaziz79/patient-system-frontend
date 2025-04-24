import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface SuccessMessageProps {
  handleGoBack: () => void;
}

export function SuccessMessage({ handleGoBack }: SuccessMessageProps) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="p-8 flex flex-col items-center justify-center"
    >
      <div className="mb-4 bg-green-100 dark:bg-green-900/50 p-6 rounded-full">
        <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        Patient Updated Successfully
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-6">
        The patient information has been updated and saved to the system.
      </p>
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={handleGoBack}
          className="border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30"
        >
          Return to Patient
        </Button>
      </div>
    </motion.div>
  );
}
