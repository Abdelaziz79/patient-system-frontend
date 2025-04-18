import { PatientTemplate } from "@/app/_types/Template";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardIcon, LockIcon, UnlockIcon, StarIcon } from "lucide-react";

interface TemplateInfoProps {
  template: PatientTemplate;
  isViewMode: boolean;
  updateTemplateField: (field: string, value: any) => void;
}

export function TemplateInfo({
  template,
  isViewMode,
  updateTemplateField,
}: TemplateInfoProps) {
  return (
    <Card className="bg-gradient-to-b from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border-green-100 dark:border-green-900 shadow-lg overflow-hidden">
      <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-900 pb-4">
        <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300 flex items-center">
          <ClipboardIcon className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
          Template Information
        </CardTitle>
        <CardDescription className="text-green-600 dark:text-green-400">
          Basic details about this patient template
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label
              htmlFor="templateName"
              className="text-gray-700 dark:text-gray-300 font-medium"
            >
              Template Name
            </Label>
            <Input
              id="templateName"
              placeholder="Enter template name"
              value={template.name}
              onChange={(e) => updateTemplateField("name", e.target.value)}
              disabled={isViewMode}
              className="bg-white dark:bg-slate-800 border-green-100 dark:border-green-900 focus:border-green-400 dark:focus:border-green-700 transition-colors"
            />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="isPrivate"
                className="text-gray-700 dark:text-gray-300 font-medium flex items-center"
              >
                {template.isPrivate ? (
                  <LockIcon className="h-4 w-4 mr-2 text-amber-500" />
                ) : (
                  <UnlockIcon className="h-4 w-4 mr-2 text-green-500" />
                )}
                Private Template
              </Label>
              <Switch
                id="isPrivate"
                checked={template.isPrivate}
                onCheckedChange={(checked) =>
                  updateTemplateField("isPrivate", checked)
                }
                disabled={isViewMode}
                className="data-[state=checked]:bg-amber-500 data-[state=unchecked]:bg-gray-700 "
              />
            </div>
            <p className="text-xs text-gray-500 pl-6">
              {template.isPrivate
                ? "This template is private and only visible to you"
                : "This template is public and visible to all users"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label
              htmlFor="templateDescription"
              className="text-gray-700 dark:text-gray-300 font-medium"
            >
              Description
            </Label>
            <Textarea
              id="templateDescription"
              placeholder="Enter template description"
              value={template.description || ""}
              onChange={(e) =>
                updateTemplateField("description", e.target.value)
              }
              disabled={isViewMode}
              className="bg-white dark:bg-slate-800 border-green-100 dark:border-green-900 focus:border-green-400 dark:focus:border-green-700 transition-colors min-h-[120px]"
            />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="isDefault"
                className="text-gray-700 dark:text-gray-300 font-medium flex items-center"
              >
                <StarIcon
                  className={`h-4 w-4 mr-2 ${
                    template.isDefault
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-400"
                  }`}
                />
                Default Template
              </Label>
              <Switch
                id="isDefault"
                checked={template.isDefault}
                onCheckedChange={(checked) =>
                  updateTemplateField("isDefault", checked)
                }
                disabled={isViewMode}
                className="data-[state=checked]:bg-yellow-500  data-[state=unchecked]:bg-gray-700"
              />
            </div>
            <p className="text-xs text-gray-500 pl-6">
              {template.isDefault
                ? "This template will be used as the default for new patients"
                : "This template will not be used as the default for new patients"}
            </p>

            {/* Template Stats (Could be expanded with real data) */}
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 mt-4 border border-gray-200 dark:border-gray-600">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Template Stats
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-gray-600 dark:text-gray-400">
                  Sections:
                </div>
                <div className="text-gray-800 dark:text-gray-200 font-medium">
                  {template.sections.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Status Options:
                </div>
                <div className="text-gray-800 dark:text-gray-200 font-medium">
                  {template.statusOptions.length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Created:</div>
                <div className="text-gray-800 dark:text-gray-200 font-medium">
                  {new Date(template.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
