import { ActionCardProps } from "@/types/actionCard";

export function ActionCard({
  title,
  href,
  icon,
}: Readonly<ActionCardProps>) {
  return (
    <a
      href={href}
      className="flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-4 rounded-xl transition shadow-lg"
    >
      <span>{title}</span>
      <span>{icon}</span>
    </a>
  );
}
