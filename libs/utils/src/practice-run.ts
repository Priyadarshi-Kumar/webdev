import type { PracticeTest } from "@webdev/types";

export type PracticeRunMode = "run" | "check";

export type PracticeCheckResult = {
  label: string;
  ok: boolean;
  expected: string;
  received: string;
};

export type PracticeRunResult = {
  ok: boolean;
  logs: string[];
  error?: string;
  checks?: PracticeCheckResult[];
  passedCount?: number;
  totalCount?: number;
};

type WorkerResponse = PracticeRunResult & { id: number };

const WORKER_SOURCE = `"use strict";
function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every(function (item, index) { return deepEqual(item, b[index]); });
  }
  if (typeof a === "object" && typeof b === "object") {
    var leftKeys = Object.keys(a).sort();
    var rightKeys = Object.keys(b).sort();
    if (leftKeys.length !== rightKeys.length) return false;
    return leftKeys.every(function (key, index) {
      return key === rightKeys[index] && deepEqual(a[key], b[key]);
    });
  }
  return false;
}
function formatValue(value) {
  if (value === undefined) return "undefined";
  if (typeof value === "number" && Number.isNaN(value)) return "NaN";
  if (typeof value === "function") return "[Function]";
  if (typeof value === "symbol") return String(value);
  if (typeof value === "bigint") return String(value) + "n";
  if (typeof value === "string") return JSON.stringify(value);
  try { return JSON.stringify(value); } catch (err) { return String(value); }
}
function captureConsole() {
  var logs = [];
  function write(args) {
    logs.push(Array.prototype.map.call(args, formatValue).join(" "));
  }
  console.log = function () { write(arguments); };
  console.info = function () { write(arguments); };
  console.warn = function () { write(arguments); };
  console.error = function () { write(arguments); };
  return logs;
}
self.onmessage = async function (event) {
  var data = event.data;
  var logs = captureConsole();
  try {
    var factory = new Function(data.source + "\\n; return typeof " + data.fnName + " === \\"function\\" ? " + data.fnName + " : undefined;");
    var fn = factory();
    if (data.mode === "run") {
      self.postMessage({ id: data.id, ok: true, logs: logs.slice() });
      return;
    }
    if (typeof fn !== "function") {
      self.postMessage({
        id: data.id,
        ok: false,
        logs: logs.slice(),
        error: "No function named " + data.fnName + "(). Declare it in your editor — that is what Check calls.",
      });
      return;
    }
    var checks = [];
    for (var i = 0; i < data.tests.length; i++) {
      var test = data.tests[i];
      try {
        var got;
        if (test.run) {
          var exec = new Function("fn", '"use strict"; return (async function () { ' + test.run + " })();");
          got = await exec(fn);
        } else {
          got = await fn.apply(undefined, test.args || []);
        }
        var ok = deepEqual(got, test.expected);
        checks.push({
          label: test.label,
          ok: ok,
          expected: formatValue(test.expected),
          received: formatValue(got),
        });
      } catch (err) {
        checks.push({
          label: test.label,
          ok: false,
          expected: formatValue(test.expected),
          received: err && err.message ? err.message : String(err),
        });
      }
    }
    var passedCount = checks.filter(function (item) { return item.ok; }).length;
    self.postMessage({
      id: data.id,
      ok: passedCount === checks.length,
      logs: logs.slice(),
      checks: checks,
      passedCount: passedCount,
      totalCount: checks.length,
    });
  } catch (err) {
    self.postMessage({
      id: data.id,
      ok: false,
      logs: logs.slice(),
      error: err && err.message ? err.message : String(err),
    });
  }
};
`;

let requestId = 0;

export function runPracticeCode(
  source: string,
  options: {
    fnName: string;
    mode: PracticeRunMode;
    tests?: PracticeTest[];
    timeoutMs?: number;
  },
): Promise<PracticeRunResult> {
  if (typeof window === "undefined" || typeof Worker === "undefined") {
    return Promise.resolve({ ok: false, logs: [], error: "The runner only works in the browser." });
  }

  const timeoutMs = options.timeoutMs ?? 2500;
  const id = ++requestId;
  const blob = new Blob([WORKER_SOURCE], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve) => {
    const worker = new Worker(url);
    let settled = false;

    const finish = (result: PracticeRunResult) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(result);
    };

    const timer = window.setTimeout(() => {
      finish({
        ok: false,
        logs: [],
        error: `Timed out after ${timeoutMs}ms. Check for an infinite loop, then Run again.`,
      });
    }, timeoutMs);

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      if (event.data?.id !== id) return;
      const { id: _id, ...result } = event.data;
      finish(result);
    };
    worker.onerror = (event) => {
      finish({ ok: false, logs: [], error: event.message || "The worker failed to start." });
    };

    worker.postMessage({
      id,
      source,
      fnName: options.fnName,
      mode: options.mode,
      tests: options.tests ?? [],
    });
  });
}
