"use client";

import { useLanguage } from "@/app/_contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import { AITemplateGenerator } from "../AITemplateGenerator";

interface AITemplateDialogProps {
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
  onGenerate?: () => void;
}

export function AITemplateDialog({
  open,
  onOpenChange,
  onGenerate,
}: AITemplateDialogProps) {
  const { t } = useLanguage();
  // If open and onOpenChange are provided, use them for controlled behavior
  const controlled = open !== undefined && onOpenChange !== undefined;

  return (
    <Dialog
      open={controlled ? open : undefined}
      onOpenChange={controlled ? onOpenChange : undefined}
    >
      <DialogContent className="sm:max-w-[500px] bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-green-100 dark:border-green-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent">
            {t("generateTemplateWithAI")}
          </DialogTitle>
        </DialogHeader>
        <AITemplateGenerator onGenerate={onGenerate} />
      </DialogContent>
    </Dialog>
  );
}
