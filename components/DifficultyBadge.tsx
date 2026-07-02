import { difficultyClass } from "@/lib/utils";

export default function DifficultyBadge({
  difficulty,
  className = "",
}: {
  difficulty: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${difficultyClass(
        difficulty
      )} ${className}`}
    >
      {difficulty}
    </span>
  );
}
