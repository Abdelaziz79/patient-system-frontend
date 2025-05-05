const InfoItem = ({
  icon: Icon,
  label,
  value,
  fullWidth = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string | string[];
  fullWidth?: boolean;
}) => (
  <div
    className={`p-4 bg-blue-50 dark:bg-slate-700 rounded-lg ${
      fullWidth ? "md:col-span-2" : ""
    }`}
  >
    <div className="flex items-center mb-2">
      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400 mx-2" />
      <span className="font-semibold dark:text-gray-200">{label}</span>
    </div>
    {Array.isArray(value) ? (
      <ul className="list-disc list-inside text-gray-800 dark:text-gray-200 mx-2">
        {value.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-800 dark:text-gray-200">{value}</p>
    )}
  </div>
);

export default InfoItem;
