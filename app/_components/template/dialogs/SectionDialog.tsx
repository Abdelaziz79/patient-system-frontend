import { Section } from "@/app/_types/Template";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSection: Section | null;
  setSelectedSection: (section: Section | null) => void;
  onSave: () => void;
}

export function SectionDialog({
  open,
  onOpenChange,
  selectedSection,
  setSelectedSection,
  onSave,
}: SectionDialogProps) {
  const updateSectionField = (field: string, value: string) => {
    if (!selectedSection) return;

    setSelectedSection({
      ...selectedSection,
      [field]: value,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gradient-to-b from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border-green-200 dark:border-green-900 shadow-lg">
        <DialogHeader className="pb-2 border-b border-green-100 dark:border-green-900">
          <DialogTitle className="text-xl text-green-800 dark:text-green-300 font-bold">
            {selectedSection?._id ? "Edit Section" : "Add New Section"}
          </DialogTitle>
          <DialogDescription className="text-green-600 dark:text-green-400">
            Create or modify a section to organize related fields
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-3">
          <div className="space-y-2">
            <Label
              htmlFor="sectionName"
              className="font-medium text-green-700 dark:text-green-300"
            >
              Section Name
            </Label>
            <Input
              id="sectionName"
              placeholder="e.g. personalInfo"
              value={selectedSection?.name || ""}
              onChange={(e) => updateSectionField("name", e.target.value)}
              className="border-green-200 dark:border-green-900 focus:border-green-400 dark:focus:border-green-700 transition-colors"
            />
            <p className="text-xs text-gray-500">
              Internal name used in code (no spaces, lowercase)
            </p>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="sectionLabel"
              className="font-medium text-green-700 dark:text-green-300"
            >
              Display Label
            </Label>
            <Input
              id="sectionLabel"
              placeholder="e.g. Personal Information"
              value={selectedSection?.label || ""}
              onChange={(e) => updateSectionField("label", e.target.value)}
              className="border-green-200 dark:border-green-900 focus:border-green-400 dark:focus:border-green-700 transition-colors"
            />
            <p className="text-xs text-gray-500">
              User-friendly label displayed in the UI
            </p>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="sectionDescription"
              className="font-medium text-green-700 dark:text-green-300"
            >
              Description (Optional)
            </Label>
            <Textarea
              id="sectionDescription"
              placeholder="Describe this section's purpose"
              value={selectedSection?.description || ""}
              onChange={(e) =>
                updateSectionField("description", e.target.value)
              }
              className="border-green-200 dark:border-green-900 focus:border-green-400 dark:focus:border-green-700 transition-colors"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter className="pt-2 border-t border-green-100 dark:border-green-900">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-green-200 dark:border-green-900 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
          >
            Save Section
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
