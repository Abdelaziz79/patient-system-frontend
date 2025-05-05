import { useLanguage } from "@/app/_contexts/LanguageContext";
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
import { ClipboardIcon, LockIcon, StarIcon, UnlockIcon } from "lucide-react";

interface TemplateInfoProps {
  template: PatientTemplate;
  isViewMode: boolean;
  updateTemplateField: (field: string, value: any) => void;
  userRole?: string;
}

export function TemplateInfo({
  template,
  isViewMode,
  updateTemplateField,
  userRole,
}: TemplateInfoProps) {
  const { t } = useLanguage();
  const isSuperAdmin = userRole === "super_admin";

  return (
    <Card className="bg-gradient-to-b from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 border-green-100 dark:border-green-900 shadow-lg overflow-hidden">
      <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-900 pb-4">
        <CardTitle className="text-xl font-bold text-green-800 dark:text-green-300 flex items-center">
          <ClipboardIcon className="h-5 w-5 mx-2 text-green-600 dark:text-green-400" />
          {t("templateInfo")}
        </CardTitle>
        <CardDescription className="text-green-600 dark:text-green-400">
          {t("basicTemplateDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label
              htmlFor="templateName"
              className="text-gray-700 dark:text-gray-300 font-medium"
            >
              {t("templateName")}
            </Label>
            <Input
              id="templateName"
              placeholder={t("templateName")}
              value={template.name}
              onChange={(e) => updateTemplateField("name", e.target.value)}
              disabled={isViewMode}
              className="bg-white dark:bg-slate-800 border-green-100 dark:border-green-900 focus:border-green-400 dark:focus:border-green-700 transition-colors"
            />
          </div>
          {userRole === "super_admin" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="isPrivate"
                  className="text-gray-700 dark:text-gray-300 font-medium flex items-center"
                >
                  {template.isPrivate ? (
                    <LockIcon className="h-4 w-4 mx-2 text-amber-500" />
                  ) : (
                    <UnlockIcon className="h-4 w-4 mx-2 text-green-500" />
                  )}
                  {t("isPrivate")}
                </Label>
                <Switch
                  id="isPrivate"
                  checked={template.isPrivate}
                  onCheckedChange={(checked) =>
                    updateTemplateField("isPrivate", checked)
                  }
                  disabled={
                    isViewMode || (!isSuperAdmin && !template.isPrivate)
                  }
                  className="data-[state=checked]:bg-amber-500 data-[state=unchecked]:bg-gray-700 "
                />
              </div>
              <p className="text-xs text-gray-500 px-6">
                {t("isPrivateDescription")}
              </p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label
              htmlFor="templateDescription"
              className="text-gray-700 dark:text-gray-300 font-medium"
            >
              {t("templateDescription")}
            </Label>
            <Textarea
              id="templateDescription"
              placeholder={t("templateDescription")}
              value={template.description || ""}
              onChange={(e) =>
                updateTemplateField("description", e.target.value)
              }
              disabled={isViewMode}
              className="bg-white dark:bg-slate-800 border-green-100 dark:border-green-900 focus:border-green-400 dark:focus:border-green-700 transition-colors min-h-[120px]"
            />
          </div>
          {userRole === "super_admin" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="isDefault"
                  className="text-gray-700 dark:text-gray-300 font-medium flex items-center"
                >
                  <StarIcon
                    className={`h-4 w-4 mx-2 ${
                      template.isDefault
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-400"
                    }`}
                  />
                  {t("isDefault")}
                </Label>
                <Switch
                  id="isDefault"
                  checked={template.isDefault}
                  onCheckedChange={(checked) =>
                    updateTemplateField("isDefault", checked)
                  }
                  disabled={isViewMode || !isSuperAdmin}
                  className="data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-gray-700"
                />
              </div>
              <p className="text-xs text-gray-500 px-6">
                {t("isDefaultDescription")}
              </p>

              {/* Template Stats (Could be expanded with real data) */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 mt-4 border border-gray-200 dark:border-gray-600">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("templateStats")}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-gray-600 dark:text-gray-400">
                    {t("templateSections")}:
                  </div>
                  <div className="text-gray-800 dark:text-gray-200 font-medium">
                    {template.sections.length}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {t("created")}:
                  </div>
                  <div className="text-gray-800 dark:text-gray-200 font-medium">
                    {template.createdAt
                      ? new Date(template.createdAt).toLocaleDateString()
                      : t("newTemplate")}
                  </div>
                  {template.createdBy &&
                    typeof template.createdBy !== "string" && (
                      <>
                        <div className="text-gray-600 dark:text-gray-400">
                          {t("creator")}:
                        </div>
                        <div className="text-gray-800 dark:text-gray-200 font-medium">
                          {template.createdBy.name || t("unknown")}
                        </div>
                      </>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
