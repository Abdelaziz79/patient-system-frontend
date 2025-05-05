import { Skeleton } from "@/components/ui/skeleton";

// Loading skeletons for better UX
const UserSkeletons = () => (
  <div className="space-y-4">
    {Array(6)
      .fill(0)
      .map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        </div>
      ))}
  </div>
);

export default UserSkeletons;
