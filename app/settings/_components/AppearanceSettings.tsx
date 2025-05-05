import { useLanguage } from "@/app/_contexts/LanguageContext";
import { useThemeMode } from "@/app/_hooks/useThemeMode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Moon, Sun } from "lucide-react";

interface AppearanceSettingsProps {
  currentTheme: string;
}

export function AppearanceSettings({ currentTheme }: AppearanceSettingsProps) {
  const { t, dir } = useLanguage();
  const { setTheme } = useThemeMode();

  const handleThemeChange = (value: string) => {
    setTheme(value as "light" | "dark" | "system");
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-emerald-100 dark:border-emerald-900 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-400 dark:to-emerald-600 bg-clip-text text-transparent">
          {t("appearance")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="gap-y-4">
          <RadioGroup
            value={currentTheme}
            onValueChange={handleThemeChange}
            className="grid grid-cols-1 gap-4"
          >
            <div
              dir={dir}
              className={`flex items-center gap-x-2 rounded-lg border p-4 ${
                currentTheme === "light"
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <RadioGroupItem
                value="light"
                id="light"
                className="text-emerald-600 border-emerald-400"
              />
              <Label
                htmlFor="light"
                className="flex flex-1 items-center gap-2 cursor-pointer"
              >
                <Sun className="h-4 w-4 text-yellow-500" />
                <span>{t("lightMode")}</span>
              </Label>
            </div>

            <div
              dir={dir}
              className={`flex items-center gap-x-2 rounded-lg border p-4 ${
                currentTheme === "dark"
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <RadioGroupItem
                value="dark"
                id="dark"
                className="text-emerald-600 border-emerald-400"
              />
              <Label
                htmlFor="dark"
                className="flex flex-1 items-center gap-2 cursor-pointer"
              >
                <Moon className="h-4 w-4 text-indigo-400" />
                <span>{t("darkMode")}</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
