import {
  Check,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { readDoneSlugs, setDone } from "@webdev/store";
import type { PracticeDifficulty, PracticeGroup, PracticeQuestion } from "@webdev/types";
import {
  difficultyOrder,
  getPracticeQuestion,
  practiceDifficulties,
  practiceGroups,
  practiceQuestions,
} from "./data";

type TopicFilter = PracticeGroup | "all";
type DifficultyFilter = PracticeDifficulty | "all";
type GroupBy = "subject" | "level";

function difficultyClass(level: PracticeDifficulty) {
  if (level === "easy") return "text-emerald-700 dark:text-emerald-300";
  if (level === "medium") return "text-amber-700 dark:text-amber-300";
  return "text-rose-700 dark:text-rose-300";
}

function groupLabel(id: PracticeGroup) {
  return practiceGroups.find((group) => group.id === id)?.label ?? id;
}

function difficultyLabel(id: PracticeDifficulty) {
  return practiceDifficulties.find((item) => item.id === id)?.label ?? id;
}

export function PracticeWorkspace({ selectedSlug }: { selectedSlug?: string }) {
  const [done, setDoneList] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDoneList(readDoneSlugs());
    setReady(true);
  }, []);

  const question = selectedSlug ? getPracticeQuestion(selectedSlug) : undefined;
  const doneCount = ready ? done.filter((slug) => practiceQuestions.some((item) => item.slug === slug)).length : 0;

  if (question) {
    return (
      <PracticeDetail
        question={question}
        done={done.includes(question.slug)}
        ready={ready}
        onToggleDone={() => setDoneList(setDone(question.slug, !done.includes(question.slug)))}
      />
    );
  }

  return <PracticeHub done={done} doneCount={doneCount} ready={ready} />;
}

function PracticeHub({ done, doneCount, ready }: { done: string[]; doneCount: number; ready: boolean }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<TopicFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [groupBy, setGroupBy] = useState<GroupBy>("subject");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (practiceGroups.some((group) => group.id === hash)) setTopic(hash as PracticeGroup);
  }, []);

  useEffect(() => {
    if (!filtersOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.classList.add("overflow-hidden");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("overflow-hidden");
    };
  }, [filtersOpen]);

  const needle = query.trim().toLowerCase();
  const visible = useMemo(() => {
    const byTopic = topic === "all" ? practiceQuestions : practiceQuestions.filter((item) => item.group === topic);
    const byDifficulty =
      difficulty === "all" ? byTopic : byTopic.filter((item) => item.difficulty === difficulty);
    if (!needle) return byDifficulty;
    return byDifficulty.filter(
      (item) =>
        item.title.toLowerCase().includes(needle) ||
        item.description.toLowerCase().includes(needle) ||
        item.slug.includes(needle) ||
        item.fnName.toLowerCase().includes(needle) ||
        item.group.includes(needle),
    );
  }, [needle, topic, difficulty]);

  const sections = useMemo(() => {
    if (groupBy === "level") {
      return practiceDifficulties
        .map((level) => ({
          id: level.id as string,
          label: level.label,
          items: visible.filter((item) => item.difficulty === level.id),
        }))
        .filter((section) => section.items.length > 0);
    }
    return practiceGroups
      .map((group) => ({
        id: group.id as string,
        label: group.label,
        items: visible.filter((item) => item.group === group.id),
      }))
      .filter((section) => section.items.length > 0);
  }, [groupBy, visible]);

  function selectTopic(next: TopicFilter) {
    setTopic(next);
    const hash = next === "all" ? "" : `#${next}`;
    window.history.replaceState(null, "", `${window.location.pathname}${hash}`);
  }

  const filtersActive = topic !== "all" || difficulty !== "all";

  return (
    <div className="pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="flex flex-wrap items-center gap-3 pr-14 md:pr-0">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">Practice</h1>
        {ready ? (
          <p className="text-sm tabular-nums text-zinc-500 dark:text-zinc-400">
            {doneCount}/{practiceQuestions.length}
          </p>
        ) : null}
        <label className="relative min-w-0 flex-1 basis-full sm:basis-64 sm:flex-none sm:ml-auto">
          <span className="sr-only">Search questions</span>
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            autoComplete="off"
            enterKeyHint="search"
            className="field min-h-10 py-2"
          />
        </label>
      </div>

      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        Interview-style questions with a worked problem statement and sample inputs and outputs. Solve them in your own
        editor — group by subject or by level to plan a session.
      </p>

      <div className="mt-4 hidden md:block">
        <GroupByToggle value={groupBy} onChange={setGroupBy} />
        <TopicChips className="mt-3" topic={topic} done={done} onChange={selectTopic} />
        <DifficultyChips className="mt-2" difficulty={difficulty} onChange={setDifficulty} />
      </div>

      <PracticeMobileFilters
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filtersActive={filtersActive}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        topic={topic}
        difficulty={difficulty}
        done={done}
        onTopicChange={selectTopic}
        onDifficultyChange={setDifficulty}
      />

      {sections.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-400">
          Nothing matches “{query.trim()}”. Clear search or pick another filter.
        </p>
      ) : (
        <div className="mt-8 space-y-10">
          {sections.map((section) => {
            const finished = section.items.filter((item) => done.includes(item.slug)).length;
            const sorted = [...section.items].sort(
              (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty] || a.title.localeCompare(b.title),
            );
            return (
              <section key={section.id} id={section.id} className="scroll-mt-20">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="font-display text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">
                    {section.label}
                  </h2>
                  <p className="text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                    {ready ? `${finished}/${section.items.length}` : section.items.length}
                  </p>
                </div>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {sorted.map((item) => (
                    <li key={item.slug}>
                      <QuestionCard question={item} done={done.includes(item.slug)} showSubject={groupBy === "level"} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GroupByToggle({ value, onChange }: { value: GroupBy; onChange: (next: GroupBy) => void }) {
  const options: { id: GroupBy; label: string }[] = [
    { id: "subject", label: "Subject" },
    { id: "level", label: "Level" },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
        Group by
      </span>
      <div
        className="inline-flex gap-1 rounded-full border border-zinc-200/90 bg-white/70 p-1 dark:border-white/10 dark:bg-zinc-950/40"
        role="group"
        aria-label="Group questions by"
      >
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              aria-pressed={selected}
              className={`inline-flex min-h-9 items-center rounded-full px-3 text-xs font-semibold transition ${
                selected
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                  : "text-zinc-600 hover:text-sky-700 dark:text-zinc-300 dark:hover:text-sky-300"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PracticeMobileFilters({
  open,
  onOpenChange,
  filtersActive,
  groupBy,
  onGroupByChange,
  topic,
  difficulty,
  done,
  onTopicChange,
  onDifficultyChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filtersActive: boolean;
  groupBy: GroupBy;
  onGroupByChange: (next: GroupBy) => void;
  topic: TopicFilter;
  difficulty: DifficultyFilter;
  done: string[];
  onTopicChange: (id: TopicFilter) => void;
  onDifficultyChange: (id: DifficultyFilter) => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        aria-expanded={open}
        aria-controls="practice-mobile-filters"
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-sky-400 bg-white/90 text-zinc-700 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.45)] backdrop-blur-md transition hover:border-sky-300 hover:text-sky-700 md:hidden dark:border-sky-400 dark:bg-zinc-950/80 dark:text-zinc-200 dark:hover:border-sky-300 dark:hover:text-sky-300"
      >
        <span className="sr-only">Open practice filters</span>
        <SlidersHorizontal size={20} aria-hidden />
        {filtersActive ? (
          <span
            className="absolute right-2 top-2 h-2 w-2 rounded-full bg-sky-500 ring-2 ring-white dark:ring-zinc-950"
            aria-hidden
          />
        ) : null}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60] md:hidden" role="presentation">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-zinc-950/50 backdrop-blur-[2px]"
            onClick={() => onOpenChange(false)}
          />
          <div
            id="practice-mobile-filters"
            role="dialog"
            aria-modal="true"
            aria-labelledby="practice-mobile-filters-title"
            className="absolute inset-x-0 bottom-0 max-h-[min(85svh,34rem)] overflow-y-auto rounded-t-3xl border border-zinc-200/80 bg-white/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_40px_-16px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-zinc-950/95"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2
                id="practice-mobile-filters-title"
                className="font-display text-base font-semibold tracking-tight text-zinc-950 dark:text-white"
              >
                Filters
              </h2>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <span className="sr-only">Close filters</span>
                <X size={18} aria-hidden />
              </button>
            </div>
            <GroupByToggle value={groupBy} onChange={onGroupByChange} />
            <TopicChips className="mt-4" topic={topic} done={done} onChange={onTopicChange} />
            <DifficultyChips className="mt-3" difficulty={difficulty} onChange={onDifficultyChange} />
          </div>
        </div>
      ) : null}
    </>
  );
}

function TopicChips({
  topic,
  done,
  onChange,
  className = "",
}: {
  topic: TopicFilter;
  done: string[];
  onChange: (id: TopicFilter) => void;
  className?: string;
}) {
  const chips: { id: TopicFilter; label: string; count: number; finished: number }[] = [
    {
      id: "all",
      label: "All subjects",
      count: practiceQuestions.length,
      finished: done.filter((slug) => practiceQuestions.some((item) => item.slug === slug)).length,
    },
    ...practiceGroups.map((group) => {
      const items = practiceQuestions.filter((item) => item.group === group.id);
      return {
        id: group.id as TopicFilter,
        label: group.label,
        count: items.length,
        finished: items.filter((item) => done.includes(item.slug)).length,
      };
    }),
  ];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`.trim()} role="group" aria-label="Filter by subject">
      {chips.map((chip) => {
        const selected = topic === chip.id;
        return (
          <button
            key={chip.id}
            type="button"
            onClick={() => onChange(chip.id)}
            aria-pressed={selected}
            className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition sm:min-h-9 sm:py-1.5 sm:text-xs ${
              selected
                ? "border-sky-400/70 bg-sky-400/15 text-sky-800 dark:text-sky-200"
                : "border-zinc-200/90 bg-white/70 text-zinc-600 hover:border-sky-400/50 hover:text-sky-700 dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-300 dark:hover:text-sky-300"
            }`}
          >
            {chip.label}
            <span className="tabular-nums opacity-70">
              {chip.finished}/{chip.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function DifficultyChips({
  difficulty,
  onChange,
  className = "",
}: {
  difficulty: DifficultyFilter;
  onChange: (id: DifficultyFilter) => void;
  className?: string;
}) {
  const chips: { id: DifficultyFilter; label: string; count: number }[] = [
    { id: "all", label: "All levels", count: practiceQuestions.length },
    ...practiceDifficulties.map((item) => ({
      id: item.id as DifficultyFilter,
      label: item.label,
      count: practiceQuestions.filter((question) => question.difficulty === item.id).length,
    })),
  ];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`.trim()} role="group" aria-label="Filter by level">
      {chips.map((chip) => {
        const selected = difficulty === chip.id;
        return (
          <button
            key={chip.id}
            type="button"
            onClick={() => onChange(chip.id)}
            aria-pressed={selected}
            className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              selected
                ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950"
                : "border-zinc-200/90 bg-white/70 text-zinc-600 hover:border-sky-400/50 hover:text-sky-700 dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-300 dark:hover:text-sky-300"
            }`}
          >
            {chip.label}
            <span className="tabular-nums opacity-70">{chip.count}</span>
          </button>
        );
      })}
    </div>
  );
}

function QuestionCard({
  question,
  done,
  showSubject,
}: {
  question: PracticeQuestion;
  done: boolean;
  showSubject: boolean;
}) {
  return (
    <a href={`/practice/${question.slug}`} className="card block h-full p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${difficultyClass(question.difficulty)}`}>
          {showSubject ? groupLabel(question.group) : question.difficulty}
        </p>
        {done ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
            <Check size={12} aria-hidden />
            Done
          </span>
        ) : (
          <span className="text-[11px] font-medium text-zinc-400">Open</span>
        )}
      </div>
      <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">
        {question.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {question.description}
      </p>
    </a>
  );
}

function PracticeDetail({
  question,
  done,
  ready,
  onToggleDone,
}: {
  question: PracticeQuestion;
  done: boolean;
  ready: boolean;
  onToggleDone: () => void;
}) {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setShowHint(false);
  }, [question.slug]);

  const inSubject = practiceQuestions
    .filter((item) => item.group === question.group)
    .sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty] || a.title.localeCompare(b.title));
  const index = inSubject.findIndex((item) => item.slug === question.slug);
  const prev = index > 0 ? inSubject[index - 1] : undefined;
  const next = index >= 0 && index < inSubject.length - 1 ? inSubject[index + 1] : undefined;

  return (
    <div className="mx-auto w-full max-w-3xl pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="flex min-w-0 items-center gap-2 pr-14 lg:pr-0">
        <a
          href={`/practice#${question.group}`}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-zinc-600 hover:text-sky-700 dark:text-zinc-400 dark:hover:text-sky-300"
        >
          <ChevronLeft size={16} aria-hidden />
          {groupLabel(question.group)}
        </a>
        <div className="ml-auto flex shrink-0 items-center">
          <NavArrow question={prev} direction="prev" />
          <NavArrow question={next} direction="next" />
        </div>
      </div>

      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600 dark:text-sky-400">
        {groupLabel(question.group)}
        <span className="mx-1.5 text-zinc-300 dark:text-zinc-600">·</span>
        <span className={difficultyClass(question.difficulty)}>{difficultyLabel(question.difficulty)}</span>
      </p>

      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl dark:text-white">
        {question.title}
      </h1>

      <p className="mt-4 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">{question.prompt}</p>

      <div className="mt-5 rounded-2xl border border-zinc-200/80 bg-zinc-50/80 px-4 py-3 dark:border-white/10 dark:bg-zinc-950/40">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
          Signature
        </p>
        <p className="mt-1 break-all font-mono text-sm text-zinc-800 dark:text-zinc-200">{question.signature}</p>
      </div>

      <h2 className="mt-8 font-display text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">
        Examples
      </h2>
      <div className="mt-3 overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/10">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-zinc-100/80 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
              <th scope="col" className="px-3 py-2">Input</th>
              <th scope="col" className="px-3 py-2">Output</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/80 dark:divide-white/10">
            {question.examples.map((example) => (
              <tr key={example.call} className="align-top">
                <td className="px-3 py-2 font-mono text-xs break-all text-zinc-800 dark:text-zinc-200">
                  {example.call}
                </td>
                <td className="px-3 py-2 font-mono text-xs break-all text-emerald-700 dark:text-emerald-300">
                  {example.result}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 font-display text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">
        Notes and constraints
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {question.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setShowHint((open) => !open)}
          className="btn-ghost min-h-10 gap-1.5 px-3 py-2 text-sm"
          aria-expanded={showHint}
        >
          <Lightbulb size={15} aria-hidden />
          {showHint ? "Hide hint" : "Show hint"}
        </button>
        {ready ? (
          <button
            type="button"
            onClick={onToggleDone}
            aria-pressed={done}
            className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
              done
                ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-800 dark:text-emerald-300"
                : "border-zinc-200/90 bg-white/70 text-zinc-600 hover:border-sky-400/50 hover:text-sky-700 dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-300 dark:hover:text-sky-300"
            }`}
          >
            <Check size={15} aria-hidden />
            {done ? "Marked as done" : "Mark as done"}
          </button>
        ) : null}
      </div>

      {showHint ? (
        <p className="mt-3 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 font-mono text-xs leading-relaxed text-amber-900 dark:text-amber-100">
          {question.hint}
        </p>
      ) : null}

      <nav className="mt-10 grid gap-3 border-t border-zinc-200/80 pt-5 sm:grid-cols-2 dark:border-white/10">
        <NavCard question={prev} direction="prev" />
        <NavCard question={next} direction="next" />
      </nav>
    </div>
  );
}

function NavArrow({ question, direction }: { question?: PracticeQuestion; direction: "prev" | "next" }) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  if (!question) {
    return (
      <span className="inline-flex h-9 w-9 items-center justify-center text-zinc-300 dark:text-zinc-700" aria-hidden>
        <Icon size={16} />
      </span>
    );
  }
  return (
    <a
      href={`/practice/${question.slug}`}
      aria-label={`${direction === "prev" ? "Previous" : "Next"}: ${question.title}`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white"
    >
      <Icon size={16} aria-hidden />
    </a>
  );
}

function NavCard({ question, direction }: { question?: PracticeQuestion; direction: "prev" | "next" }) {
  if (!question) return <span aria-hidden />;
  return (
    <a
      href={`/practice/${question.slug}`}
      className={`card block p-4 ${direction === "next" ? "sm:text-right" : ""}`}
    >
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
        {direction === "prev" ? "Previous" : "Next"}
      </span>
      <span className="mt-1 block font-display text-base font-semibold tracking-tight text-zinc-950 dark:text-white">
        {question.title}
      </span>
    </a>
  );
}
