import { Field, fieldTypes } from "@/app/_types/Template";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";

interface FieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedField: Field | null;
  setSelectedField: (field: Field | null) => void;
  onSave: () => void;
}

export function FieldDialog({
  open,
  onOpenChange,
  selectedField,
  setSelectedField,
  onSave,
}: FieldDialogProps) {
  const [fieldOptionText, setFieldOptionText] = useState("");

  const updateFieldValue = (field: string, value: any) => {
    if (!selectedField) return;

    setSelectedField({
      ...selectedField,
      [field]: value,
    });
  };

  const addFieldOption = () => {
    if (!selectedField || !fieldOptionText.trim()) return;

    const options = selectedField.options || [];
    setSelectedField({
      ...selectedField,
      options: [...options, fieldOptionText.trim()],
    });

    setFieldOptionText("");
  };

  const removeFieldOption = (index: number) => {
    if (!selectedField || !selectedField.options) return;

    const options = [...selectedField.options];
    options.splice(index, 1);

    setSelectedField({
      ...selectedField,
      options,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gradient-to-b from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border-green-200 dark:border-green-900 shadow-lg">
        <DialogHeader className="pb-2 border-b border-green-100 dark:border-green-900">
          <DialogTitle className="text-xl text-green-800 dark:text-green-300 font-bold">
            {selectedField?._id ? "Edit Field" : "Add New Field"}
          </DialogTitle>
          <DialogDescription className="text-green-600 dark:text-green-400">
            Configure the field properties
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-3">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label
                htmlFor="fieldName"
                className="font-medium text-green-700 dark:text-green-300"
              >
                Field Name
              </Label>
              <Input
                id="fieldName"
                placeholder="e.g. firstName"
                value={selectedField?.name || ""}
                onChange={(e) => updateFieldValue("name", e.target.value)}
                className="border-green-200 dark:border-green-900 focus:border-green-400 dark:focus:border-green-700 transition-colors"
              />
              <p className="text-xs text-gray-500">Internal name (no spaces)</p>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="fieldLabel"
                className="font-medium text-green-700 dark:text-green-300"
              >
                Display Label
              </Label>
              <Input
                id="fieldLabel"
                placeholder="e.g. First Name"
                value={selectedField?.label || ""}
                onChange={(e) => updateFieldValue("label", e.target.value)}
                className="border-green-200 dark:border-green-900 focus:border-green-400 dark:focus:border-green-700 transition-colors"
              />
              <p className="text-xs text-gray-500">User-friendly label</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label
                htmlFor="fieldType"
                className="font-medium text-green-700 dark:text-green-300"
              >
                Field Type
              </Label>
              <Select
                value={selectedField?.type || "text"}
                onValueChange={(value) => updateFieldValue("type", value)}
              >
                <SelectTrigger className="border-green-200 dark:border-green-900 focus:border-green-400 dark:focus:border-green-700 transition-colors">
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-green-200 dark:border-green-900">
                  {fieldTypes.map((type) => (
                    <SelectItem
                      key={type.value}
                      value={type.value}
                      className="hover:bg-green-50 dark:hover:bg-green-900/30"
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex items-center">
              <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 p-3 rounded-md w-full h-full">
                <Checkbox
                  id="required"
                  checked={selectedField?.required || false}
                  onCheckedChange={(checked) =>
                    updateFieldValue("required", !!checked)
                  }
                  className="border-green-400 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <Label
                  htmlFor="required"
                  className="font-medium text-green-700 dark:text-green-300"
                >
                  Required Field
                </Label>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="fieldDescription"
              className="font-medium text-green-700 dark:text-green-300"
            >
              Description (Optional)
            </Label>
            <Textarea
              id="fieldDescription"
              placeholder="Help text for this field"
              value={selectedField?.description || ""}
              onChange={(e) => updateFieldValue("description", e.target.value)}
              className="border-green-200 dark:border-green-900 focus:border-green-400 dark:focus:border-green-700 transition-colors"
              rows={2}
            />
          </div>

          {/* Options for select field type */}
          {selectedField?.type === "select" && (
            <div className="space-y-3 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-900">
              <Label className="font-medium text-green-700 dark:text-green-300">
                Options
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Add new option"
                  value={fieldOptionText}
                  onChange={(e) => setFieldOptionText(e.target.value)}
                  className="border-green-200 dark:border-green-900 focus:border-green-400 dark:focus:border-green-700 transition-colors"
                />
                <Button
                  type="button"
                  onClick={addFieldOption}
                  disabled={!fieldOptionText.trim()}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2">
                {!selectedField.options ||
                selectedField.options.length === 0 ? (
                  <p className="text-xs text-gray-500">No options added yet</p>
                ) : (
                  <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                    {selectedField.options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 rounded-md border border-green-100 dark:border-green-900"
                      >
                        <span className="text-sm text-green-800 dark:text-green-300">
                          {option}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFieldOption(index)}
                          className="h-6 w-6 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full"
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
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
            Save Field
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
