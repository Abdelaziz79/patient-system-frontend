import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useLanguage } from "@/app/_contexts/LanguageContext";

interface SuccessMessageProps {
  handleGoBack: () => void;
}

export function SuccessMessage({ handleGoBack }: SuccessMessageProps) {
  const { t, dir } = useLanguage();

  // Trigger confetti effect on component mount
  useEffect(() => {
    // Create confetti burst effect
    const duration = 2000;
    const end = Date.now() + duration;

    const runConfetti = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#4ade80", "#22c55e", "#16a34a"],
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#4ade80", "#22c55e", "#16a34a"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(runConfetti);
      }
    };

    runConfetti();
  }, []);

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="p-8 flex flex-col items-center justify-center"
      dir={dir}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.2,
          duration: 0.5,
          type: "spring",
          stiffness: 200,
        }}
        className="mb-6 relative"
      >
        <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-20 scale-150 animate-pulse" />
        <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 p-8 rounded-full relative">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            <CheckCircle2 className="h-20 w-20 text-green-600 dark:text-green-400" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 text-center">
          Patient Updated Successfully
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-8">
          The patient information has been updated and saved to the system.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        className="flex gap-4"
      >
        <Button
          onClick={handleGoBack}
          className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white flex items-center gap-2 px-6 py-5 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" /> {t("backToPatients")}
        </Button>
      </motion.div>
    </motion.div>
  );
}
