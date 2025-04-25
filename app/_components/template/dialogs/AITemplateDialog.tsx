"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AITemplateGenerator } from "../AITemplateGenerator";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { ReactNode } from "react";

interface AITemplateDialogProps {
  trigger?: ReactNode;
}

export function AITemplateDialog({ trigger }: AITemplateDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white transition-all duration-200">
            <Sparkles className="mr-2 h-5 w-5" />
            <span>AI Generate Template</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-green-800 dark:text-green-300">
            Generate Template with AI
          </DialogTitle>
        </DialogHeader>
        <AITemplateGenerator />
      </DialogContent>
    </Dialog>
  );
}
