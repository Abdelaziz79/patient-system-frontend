import { useLanguage } from "@/app/_contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Globe } from "lucide-react";

interface LanguageSettingsProps {
  currentLanguage: string;
}

export function LanguageSettings({ currentLanguage }: LanguageSettingsProps) {
  const { t, toggleLanguage, dir } = useLanguage();

  const handleLanguageChange = (value: string) => {
    if (value !== currentLanguage) {
      toggleLanguage();
    }
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-emerald-100 dark:border-emerald-900 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-400 dark:to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
          <Globe className="h-5 w-5" />
          {t("language")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="gap-y-4">
          <RadioGroup
            value={currentLanguage}
            onValueChange={handleLanguageChange}
            className="grid grid-cols-1 gap-4"
          >
            <div
              dir={dir}
              className={`flex items-center gap-x-2 rounded-lg border p-4 ${
                currentLanguage === "en"
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <RadioGroupItem
                value="en"
                id="english"
                className="text-emerald-600 border-emerald-400"
              />
              <Label
                htmlFor="english"
                className="flex flex-1 items-center gap-2 cursor-pointer"
              >
                <span className="text-lg font-medium">🇺🇸</span>
                <span>English</span>
              </Label>
            </div>

            <div
              dir={dir}
              className={`flex items-center gap-x-2 rounded-lg border p-4 ${
                currentLanguage === "ar"
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <RadioGroupItem
                value="ar"
                id="arabic"
                className="text-emerald-600 border-emerald-400"
              />
              <Label
                htmlFor="arabic"
                className="flex flex-1 items-center gap-2 cursor-pointer"
              >
                <span className="text-lg font-medium">🇸🇦</span>
                <span>العربية</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
