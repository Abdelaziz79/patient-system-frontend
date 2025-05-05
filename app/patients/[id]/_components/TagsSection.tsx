import { usePatient } from "@/app/_hooks/patient/usePatient";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { IPatient } from "@/app/_types/Patient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Tag, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface TagsSectionProps {
  patient: IPatient;
}

export function TagsSection({ patient }: TagsSectionProps) {
  const { t } = useLanguage();
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Maintain our own tags state to ensure immediate UI updates
  const [tags, setTags] = useState<string[]>(patient?.tags || []);

  const { addTag, removeTag, isAddingTag, isRemovingTag } = usePatient({
    initialFetch: false,
  });

  // Update tags when patient prop changes
  useEffect(() => {
    if (patient?.tags) {
      setTags(patient.tags);
    }
  }, [patient?.tags]);

  const handleAddTag = async () => {
    if (!newTag.trim() || !patient?.id || isLoading) return;

    const tagToAdd = newTag.trim();

    // Check if tag already exists
    if (tags.includes(tagToAdd)) {
      toast.error(t("tagAlreadyExists"));
      return;
    }

    // Update local state immediately
    setTags((prevTags) => [...prevTags, tagToAdd]);
    setNewTag("");
    setIsLoading(true);

    try {
      const result = await addTag(patient.id, tagToAdd);
      if (!result.success) {
        // Revert on failure
        setTags((prevTags) => prevTags.filter((t) => t !== tagToAdd));
        toast.error(result.error || t("failedToAddTag"));
      } else {
        toast.success(t("tagAddedSuccess").replace("{{tag}}", tagToAdd));
      }
    } catch (error) {
      // Revert on error
      setTags((prevTags) => prevTags.filter((t) => t !== tagToAdd));
      toast.error(t("unexpectedError"));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTag = async (tag: string) => {
    if (!patient?.id || isLoading) return;

    // Update local state immediately
    setTags((prevTags) => prevTags.filter((t) => t !== tag));
    setIsLoading(true);

    try {
      const result = await removeTag(patient.id, tag);
      if (!result.success) {
        // Revert on failure
        setTags((prevTags) => [...prevTags, tag]);
        toast.error(result.error || t("failedToRemoveTag"));
      } else {
        toast.success(t("tagRemovedSuccess").replace("{{tag}}", tag));
      }
    } catch (error) {
      // Revert on error
      setTags((prevTags) => [...prevTags, tag]);
      toast.error(t("unexpectedError"));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Card className="mt-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-indigo-100 dark:border-slate-800 shadow-xl transition-all duration-200">
      <CardHeader className="py-4">
        <CardTitle className="text-lg text-indigo-800 dark:text-slate-300 flex items-center gap-2">
          <Tag className="h-5 w-5 text-indigo-600 dark:text-slate-400" />
          {t("tags")}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <Badge
                key={`${tag}-${index}`}
                variant="secondary"
                className="px-3 py-1.5 px-1 flex items-center gap-1 bg-indigo-50 dark:bg-slate-800 text-indigo-800 dark:text-slate-200 hover:bg-indigo-100 dark:hover:bg-slate-700 transition-colors duration-200 border border-indigo-200 dark:border-slate-700"
              >
                {tag}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 rounded-full hover:bg-red-100 dark:hover:bg-slate-600 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                        onClick={() => handleRemoveTag(tag)}
                        disabled={isRemovingTag && isLoading}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white dark:bg-slate-800 border-indigo-200 dark:border-slate-700">
                      <p>{t("removeTag")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Badge>
            ))
          ) : (
            <div className="text-gray-500 dark:text-slate-400 italic p-2">
              {t("noTagsYet")}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder={t("addNewTagPlaceholder")}
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            className="max-w-sm bg-white dark:bg-slate-800 border-indigo-200 dark:border-slate-700 focus-visible:ring-indigo-500 dark:focus-visible:ring-slate-500"
            disabled={isLoading}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddTag}
            disabled={
              isAddingTag || !newTag.trim() || !patient?.id || isLoading
            }
            className="flex items-center gap-1 bg-indigo-50 dark:bg-slate-800 text-indigo-800 dark:text-slate-200 hover:bg-indigo-100 dark:hover:bg-slate-700 border-indigo-200 dark:border-slate-700 transition-all duration-200"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-indigo-600 dark:border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {t("add")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
