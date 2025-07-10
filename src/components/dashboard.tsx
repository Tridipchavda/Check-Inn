export function DashboardCard({
  title,
  value,
  icon,
}: {
  readonly title: string;
  readonly value: string | number;
  readonly icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition">
      <div className="bg-blue-100 text-blue-600 p-3 rounded-full">{icon}</div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}