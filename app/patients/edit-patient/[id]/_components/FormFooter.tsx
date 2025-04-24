import { Button } from "@/components/ui/button";
import { Loader2, SaveIcon } from "lucide-react";

interface FormFooterProps {
  isSaving: boolean;
  handleGoBack: () => void;
}

export function FormFooter({ isSaving, handleGoBack }: FormFooterProps) {
  return (
    <div className="px-6 py-5 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={handleGoBack}
        className="border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isSaving}
        className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white flex items-center gap-2"
      >
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <SaveIcon className="h-4 w-4" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  );
}
