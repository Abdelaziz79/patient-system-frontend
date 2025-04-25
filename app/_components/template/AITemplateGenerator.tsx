"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAI } from "@/app/_hooks/useAI";
import { TemplateGenerationInput } from "@/app/_api/AIApi";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function AITemplateGenerator() {
  const router = useRouter();
  const { generateTemplate, isLoadingTemplate } = useAI();
  const [condition, setCondition] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");

  const handleGenerate = async () => {
    if (!condition.trim()) {
      toast.error("Please enter a medical condition");
      return;
    }

    const templateInput: TemplateGenerationInput = {
      condition: condition.trim(),
      specialization: specialRequirements.trim() || undefined,
    };

    toast.loading("Generating template...", { id: "generate-template" });

    try {
      const result = await generateTemplate(templateInput);

      toast.dismiss("generate-template");

      if (result.success && result.data) {
        toast.success("Template generated successfully");

        // Store the generated template in localStorage to be used on the new template page
        localStorage.setItem(
          "aiGeneratedTemplate",
          JSON.stringify(result.data)
        );

        // Navigate to the new template page
        router.push("/templates/new");
      } else {
        toast.error(result.message || "Failed to generate template");
      }
    } catch (error) {
      toast.dismiss("generate-template");
      toast.error("An error occurred while generating the template");
    }
  };

  return (
    <div className="space-y-4 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-green-100 dark:border-green-900">
      <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
        <Sparkles className="h-5 w-5" />
        <h3 className="text-lg font-semibold">AI Template Generator</h3>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300">
        Enter a medical condition and our AI will generate a suitable patient
        template with relevant sections and fields.
      </p>

      <div className="space-y-3">
        <div>
          <label htmlFor="condition" className="block text-sm font-medium mb-1">
            Medical Condition
          </label>
          <Input
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder="e.g., Diabetes, Hypertension, Asthma"
            className="w-full"
          />
        </div>

        <div>
          <label
            htmlFor="requirements"
            className="block text-sm font-medium mb-1"
          >
            Specialization (Optional)
          </label>
          <Textarea
            id="requirements"
            value={specialRequirements}
            onChange={(e) => setSpecialRequirements(e.target.value)}
            placeholder="e.g., Cardiology, Pediatrics, General Practice"
            className="w-full resize-none"
            rows={3}
          />
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={isLoadingTemplate || !condition.trim()}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        {isLoadingTemplate ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Template
          </>
        )}
      </Button>
    </div>
  );
}
