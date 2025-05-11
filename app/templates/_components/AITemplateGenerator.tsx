"use client";

import { useLanguage } from "@/app/_contexts/LanguageContext";
import { TemplateGenerationInput } from "@/app/_hooks/AI/AIApi";
import { useAI } from "@/app/_hooks/AI/useAI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface AITemplateGeneratorProps {
  onGenerate?: () => void;
}

export function AITemplateGenerator({ onGenerate }: AITemplateGeneratorProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { generateTemplate, isLoadingTemplate } = useAI();
  const [condition, setCondition] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");

  const handleGenerate = async () => {
    if (!condition.trim()) {
      toast.error(t("pleaseEnterMedicalCondition"));
      return;
    }

    const templateInput: TemplateGenerationInput = {
      condition: condition.trim(),
      specialization: specialRequirements.trim() || undefined,
    };

    toast.loading(t("generatingTemplate"), { id: "generate-template" });

    try {
      const result = await generateTemplate(templateInput);

      toast.dismiss("generate-template");

      if (result.success && result.data) {
        toast.success(t("templateGeneratedSuccess"));

        // Store the generated template in localStorage to be used on the new template page
        localStorage.setItem(
          "aiGeneratedTemplate",
          JSON.stringify(result.data)
        );

        // If onGenerate prop is provided, call it, otherwise navigate directly
        if (onGenerate) {
          onGenerate();
        } else {
          router.push("/templates/new");
        }
      } else {
        toast.error(result.message || t("failedToGenerateTemplate"));
      }
    } catch (error) {
      console.error(error);
      toast.dismiss("generate-template");
      toast.error(t("errorGeneratingTemplate"));
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 p-2 sm:p-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-lg border border-green-100 dark:border-green-900">
      <div className="flex items-center gap-1.5 sm:gap-2 text-green-700 dark:text-green-400">
        <Sparkles className="h-4 sm:h-5 w-4 sm:w-5" />
        <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
          {t("aiTemplateGenerator")}
        </h3>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
        {t("aiTemplateDescription")}
      </p>

      <div className="space-y-2 sm:space-y-3">
        <div>
          <label
            htmlFor="condition"
            className="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            {t("medicalCondition")}
          </label>
          <Input
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder={t("medicalConditionPlaceholder")}
            className="w-full text-xs sm:text-sm py-2 sm:py-2.5 border-gray-300 dark:border-slate-600 focus:border-green-500 focus:ring-green-500 dark:focus:border-green-400 dark:focus:ring-green-400 dark:bg-slate-700/70"
          />
        </div>

        <div>
          <label
            htmlFor="requirements"
            className="block text-xs sm:text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
          >
            {t("specializationOptional")}
          </label>
          <Textarea
            id="requirements"
            value={specialRequirements}
            onChange={(e) => setSpecialRequirements(e.target.value)}
            placeholder={t("specializationPlaceholder")}
            className="w-full text-xs sm:text-sm resize-none border-gray-300 dark:border-slate-600 focus:border-green-500 focus:ring-green-500 dark:focus:border-green-400 dark:focus:ring-green-400 dark:bg-slate-700/70"
            rows={3}
          />
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={isLoadingTemplate || !condition.trim()}
        className="w-full text-xs sm:text-sm py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-700 dark:to-green-800 dark:hover:from-green-600 dark:hover:to-green-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
      >
        {isLoadingTemplate ? (
          <>
            <Loader2 className="mx-1 sm:mx-2 h-3 sm:h-4 w-3 sm:w-4 animate-spin" />
            {t("generating")}
          </>
        ) : (
          <>
            <Sparkles className="mx-1 sm:mx-2 h-3 sm:h-4 w-3 sm:w-4" />
            {t("generateTemplate")}
          </>
        )}
      </Button>
    </div>
  );
}
