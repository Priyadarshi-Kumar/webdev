import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Lightbulb,
  Play,
  RotateCcw,
  Search,
  SquareCheck,
  Terminal,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import {
  clearDraft,
  clampPracticeSplit,
  markPassed,
  readDraft,
  readPassedSlugs,
  readPracticeSplit,
  writeDraft,
  writePracticeSplit,
} from "@webdev/store";
import type { PracticeGroup, PracticeQuestion } from "@webdev/types";
import type { PracticeRunResult } from "@webdev/utils";
import { runPracticeCode } from "@webdev/utils";
import { getPracticeQuestion, practiceGroups, practiceQuestions } from "./data";

type TopicFilter = PracticeGroup | "all";

export function PracticeWorkspace({ selectedSlug }: { selectedSlug?: string }) {
  const [passed, setPassed] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPassed(readPassedSlugs());
    setReady(true);
  }, []);

  const question = selectedSlug ? getPracticeQuestion(selectedSlug) : undefined;
  const passedCount = ready ? passed.filter((slug) => practiceQuestions.some((item) => item.slug === slug)).length : 0;

  if (question) {
    return (
      <PracticeKata
        question={question}
        passed={passed}
        ready={ready}
        onPassed={(slug) => {
          markPassed(slug);
          setPassed(readPassedSlugs());
        }}
      />
    );
  }

  return <PracticeHub passed={passed} passedCount={passedCount} ready={ready} />;
}

function PracticeHub({
  passed,
  passedCount,
  ready,
}: {
  passed: string[];
  passedCount: number;
  ready: boolean;
}) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<TopicFilter>("all");

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (practiceGroups.some((group) => group.id === hash)) {
      setTopic(hash as PracticeGroup);
    }
  }, []);

  const needle = query.trim().toLowerCase();
  const visible = useMemo(() => {
    const byTopic = topic === "all" ? practiceQuestions : practiceQuestions.filter((item) => item.group === topic);
    if (!needle) return byTopic;
    return byTopic.filter(
      (item) =>
        item.title.toLowerCase().includes(needle) ||
        item.description.toLowerCase().includes(needle) ||
        item.slug.includes(needle) ||
        item.fnName.toLowerCase().includes(needle) ||
        item.group.includes(needle),
    );
  }, [needle, topic]);

  const sections = practiceGroups
    .map((group) => ({
      ...group,
      items: visible.filter((item) => item.group === group.id),
    }))
    .filter((section) => section.items.length > 0);

  function selectTopic(next: TopicFilter) {
    setTopic(next);
    const hash = next === "all" ? "" : `#${next}`;
    window.history.replaceState(null, "", `${window.location.pathname}${hash}`);
  }

  return (
    <div className="pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <header className="max-w-3xl">
        <p className="eyebrow">JavaScript</p>
        <h1 className="page-title">
          Practice <span className="text-gradient">by topic</span>
        </h1>
        <p className="page-lead">
          Pick a topic, open a question, write the function in the browser, then Check. Nothing is uploaded. Progress
          stays on this device.
        </p>
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          {ready ? `${passedCount} / ${practiceQuestions.length} questions passed` : "Progress is saved in this browser."}
        </p>
      </header>

      <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-start sm:gap-4">
        <label className="relative block min-w-0 flex-1">
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
            placeholder="Search by title, function, or topic"
            autoComplete="off"
            enterKeyHint="search"
            className="field min-h-11"
          />
        </label>
      </div>

      <TopicChips
        className="mt-4"
        topic={topic}
        passed={passed}
        onChange={selectTopic}
      />

      {sections.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-400">
          Nothing matches “{query.trim()}”. Clear search or pick another topic.
        </p>
      ) : (
        <div className="mt-8 space-y-10">
          {sections.map((section) => {
            const total = practiceQuestions.filter((item) => item.group === section.id).length;
            const done = section.items.filter((item) => passed.includes(item.slug)).length;
            return (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="font-display text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl dark:text-white">
                      {section.label}
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {section.description}
                    </p>
                  </div>
                  <p className="text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                    {ready ? `${done} / ${total} passed` : `${total} questions`}
                  </p>
                </div>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {section.items.map((item) => (
                    <li key={item.slug}>
                      <QuestionCard question={item} done={passed.includes(item.slug)} />
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

function TopicChips({
  topic,
  passed,
  onChange,
  className = "",
}: {
  topic: TopicFilter;
  passed: string[];
  onChange: (id: TopicFilter) => void;
  className?: string;
}) {
  const chips: { id: TopicFilter; label: string; count: number; done: number }[] = [
    {
      id: "all",
      label: "All topics",
      count: practiceQuestions.length,
      done: passed.filter((slug) => practiceQuestions.some((item) => item.slug === slug)).length,
    },
    ...practiceGroups.map((group) => {
      const items = practiceQuestions.filter((item) => item.group === group.id);
      return {
        id: group.id,
        label: group.label,
        count: items.length,
        done: items.filter((item) => passed.includes(item.slug)).length,
      };
    }),
  ];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`.trim()} role="group" aria-label="Filter by topic">
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
              {chip.done}/{chip.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function QuestionCard({ question, done }: { question: PracticeQuestion; done: boolean }) {
  return (
    <a href={`/practice/${question.slug}`} className="card block h-full p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600 dark:text-sky-400">
          {question.difficulty}
        </p>
        {done ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
            <Check size={12} aria-hidden />
            Passed
          </span>
        ) : (
          <span className="text-[11px] font-medium text-zinc-400">Open</span>
        )}
      </div>
      <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">
        {question.title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{question.description}</p>
      <p className="mt-3 break-all font-mono text-xs text-zinc-500 dark:text-zinc-400">{question.signature}</p>
    </a>
  );
}

function PracticeKata({
  question,
  passed,
  ready,
  onPassed,
}: {
  question: PracticeQuestion;
  passed: string[];
  ready: boolean;
  onPassed: (slug: string) => void;
}) {
  const group = practiceGroups.find((item) => item.id === question.group) ?? practiceGroups[0];
  const inTopic = practiceQuestions.filter((item) => item.group === question.group);
  const index = inTopic.findIndex((item) => item.slug === question.slug);
  const prev = index > 0 ? inTopic[index - 1] : undefined;
  const next = index >= 0 && index < inTopic.length - 1 ? inTopic[index + 1] : undefined;

  const [code, setCode] = useState(question.starter);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<PracticeRunResult | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const draft = readDraft(question.slug);
    setCode(draft ?? question.starter);
    setResult(null);
    setShowHint(false);
  }, [question.slug, question.starter]);

  const onCodeChange = useCallback(
    (value: string) => {
      setCode(value);
      writeDraft(question.slug, value);
    },
    [question.slug],
  );

  async function run(mode: "run" | "check") {
    setBusy(true);
    setResult(null);
    const nextResult = await runPracticeCode(code, {
      fnName: question.fnName,
      mode,
      tests: question.tests,
    });
    setResult(nextResult);
    setBusy(false);
    if (mode === "check" && nextResult.ok) onPassed(question.slug);
  }

  function reset() {
    clearDraft(question.slug);
    setCode(question.starter);
    setResult(null);
  }

  const done = passed.includes(question.slug);

  return (
    <div className="-mx-1 flex min-h-0 flex-col lg:-mx-2">
      <header className="mb-3 flex min-w-0 items-center gap-2 sm:mb-4">
        <a
          href={`/practice#${group.id}`}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-zinc-600 hover:text-sky-700 dark:text-zinc-400 dark:hover:text-sky-300"
        >
          <ChevronLeft size={16} aria-hidden />
          {group.label}
        </a>
        <h1 className="min-w-0 flex-1 truncate font-display text-lg font-semibold tracking-tight text-zinc-950 sm:text-xl dark:text-white">
          {question.title}
        </h1>
        {ready && done ? (
          <span className="hidden shrink-0 items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 sm:inline-flex dark:text-emerald-300">
            <Check size={12} aria-hidden />
            Passed
          </span>
        ) : null}
        <select
          className="tool-input hidden max-w-[10rem] shrink py-1.5 text-xs sm:block md:max-w-[14rem]"
          value={question.slug}
          aria-label={`Questions in ${group.label}`}
          onChange={(event) => {
            window.location.href = `/practice/${event.target.value}`;
          }}
        >
          {inTopic.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.title}
              {passed.includes(item.slug) ? " ✓" : ""}
            </option>
          ))}
        </select>
        <div className="flex shrink-0">
          {prev ? (
            <a href={`/practice/${prev.slug}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white" aria-label={`Previous: ${prev.title}`}>
              <ChevronLeft size={16} aria-hidden />
            </a>
          ) : (
            <span className="inline-flex h-9 w-9 items-center justify-center text-zinc-300 dark:text-zinc-700" aria-hidden>
              <ChevronLeft size={16} />
            </span>
          )}
          {next ? (
            <a href={`/practice/${next.slug}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white" aria-label={`Next: ${next.title}`}>
              <ChevronRight size={16} aria-hidden />
            </a>
          ) : (
            <span className="inline-flex h-9 w-9 items-center justify-center text-zinc-300 dark:text-zinc-700" aria-hidden>
              <ChevronRight size={16} />
            </span>
          )}
        </div>
      </header>

      <SplitPanes
        first={
          <div className="space-y-4 p-4 sm:p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600 dark:text-sky-400">
                {group.label}
                <span className="mx-1.5 text-zinc-300 dark:text-zinc-600">·</span>
                <span className={question.difficulty === "easy" ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}>
                  {question.difficulty}
                </span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{question.prompt}</p>
              <p className="mt-3 break-all font-mono text-xs text-zinc-500 dark:text-zinc-400">{question.signature}</p>
            </div>
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">Examples</h2>
              <ul className="mt-2 divide-y divide-zinc-200/80 overflow-hidden rounded-xl border border-zinc-200/80 dark:divide-white/10 dark:border-white/10">
                {question.examples.map((example) => (
                  <li key={example.call} className="flex flex-col gap-0.5 bg-zinc-50/80 px-3 py-2 font-mono text-xs dark:bg-zinc-950/40">
                    <span className="break-all text-zinc-700 dark:text-zinc-200">{example.call}</span>
                    <span className="break-all text-emerald-700 dark:text-emerald-300">→ {example.result}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">Notes</h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {question.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setShowHint((open) => !open)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-sky-700 dark:text-zinc-400 dark:hover:text-sky-300"
                aria-expanded={showHint}
              >
                <Lightbulb size={14} aria-hidden />
                {showHint ? "Hide hint" : "Hint"}
              </button>
              {showHint ? (
                <p className="mt-2 rounded-xl border border-amber-400/25 bg-amber-400/10 px-3 py-2 font-mono text-xs leading-relaxed text-amber-900 dark:text-amber-100">
                  {question.hint}
                </p>
              ) : null}
            </div>
          </div>
        }
        second={
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-zinc-200/80 px-3 py-2 dark:border-white/10">
              <RunButtons busy={busy} onRun={run} onReset={reset} />
              <p className="hidden text-xs text-zinc-400 lg:block">⌘/Ctrl + Enter to check</p>
            </div>
            <label className="flex min-h-0 flex-1 flex-col p-3" id="practice-editor">
              <span className="sr-only">JavaScript editor</span>
              <textarea
                value={code}
                onChange={(event) => onCodeChange(event.target.value)}
                onKeyDown={(event) => {
                  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                    event.preventDefault();
                    void run("check");
                  }
                }}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                className="tool-input min-h-[12rem] flex-1 resize-none text-base leading-6 sm:text-sm"
                aria-label="JavaScript editor"
              />
            </label>
            {result ? (
              <div className="min-h-0 max-h-[40%] overflow-y-auto border-t border-zinc-200/80 px-3 py-3 dark:border-white/10">
                <ResultPanel result={result} />
              </div>
            ) : null}
          </div>
        }
      />
    </div>
  );
}

function SplitPanes({ first, second }: { first: ReactNode; second: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [pct, setPct] = useState(38);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    setPct(readPracticeSplit());
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setWide(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  function setSplit(next: number) {
    const clamped = clampPracticeSplit(next);
    setPct(clamped);
    writePracticeSplit(clamped);
  }

  function clientPct(event: { clientX: number; clientY: number }) {
    const root = rootRef.current;
    if (!root) return pct;
    const rect = root.getBoundingClientRect();
    if (wide) {
      const x = event.clientX - rect.left;
      return (x / rect.width) * 100;
    }
    const y = event.clientY - rect.top;
    return (y / rect.height) * 100;
  }

  function onPointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    document.body.classList.add("select-none");
  }

  function onPointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!dragging.current) return;
    setPct(clampPracticeSplit(clientPct(event)));
  }

  function onPointerUp(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!dragging.current) return;
    dragging.current = false;
    document.body.classList.remove("select-none");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setSplit(clientPct(event));
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const step = event.shiftKey ? 8 : 3;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      setSplit(pct - step);
    }
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      setSplit(pct + step);
    }
    if (event.key === "Home") {
      event.preventDefault();
      setSplit(22);
    }
    if (event.key === "End") {
      event.preventDefault();
      setSplit(68);
    }
  }

  return (
    <div
      ref={rootRef}
      className="flex h-[calc(100svh-11.5rem)] min-h-[28rem] flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/70 lg:h-[calc(100svh-10.5rem)] lg:flex-row dark:border-white/10 dark:bg-zinc-900/40"
    >
      <section
        aria-label="Question details"
        className="min-h-0 min-w-0 overflow-y-auto"
        style={{ flex: `0 0 ${pct}%` }}
      >
        {first}
      </section>
      <button
        type="button"
        aria-label="Resize details and editor"
        aria-orientation={wide ? "vertical" : "horizontal"}
        aria-valuemin={22}
        aria-valuemax={68}
        aria-valuenow={Math.round(pct)}
        title="Drag to resize. Double-click to reset."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={() => setSplit(38)}
        onKeyDown={onKeyDown}
        className="group relative z-10 flex h-3 w-full shrink-0 touch-none cursor-row-resize items-center justify-center bg-zinc-200/80 transition hover:bg-sky-400/40 lg:h-auto lg:w-3 lg:cursor-col-resize dark:bg-white/10 dark:hover:bg-sky-400/30"
      >
        <span
          className="h-1 w-8 rounded-full bg-zinc-400 group-hover:bg-sky-500 lg:h-8 lg:w-1 dark:bg-zinc-500 dark:group-hover:bg-sky-400"
          aria-hidden
        />
      </button>
      <section aria-label="Practice editor" className="min-h-0 min-w-0 flex-1 overflow-hidden">
        {second}
      </section>
    </div>
  );
}

function RunButtons({
  busy,
  onRun,
  onReset,
}: {
  busy: boolean;
  onRun: (mode: "run" | "check") => void;
  onReset: () => void;
}) {
  return (
    <>
      <button type="button" disabled={busy} onClick={() => void onRun("run")} className="btn-ghost min-h-10 gap-1.5 px-3 py-2 text-sm disabled:opacity-40">
        <Play size={15} aria-hidden />
        Run
      </button>
      <button type="button" disabled={busy} onClick={() => void onRun("check")} className="btn-primary min-h-10 gap-1.5 px-3 py-2 text-sm disabled:opacity-40">
        <SquareCheck size={15} aria-hidden />
        Check
      </button>
      <button type="button" disabled={busy} onClick={onReset} className="btn-ghost min-h-10 gap-1.5 px-3 py-2 text-sm disabled:opacity-40">
        <RotateCcw size={15} aria-hidden />
        Reset
      </button>
    </>
  );
}

function ResultPanel({ result }: { result: PracticeRunResult }) {
  return (
    <div className="space-y-3" aria-live="polite">
      {result.error ? (
        <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-800 dark:text-rose-200">
          {result.error}
        </p>
      ) : null}

      {result.checks ? (
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {result.ok ? <Check size={16} className="text-emerald-500" aria-hidden /> : <CircleHelp size={16} className="text-amber-500" aria-hidden />}
            {result.passedCount} / {result.totalCount} tests passed
            {result.ok ? " — marked complete on this device." : ""}
          </p>
          <ul className="space-y-1.5">
            {result.checks.map((check) => (
              <li
                key={check.label}
                className={`rounded-xl border px-3 py-2 text-sm ${
                  check.ok
                    ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-900 dark:text-emerald-100"
                    : "border-rose-400/25 bg-rose-400/10 text-rose-900 dark:text-rose-100"
                }`}
              >
                <span className="font-medium">{check.ok ? "Pass" : "Fail"}</span>
                <span className="mx-2 opacity-50">·</span>
                <span className="break-words">{check.label}</span>
                {check.ok ? null : (
                  <p className="mt-1 break-all font-mono text-xs opacity-90">
                    expected {check.expected}, received {check.received}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <p className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
          <Terminal size={12} aria-hidden />
          Console
        </p>
        <pre className="max-h-48 overflow-auto rounded-2xl border border-zinc-200/80 bg-zinc-950 px-3 py-2 font-mono text-xs leading-relaxed text-zinc-100 dark:border-white/10">
          {result.logs.length > 0
            ? result.logs.join("\n")
            : result.checks
              ? "(no console output)"
              : "Ran without throwing. Add console.log, or Check to grade tests."}
        </pre>
      </div>
    </div>
  );
}
