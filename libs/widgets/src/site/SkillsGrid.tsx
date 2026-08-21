import type { SkillGroup } from "@webdev/types";

function SkillList({ skills }: { skills: string[] }) {
  return (
    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
      {skills.map((skill) => (
        <li
          key={skill}
          className="flex items-start gap-2.5 text-sm leading-snug text-zinc-700 dark:text-zinc-300"
        >
          <span
            className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500 dark:bg-sky-400"
            aria-hidden
          />
          <span>{skill}</span>
        </li>
      ))}
    </ul>
  );
}

function GroupHeading({ label }: { label: string }) {
  return (
    <h3 className="text-sm font-semibold tracking-tight text-zinc-950 sm:text-base dark:text-white">{label}</h3>
  );
}

export function SkillsGrid({
  groups,
  variant = "cards",
}: {
  groups: SkillGroup[];
  variant?: "cards" | "compact";
}) {
  if (groups.length === 0) return null;

  if (variant === "compact") {
    return (
      <div className="card flex max-h-[min(32rem,70vh)] flex-col overflow-hidden p-4 sm:p-5 lg:max-h-none lg:overflow-visible">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600 dark:text-sky-400">Skills</p>
        <p className="mt-1 font-display text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">
          Stack at a glance
        </p>
        <div className="mt-4 min-h-0 flex-1 space-y-5 overflow-y-auto pr-1 lg:overflow-visible">
          {groups.map((group, index) => (
            <div
              key={group.label}
              className={index > 0 ? "border-t border-zinc-200/80 pt-5 dark:border-white/10" : undefined}
            >
              <GroupHeading label={group.label} />
              <SkillList skills={group.skills} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {groups.map((group) => (
        <div
          key={group.label}
          className="rounded-2xl border border-zinc-200/90 bg-white/80 p-4 sm:p-5 dark:border-white/10 dark:bg-zinc-950/50"
        >
          <GroupHeading label={group.label} />
          <SkillList skills={group.skills} />
        </div>
      ))}
    </div>
  );
}
