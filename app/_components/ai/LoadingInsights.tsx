// LoadingInsights.jsx - A reusable component for displaying loading states and insights
import { Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

const LoadingInsights = ({
  isLoading = false,
  isGenerating = false,
  insights = null,
  title = "AI Analysis & Insights",
  loadingText = "Analyzing data...",
  loadingSubtext = "This may take a moment",
  className = "",
}: {
  isLoading: boolean;
  isGenerating: boolean;
  insights: string | null;
  title: string;
  loadingText: string;
  loadingSubtext: string;
  className?: string;
}) => {
  const isInProgress = isLoading || isGenerating;

  return (
    <div className={`mt-4 md:mt-6 ${className}`}>
      {isInProgress && (
        <div className="p-4 md:p-6 bg-white dark:bg-slate-800 rounded-lg shadow border border-green-100 dark:border-green-900 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-pulse mb-2">
              <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-green-700 dark:text-green-300 font-medium text-center">
              {loadingText}
            </p>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
              {loadingSubtext}
            </p>
          </div>
        </div>
      )}

      {insights && !isInProgress && (
        <div className="p-3 md:p-4 bg-white dark:bg-slate-800 rounded-lg shadow border border-green-100 dark:border-green-900">
          <div className="flex items-center mb-2 md:mb-3">
            <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
            <h2 className="text-lg md:text-xl font-medium text-green-800 dark:text-green-300 truncate">
              {title}
            </h2>
          </div>
          <div className="prose dark:prose-invert max-w-none prose-sm md:prose-base prose-headings:text-green-700 dark:prose-headings:text-green-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-lg prose-strong:text-green-700 dark:prose-strong:text-green-300 overflow-auto">
            {typeof insights === "string" ? (
              <ReactMarkdown>{insights}</ReactMarkdown>
            ) : (
              insights
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingInsights;
