import type { PracticeGroup, PracticeQuestion } from "@webdev/types";
import { findBySlug } from "@webdev/utils";

export const practiceGroups: { id: PracticeGroup; label: string; description: string }[] = [
  { id: "basics", label: "Basics", description: "Return values, numbers, strings, and conditionals." },
  { id: "arrays", label: "Arrays", description: "Map, unique, chunk, and flatten collections." },
  { id: "objects", label: "Objects", description: "Pick keys and reshape plain objects." },
  { id: "functions", label: "Functions", description: "Closures, composition, and returned functions." },
  { id: "async", label: "Async", description: "Promises and async results the grader can await." },
];

export const practiceQuestions: PracticeQuestion[] = [
  {
    slug: "sum",
    title: "Add two numbers",
    description: "Return the sum of two numbers. First kata: name the function, return a value, then Check.",
    group: "basics",
    difficulty: "easy",
    fnName: "sum",
    signature: "sum(a, b) → number",
    prompt:
      "Write a function named sum that takes two numbers and returns their sum. Check calls that name with hidden inputs — console.log is for you, not the grader.",
    examples: [
      { call: "sum(2, 3)", result: "5" },
      { call: "sum(-4, 1)", result: "-3" },
    ],
    notes: [
      "Use a function declaration or a const plus arrow function, as long as the name sum exists.",
      "No import / export. This is a script, not a module.",
      "Return the number. Do not wrap it in a string.",
    ],
    hint: "return a + b;",
    starter: `function sum(a, b) {
  // return the sum
}
`,
    tests: [
      { label: "sum(2, 3) → 5", args: [2, 3], expected: 5 },
      { label: "sum(-4, 1) → -3", args: [-4, 1], expected: -3 },
      { label: "sum(0, 0) → 0", args: [0, 0], expected: 0 },
      { label: "sum(1.5, 2.25) → 3.75", args: [1.5, 2.25], expected: 3.75 },
    ],
  },
  {
    slug: "clamp",
    title: "Clamp a number",
    description: "Keep a value between a minimum and a maximum, inclusive.",
    group: "basics",
    difficulty: "easy",
    fnName: "clamp",
    signature: "clamp(value, min, max) → number",
    prompt:
      "Implement clamp(value, min, max). If value is below min, return min. If it is above max, return max. Otherwise return value. Assume min is less than or equal to max.",
    examples: [
      { call: "clamp(15, 0, 10)", result: "10" },
      { call: "clamp(-2, 0, 10)", result: "0" },
      { call: "clamp(7, 0, 10)", result: "7" },
    ],
    notes: [
      "Inclusive bounds: clamp(0, 0, 10) is 0 and clamp(10, 0, 10) is 10.",
      "Math.min and Math.max can express this in one expression.",
    ],
    hint: "return Math.min(max, Math.max(min, value));",
    starter: `function clamp(value, min, max) {
  // keep value inside [min, max]
}
`,
    tests: [
      { label: "above max", args: [15, 0, 10], expected: 10 },
      { label: "below min", args: [-2, 0, 10], expected: 0 },
      { label: "inside range", args: [7, 0, 10], expected: 7 },
      { label: "on the min", args: [0, 0, 10], expected: 0 },
      { label: "on the max", args: [10, 0, 10], expected: 10 },
    ],
  },
  {
    slug: "reverse-string",
    title: "Reverse a string",
    description: "Return a new string with the characters in reverse order.",
    group: "basics",
    difficulty: "easy",
    fnName: "reverseString",
    signature: "reverseString(text) → string",
    prompt:
      "Write reverseString(text) that returns a new string with the characters of text reversed. Do not mutate anything — strings are already immutable.",
    examples: [
      { call: 'reverseString("ab")', result: '"ba"' },
      { call: 'reverseString("")', result: '""' },
    ],
    notes: [
      "Unicode combining characters are out of scope; treat the string as a sequence of UTF-16 code units (the default for [...text] / split).",
      "Empty string should return empty string.",
    ],
    hint: 'return [...text].reverse().join("");',
    starter: `function reverseString(text) {
  // return the reversed string
}
`,
    tests: [
      { label: "two letters", args: ["ab"], expected: "ba" },
      { label: "empty", args: [""], expected: "" },
      { label: "word", args: ["code"], expected: "edoc" },
      { label: "spaces kept", args: ["a b"], expected: "b a" },
    ],
  },
  {
    slug: "fizzbuzz",
    title: "FizzBuzz value",
    description: "Map one number to Fizz, Buzz, FizzBuzz, or the number as a string.",
    group: "basics",
    difficulty: "easy",
    fnName: "fizzBuzz",
    signature: "fizzBuzz(n) → string",
    prompt:
      "Write fizzBuzz(n) for a single integer n. Return \"FizzBuzz\" if n is divisible by both 3 and 5, \"Fizz\" if only by 3, \"Buzz\" if only by 5, otherwise the decimal string of n (for example 1 → \"1\").",
    examples: [
      { call: "fizzBuzz(3)", result: '"Fizz"' },
      { call: "fizzBuzz(5)", result: '"Buzz"' },
      { call: "fizzBuzz(15)", result: '"FizzBuzz"' },
      { call: "fizzBuzz(2)", result: '"2"' },
    ],
    notes: [
      "Check 15 before 3 or 5, or use both conditions together.",
      "The return type is always a string — even when n is not Fizz or Buzz.",
    ],
    hint: 'If n % 15 === 0 return "FizzBuzz". Else if n % 3 === 0 return "Fizz". Else if n % 5 === 0 return "Buzz". Else return String(n).',
    starter: `function fizzBuzz(n) {
  // return "Fizz", "Buzz", "FizzBuzz", or String(n)
}
`,
    tests: [
      { label: "divisible by 3", args: [3], expected: "Fizz" },
      { label: "divisible by 5", args: [5], expected: "Buzz" },
      { label: "divisible by 15", args: [15], expected: "FizzBuzz" },
      { label: "neither", args: [2], expected: "2" },
      { label: "30 is FizzBuzz", args: [30], expected: "FizzBuzz" },
      { label: "7 as string", args: [7], expected: "7" },
    ],
  },
  {
    slug: "unique",
    title: "Unique values",
    description: "Return unique array values in first-seen order.",
    group: "arrays",
    difficulty: "easy",
    fnName: "unique",
    signature: "unique(items) → array",
    prompt:
      "Write unique(items) that returns a new array of the values in items with duplicates removed, keeping the first occurrence of each value. Use SameValueZero equality (what Set uses): NaN matches NaN, and 0 is distinct from \"0\".",
    examples: [
      { call: "unique([1, 1, 2, 1])", result: "[1, 2]" },
      { call: 'unique(["a", "b", "a"])', result: '["a", "b"]' },
    ],
    notes: [
      "Do not sort. Order is first-seen.",
      "A Set walks insertion order — converting through Set is enough for primitives.",
    ],
    hint: "return [...new Set(items)];",
    starter: `function unique(items) {
  // return unique values, first-seen order
}
`,
    tests: [
      { label: "numbers", args: [[1, 1, 2, 1]], expected: [1, 2] },
      { label: "strings", args: [["a", "b", "a"]], expected: ["a", "b"] },
      { label: "empty", args: [[]], expected: [] },
      { label: "already unique", args: [[3, 2, 1]], expected: [3, 2, 1] },
    ],
  },
  {
    slug: "chunk",
    title: "Chunk an array",
    description: "Split an array into subarrays of a given size. The last chunk may be smaller.",
    group: "arrays",
    difficulty: "medium",
    fnName: "chunk",
    signature: "chunk(items, size) → array[]",
    prompt:
      "Write chunk(items, size) that splits items into a new array of chunks, each of length size, except possibly the last chunk if items.length is not a multiple of size. size is a positive integer.",
    examples: [
      { call: "chunk([1, 2, 3, 4, 5], 2)", result: "[[1, 2], [3, 4], [5]]" },
      { call: "chunk([1, 2, 3], 5)", result: "[[1, 2, 3]]" },
    ],
    notes: [
      "Return a new array. Do not mutate items.",
      "size of 1 should yield one-element chunks.",
      "An empty input should return [].",
    ],
    hint: "Loop with i += size and push items.slice(i, i + size).",
    starter: `function chunk(items, size) {
  // return an array of chunks
}
`,
    tests: [
      { label: "leftover last chunk", args: [[1, 2, 3, 4, 5], 2], expected: [[1, 2], [3, 4], [5]] },
      { label: "size larger than length", args: [[1, 2, 3], 5], expected: [[1, 2, 3]] },
      { label: "exact fit", args: [[1, 2, 3, 4], 2], expected: [[1, 2], [3, 4]] },
      { label: "size 1", args: [[9, 8], 1], expected: [[9], [8]] },
      { label: "empty", args: [[], 3], expected: [] },
    ],
  },
  {
    slug: "flatten",
    title: "Flatten one level",
    description: "Flatten an array one level deep — nested arrays become elements, deeper nesting stays.",
    group: "arrays",
    difficulty: "medium",
    fnName: "flatten",
    signature: "flatten(items) → array",
    prompt:
      "Write flatten(items) that returns a new array one level flatter. Nested arrays are concatenated; values that are not arrays stay as they are. Do not flatten recursively — [[1, [2]], 3] becomes [1, [2], 3].",
    examples: [
      { call: "flatten([1, [2, 3], 4])", result: "[1, 2, 3, 4]" },
      { call: "flatten([1, [2, [3]], 4])", result: "[1, 2, [3], 4]" },
    ],
    notes: [
      "Array.prototype.flat(1) is allowed.",
      "Empty nested arrays contribute nothing.",
    ],
    hint: "return items.flat(1);  — or concat in a loop.",
    starter: `function flatten(items) {
  // flatten exactly one level
}
`,
    tests: [
      { label: "one nested array", args: [[1, [2, 3], 4]], expected: [1, 2, 3, 4] },
      { label: "leave deeper arrays", args: [[1, [2, [3]], 4]], expected: [1, 2, [3], 4] },
      { label: "already flat", args: [[1, 2, 3]], expected: [1, 2, 3] },
      { label: "empty nested", args: [[1, [], 2]], expected: [1, 2] },
    ],
  },
  {
    slug: "pick",
    title: "Pick object keys",
    description: "Build a new object with only the listed keys that exist on the source.",
    group: "objects",
    difficulty: "easy",
    fnName: "pick",
    signature: "pick(source, keys) → object",
    prompt:
      "Write pick(source, keys) that returns a new object. For each string in keys, if source has an own property with that name, copy it. Skip missing keys. Do not mutate source.",
    examples: [
      { call: 'pick({ a: 1, b: 2, c: 3 }, ["a", "c"])', result: "{ a: 1, c: 3 }" },
      { call: 'pick({ a: 1 }, ["b"])', result: "{}" },
    ],
    notes: [
      "Use Object.hasOwn(source, key) or Object.prototype.hasOwnProperty.call so inherited keys are not copied.",
      "Values can be 0, false, or null — still copy them if the key exists.",
    ],
    hint: "Start with {}. For each key, if Object.hasOwn(source, key) then result[key] = source[key].",
    starter: `function pick(source, keys) {
  // return a new object with only those keys
}
`,
    tests: [
      { label: "two keys", args: [{ a: 1, b: 2, c: 3 }, ["a", "c"]], expected: { a: 1, c: 3 } },
      { label: "missing key skipped", args: [{ a: 1 }, ["b"]], expected: {} },
      { label: "falsy value kept", args: [{ a: 0, b: 2 }, ["a"]], expected: { a: 0 } },
      { label: "empty keys", args: [{ a: 1 }, []], expected: {} },
    ],
  },
  {
    slug: "invert",
    title: "Invert keys and values",
    description: "Swap own enumerable keys and values. Values become string keys.",
    group: "objects",
    difficulty: "medium",
    fnName: "invert",
    signature: "invert(source) → object",
    prompt:
      "Write invert(source) that returns a new object. Each own enumerable key of source becomes a value, and each value becomes a key via String(value). If two values stringify the same, the later key wins.",
    examples: [
      { call: "invert({ a: 1, b: 2 })", result: '{ "1": "a", "2": "b" }' },
      { call: "invert({ a: 1, b: 1 })", result: '{ "1": "b" }' },
    ],
    notes: [
      "Object keys are always strings (or symbols — ignore symbols here).",
      "Number values become \"1\", \"2\", and so on.",
    ],
    hint: "for (const [key, value] of Object.entries(source)) result[String(value)] = key;",
    starter: `function invert(source) {
  // keys become values, values become keys
}
`,
    tests: [
      { label: "numbers to string keys", args: [{ a: 1, b: 2 }], expected: { "1": "a", "2": "b" } },
      { label: "later duplicate wins", args: [{ a: 1, b: 1 }], expected: { "1": "b" } },
      { label: "empty", args: [{}], expected: {} },
      { label: "string values", args: [{ x: "y" }], expected: { y: "x" } },
    ],
  },
  {
    slug: "make-counter",
    title: "Make a counter",
    description: "Return a function that closes over a count and increments it on every call.",
    group: "functions",
    difficulty: "medium",
    fnName: "makeCounter",
    signature: "makeCounter(start) → () → number",
    prompt:
      "Write makeCounter(start) that returns a new function. Each time that inner function is called with no arguments, increment the closed-over count by 1 and return it. The first call after makeCounter(0) returns 1. Two counters must not share state.",
    examples: [
      { call: "const c = makeCounter(0); c(); c();", result: "1 then 2" },
      { call: "makeCounter(10)()", result: "11" },
    ],
    notes: [
      "The increment lives in the outer function’s scope (let n = start), not on a global.",
      "Each call to makeCounter allocates a new n.",
    ],
    hint: "let n = start; return function () { n += 1; return n; };",
    starter: `function makeCounter(start) {
  // return a function that increments and returns the next value
}
`,
    tests: [
      {
        label: "0 → 1, 2, 3",
        expected: [1, 2, 3],
        run: "const c = fn(0); return [c(), c(), c()];",
      },
      {
        label: "start at 10",
        expected: [11, 12],
        run: "const c = fn(10); return [c(), c()];",
      },
      {
        label: "two counters are independent",
        expected: [1, 1, 2],
        run: "const a = fn(0); const b = fn(0); return [a(), b(), a()];",
      },
    ],
  },
  {
    slug: "compose",
    title: "Compose two functions",
    description: "Return a function that applies g then f — compose(f, g)(x) is f(g(x)).",
    group: "functions",
    difficulty: "medium",
    fnName: "compose",
    signature: "compose(f, g) → (x) → result",
    prompt:
      "Write compose(f, g) that returns a function of one argument x. Calling that function should return f(g(x)) — g runs first. Do not call f or g until the inner function is invoked.",
    examples: [
      { call: "compose(add1, double)(3)  // add1(double(3))", result: "7" },
      { call: "compose(double, add1)(3)", result: "8" },
    ],
    notes: [
      "Right-to-left is the usual math order: (f ∘ g)(x) = f(g(x)).",
      "Return a new function; do not invoke f(g(x)) inside compose itself.",
    ],
    hint: "return function (x) { return f(g(x)); };",
    starter: `function compose(f, g) {
  // return a function that runs g, then f
}
`,
    tests: [
      {
        label: "add1(double(3)) → 7",
        expected: 7,
        run: "const add1 = (n) => n + 1; const double = (n) => n * 2; return fn(add1, double)(3);",
      },
      {
        label: "double(add1(3)) → 8",
        expected: 8,
        run: "const add1 = (n) => n + 1; const double = (n) => n * 2; return fn(double, add1)(3);",
      },
      {
        label: "does not call f until the inner function runs",
        expected: 0,
        run: "let calls = 0; const f = (n) => { calls += 1; return n; }; const g = (n) => n; fn(f, g); return calls;",
      },
    ],
  },
  {
    slug: "double-later",
    title: "Resolve a doubled value",
    description: "Return a promise that resolves to twice the input. Check awaits it.",
    group: "async",
    difficulty: "easy",
    fnName: "doubleLater",
    signature: "doubleLater(n) → Promise<number>",
    prompt:
      "Write doubleLater(n) that returns a Promise which resolves to n * 2. You do not need setTimeout — Promise.resolve is enough. Returning a bare number will fail because Check expects a thenable.",
    examples: [
      { call: "await doubleLater(4)", result: "8" },
      { call: "await doubleLater(0)", result: "0" },
    ],
    notes: [
      "async function doubleLater(n) { return n * 2; } also works — async always returns a promise.",
      "Rejecting or throwing fails the test.",
    ],
    hint: "return Promise.resolve(n * 2);",
    starter: `function doubleLater(n) {
  // return a promise for n * 2
}
`,
    tests: [
      { label: "double 4", args: [4], expected: 8 },
      { label: "double 0", args: [0], expected: 0 },
      { label: "double -3", args: [-3], expected: -6 },
    ],
  },
];

export function getPracticeQuestion(slug: string): PracticeQuestion | undefined {
  return findBySlug(practiceQuestions, slug);
}
