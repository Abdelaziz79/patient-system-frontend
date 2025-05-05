import { formatDistanceToNow } from "date-fns";

interface UserListItemProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  timestamp?: string;
  timestampLabel?: string;
}

export default function UserListItem({
  user,
  timestamp,
  timestampLabel,
}: UserListItemProps) {
  return (
    <li className="flex items-center justify-between text-sm p-3 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-medium">{user.name}</span>
          <span className="text-xs py-0.5 px-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300">
            {user.role}
          </span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {user.email}
        </p>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap mx-4">
        {timestamp
          ? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
          : timestampLabel || "Never"}
      </span>
    </li>
  );
}
