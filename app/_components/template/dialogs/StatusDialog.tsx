import { PatientStatusOption } from "@/app/_types/Template";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

interface StatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStatus: PatientStatusOption | null;
  setSelectedStatus: (status: PatientStatusOption | null) => void;
  onSave: () => void;
}

export function StatusDialog({
  open,
  onOpenChange,
  selectedStatus,
  setSelectedStatus,
  onSave,
}: StatusDialogProps) {
  const updateStatusField = (field: string, value: any) => {
    if (!selectedStatus) return;

    setSelectedStatus({
      ...selectedStatus,
      [field]: value,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gradient-to-b from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border-green-200 dark:border-green-900 shadow-lg">
        <DialogHeader className="pb-2 border-b border-green-100 dark:border-green-900">
          <DialogTitle className="text-xl text-green-800 dark:text-green-300 font-bold">
            {selectedStatus?._id ? "Edit Status" : "Add New Status"}
          </DialogTitle>
          <DialogDescription className="text-green-600 dark:text-green-400">
            Define a patient status option
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-3">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label
                htmlFor="statusName"
                className="font-medium text-green-700 dark:text-green-300"
              >
                Status Name
              </Label>
              <Input
                id="statusName"
                placeholder="e.g. active"
                value={selectedStatus?.name || ""}
                onChange={(e) => updateStatusField("name", e.target.value)}
                className="border-green-200 dark:border-green-900 focus:border-green-400 dark:focus:border-green-700 transition-colors"
              />
              <p className="text-xs text-gray-500">Internal name (no spaces)</p>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="statusLabel"
                className="font-medium text-green-700 dark:text-green-300"
              >
                Display Label
              </Label>
              <Input
                id="statusLabel"
                placeholder="e.g. Active"
                value={selectedStatus?.label || ""}
                onChange={(e) => updateStatusField("label", e.target.value)}
                className="border-green-200 dark:border-green-900 focus:border-green-400 dark:focus:border-green-700 transition-colors"
              />
              <p className="text-xs text-gray-500">User-friendly label</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label
                htmlFor="statusColor"
                className="font-medium text-green-700 dark:text-green-300"
              >
                Color
              </Label>
              <div className="relative">
                <Input
                  id="statusColor"
                  type="color"
                  value={selectedStatus?.color || "#3498db"}
                  onChange={(e) => updateStatusField("color", e.target.value)}
                  className="h-10 w-full p-1 border-green-200 dark:border-green-900 cursor-pointer"
                />
                <div
                  className="absolute top-0 right-0 bottom-0 w-12 rounded-r-md flex items-center justify-center text-xs font-mono"
                  style={{ background: selectedStatus?.color || "#3498db" }}
                >
                  <span
                    className={`${
                      selectedStatus?.color
                        ? parseInt(selectedStatus.color.replace("#", ""), 16) >
                          0xffffff / 2
                          ? "text-gray-800"
                          : "text-white"
                        : "text-white"
                    }`}
                  >
                    {selectedStatus?.color || "#3498db"}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2 flex items-center">
              <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 p-3 rounded-md w-full h-full">
                <Checkbox
                  id="isDefault"
                  checked={selectedStatus?.isDefault || false}
                  onCheckedChange={(checked) =>
                    updateStatusField("isDefault", !!checked)
                  }
                  className="border-green-400 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <Label
                  htmlFor="isDefault"
                  className="font-medium text-green-700 dark:text-green-300"
                >
                  Default Status
                </Label>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="statusDescription"
              className="font-medium text-green-700 dark:text-green-300"
            >
              Description (Optional)
            </Label>
            <Textarea
              id="statusDescription"
              placeholder="Description of this status"
              value={selectedStatus?.description || ""}
              onChange={(e) => updateStatusField("description", e.target.value)}
              className="border-green-200 dark:border-green-900 focus:border-green-400 dark:focus:border-green-700 transition-colors"
              rows={2}
            />
          </div>

          {/* Preview */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-900">
            <Label className="font-medium text-green-700 dark:text-green-300 mb-2 block">
              Preview
            </Label>
            <div className="flex items-center space-x-2">
              <div
                className="h-6 w-6 rounded-full flex-shrink-0"
                style={{ backgroundColor: selectedStatus?.color || "#3498db" }}
              ></div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {selectedStatus?.label || "Status Label"}
              </span>
            </div>
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
            Save Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
