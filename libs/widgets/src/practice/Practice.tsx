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
import { CodeBlock } from "@webdev/components";
import { readDoneSlugs, setDone } from "@webdev/store";
import type { PracticeCompany, PracticeDifficulty, PracticeGroup, PracticeQuestion } from "@webdev/types";
import {
  companyOrder,
  difficultyOrder,
  getPracticeQuestion,
  practiceCompanies,
  practiceDifficulties,
  practiceGroups,
  practiceQuestions,
} from "./data";

type TopicFilter = PracticeGroup | "all";
type DifficultyFilter = PracticeDifficulty | "all";
type CompanyFilter = PracticeCompany | "all";
type GroupBy = "subject" | "level" | "company";

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

function companyLabel(id: PracticeCompany) {
  return practiceCompanies.find((company) => company.id === id)?.label ?? id;
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
  const [company, setCompany] = useState<CompanyFilter>("all");
  const [groupBy, setGroupBy] = useState<GroupBy>("subject");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (practiceGroups.some((group) => group.id === hash)) setTopic(hash as PracticeGroup);
    if (practiceCompanies.some((item) => item.id === hash)) {
      setCompany(hash as PracticeCompany);
      setGroupBy("company");
    }
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
    const byCompany =
      company === "all" ? byDifficulty : byDifficulty.filter((item) => item.companies.includes(company));
    if (!needle) return byCompany;
    return byCompany.filter((item) => {
      const companies = item.companies.map(companyLabel).join(" ");
      return (
        item.title.toLowerCase().includes(needle) ||
        item.description.toLowerCase().includes(needle) ||
        item.slug.includes(needle) ||
        item.fnName.toLowerCase().includes(needle) ||
        item.group.includes(needle) ||
        companies.toLowerCase().includes(needle)
      );
    });
  }, [needle, topic, difficulty, company]);

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
    if (groupBy === "company") {
      return practiceCompanies
        .map((item) => ({
          id: item.id as string,
          label: item.label,
          items: visible.filter((question) => question.companies.includes(item.id)),
        }))
        .filter((section) => section.items.length > 0)
        .sort((a, b) => companyOrder[a.id as PracticeCompany] - companyOrder[b.id as PracticeCompany]);
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
    if (next !== "all") setCompany("all");
    const hash = next === "all" ? "" : `#${next}`;
    window.history.replaceState(null, "", `${window.location.pathname}${hash}`);
  }

  function selectCompany(next: CompanyFilter) {
    setCompany(next);
    if (next !== "all") {
      setTopic("all");
      setGroupBy("company");
    }
    const hash = next === "all" ? "" : `#${next}`;
    window.history.replaceState(null, "", `${window.location.pathname}${hash}`);
  }

  const filtersActive = topic !== "all" || difficulty !== "all" || company !== "all";

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
        Interview-style questions with a worked problem statement and sample inputs and outputs. Tagged from public
        Google, Microsoft, Amazon, Meta, Netflix, Uber, Flipkart, Swiggy, Zomato, and Arcana loops — group by subject,
        level, or company.
      </p>

      <div className="mt-4 hidden md:block">
        <GroupByToggle value={groupBy} onChange={setGroupBy} />
        <TopicChips className="mt-3" topic={topic} done={done} onChange={selectTopic} />
        <DifficultyChips className="mt-2" difficulty={difficulty} onChange={setDifficulty} />
        <CompanyChips className="mt-2" company={company} done={done} onChange={selectCompany} />
      </div>

      <PracticeMobileFilters
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        filtersActive={filtersActive}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        topic={topic}
        difficulty={difficulty}
        company={company}
        done={done}
        onTopicChange={selectTopic}
        onDifficultyChange={setDifficulty}
        onCompanyChange={selectCompany}
      />

      {sections.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-400">
          {query.trim()
            ? `Nothing matches “${query.trim()}”. Clear search or pick another filter.`
            : "Nothing in this filter. Group by subject to see every kata, or pick another company."}
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
                    <li key={`${section.id}-${item.slug}`}>
                      <QuestionCard
                        question={item}
                        done={done.includes(item.slug)}
                        showSubject={groupBy !== "subject"}
                        showCompanies={groupBy !== "company"}
                      />
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
    { id: "company", label: "Company" },
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
  company,
  done,
  onTopicChange,
  onDifficultyChange,
  onCompanyChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filtersActive: boolean;
  groupBy: GroupBy;
  onGroupByChange: (next: GroupBy) => void;
  topic: TopicFilter;
  difficulty: DifficultyFilter;
  company: CompanyFilter;
  done: string[];
  onTopicChange: (id: TopicFilter) => void;
  onDifficultyChange: (id: DifficultyFilter) => void;
  onCompanyChange: (id: CompanyFilter) => void;
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
            className="rail-scroll absolute inset-x-0 bottom-0 max-h-[min(85svh,34rem)] overflow-y-auto rounded-t-3xl border border-zinc-200/80 bg-white/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_40px_-16px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-zinc-950/95"
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
            <CompanyChips className="mt-3" company={company} done={done} onChange={onCompanyChange} />
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

function CompanyChips({
  company,
  done,
  onChange,
  className = "",
}: {
  company: CompanyFilter;
  done: string[];
  onChange: (id: CompanyFilter) => void;
  className?: string;
}) {
  const tagged = practiceQuestions.filter((question) => question.companies.length > 0);
  const chips: { id: CompanyFilter; label: string; count: number; finished: number }[] = [
    {
      id: "all",
      label: "All companies",
      count: tagged.length,
      finished: tagged.filter((question) => done.includes(question.slug)).length,
    },
    ...practiceCompanies.map((item) => {
      const items = practiceQuestions.filter((question) => question.companies.includes(item.id));
      return {
        id: item.id as CompanyFilter,
        label: item.label,
        count: items.length,
        finished: items.filter((question) => done.includes(question.slug)).length,
      };
    }),
  ];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`.trim()} role="group" aria-label="Filter by company">
      {chips.map((chip) => {
        const selected = company === chip.id;
        return (
          <button
            key={chip.id}
            type="button"
            onClick={() => onChange(chip.id)}
            aria-pressed={selected}
            className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
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

function QuestionCard({
  question,
  done,
  showSubject,
  showCompanies,
}: {
  question: PracticeQuestion;
  done: boolean;
  showSubject: boolean;
  showCompanies: boolean;
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
      {showCompanies && question.companies.length > 0 ? (
        <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          {question.companies.map(companyLabel).join(" · ")}
        </p>
      ) : null}
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
  const [tab, setTab] = useState<"prompt" | "solution">("prompt");

  useEffect(() => {
    setShowHint(false);
    setTab("prompt");
  }, [question.slug]);

  const solutionLanguage = question.group === "react" ? "tsx" : "javascript";

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
        {question.companies.length > 0 ? (
          <>
            <span className="mx-1.5 text-zinc-300 dark:text-zinc-600">·</span>
            <span className="font-medium normal-case tracking-normal text-zinc-500 dark:text-zinc-400">
              {question.companies.map(companyLabel).join(" · ")}
            </span>
          </>
        ) : null}
      </p>

      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl dark:text-white">
        {question.title}
      </h1>

      <div
        role="tablist"
        aria-label="Question sections"
        className="mt-5 flex w-fit gap-1 rounded-full border border-zinc-200/90 bg-white/70 p-1 dark:border-white/10 dark:bg-zinc-950/40"
      >
        {(
          [
            ["prompt", "Prompt"],
            ["solution", "Solution"],
          ] as const
        ).map(([id, label]) => {
          const selected = tab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`practice-tab-${id}`}
              aria-selected={selected}
              aria-controls={`practice-panel-${id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(id)}
              className={`min-h-9 rounded-full px-3.5 text-sm font-semibold transition ${
                selected
                  ? "bg-sky-500/15 text-sky-800 dark:text-sky-200"
                  : "text-zinc-600 hover:text-sky-700 dark:text-zinc-300 dark:hover:text-sky-300"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {tab === "prompt" ? (
      <div role="tabpanel" id="practice-panel-prompt" aria-labelledby="practice-tab-prompt">
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
      </div>

      {showHint ? (
        <p className="mt-3 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 font-mono text-xs leading-relaxed text-amber-900 dark:text-amber-100">
          {question.hint}
        </p>
      ) : null}
      </div>
      ) : (
      <div role="tabpanel" id="practice-panel-solution" aria-labelledby="practice-tab-solution" className="mt-5">
        <p className="mb-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Optimized reference — same contract as the prompt, written for interview time and complexity, not golf.
        </p>
        <CodeBlock>
          <code className={`language-${solutionLanguage}`}>{question.solution}</code>
        </CodeBlock>
      </div>
      )}

      {ready ? (
        <div className="mt-8">
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
        </div>
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
