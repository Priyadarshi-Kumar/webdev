import type { PracticeDifficulty, PracticeGroup, PracticeQuestion } from "@webdev/types";
import { findBySlug } from "@webdev/utils";

export const practiceDifficulties: { id: PracticeDifficulty; label: string }[] = [
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
];

export const difficultyOrder: Record<PracticeDifficulty, number> = { easy: 0, medium: 1, hard: 2 };

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
  {
    slug: "palindrome",
    title: "Palindrome",
    description: "Return whether a string reads the same forwards and backwards.",
    group: "basics",
    difficulty: "easy",
    fnName: "isPalindrome",
    signature: "isPalindrome(text) → boolean",
    prompt:
      "Write isPalindrome(text) that returns true when text is the same as its reverse. Compare characters as-is: case, spaces, and punctuation all count. Empty string is a palindrome.",
    examples: [
      { call: 'isPalindrome("aba")', result: "true" },
      { call: 'isPalindrome("ab")', result: "false" },
      { call: 'isPalindrome("")', result: "true" },
    ],
    notes: ["Do not ignore case: \"Aa\" is not a palindrome.", "Single-character strings are palindromes."],
    hint: 'return text === [...text].reverse().join("");',
    starter: `function isPalindrome(text) {
  // return true if text equals its reverse
}
`,
    tests: [
      { label: "odd length", args: ["aba"], expected: true },
      { label: "not a palindrome", args: ["ab"], expected: false },
      { label: "empty", args: [""], expected: true },
      { label: "case sensitive", args: ["Aa"], expected: false },
      { label: "one character", args: ["z"], expected: true },
    ],
  },
  {
    slug: "factorial",
    title: "Factorial",
    description: "Return n! for a non-negative integer. 0! is 1.",
    group: "basics",
    difficulty: "easy",
    fnName: "factorial",
    signature: "factorial(n) → number",
    prompt:
      "Write factorial(n) for a non-negative integer n. Return the product 1 × 2 × … × n. By definition factorial(0) is 1. n will be small enough that the result fits in a JS number.",
    examples: [
      { call: "factorial(0)", result: "1" },
      { call: "factorial(5)", result: "120" },
    ],
    notes: ["Do not recurse into negative n — it will not be passed.", "A loop or a recursive call both work."],
    hint: "Start at 1 and multiply from 2 through n.",
    starter: `function factorial(n) {
  // return n!
}
`,
    tests: [
      { label: "0! is 1", args: [0], expected: 1 },
      { label: "1! is 1", args: [1], expected: 1 },
      { label: "5! is 120", args: [5], expected: 120 },
      { label: "6! is 720", args: [6], expected: 720 },
    ],
  },
  {
    slug: "range",
    title: "Inclusive range",
    description: "Build an array of integers from start through end, inclusive.",
    group: "basics",
    difficulty: "medium",
    fnName: "range",
    signature: "range(start, end) → number[]",
    prompt:
      "Write range(start, end) that returns every integer from start through end, inclusive, in increasing order. If start is greater than end, return an empty array. start and end are integers.",
    examples: [
      { call: "range(1, 4)", result: "[1, 2, 3, 4]" },
      { call: "range(3, 3)", result: "[3]" },
      { call: "range(5, 2)", result: "[]" },
    ],
    notes: ["Inclusive on both ends.", "Negative numbers are allowed."],
    hint: "for (let i = start; i <= end; i++) push i.",
    starter: `function range(start, end) {
  // return [start, start+1, …, end]
}
`,
    tests: [
      { label: "1 through 4", args: [1, 4], expected: [1, 2, 3, 4] },
      { label: "single value", args: [3, 3], expected: [3] },
      { label: "start after end", args: [5, 2], expected: [] },
      { label: "negatives", args: [-2, 1], expected: [-2, -1, 0, 1] },
    ],
  },
  {
    slug: "anagram",
    title: "Anagram",
    description: "Decide if two strings use the same letters, ignoring case and spaces.",
    group: "basics",
    difficulty: "medium",
    fnName: "isAnagram",
    signature: "isAnagram(a, b) → boolean",
    prompt:
      "Write isAnagram(a, b) that returns true when a and b contain the same letters. Ignore case and spaces. Other punctuation will not appear. Empty strings are anagrams of each other.",
    examples: [
      { call: 'isAnagram("listen", "silent")', result: "true" },
      { call: 'isAnagram("Hello", "ole lh")', result: "true" },
      { call: 'isAnagram("cat", "car")', result: "false" },
    ],
    notes: ["Sort the remaining letters after normalizing, or count frequencies.", "\"a a\" and \"aa\" are anagrams."],
    hint: 'Normalize with toLowerCase and split/filter spaces, then sort and join.',
    starter: `function isAnagram(a, b) {
  // ignore case and spaces
}
`,
    tests: [
      { label: "listen / silent", args: ["listen", "silent"], expected: true },
      { label: "spaces and case", args: ["Hello", "ole lh"], expected: true },
      { label: "different letters", args: ["cat", "car"], expected: false },
      { label: "empties", args: ["", ""], expected: true },
      { label: "length mismatch after spaces", args: ["ab", "a"], expected: false },
    ],
  },
  {
    slug: "valid-parens",
    title: "Valid parentheses",
    description: "Check that (), [], and {} are balanced and correctly nested.",
    group: "basics",
    difficulty: "hard",
    fnName: "validParens",
    signature: "validParens(text) → boolean",
    prompt:
      "Write validParens(text) for a string made only of (), [], and {}. Return true when every opener has a matching closer of the same type, in the right order. Empty string is valid.",
    examples: [
      { call: 'validParens("()[]{}")', result: "true" },
      { call: 'validParens("([)]")', result: "false" },
      { call: 'validParens("{[]}")', result: "true" },
    ],
    notes: ["A stack of openers is the usual approach.", "A closer with an empty stack is invalid."],
    hint: "Push openers. On a closer, pop and check it matches.",
    starter: `function validParens(text) {
  // return whether brackets are balanced
}
`,
    tests: [
      { label: "simple pairs", args: ["()[]{}"], expected: true },
      { label: "nested", args: ["{[]}"], expected: true },
      { label: "crossed", args: ["([)]"], expected: false },
      { label: "empty", args: [""], expected: true },
      { label: "only closer", args: [")"], expected: false },
      { label: "unclosed", args: ["(()"], expected: false },
    ],
  },
  {
    slug: "intersection",
    title: "Intersection",
    description: "Values that appear in both arrays, first-seen order from the first array.",
    group: "arrays",
    difficulty: "easy",
    fnName: "intersection",
    signature: "intersection(a, b) → array",
    prompt:
      "Write intersection(a, b) that returns a new array of values that appear in both a and b. Keep the order of first appearance in a. Each value at most once. Use SameValueZero (a Set is fine) for membership in b.",
    examples: [
      { call: "intersection([1, 2, 2, 3], [2, 4])", result: "[2]" },
      { call: "intersection([1, 2], [3])", result: "[]" },
    ],
    notes: ["Do not mutate the inputs.", "If a has 2 twice and b has 2, the result still has 2 once."],
    hint: "const set = new Set(b); then filter unique values from a that set.has.",
    starter: `function intersection(a, b) {
  // values in both, order from a
}
`,
    tests: [
      { label: "shared 2", args: [[1, 2, 2, 3], [2, 4]], expected: [2] },
      { label: "none", args: [[1, 2], [3]], expected: [] },
      { label: "preserves a order", args: [[3, 1, 2], [1, 2, 3]], expected: [3, 1, 2] },
      { label: "empty a", args: [[], [1]], expected: [] },
    ],
  },
  {
    slug: "zip",
    title: "Zip two arrays",
    description: "Pair items at the same index. Stop at the shorter array.",
    group: "arrays",
    difficulty: "medium",
    fnName: "zip",
    signature: "zip(a, b) → array[]",
    prompt:
      "Write zip(a, b) that returns an array of [a[i], b[i]] pairs. Length is the minimum of a.length and b.length.",
    examples: [
      { call: 'zip([1, 2, 3], ["a", "b"])', result: '[[1, "a"], [2, "b"]]' },
      { call: "zip([], [1])", result: "[]" },
    ],
    notes: ["Do not pad the shorter side.", "Pairs are two-element arrays."],
    hint: "Loop to Math.min(a.length, b.length) and push [a[i], b[i]].",
    starter: `function zip(a, b) {
  // pair by index, stop at the shorter
}
`,
    tests: [
      { label: "b shorter", args: [[1, 2, 3], ["a", "b"]], expected: [[1, "a"], [2, "b"]] },
      { label: "a shorter", args: [[1], [9, 8, 7]], expected: [[1, 9]] },
      { label: "empty", args: [[], [1]], expected: [] },
      { label: "same length", args: [[1, 2], [3, 4]], expected: [[1, 3], [2, 4]] },
    ],
  },
  {
    slug: "group-by",
    title: "Group by",
    description: "Bucket objects by a key function into an object of arrays.",
    group: "arrays",
    difficulty: "medium",
    fnName: "groupBy",
    signature: "groupBy(items, keyFn) → object",
    prompt:
      "Write groupBy(items, keyFn) that returns an object. For each item, call keyFn(item) to get a string (or number) key and push the item onto that key’s array, preserving order. Do not mutate items.",
    examples: [
      { call: "groupBy([{t:\"a\"},{t:\"b\"},{t:\"a\"}], x => x.t)", result: '{ a: [{t:"a"},{t:"a"}], b: [{t:"b"}] }' },
    ],
    notes: ["Create arrays as keys appear.", "Number keys become string keys on the object."],
    hint: "result[key] ??= []; result[key].push(item);",
    starter: `function groupBy(items, keyFn) {
  // bucket items by keyFn(item)
}
`,
    tests: [
      {
        label: "two groups",
        expected: { a: [{ t: "a", n: 1 }, { t: "a", n: 2 }], b: [{ t: "b", n: 3 }] },
        run: "return fn([{ t: 'a', n: 1 }, { t: 'b', n: 3 }, { t: 'a', n: 2 }], (x) => x.t);",
      },
      {
        label: "empty",
        expected: {},
        run: "return fn([], (x) => x);",
      },
      {
        label: "numeric keys stringify",
        expected: { "1": [1, 11], "2": [2] },
        run: "return fn([1, 2, 11], (n) => n % 10);",
      },
    ],
  },
  {
    slug: "two-sum",
    title: "Two sum indices",
    description: "Find the first pair of indices whose values add up to a target.",
    group: "arrays",
    difficulty: "hard",
    fnName: "twoSum",
    signature: "twoSum(nums, target) → [i, j] | null",
    prompt:
      "Write twoSum(nums, target) that returns a two-element array [i, j] with i < j such that nums[i] + nums[j] === target. Use the smallest i, then the smallest j. If no pair exists, return null. Do not reuse the same index twice.",
    examples: [
      { call: "twoSum([2, 7, 11, 15], 9)", result: "[0, 1]" },
      { call: "twoSum([1, 2, 3], 7)", result: "null" },
    ],
    notes: ["Prefer a nested loop or a Map of value → index.", "Return null, not undefined, when there is no pair."],
    hint: "For each i, look for target - nums[i] at a later index.",
    starter: `function twoSum(nums, target) {
  // return [i, j] or null
}
`,
    tests: [
      { label: "classic pair", args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { label: "later pair", args: [[3, 2, 4], 6], expected: [1, 2] },
      { label: "no pair", args: [[1, 2, 3], 7], expected: null },
      { label: "duplicates", args: [[3, 3], 6], expected: [0, 1] },
    ],
  },
  {
    slug: "flatten-deep",
    title: "Flatten deep",
    description: "Recursively flatten nested arrays into one list of values.",
    group: "arrays",
    difficulty: "hard",
    fnName: "flattenDeep",
    signature: "flattenDeep(items) → array",
    prompt:
      "Write flattenDeep(items) that returns a new array with every nested array expanded, no matter how deep. Non-array values stay as they are. Empty arrays contribute nothing.",
    examples: [
      { call: "flattenDeep([1, [2, [3, 4]], 5])", result: "[1, 2, 3, 4, 5]" },
      { call: "flattenDeep([[], 1])", result: "[1]" },
    ],
    notes: ["Use Array.isArray, not typeof.", "flat(Infinity) is allowed."],
    hint: "return items.flat(Infinity); or recurse when Array.isArray(item).",
    starter: `function flattenDeep(items) {
  // flatten nested arrays fully
}
`,
    tests: [
      { label: "nested three levels", args: [[1, [2, [3, 4]], 5]], expected: [1, 2, 3, 4, 5] },
      { label: "already flat", args: [[1, 2]], expected: [1, 2] },
      { label: "empty nested", args: [[[], 1, [[]]]], expected: [1] },
      { label: "mixed types", args: [["a", ["b", [1]]]], expected: ["a", "b", 1] },
    ],
  },
  {
    slug: "omit",
    title: "Omit object keys",
    description: "Copy an object without the listed keys.",
    group: "objects",
    difficulty: "easy",
    fnName: "omit",
    signature: "omit(source, keys) → object",
    prompt:
      "Write omit(source, keys) that returns a new object with every own enumerable key of source except those named in keys. Do not mutate source.",
    examples: [
      { call: 'omit({ a: 1, b: 2, c: 3 }, ["b"])', result: "{ a: 1, c: 3 }" },
      { call: 'omit({ a: 1 }, ["z"])', result: "{ a: 1 }" },
    ],
    notes: ["Unknown keys in the list are ignored.", "Keep falsy values that you do not omit."],
    hint: "Filter Object.entries where !keys.includes(key), then Object.fromEntries.",
    starter: `function omit(source, keys) {
  // copy source without those keys
}
`,
    tests: [
      { label: "drop b", args: [{ a: 1, b: 2, c: 3 }, ["b"]], expected: { a: 1, c: 3 } },
      { label: "unknown key", args: [{ a: 1 }, ["z"]], expected: { a: 1 } },
      { label: "drop all", args: [{ a: 1 }, ["a"]], expected: {} },
      { label: "keep zero", args: [{ a: 0, b: 1 }, ["b"]], expected: { a: 0 } },
    ],
  },
  {
    slug: "map-values",
    title: "Map object values",
    description: "Return a new object with the same keys and mapped values.",
    group: "objects",
    difficulty: "medium",
    fnName: "mapValues",
    signature: "mapValues(source, mapper) → object",
    prompt:
      "Write mapValues(source, mapper) that returns a new object with the same own keys. Each value is mapper(value, key). Do not mutate source.",
    examples: [
      { call: "mapValues({ a: 1, b: 2 }, (n) => n * 2)", result: "{ a: 2, b: 4 }" },
    ],
    notes: ["Pass the key as the second argument so callers can use it.", "Empty object stays empty."],
    hint: "for (const [key, value] of Object.entries(source)) result[key] = mapper(value, key);",
    starter: `function mapValues(source, mapper) {
  // map each value, keep keys
}
`,
    tests: [
      {
        label: "double numbers",
        expected: { a: 2, b: 4 },
        run: "return fn({ a: 1, b: 2 }, (n) => n * 2);",
      },
      {
        label: "uses key",
        expected: { a: "a:1", b: "b:2" },
        run: "return fn({ a: 1, b: 2 }, (n, key) => key + ':' + n);",
      },
      {
        label: "empty",
        expected: {},
        run: "return fn({}, (n) => n);",
      },
    ],
  },
  {
    slug: "get-path",
    title: "Get nested path",
    description: "Read a dotted path from a nested object. Missing paths return null.",
    group: "objects",
    difficulty: "hard",
    fnName: "getPath",
    signature: "getPath(source, path) → unknown | null",
    prompt:
      "Write getPath(source, path) where path is a dotted string such as \"a.b.c\". Walk those keys. If any step is null, undefined, or not an object that has the next key, return null. A path that lands on 0 or false should still return that value.",
    examples: [
      { call: 'getPath({ a: { b: 2 } }, "a.b")', result: "2" },
      { call: 'getPath({ a: 1 }, "a.b")', result: "null" },
    ],
    notes: ["Split on \".\" only — no bracket syntax.", "Return null for a missing path, not undefined."],
    hint: "Reduce over path.split('.'). If acc == null or the key is missing, return null.",
    starter: `function getPath(source, path) {
  // walk dotted keys; missing → null
}
`,
    tests: [
      { label: "nested hit", args: [{ a: { b: 2 } }, "a.b"], expected: 2 },
      { label: "missing mid", args: [{ a: 1 }, "a.b"], expected: null },
      { label: "top level", args: [{ x: 0 }, "x"], expected: 0 },
      { label: "false is a value", args: [{ ok: false }, "ok"], expected: false },
      { label: "empty object", args: [{}, "a"], expected: null },
    ],
  },
  {
    slug: "once",
    title: "Call once",
    description: "Wrap a function so it runs only the first time; later calls reuse that result.",
    group: "functions",
    difficulty: "medium",
    fnName: "once",
    signature: "once(fn) → function",
    prompt:
      "Write once(fn) that returns a new function. The first time it is called, invoke fn with the same arguments and remember the return value. Later calls ignore new arguments and return that same value. fn must not run again.",
    examples: [
      { call: "const f = once((n) => n + 1); f(1); f(99);", result: "2 then 2" },
    ],
    notes: ["Close over a called flag and a saved result.", "The wrapper should accept any number of arguments on the first call."],
    hint: "let called = false, result; return function (...args) { if (!called) { called = true; result = fn(...args); } return result; }",
    starter: `function once(fn) {
  // return a function that runs fn only once
}
`,
    tests: [
      {
        label: "same result after first",
        expected: [2, 2, 2],
        run: "const f = fn((n) => n + 1); return [f(1), f(99), f(0)];",
      },
      {
        label: "fn runs once",
        expected: 1,
        run: "let n = 0; const f = fn(() => { n += 1; return n; }); f(); f(); f(); return n;",
      },
      {
        label: "forwards first args",
        expected: 5,
        run: "return fn((a, b) => a + b)(2, 3);",
      },
    ],
  },
  {
    slug: "pipe",
    title: "Pipe functions",
    description: "Left-to-right function pipeline: pipe(f, g)(x) is g(f(x)).",
    group: "functions",
    difficulty: "hard",
    fnName: "pipe",
    signature: "pipe(...fns) → (x) → result",
    prompt:
      "Write pipe(...fns) that returns a function of one argument x. Apply the functions from left to right: the first fn gets x, the next gets that result, and so on. pipe() with no functions should return x unchanged. Do not call any fn until the inner function runs.",
    examples: [
      { call: "pipe(double, add1)(3)  // add1(double(3))", result: "7" },
      { call: "pipe()(4)", result: "4" },
    ],
    notes: ["Opposite order from compose(f, g) which is f(g(x)).", "Support more than two functions."],
    hint: "return (x) => fns.reduce((value, f) => f(value), x);",
    starter: `function pipe(...fns) {
  // left-to-right pipeline
}
`,
    tests: [
      {
        label: "double then add1",
        expected: 7,
        run: "const add1 = (n) => n + 1; const double = (n) => n * 2; return fn(double, add1)(3);",
      },
      {
        label: "three steps",
        expected: 9,
        run: "return fn((n) => n + 1, (n) => n * 2, (n) => n + 1)(3);",
      },
      {
        label: "identity when empty",
        expected: 4,
        run: "return fn()(4);",
      },
      {
        label: "lazy",
        expected: 0,
        run: "let calls = 0; const f = (n) => { calls += 1; return n; }; fn(f, f); return calls;",
      },
    ],
  },
  {
    slug: "memoize",
    title: "Memoize one argument",
    description: "Cache a function of one primitive argument so the same input is not recomputed.",
    group: "functions",
    difficulty: "hard",
    fnName: "memoize",
    signature: "memoize(fn) → function",
    prompt:
      "Write memoize(fn) that returns a wrapped function of one argument. The first time you see a given argument (SameValueZero, a Map is fine), call fn and store the result. Later calls with that same argument return the cached value without calling fn again. Different arguments each call fn once.",
    examples: [
      { call: "const f = memoize((n) => n * 2); f(2); f(2);", result: "4, fn ran once" },
    ],
    notes: ["A Map from argument to result is enough for primitives.", "Do not cache across different wrappers — each memoize(fn) has its own Map."],
    hint: "const cache = new Map(); return (arg) => { if (cache.has(arg)) return cache.get(arg); const value = fn(arg); cache.set(arg, value); return value; }",
    starter: `function memoize(fn) {
  // cache fn(arg) by arg
}
`,
    tests: [
      {
        label: "caches repeat",
        expected: [4, 1],
        run: "let calls = 0; const f = fn((n) => { calls += 1; return n * 2; }); f(2); f(2); return [f(2), calls];",
      },
      {
        label: "separate keys",
        expected: [2, 2],
        run: "let calls = 0; const f = fn((n) => { calls += 1; return n; }); f(1); f(2); return [calls, f(1)];",
      },
      {
        label: "zero is a key",
        expected: [0, 1],
        run: "let calls = 0; const f = fn((n) => { calls += 1; return n; }); f(0); f(0); return [f(0), calls];",
      },
    ],
  },
  {
    slug: "delay",
    title: "Delay a value",
    description: "Return a promise that resolves to a value after a given number of milliseconds.",
    group: "async",
    difficulty: "medium",
    fnName: "delay",
    signature: "delay(ms, value) → Promise",
    prompt:
      "Write delay(ms, value) that returns a Promise which resolves to value after ms milliseconds. Use setTimeout. Check awaits the promise, so keep ms small in your own experiments.",
    examples: [
      { call: "await delay(0, \"ok\")", result: '"ok"' },
    ],
    notes: ["new Promise((resolve) => setTimeout(() => resolve(value), ms))", "ms of 0 is still asynchronous — return a promise, not value itself."],
    hint: "return new Promise((resolve) => { setTimeout(() => resolve(value), ms); });",
    starter: `function delay(ms, value) {
  // resolve value after ms
}
`,
    tests: [
      { label: "zero delay string", args: [0, "ok"], expected: "ok" },
      { label: "zero delay number", args: [0, 7], expected: 7 },
      {
        label: "is a thenable",
        expected: true,
        run: "const p = fn(0, 1); return p != null && typeof p.then === 'function';",
      },
    ],
  },
  {
    slug: "retry",
    title: "Retry a function",
    description: "Call an async function up to N times until it succeeds.",
    group: "async",
    difficulty: "hard",
    fnName: "retry",
    signature: "retry(task, attempts) → Promise",
    prompt:
      "Write async retry(task, attempts) (or return a promise). Call task() with no arguments. If it returns a value or a resolving promise, return that result. If it throws or rejects, try again until you have used attempts calls. If every attempt fails, rethrow the last error.",
    examples: [
      { call: "await retry(() => 1, 3)", result: "1" },
      { call: "task fails twice then succeeds", result: "third return value" },
    ],
    notes: ["attempts is a positive integer.", "Do not call task extra times after success."],
    hint: "Loop attempts times, try/catch await task(), return on success, throw the last error after the loop.",
    starter: `async function retry(task, attempts) {
  // try task() up to attempts times
}
`,
    tests: [
      {
        label: "succeeds first try",
        expected: 1,
        run: "return fn(() => 1, 3);",
      },
      {
        label: "fails twice then works",
        expected: 3,
        run: "let n = 0; const task = () => { n += 1; if (n < 3) throw new Error('fail'); return n; }; return fn(task, 5);",
      },
      {
        label: "counts failures",
        expected: 2,
        run: "let n = 0; const task = () => { n += 1; throw new Error('x'); }; try { await fn(task, 2); return 'nope'; } catch (err) { return n; }",
      },
    ],
  },
];

export function getPracticeQuestion(slug: string): PracticeQuestion | undefined {
  return findBySlug(practiceQuestions, slug);
}
