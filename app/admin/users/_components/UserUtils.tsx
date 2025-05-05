import { Badge } from "@/components/ui/badge";

export function UserUtils() {
  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge
        variant="outline"
        className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
      >
        Active
      </Badge>
    ) : (
      <Badge
        variant="outline"
        className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
      >
        Inactive
      </Badge>
    );
  };

  const getRoleBadge = (
    role: "admin" | "doctor" | "nurse" | "staff" | "super_admin"
  ) => {
    const badges = {
      super_admin:
        "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
      admin:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
      doctor:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
      nurse:
        "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
      staff:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    };

    return (
      <Badge variant="outline" className={badges[role] || badges.staff}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return {
    getStatusBadge,
    getRoleBadge,
    formatDate,
  };
}
