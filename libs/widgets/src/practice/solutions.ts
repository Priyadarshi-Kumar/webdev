/** Optimized reference implementations for every practice kata. */
export const practiceSolutions: Record<string, string> = {
  sum: `function sum(a, b) {
  return a + b;
}
`,
  clamp: `function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
`,
  "reverse-string": `function reverseString(text) {
  return [...text].reverse().join("");
}
`,
  fizzbuzz: `function fizzBuzz(n) {
  if (n % 15 === 0) return "FizzBuzz";
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return String(n);
}
`,
  unique: `function unique(items) {
  return [...new Set(items)];
}
`,
  chunk: `function chunk(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}
`,
  flatten: `function flatten(items) {
  return items.flat(1);
}
`,
  pick: `function pick(source, keys) {
  const result = {};
  for (const key of keys) {
    if (Object.hasOwn(source, key)) result[key] = source[key];
  }
  return result;
}
`,
  invert: `function invert(source) {
  const result = {};
  for (const [key, value] of Object.entries(source)) {
    result[String(value)] = key;
  }
  return result;
}
`,
  "make-counter": `function makeCounter(start) {
  let n = start;
  return function () {
    n += 1;
    return n;
  };
}
`,
  compose: `function compose(f, g) {
  return function (x) {
    return f(g(x));
  };
}
`,
  "double-later": `function doubleLater(n) {
  return Promise.resolve(n * 2);
}
`,
  palindrome: `function isPalindrome(text) {
  const n = text.length;
  for (let i = 0; i < n / 2; i++) {
    if (text[i] !== text[n - 1 - i]) return false;
  }
  return true;
}
`,
  factorial: `function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}
`,
  range: `function range(start, end) {
  const out = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}
`,
  anagram: `function isAnagram(a, b) {
  const norm = (s) =>
    s.toLowerCase().replace(/\\s+/g, "").split("").sort().join("");
  return norm(a) === norm(b);
}
`,
  "valid-parens": `function validParens(text) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of text) {
    if (ch === "(" || ch === "[" || ch === "{") stack.push(ch);
    else if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}
`,
  intersection: `function intersection(a, b) {
  const set = new Set(b);
  const seen = new Set();
  const out = [];
  for (const item of a) {
    if (set.has(item) && !seen.has(item)) {
      seen.add(item);
      out.push(item);
    }
  }
  return out;
}
`,
  zip: `function zip(a, b) {
  const n = Math.min(a.length, b.length);
  const out = [];
  for (let i = 0; i < n; i++) out.push([a[i], b[i]]);
  return out;
}
`,
  "group-by": `function groupBy(items, keyFn) {
  const result = {};
  for (const item of items) {
    const key = keyFn(item);
    (result[key] ??= []).push(item);
  }
  return result;
}
`,
  "two-sum": `function twoSum(nums, target) {
  const first = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (!first.has(nums[i])) first.set(nums[i], i);
  }
  let bestI = Infinity;
  let bestJ = Infinity;
  for (let j = 0; j < nums.length; j++) {
    const i = first.get(target - nums[j]);
    if (i == null || i >= j) continue;
    if (i < bestI || (i === bestI && j < bestJ)) {
      bestI = i;
      bestJ = j;
    }
  }
  return bestI === Infinity ? null : [bestI, bestJ];
}
`,
  "flatten-deep": `function flattenDeep(items) {
  const out = [];
  const stack = [...items];
  while (stack.length) {
    const next = stack.pop();
    if (Array.isArray(next)) {
      for (let i = next.length - 1; i >= 0; i--) stack.push(next[i]);
    } else {
      out.push(next);
    }
  }
  return out;
}
`,
  omit: `function omit(source, keys) {
  const skip = new Set(keys);
  const result = {};
  for (const [key, value] of Object.entries(source)) {
    if (!skip.has(key)) result[key] = value;
  }
  return result;
}
`,
  "map-values": `function mapValues(source, mapper) {
  const result = {};
  for (const [key, value] of Object.entries(source)) {
    result[key] = mapper(value, key);
  }
  return result;
}
`,
  "get-path": `function getPath(source, path) {
  let acc = source;
  for (const key of path.split(".")) {
    if (acc == null || !Object.hasOwn(acc, key)) return null;
    acc = acc[key];
  }
  return acc;
}
`,
  once: `function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}
`,
  pipe: `function pipe(...fns) {
  return (x) => fns.reduce((value, f) => f(value), x);
}
`,
  memoize: `function memoize(fn) {
  const cache = new Map();
  return function (arg) {
    if (cache.has(arg)) return cache.get(arg);
    const value = fn(arg);
    cache.set(arg, value);
    return value;
  };
}
`,
  delay: `function delay(ms, value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}
`,
  retry: `async function retry(task, attempts) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}
`,
  "is-even": `function isEven(n) {
  return n % 2 === 0;
}
`,
  "max-of-three": `function maxOfThree(a, b, c) {
  return Math.max(a, b, c);
}
`,
  "celsius-to-fahrenheit": `function toFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}
`,
  fibonacci: `function fib(n) {
  if (n < 2) return n;
  let prev = 0;
  let curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}
`,
  gcd: `function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}
`,
  "is-prime": `function isPrime(n) {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}
`,
  capitalize: `function capitalize(word) {
  return word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word;
}
`,
  "count-vowels": `function countVowels(text) {
  let count = 0;
  for (const ch of text.toLowerCase()) {
    if (ch === "a" || ch === "e" || ch === "i" || ch === "o" || ch === "u") count++;
  }
  return count;
}
`,
  truncate: `function truncate(text, max) {
  if (text.length <= max) return text;
  return text.slice(0, Math.max(0, max - 3)) + "...";
}
`,
  "longest-word": `function longestWord(sentence) {
  let best = "";
  for (const word of sentence.split(" ")) {
    if (word.length > best.length) best = word;
  }
  return best;
}
`,
  "title-case": `function titleCase(sentence) {
  return sentence
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word))
    .join(" ");
}
`,
  "word-frequency": `function wordFrequency(text) {
  const counts = {};
  for (const word of text.toLowerCase().split(/\\s+/).filter(Boolean)) {
    counts[word] = (counts[word] ?? 0) + 1;
  }
  return counts;
}
`,
  "caesar-cipher": `function caesar(text, shift) {
  const k = ((shift % 26) + 26) % 26;
  let out = "";
  for (const ch of text) {
    if (ch >= "a" && ch <= "z") {
      out += String.fromCharCode(((ch.charCodeAt(0) - 97 + k) % 26) + 97);
    } else if (ch >= "A" && ch <= "Z") {
      out += String.fromCharCode(((ch.charCodeAt(0) - 65 + k) % 26) + 65);
    } else {
      out += ch;
    }
  }
  return out;
}
`,
  "longest-unique-substring": `function longestUnique(text) {
  const last = new Map();
  let start = 0;
  let best = 0;
  for (let i = 0; i < text.length; i++) {
    const seen = last.get(text[i]);
    if (seen !== undefined && seen >= start) start = seen + 1;
    last.set(text[i], i);
    best = Math.max(best, i - start + 1);
  }
  return best;
}
`,
  "sum-array": `function sumArray(numbers) {
  let total = 0;
  for (const n of numbers) total += n;
  return total;
}
`,
  "max-in-array": `function maxIn(numbers) {
  if (numbers.length === 0) return null;
  let best = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > best) best = numbers[i];
  }
  return best;
}
`,
  average: `function average(numbers) {
  if (numbers.length === 0) return 0;
  let total = 0;
  for (const n of numbers) total += n;
  return total / numbers.length;
}
`,
  partition: `function partition(items, predicate) {
  const pass = [];
  const fail = [];
  for (const item of items) (predicate(item) ? pass : fail).push(item);
  return [pass, fail];
}
`,
  "rotate-array": `function rotate(items, steps) {
  const n = items.length;
  if (n === 0) return [];
  const k = ((steps % n) + n) % n;
  if (k === 0) return items.slice();
  return items.slice(n - k).concat(items.slice(0, n - k));
}
`,
  "move-zeroes": `function moveZeroes(numbers) {
  const out = new Array(numbers.length);
  let w = 0;
  for (const n of numbers) {
    if (n !== 0) out[w++] = n;
  }
  while (w < out.length) out[w++] = 0;
  return out;
}
`,
  "merge-sorted": `function mergeSorted(a, b) {
  const out = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) out.push(a[i++]);
    else out.push(b[j++]);
  }
  while (i < a.length) out.push(a[i++]);
  while (j < b.length) out.push(b[j++]);
  return out;
}
`,
  "max-subarray": `function maxSubarray(numbers) {
  if (numbers.length === 0) return 0;
  let current = numbers[0];
  let best = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    current = Math.max(numbers[i], current + numbers[i]);
    best = Math.max(best, current);
  }
  return best;
}
`,
  "merge-objects": `function merge(a, b) {
  return { ...a, ...b };
}
`,
  "default-values": `function withDefaults(options, defaults) {
  return { ...defaults, ...options };
}
`,
  "count-by": `function countBy(items, keyFn) {
  const out = {};
  for (const item of items) {
    const key = keyFn(item);
    out[key] = (out[key] ?? 0) + 1;
  }
  return out;
}
`,
  "deep-clone": `function deepClone(value) {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(deepClone);
  const out = {};
  for (const [key, nested] of Object.entries(value)) out[key] = deepClone(nested);
  return out;
}
`,
  "flatten-object": `function flattenObject(obj, prefix = "", out = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? prefix + "." + key : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenObject(value, path, out);
    } else {
      out[path] = value;
    }
  }
  return out;
}
`,
  "deep-equal": `function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b || a === null || b === null) return false;
  if (typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.hasOwn(b, key) || !deepEqual(a[key], b[key])) return false;
  }
  return true;
}
`,
  "call-n-times": `function times(n, fn) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(fn(i));
  return out;
}
`,
  partial: `function partial(fn, ...preset) {
  return function (...later) {
    return fn(...preset, ...later);
  };
}
`,
  "curry-add": `function add(a) {
  return (b) => (c) => a + b + c;
}
`,
  throttle: `function throttle(fn, ms) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      return fn.apply(this, args);
    }
  };
}
`,
  debounce: `function debounce(fn, ms) {
  let id;
  return function (...args) {
    clearTimeout(id);
    id = setTimeout(() => fn.apply(this, args), ms);
  };
}
`,
  "chain-promises": `async function addLater(a, b) {
  const v = await Promise.resolve(a);
  return v + b;
}
`,
  "timeout-promise": `function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error("timeout")), ms);
    }),
  ]);
}
`,
  "sequential-map": `async function mapSeries(items, fn) {
  const out = [];
  for (const item of items) out.push(await fn(item));
  return out;
}
`,
  "settle-all": `function settleAll(promises) {
  return Promise.all(
    promises.map((p) =>
      Promise.resolve(p).then(
        (value) => ({ ok: true, value }),
        (error) => ({ ok: false, error }),
      ),
    ),
  );
}
`,
  "parallel-limit": `async function limitAll(tasks, limit) {
  const results = new Array(tasks.length);
  let next = 0;
  async function worker() {
    while (next < tasks.length) {
      const i = next++;
      results[i] = await tasks[i]();
    }
  }
  const n = Math.min(Math.max(limit, 1), tasks.length);
  await Promise.all(Array.from({ length: n }, worker));
  return results;
}
`,
  "map-polyfill": `Array.prototype.myMap = function (cb, thisArg) {
  const out = new Array(this.length);
  for (let i = 0; i < this.length; i++) {
    if (i in this) out[i] = cb.call(thisArg, this[i], i, this);
  }
  return out;
};
`,
  "filter-polyfill": `Array.prototype.myFilter = function (cb, thisArg) {
  const out = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this && cb.call(thisArg, this[i], i, this)) out.push(this[i]);
  }
  return out;
};
`,
  "reduce-polyfill": `Array.prototype.myReduce = function (reducer, initialValue) {
  let i = 0;
  let acc;
  if (arguments.length >= 2) {
    acc = initialValue;
  } else {
    while (i < this.length && !(i in this)) i++;
    if (i >= this.length) throw new TypeError("Reduce of empty array");
    acc = this[i++];
  }
  for (; i < this.length; i++) {
    if (i in this) acc = reducer(acc, this[i], i, this);
  }
  return acc;
};
`,
  "flat-polyfill": `Array.prototype.myFlat = function (depth = 1) {
  const out = [];
  const walk = (arr, d) => {
    for (let i = 0; i < arr.length; i++) {
      if (i in arr) {
        const item = arr[i];
        if (Array.isArray(item) && d > 0) walk(item, d - 1);
        else out.push(item);
      }
    }
  };
  walk(this, depth);
  return out;
};
`,
  "call-polyfill": `Function.prototype.myCall = function (context, ...args) {
  const ctx = context ?? globalThis;
  const key = Symbol();
  ctx[key] = this;
  try {
    return ctx[key](...args);
  } finally {
    delete ctx[key];
  }
};
`,
  "apply-polyfill": `Function.prototype.myApply = function (context, argsArray) {
  const ctx = context ?? globalThis;
  const key = Symbol();
  ctx[key] = this;
  try {
    return ctx[key](...(argsArray ?? []));
  } finally {
    delete ctx[key];
  }
};
`,
  "bind-polyfill": `Function.prototype.myBind = function (context, ...preset) {
  const fn = this;
  function bound(...later) {
    return fn.apply(this instanceof bound ? this : context, [...preset, ...later]);
  }
  if (fn.prototype) bound.prototype = Object.create(fn.prototype);
  return bound;
};
`,
  "promise-all-polyfill": `function promiseAll(items) {
  return new Promise((resolve, reject) => {
    const list = [...items];
    if (list.length === 0) return resolve([]);
    const results = new Array(list.length);
    let remaining = list.length;
    list.forEach((item, i) => {
      Promise.resolve(item).then((value) => {
        results[i] = value;
        remaining -= 1;
        if (remaining === 0) resolve(results);
      }, reject);
    });
  });
}
`,
  "promise-race-polyfill": `function promiseRace(items) {
  return new Promise((resolve, reject) => {
    for (const item of items) Promise.resolve(item).then(resolve, reject);
  });
}
`,
  "promise-any-polyfill": `function promiseAny(items) {
  return new Promise((resolve, reject) => {
    const list = [...items];
    if (list.length === 0) return reject(new AggregateError([], "All promises were rejected"));
    const errors = new Array(list.length);
    let rejected = 0;
    list.forEach((item, i) => {
      Promise.resolve(item).then(resolve, (error) => {
        errors[i] = error;
        rejected += 1;
        if (rejected === list.length) reject(new AggregateError(errors, "All promises were rejected"));
      });
    });
  });
}
`,
  "object-assign-polyfill": `function myAssign(target, ...sources) {
  if (target == null) throw new TypeError("Cannot convert undefined or null to object");
  const to = Object(target);
  for (const source of sources) {
    if (source == null) continue;
    for (const key of Object.keys(source)) to[key] = source[key];
  }
  return to;
}
`,
  "event-emitter": `class EventEmitter {
  constructor() {
    this.events = new Map();
  }
  on(event, fn) {
    const list = this.events.get(event);
    if (list) list.push(fn);
    else this.events.set(event, [fn]);
    return this;
  }
  off(event, fn) {
    const list = this.events.get(event);
    if (!list) return this;
    this.events.set(
      event,
      list.filter((listener) => listener !== fn),
    );
    return this;
  }
  emit(event, ...args) {
    const list = this.events.get(event);
    if (!list) return false;
    for (const fn of list.slice()) fn(...args);
    return true;
  }
  once(event, fn) {
    const wrap = (...args) => {
      this.off(event, wrap);
      fn(...args);
    };
    return this.on(event, wrap);
  }
}
`,
  "custom-promise": `class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.queue = [];
    const settle = (state, value) => {
      if (this.state !== "pending") return;
      this.state = state;
      this.value = value;
      queueMicrotask(() => {
        for (const job of this.queue) job();
        this.queue = [];
      });
    };
    try {
      executor(
        (value) => settle("fulfilled", value),
        (reason) => settle("rejected", reason),
      );
    } catch (error) {
      settle("rejected", error);
    }
  }
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const run = () => {
        try {
          if (this.state === "fulfilled") {
            if (typeof onFulfilled !== "function") return resolve(this.value);
            resolve(onFulfilled(this.value));
          } else {
            if (typeof onRejected !== "function") return reject(this.value);
            resolve(onRejected(this.value));
          }
        } catch (error) {
          reject(error);
        }
      };
      if (this.state === "pending") this.queue.push(() => queueMicrotask(run));
      else queueMicrotask(run);
    });
  }
}
`,
  "json-stringify-polyfill": `function myStringify(value) {
  if (value === undefined || typeof value === "function") return undefined;
  if (value === null) return "null";
  const t = typeof value;
  if (t === "number") return Number.isFinite(value) ? String(value) : "null";
  if (t === "boolean") return value ? "true" : "false";
  if (t === "string") return '"' + value.replace(/[\\\\"\\n\\r\\t]/g, (ch) => ({ "\\\\": "\\\\\\\\", '"': '\\\\"', "\\n": "\\\\n", "\\r": "\\\\r", "\\t": "\\\\t" }[ch])) + '"';
  if (Array.isArray(value)) {
    return "[" + value.map((item) => {
      const s = myStringify(item);
      return s === undefined ? "null" : s;
    }).join(",") + "]";
  }
  const parts = [];
  for (const [key, nested] of Object.entries(value)) {
    const s = myStringify(nested);
    if (s === undefined) continue;
    parts.push(myStringify(key) + ":" + s);
  }
  return "{" + parts.join(",") + "}";
}
`,
  "event-delegation": `function delegate(root, selector, handler) {
  const onClick = (event) => {
    const el = event.target.closest(selector);
    if (el && root.contains(el)) handler(el, event);
  };
  root.addEventListener("click", onClick);
  return () => root.removeEventListener("click", onClick);
}
`,
  "get-by-class-name": `function getByClass(root, className) {
  const out = [];
  const walk = (node) => {
    if (node.nodeType === 1 && node.classList.contains(className)) out.push(node);
    for (const child of node.children ?? []) walk(child);
  };
  walk(root);
  return out;
}
`,
  "render-virtual-dom": `function render(vnode) {
  if (vnode == null || typeof vnode === "boolean") return document.createTextNode("");
  if (typeof vnode === "string" || typeof vnode === "number") {
    return document.createTextNode(String(vnode));
  }
  const el = document.createElement(vnode.type);
  const { children, ...props } = vnode.props ?? {};
  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith("on") && typeof value === "function") {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === "className") el.setAttribute("class", value);
    else if (value != null && value !== false) el.setAttribute(key, value === true ? "" : value);
  }
  const list = Array.isArray(children) ? children : children == null ? [] : [children];
  for (const child of list) el.appendChild(render(child));
  return el;
}
`,
  "element-in-viewport": `function isInViewport(element) {
  const r = element.getBoundingClientRect();
  return r.top >= 0 && r.left >= 0 && r.bottom <= innerHeight && r.right <= innerWidth;
}
`,
  "lazy-load-images": `function lazyLoadImages(selector) {
  const imgs = document.querySelectorAll(selector);
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const img = entry.target;
      img.src = img.dataset.src;
      io.unobserve(img);
    }
  });
  imgs.forEach((img) => io.observe(img));
  return () => io.disconnect();
}
`,
  "highlight-search-text": `function highlight(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^\${}()|[\\]\\\\]/g, "\\\\$&");
  return text.replace(new RegExp(escaped, "gi"), (m) => "<mark>" + m + "</mark>");
}
`,
  "click-outside-vanilla": `function onClickOutside(element, handler) {
  const onDoc = (event) => {
    if (!element.contains(event.target)) handler(event);
  };
  document.addEventListener("click", onDoc);
  return () => document.removeEventListener("click", onDoc);
}
`,
  "infinite-scroll-vanilla": `function infiniteScroll(sentinel, loadMore) {
  let loading = false;
  let done = false;
  const io = new IntersectionObserver(async (entries) => {
    if (done || loading || !entries.some((e) => e.isIntersecting)) return;
    loading = true;
    const more = await loadMore();
    loading = false;
    if (more === false) {
      done = true;
      io.disconnect();
    }
  });
  io.observe(sentinel);
  return () => io.disconnect();
}
`,
  "find-corresponding-node": `function findCorresponding(rootA, rootB, nodeA) {
  const path = [];
  let node = nodeA;
  while (node && node !== rootA) {
    const parent = node.parentNode;
    path.push(Array.prototype.indexOf.call(parent.childNodes, node));
    node = parent;
  }
  let cursor = rootB;
  for (let i = path.length - 1; i >= 0; i--) cursor = cursor.childNodes[path[i]];
  return cursor;
}
`,
  "use-toggle": `function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle, setValue];
}
`,
  "use-previous": `function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
`,
  "use-window-size": `function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}
`,
  "use-debounce": `function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
`,
  "use-local-storage": `function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? initialValue : JSON.parse(raw);
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}
`,
  "use-interval": `function useInterval(callback, delay) {
  const saved = useRef(callback);
  useEffect(() => {
    saved.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay == null) return;
    const id = setInterval(() => saved.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
`,
  "use-click-outside": `function useClickOutside(ref, handler) {
  useEffect(() => {
    const onDoc = (event) => {
      if (ref.current && !ref.current.contains(event.target)) handler(event);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [ref, handler]);
}
`,
  "use-fetch": `function useFetch(url) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  useEffect(() => {
    const c = new AbortController();
    setState({ data: null, error: null, loading: true });
    fetch(url, { signal: c.signal })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => {
        if (error.name === "AbortError") return;
        setState({ data: null, error, loading: false });
      });
    return () => c.abort();
  }, [url]);
  return state;
}
`,
  "use-media-query": `function useMediaQuery(query) {
  const subscribe = (cb) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  };
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
`,
  "use-intersection-observer": `function useIntersectionObserver(ref, options) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    io.observe(el);
    return () => io.disconnect();
  }, [ref, options]);
  return isIntersecting;
}
`,
  "todo-list": `function TodoList() {
  const [text, setText] = useState("");
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const visible = useMemo(() => {
    if (filter === "active") return items.filter((t) => !t.done);
    if (filter === "done") return items.filter((t) => t.done);
    return items;
  }, [items, filter]);
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const value = text.trim();
          if (!value) return;
          setItems((list) => [...list, { id: crypto.randomUUID(), text: value, done: false }]);
          setText("");
        }}
      >
        <input value={text} onChange={(e) => setText(e.target.value)} aria-label="New todo" />
        <button type="submit">Add</button>
      </form>
      <div>
        {["all", "active", "done"].map((id) => (
          <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)}>
            {id}
          </button>
        ))}
      </div>
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={item.done}
                onChange={() =>
                  setItems((list) => list.map((t) => (t.id === item.id ? { ...t, done: !t.done } : t)))
                }
              />
              {item.text}
            </label>
            <button type="button" onClick={() => setItems((list) => list.filter((t) => t.id !== item.id))}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
`,
  "star-rating": `function StarRating({ value, max = 5, onChange }) {
  const [hover, setHover] = useState(null);
  const shown = hover ?? value;
  return (
    <div onMouseLeave={() => setHover(null)}>
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        return (
          <button
            key={n}
            type="button"
            aria-label={n + " star"}
            aria-pressed={n <= value}
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(n)}
          >
            {n <= shown ? "★" : "☆"}
          </button>
        );
      })}
    </div>
  );
}
`,
  "progress-bar": `function ProgressBar({ value, max = 100 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div style={{ width: pct + "%" }} />
    </div>
  );
}
`,
  accordion: `function Accordion({ items, allowMultiple = false }) {
  const [open, setOpen] = useState(() => new Set());
  const toggle = (id) => {
    setOpen((prev) => {
      if (allowMultiple) {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      }
      return prev.has(id) ? new Set() : new Set([id]);
    });
  };
  return (
    <div>
      {items.map((item) => {
        const expanded = open.has(item.id);
        return (
          <section key={item.id}>
            <h3>
              <button type="button" aria-expanded={expanded} onClick={() => toggle(item.id)}>
                {item.title}
              </button>
            </h3>
            {expanded ? <div>{item.content}</div> : null}
          </section>
        );
      })}
    </div>
  );
}
`,
  tabs: `function Tabs({ items, defaultId }) {
  const [activeId, setActiveId] = useState(defaultId ?? items[0]?.id);
  const order = items.map((item) => item.id);
  const onKeyDown = (event) => {
    const i = order.indexOf(activeId);
    if (event.key === "ArrowRight") setActiveId(order[(i + 1) % order.length]);
    else if (event.key === "ArrowLeft") setActiveId(order[(i - 1 + order.length) % order.length]);
    else if (event.key === "Home") setActiveId(order[0]);
    else if (event.key === "End") setActiveId(order[order.length - 1]);
  };
  return (
    <div>
      <div role="tablist" onKeyDown={onKeyDown}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === activeId}
            tabIndex={item.id === activeId ? 0 : -1}
            onClick={() => setActiveId(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) =>
        item.id === activeId ? (
          <div key={item.id} role="tabpanel">
            {item.content}
          </div>
        ) : null,
      )}
    </div>
  );
}
`,
  "modal-dialog": `function Modal({ open, onClose, children }) {
  const ref = useRef(null);
  const lastFocus = useRef(null);
  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement;
    const node = ref.current;
    const focusable = () =>
      [...node.querySelectorAll('a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])')];
    focusable()[0]?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const list = focusable();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      lastFocus.current?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="overlay" onMouseDown={onClose}>
      <div ref={ref} role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body,
  );
}
`,
  pagination: `function Pagination({ page, total, onChange, windowSize = 2 }) {
  const items = [];
  items.push(1);
  const start = Math.max(2, page - windowSize);
  const end = Math.min(total - 1, page + windowSize);
  if (start > 2) items.push("ellipsis-start");
  for (let n = start; n <= end; n++) items.push(n);
  if (end < total - 1) items.push("ellipsis-end");
  if (total > 1) items.push(total);
  return (
    <nav aria-label="Pagination">
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>Prev</button>
      {items.map((item) =>
        typeof item === "string" ? (
          <span key={item}>…</span>
        ) : (
          <button key={item} type="button" aria-current={item === page ? "page" : undefined} onClick={() => onChange(item)}>
            {item}
          </button>
        ),
      )}
      <button type="button" disabled={page >= total} onClick={() => onChange(page + 1)}>Next</button>
    </nav>
  );
}
`,
  stopwatch: `function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [accumulated, setAccumulated] = useState(0);
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 50);
    return () => clearInterval(id);
  }, [running]);
  const elapsed = running ? accumulated + (now - startedAt) : accumulated;
  return (
    <div>
      <p aria-live="polite">{(elapsed / 1000).toFixed(2)}s</p>
      <button
        type="button"
        onClick={() => {
          if (running) {
            setAccumulated(elapsed);
            setRunning(false);
          } else {
            setStartedAt(Date.now());
            setNow(Date.now());
            setRunning(true);
          }
        }}
      >
        {running ? "Stop" : "Start"}
      </button>
      <button
        type="button"
        onClick={() => {
          setRunning(false);
          setAccumulated(0);
          setStartedAt(null);
        }}
      >
        Reset
      </button>
    </div>
  );
}
`,
  "countdown-timer": `function Countdown({ seconds, onComplete }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) return;
    const id = setInterval(() => setLeft((n) => n - 1), 1000);
    return () => clearInterval(id);
  }, [left]);
  useEffect(() => {
    if (left === 0) onComplete?.();
  }, [left, onComplete]);
  const m = Math.floor(left / 60);
  const s = String(left % 60).padStart(2, "0");
  return <p aria-live="polite">{m}:{s}</p>;
}
`,
  "image-carousel": `function Carousel({ images, autoPlay = false, interval = 3000 }) {
  const [index, setIndex] = useState(0);
  const n = images.length;
  const go = (delta) => setIndex((i) => (i + delta + n) % n);
  useEffect(() => {
    if (!autoPlay || n <= 1) return;
    const id = setInterval(() => go(1), interval);
    return () => clearInterval(id);
  }, [autoPlay, interval, n]);
  return (
    <div>
      <img src={images[index]} alt="" />
      <button type="button" onClick={() => go(-1)}>Prev</button>
      <button type="button" onClick={() => go(1)}>Next</button>
      <div>
        {images.map((_, i) => (
          <button key={i} type="button" aria-current={i === index} onClick={() => setIndex(i)} />
        ))}
      </div>
    </div>
  );
}
`,
  "error-boundary": `class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) return this.props.fallback ?? <p>Something went wrong.</p>;
    return this.props.children;
  }
}
`,
  "tic-tac-toe": `function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xTurn, setXTurn] = useState(true);
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  const winner = lines.reduce((w, [a, b, c]) => {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) return board[a];
    return w;
  }, null);
  return (
    <div>
      <p>{winner ? winner + " wins" : xTurn ? "X to play" : "O to play"}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 3rem)" }}>
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            disabled={Boolean(cell) || winner}
            onClick={() => {
              setBoard((b) => {
                const next = b.slice();
                next[i] = xTurn ? "X" : "O";
                return next;
              });
              setXTurn((t) => !t);
            }}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}
`,
  "form-validation": `function SignupForm({ onSubmit }) {
  const [values, setValues] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const errors = {
    email: /.+@.+\\..+/.test(values.email) ? "" : "Enter a valid email",
    password: values.password.length >= 8 ? "" : "Password must be 8+ characters",
  };
  const show = (field) => (touched[field] || submitted) && errors[field];
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
        if (Object.values(errors).some(Boolean)) return;
        onSubmit(values);
      }}
    >
      <label>
        Email
        <input
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        />
      </label>
      {show("email") ? <p>{errors.email}</p> : null}
      <label>
        Password
        <input
          type="password"
          value={values.password}
          onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
        />
      </label>
      {show("password") ? <p>{errors.password}</p> : null}
      <button type="submit">Sign up</button>
    </form>
  );
}
`,
  autocomplete: `function Autocomplete({ fetchSuggestions, onSelect }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(-1);
  const debounced = useDebounce(query, 250);
  useEffect(() => {
    if (!debounced) {
      setItems([]);
      return;
    }
    const c = new AbortController();
    fetchSuggestions(debounced, { signal: c.signal })
      .then((list) => setItems(list))
      .catch((err) => {
        if (err.name !== "AbortError") throw err;
      });
    return () => c.abort();
  }, [debounced, fetchSuggestions]);
  return (
    <div>
      <input
        value={query}
        role="combobox"
        aria-expanded={items.length > 0}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(-1);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") setActive((i) => Math.min(i + 1, items.length - 1));
          if (e.key === "ArrowUp") setActive((i) => Math.max(i - 1, 0));
          if (e.key === "Enter" && items[active]) onSelect(items[active]);
        }}
      />
      <ul role="listbox">
        {items.map((item, i) => (
          <li key={item.id ?? item}>
            <button
              type="button"
              role="option"
              aria-selected={i === active}
              onClick={() => onSelect(item)}
            >
              {item.label ?? item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
`,
  "otp-input": `function OtpInput({ length, onComplete }) {
  const [digits, setDigits] = useState(() => Array(length).fill(""));
  const refs = useRef([]);
  const write = (i, value) => {
    const chars = value.replace(/\\D/g, "").slice(0, length - i).split("");
    if (chars.length === 0) {
      setDigits((d) => {
        const next = d.slice();
        next[i] = "";
        return next;
      });
      return;
    }
    setDigits((d) => {
      const next = d.slice();
      chars.forEach((ch, k) => {
        next[i + k] = ch;
      });
      const code = next.join("");
      if (code.length === length && !next.includes("")) onComplete?.(code);
      return next;
    });
    refs.current[Math.min(i + chars.length, length - 1)]?.focus();
  };
  return (
    <div>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={d}
          inputMode="numeric"
          maxLength={1}
          aria-label={"Digit " + (i + 1)}
          onChange={(e) => write(i, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
          }}
          onPaste={(e) => {
            e.preventDefault();
            write(i, e.clipboardData.getData("text"));
          }}
        />
      ))}
    </div>
  );
}
`,
  "nested-comments": `function Comment({ node, onReply }) {
  return (
    <article>
      <p>{node.author}</p>
      <p>{node.body}</p>
      <button type="button" onClick={() => onReply(node.id)}>Reply</button>
      {node.replies?.length ? (
        <div>
          {node.replies.map((child) => (
            <Comment key={child.id} node={child} onReply={onReply} />
          ))}
        </div>
      ) : null}
    </article>
  );
}
function CommentTree({ comments }) {
  return comments.map((node) => <Comment key={node.id} node={node} onReply={() => {}} />);
}
`,
  "file-explorer": `function Node({ node, expanded, toggle }) {
  const isDir = Boolean(node.children);
  return (
    <li>
      {isDir ? (
        <button type="button" aria-expanded={expanded.has(node.id)} onClick={() => toggle(node.id)}>
          {expanded.has(node.id) ? "▾" : "▸"} {node.name}
        </button>
      ) : (
        <span>{node.name}</span>
      )}
      {isDir && expanded.has(node.id) ? (
        <ul>
          {node.children.map((child) => (
            <Node key={child.id} node={child} expanded={expanded} toggle={toggle} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
function FileExplorer({ tree }) {
  const [expanded, setExpanded] = useState(() => new Set());
  const toggle = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  return (
    <ul>
      {tree.map((node) => (
        <Node key={node.id} node={node} expanded={expanded} toggle={toggle} />
      ))}
    </ul>
  );
}
`,
  "infinite-scroll-list": `function InfiniteList({ fetchPage }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinel = useRef(null);
  const load = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const next = await fetchPage(page + 1);
    setItems((list) => list.concat(next.items));
    setPage((p) => p + 1);
    setHasMore(next.hasMore);
    setLoading(false);
  }, [fetchPage, hasMore, loading, page]);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) load();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [load]);
  return (
    <div>
      <ul>{items.map((item) => <li key={item.id}>{item.label ?? item.title}</li>)}</ul>
      {hasMore ? <div ref={sentinel}>{loading ? "Loading…" : ""}</div> : null}
    </div>
  );
}
`,
  "virtualized-list": `function VirtualList({ items, itemHeight, height }) {
  const [scrollTop, setScrollTop] = useState(0);
  const overscan = 4;
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const count = Math.ceil(height / itemHeight) + overscan * 2;
  const slice = items.slice(start, start + count);
  return (
    <div
      style={{ height, overflow: "auto" }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: "relative" }}>
        <div style={{ transform: "translateY(" + start * itemHeight + "px)" }}>
          {slice.map((item, i) => (
            <div key={item.id ?? start + i} style={{ height: itemHeight }}>
              {item.label ?? item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`,
  "data-table": `function DataTable({ rows, columns, pageSize = 10 }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = q
      ? rows.filter((row) => columns.some((col) => String(row[col.key] ?? "").toLowerCase().includes(q)))
      : rows.slice();
    if (sortKey) {
      const dir = sortDir === "asc" ? 1 : -1;
      list = list
        .map((row, i) => ({ row, i }))
        .sort((a, b) => {
          const av = a.row[sortKey];
          const bv = b.row[sortKey];
          if (av < bv) return -1 * dir;
          if (av > bv) return 1 * dir;
          return a.i - b.i;
        })
        .map((x) => x.row);
    }
    return list;
  }, [rows, columns, query, sortKey, sortDir]);
  const pages = Math.max(1, Math.ceil(visible.length / pageSize));
  const pageRows = visible.slice((page - 1) * pageSize, page * pageSize);
  const cycleSort = (key) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") setSortDir("desc");
    else {
      setSortKey(null);
      setSortDir("asc");
    }
  };
  useEffect(() => setPage(1), [query]);
  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Filter rows" />
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} aria-sort={sortKey === col.key ? (sortDir === "asc" ? "ascending" : "descending") : "none"}>
                <button type="button" onClick={() => cycleSort(col.key)}>
                  {col.label}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageRows.map((row, i) => (
            <tr key={row.id ?? i}>
              {columns.map((col) => (
                <td key={col.key}>{row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
      <span>
        {page} / {pages}
      </span>
      <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next</button>
    </div>
  );
}
`,
  "reverse-integer": `function reverseInteger(n) {
  const sign = n < 0 ? -1 : 1;
  let x = Math.abs(n);
  let rev = 0;
  while (x > 0) {
    rev = rev * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  rev *= sign;
  if (rev < -2147483648 || rev > 2147483647) return 0;
  return rev;
}
`,
  "longest-palindrome": `function longestPalindrome(s) {
  if (!s) return "";
  let best = "";
  const expand = (L, R) => {
    while (L >= 0 && R < s.length && s[L] === s[R]) {
      L--;
      R++;
    }
    return s.slice(L + 1, R);
  };
  for (let i = 0; i < s.length; i++) {
    const odd = expand(i, i);
    const even = expand(i, i + 1);
    const next = odd.length >= even.length ? odd : even;
    if (next.length > best.length) best = next;
  }
  return best;
}
`,
  "minesweeper-reveal": `function reveal(board, [sr, sc]) {
  const rows = board.length;
  const cols = board[0].length;
  if (board[sr][sc] === "M") {
    board[sr][sc] = "X";
    return board;
  }
  const dirs = [-1, 0, 1];
  const countMines = (r, c) => {
    let n = 0;
    for (const dr of dirs) for (const dc of dirs) {
      if (!dr && !dc) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] === "M") n++;
    }
    return n;
  };
  const stack = [[sr, sc]];
  while (stack.length) {
    const [r, c] = stack.pop();
    if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== "E") continue;
    const n = countMines(r, c);
    if (n > 0) {
      board[r][c] = String(n);
      continue;
    }
    board[r][c] = "B";
    for (const dr of dirs) for (const dc of dirs) {
      if (!dr && !dc) continue;
      stack.push([r + dr, c + dc]);
    }
  }
  return board;
}
`,
  "t9-type": `function t9Type(presses, pauseMs) {
  const keys = { 2: "abc", 3: "def", 4: "ghi", 5: "jkl", 6: "mno", 7: "pqrs", 8: "tuv", 9: "wxyz" };
  let out = "";
  let lastKey = null;
  let lastTime = -Infinity;
  let cycle = 0;
  for (const { key, t } of presses) {
    const letters = keys[key];
    if (!letters) continue;
    if (key === lastKey && t - lastTime < pauseMs) {
      cycle = (cycle + 1) % letters.length;
      out = out.slice(0, -1) + letters[cycle];
    } else {
      cycle = 0;
      out += letters[0];
      lastKey = key;
    }
    lastTime = t;
  }
  return out;
}
`,
  "dynamic-html-table": `function renderTable(root, rows, cols) {
  root.replaceChildren();
  const table = document.createElement("table");
  const r = Math.max(0, rows);
  const c = Math.max(0, cols);
  for (let i = 0; i < r; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < c; j++) tr.appendChild(document.createElement("td"));
    table.appendChild(tr);
  }
  root.appendChild(table);
}
`,
  "html-outline": `function htmlOutline(root) {
  const result = [];
  const stack = [{ level: 0, children: result }];
  const walk = (node) => {
    if (node.nodeType === 1) {
      const m = /^H([1-6])$/i.exec(node.tagName);
      if (m) {
        const level = Number(m[1]);
        const item = { level, text: node.textContent.trim(), children: [] };
        while (stack[stack.length - 1].level >= level) stack.pop();
        stack[stack.length - 1].children.push(item);
        stack.push(item);
      }
      for (const child of node.children) walk(child);
    }
  };
  walk(root);
  return result;
}
`,
  "lru-cache": `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
  }
}
`,
  "prefix-trie": `class Trie {
  constructor() {
    this.root = { children: new Map(), isWord: false };
  }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), isWord: false });
      node = node.children.get(ch);
    }
    node.isWord = true;
  }
  complete(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      node = node.children.get(ch);
      if (!node) return [];
    }
    const out = [];
    const dfs = (n, path) => {
      if (n.isWord) out.push(path);
      const keys = [...n.children.keys()].sort();
      for (const ch of keys) dfs(n.children.get(ch), path + ch);
    };
    dfs(node, prefix);
    return out;
  }
}
`,
  "poll-until": `function pollUntil(fn, { interval, timeout }) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    let cancelled = false;
    const tick = async () => {
      if (cancelled) return;
      try {
        const value = await fn();
        if (cancelled) return;
        if (value) return resolve(value);
        if (Date.now() - start >= timeout) return reject(new Error("timeout"));
        setTimeout(tick, interval);
      } catch (error) {
        reject(error);
      }
    };
    tick();
  });
}
`,
  "abort-search": `let searchController;
function searchLatest(query, fetchFn) {
  searchController?.abort();
  searchController = new AbortController();
  const { signal } = searchController;
  return fetchFn(query, { signal }).catch((error) => {
    if (error.name === "AbortError") return;
    throw error;
  });
}
`,
  "analytics-queue": `function createTracker({ send, max, interval }) {
  let queue = [];
  let flushing = false;
  const flush = async () => {
    if (flushing || queue.length === 0) return;
    flushing = true;
    const batch = queue.splice(0);
    try {
      await send(batch);
    } catch {
      queue.unshift(...batch);
    } finally {
      flushing = false;
    }
  };
  const id = setInterval(flush, interval);
  const onHide = () => {
    if (document.hidden) flush();
  };
  document.addEventListener("visibilitychange", onHide);
  return {
    track(event) {
      queue.push(event);
      if (queue.length >= max) flush();
    },
    flush,
    destroy() {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onHide);
    },
  };
}
`,
  "luhn-check": `function luhnCheck(number) {
  const digits = number.replace(/\\s+/g, "");
  if (!/^\\d+$/.test(digits)) return false;
  let sum = 0;
  let dbl = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}
`,
  "shopping-cart": `function ShoppingCart({ catalog }) {
  const [qty, setQty] = useState({});
  const add = (item) => {
    setQty((q) => ({ ...q, [item.id]: Math.min(item.stock, (q[item.id] ?? 0) + 1) }));
  };
  const set = (item, n) => {
    const next = Math.max(0, Math.min(item.stock, n));
    setQty((q) => ({ ...q, [item.id]: next }));
  };
  const lines = catalog.filter((item) => (qty[item.id] ?? 0) > 0);
  const total = lines.reduce((sum, item) => sum + item.price * qty[item.id], 0);
  return (
    <div>
      <ul>
        {catalog.map((item) => (
          <li key={item.id}>
            {item.name} — {item.price}
            <button type="button" disabled={(qty[item.id] ?? 0) >= item.stock} onClick={() => add(item)}>
              Add
            </button>
          </li>
        ))}
      </ul>
      <ul>
        {lines.map((item) => (
          <li key={item.id}>
            {item.name}
            <input
              type="number"
              min={0}
              max={item.stock}
              value={qty[item.id]}
              onChange={(e) => set(item, Number(e.target.value))}
            />
          </li>
        ))}
      </ul>
      <p>Total {total}</p>
    </div>
  );
}
`,
  "restaurant-search": `function RestaurantSearch({ restaurants }) {
  const [q, setQ] = useState("");
  const [cuisine, setCuisine] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("rating");
  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = restaurants.filter((r) => {
      if (needle && !r.name.toLowerCase().includes(needle)) return false;
      if (cuisine !== "all" && r.cuisine !== cuisine) return false;
      if (r.rating < minRating) return false;
      return true;
    });
    list = list.slice().sort((a, b) => (sort === "rating" ? b.rating - a.rating : a.name.localeCompare(b.name)));
    return list;
  }, [restaurants, q, cuisine, minRating, sort]);
  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search restaurants" />
      <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
        <option value="all">All</option>
      </select>
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="rating">Rating</option>
        <option value="name">Name</option>
      </select>
      <ul>
        {visible.map((r) => (
          <li key={r.id}>{r.name}</li>
        ))}
      </ul>
    </div>
  );
}
`,
  "use-form": `function useForm({ initial, validate }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const onChange = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[name];
      return next;
    });
  };
  const handleSubmit = (onValid) => (event) => {
    event.preventDefault();
    const next = validate(values) || {};
    setErrors(next);
    if (Object.keys(next).length === 0) onValid(values);
  };
  return { values, errors, onChange, handleSubmit };
}
`,
  "nested-checkboxes": `function status(node, checked) {
  if (!node.children?.length) return checked.has(node.id) ? "all" : "none";
  const parts = node.children.map((c) => status(c, checked));
  if (parts.every((p) => p === "all")) return "all";
  if (parts.every((p) => p === "none")) return "none";
  return "mixed";
}
function collectIds(node, into = []) {
  into.push(node.id);
  for (const c of node.children ?? []) collectIds(c, into);
  return into;
}
function NestedCheckboxes({ tree }) {
  const [checked, setChecked] = useState(() => new Set());
  const toggle = (node, on) => {
    const ids = collectIds(node);
    setChecked((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        if (on) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  };
  const Node = ({ node }) => {
    const st = status(node, checked);
    return (
      <li>
        <label>
          <input
            type="checkbox"
            checked={st === "all"}
            ref={(el) => {
              if (el) el.indeterminate = st === "mixed";
            }}
            onChange={(e) => toggle(node, e.target.checked)}
          />
          {node.label}
        </label>
        {node.children?.length ? (
          <ul>
            {node.children.map((c) => (
              <Node key={c.id} node={c} />
            ))}
          </ul>
        ) : null}
      </li>
    );
  };
  return (
    <ul>
      {tree.map((node) => (
        <Node key={node.id} node={node} />
      ))}
    </ul>
  );
}
`,
  "transfer-list": `function TransferList({ items }) {
  const [left, setLeft] = useState(() => items.map((i) => i.id));
  const [right, setRight] = useState([]);
  const [selected, setSelected] = useState(() => new Set());
  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const move = (from, setFrom, setTo, onlySelected) => {
    const take = onlySelected ? from.filter((id) => selected.has(id)) : from;
    const keep = new Set(take);
    setFrom(from.filter((id) => !keep.has(id)));
    setTo((to) => to.concat(take));
    setSelected((s) => {
      const next = new Set(s);
      take.forEach((id) => next.delete(id));
      return next;
    });
  };
  const list = (ids, label) => (
    <section aria-label={label}>
      {ids.map((id) => (
        <label key={id}>
          <input
            type="checkbox"
            checked={selected.has(id)}
            onChange={() =>
              setSelected((s) => {
                const next = new Set(s);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
              })
            }
          />
          {byId.get(id)?.label ?? id}
        </label>
      ))}
    </section>
  );
  return (
    <div>
      {list(left, "Available")}
      <div>
        <button type="button" onClick={() => move(left, setLeft, setRight, true)}>Add</button>
        <button type="button" onClick={() => move(left, setLeft, setRight, false)}>Add all</button>
        <button type="button" onClick={() => move(right, setRight, setLeft, true)}>Remove</button>
        <button type="button" onClick={() => move(right, setRight, setLeft, false)}>Remove all</button>
      </div>
      {list(right, "Chosen")}
    </div>
  );
}
`,
  "with-loading": `function withLoading(Component) {
  function Wrapped({ loading, ...props }) {
    if (loading) return <p role="status">Loading</p>;
    return <Component {...props} />;
  }
  const name = Component.displayName || Component.name || "Component";
  Wrapped.displayName = "WithLoading(" + name + ")";
  return Wrapped;
}
`,
  "retry-backoff": `async function retryWithBackoff(task, { retries, baseDelay }) {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      if (i === retries) throw error;
      await sleep(baseDelay * 2 ** i);
    }
  }
  throw lastError;
}
`,
  "throttle-promises": `async function throttlePromises(tasks, batchSize) {
  const out = [];
  for (let i = 0; i < tasks.length; i += batchSize) {
    const chunk = tasks.slice(i, i + batchSize);
    out.push(...(await Promise.all(chunk.map((fn) => fn()))));
  }
  return out;
}
`,
  "shuffle-index": `function nextShuffleIndex(length, current) {
  if (length <= 1) return 0;
  const n = length - 1;
  const r = Math.floor(Math.random() * n);
  return r >= current ? r + 1 : r;
}
`,
  "carousel-controls": `function ControlledCarousel({ images }) {
  const [index, setIndex] = useState(0);
  const n = images.length;
  const wrap = (i) => (i + n) % n;
  return (
    <div>
      <img src={images[index]} alt="" />
      <button type="button" onClick={() => setIndex((i) => wrap(i - 1))}>Prev</button>
      <button type="button" onClick={() => setIndex((i) => wrap(i + 1))}>Next</button>
      <button type="button" onClick={() => setIndex(0)}>First</button>
      <button type="button" onClick={() => setIndex(n - 1)}>Last</button>
      <button type="button" onClick={() => setIndex((i) => nextShuffleIndex(n, i))}>Shuffle</button>
    </div>
  );
}
`,
  "responsive-app-shell": `function renderAppShell(root) {
  root.innerHTML = \`
    <header>
      <button type="button" aria-expanded="false" aria-controls="nav">Menu</button>
      <strong>App</strong>
    </header>
    <div class="shell">
      <nav id="nav">Nav</nav>
      <main>Content</main>
    </div>
  \`;
  const btn = root.querySelector("button");
  const nav = root.querySelector("#nav");
  btn.onclick = () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  };
}
`,
  "use-cached-fetch": `const cache = new Map();
const inflight = new Map();
function useCachedFetch(url) {
  const [state, setState] = useState(() =>
    cache.has(url) ? { data: cache.get(url), error: null, loading: false } : { data: null, error: null, loading: true },
  );
  const load = useCallback(async () => {
    if (cache.has(url)) {
      setState({ data: cache.get(url), error: null, loading: false });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    let p = inflight.get(url);
    if (!p) {
      p = fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error(String(r.status));
          return r.json();
        })
        .then((data) => {
          cache.set(url, data);
          inflight.delete(url);
          return data;
        })
        .catch((error) => {
          inflight.delete(url);
          throw error;
        });
      inflight.set(url, p);
    }
    try {
      const data = await p;
      setState({ data, error: null, loading: false });
    } catch (error) {
      setState({ data: null, error, loading: false });
    }
  }, [url]);
  useEffect(() => {
    load();
  }, [load]);
  return { ...state, refetch: load };
}
`,
  "grid-lights": `function GridLights({ config }) {
  const cells = config.flatMap((row, r) => row.map((on, c) => ({ r, c, on })).filter((x) => x.on));
  const [order, setOrder] = useState([]);
  const draining = useRef(false);
  useEffect(() => {
    if (order.length !== cells.length || draining.current) return;
    draining.current = true;
    const id = setInterval(() => {
      setOrder((o) => {
        if (o.length <= 1) {
          clearInterval(id);
          draining.current = false;
          return [];
        }
        return o.slice(0, -1);
      });
    }, 300);
    return () => clearInterval(id);
  }, [order.length, cells.length]);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(" + config[0].length + ", 2rem)" }}>
      {config.flatMap((row, r) =>
        row.map((on, c) => {
          const i = r + "," + c;
          const lit = order.includes(i);
          return (
            <button
              key={i}
              type="button"
              disabled={!on || lit || draining.current}
              onClick={() => setOrder((o) => o.concat(i))}
              style={{ opacity: on ? 1 : 0, background: lit ? "gold" : "transparent" }}
            />
          );
        }),
      )}
    </div>
  );
}
`,
  "like-button": `function LikeButton({ liked, count, onToggle }) {
  const [state, setState] = useState({ liked, count });
  const busy = useRef(false);
  useEffect(() => setState({ liked, count }), [liked, count]);
  return (
    <button
      type="button"
      aria-pressed={state.liked}
      onClick={async () => {
        if (busy.current) return;
        const snap = state;
        const next = { liked: !snap.liked, count: snap.count + (snap.liked ? -1 : 1) };
        setState(next);
        busy.current = true;
        try {
          await onToggle(next.liked);
        } catch {
          setState(snap);
        } finally {
          busy.current = false;
        }
      }}
    >
      {state.liked ? "♥" : "♡"} {state.count}
    </button>
  );
}
`,
  "chips-input": `function ChipsInput({ value, onChange }) {
  const [text, setText] = useState("");
  const commit = () => {
    const chip = text.trim();
    if (!chip || value.includes(chip)) {
      setText("");
      return;
    }
    onChange([...value, chip]);
    setText("");
  };
  return (
    <div>
      {value.map((chip) => (
        <button key={chip} type="button" aria-label={"Remove " + chip} onClick={() => onChange(value.filter((c) => c !== chip))}>
          {chip}
        </button>
      ))}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit();
          }
          if (e.key === "Backspace" && text === "" && value.length) onChange(value.slice(0, -1));
        }}
      />
    </div>
  );
}
`,
  "toast-stack": `const ToastCtx = createContext(null);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, { ms = 3000 } = {}) => {
    const id = crypto.randomUUID();
    setToasts((t) => t.concat({ id, message, ms }));
  }, []);
  const close = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <ol>
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={() => close(t.id)} />
        ))}
      </ol>
    </ToastCtx.Provider>
  );
}
function Toast({ id, message, ms, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, ms);
    return () => clearTimeout(t);
  }, [ms, onClose]);
  return (
    <li role="status">
      {message}
      <button type="button" onClick={onClose}>Close</button>
    </li>
  );
}
function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used in ToastProvider");
  return ctx;
}
`,
  "theme-context": `const ThemeCtx = createContext(null);
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "dark";
    } catch {
      return "dark";
    }
  });
  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);
  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}
function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used in ThemeProvider");
  return ctx;
}
`,
  "favourites-catalog": `function CatalogApp({ items }) {
  const [q, setQ] = useState("");
  const [view, setView] = useState("all");
  const [selected, setSelected] = useState(null);
  const [fav, setFav] = useState(() => new Set());
  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((item) => {
      if (needle && !item.title.toLowerCase().includes(needle)) return false;
      if (view === "fav" && !fav.has(item.id)) return false;
      return true;
    });
  }, [items, q, view, fav]);
  const toggleFav = (id) => {
    setFav((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
      <button type="button" aria-pressed={view === "all"} onClick={() => setView("all")}>All</button>
      <button type="button" aria-pressed={view === "fav"} onClick={() => setView("fav")}>Favourites</button>
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <button type="button" onClick={() => setSelected(item.id)}>{item.title}</button>
            <button type="button" aria-pressed={fav.has(item.id)} onClick={() => toggleFav(item.id)}>♥</button>
          </li>
        ))}
      </ul>
      {selected ? <p>{items.find((i) => i.id === selected)?.detail}</p> : null}
    </div>
  );
}
`,
  "traffic-light": `function TrafficLight({ timings }) {
  const order = ["red", "green", "yellow"];
  const [phase, setPhase] = useState("red");
  useEffect(() => {
    const id = setTimeout(() => {
      setPhase((p) => order[(order.indexOf(p) + 1) % order.length]);
    }, timings[phase]);
    return () => clearTimeout(id);
  }, [phase, timings]);
  return (
    <div>
      <p aria-live="polite">{phase}</p>
      {order.map((color) => (
        <div key={color} data-on={color === phase} />
      ))}
    </div>
  );
}
`,
  "tic-tac-toe-n": `function TicTacToeN({ size = 3 }) {
  const n = size * size;
  const [board, setBoard] = useState(() => Array(n).fill(null));
  const [xTurn, setXTurn] = useState(true);
  useEffect(() => {
    setBoard(Array(size * size).fill(null));
    setXTurn(true);
  }, [size]);
  const winner = useMemo(() => {
    const lines = [];
    for (let r = 0; r < size; r++) lines.push(Array.from({ length: size }, (_, c) => r * size + c));
    for (let c = 0; c < size; c++) lines.push(Array.from({ length: size }, (_, r) => r * size + c));
    lines.push(Array.from({ length: size }, (_, i) => i * size + i));
    lines.push(Array.from({ length: size }, (_, i) => i * size + (size - 1 - i)));
    for (const line of lines) {
      const p = board[line[0]];
      if (p && line.every((i) => board[i] === p)) return p;
    }
    return null;
  }, [board, size]);
  return (
    <div>
      <p>{winner ? winner + " wins" : board.every(Boolean) ? "Draw" : (xTurn ? "X" : "O") + " to play"}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(" + size + ", 2rem)" }}>
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            disabled={Boolean(cell) || winner}
            onClick={() => {
              setBoard((b) => {
                const next = b.slice();
                next[i] = xTurn ? "X" : "O";
                return next;
              });
              setXTurn((t) => !t);
            }}
          >
            {cell}
          </button>
        ))}
      </div>
      <button type="button" onClick={() => { setBoard(Array(n).fill(null)); setXTurn(true); }}>Reset</button>
    </div>
  );
}
`,
  "product-grid": `function ProductGrid({ products }) {
  const [category, setCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("price");
  const [cart, setCart] = useState({});
  const visible = useMemo(() => {
    return products
      .filter((p) => (category === "all" || p.category === category) && p.price <= maxPrice && p.rating >= minRating)
      .slice()
      .sort((a, b) => (sort === "price" ? a.price - b.price : b.rating - a.rating));
  }, [products, category, maxPrice, minRating, sort]);
  const add = (p) => setCart((c) => ({ ...c, [p.id]: Math.min(p.stock, (c[p.id] ?? 0) + 1) }));
  return (
    <div>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">All</option>
      </select>
      <ul>
        {visible.map((p) => (
          <li key={p.id}>
            {p.name} {p.price}
            <button type="button" disabled={(cart[p.id] ?? 0) >= p.stock} onClick={() => add(p)}>Add</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
`,
  "order-timeline": `function OrderTimeline({ steps, currentId }) {
  const i = steps.findIndex((s) => s.id === currentId);
  return (
    <ol>
      {steps.map((step, idx) => {
        const status = idx < i ? "done" : idx === i ? "current" : "pending";
        return (
          <li key={step.id} aria-current={status === "current" ? "step" : undefined} data-status={status}>
            {step.label}
          </li>
        );
      })}
    </ol>
  );
}
`,
  "media-row": `function MediaRow({ title, items }) {
  const ref = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const sync = () => {
    const el = ref.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 0);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    return () => el.removeEventListener("scroll", sync);
  }, [items]);
  return (
    <section>
      <h2>{title}</h2>
      <button type="button" disabled={!canPrev} onClick={() => ref.current.scrollBy({ left: -ref.current.clientWidth, behavior: "smooth" })}>
        Prev
      </button>
      <div ref={ref} style={{ display: "flex", overflowX: "auto" }}>
        {items.map((item) => (
          <article key={item.id}>{item.title}</article>
        ))}
      </div>
      <button type="button" disabled={!canNext} onClick={() => ref.current.scrollBy({ left: ref.current.clientWidth, behavior: "smooth" })}>
        Next
      </button>
    </section>
  );
}
`,
  "checkout-wizard": `function CheckoutWizard({ onComplete }) {
  const steps = ["address", "payment", "review"];
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({ street: "", card: "" });
  const valid = () => {
    if (step === 0) return values.street.trim().length > 0;
    if (step === 1) return values.card.replace(/\\s/g, "").length >= 12;
    return true;
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid()) return;
        if (step < 2) setStep((s) => s + 1);
        else onComplete(values);
      }}
    >
      <ol>
        {steps.map((id, i) => (
          <li key={id} aria-current={i === step ? "step" : undefined}>{id}</li>
        ))}
      </ol>
      {step === 0 ? (
        <input value={values.street} onChange={(e) => setValues((v) => ({ ...v, street: e.target.value }))} aria-label="Street" />
      ) : null}
      {step === 1 ? (
        <input value={values.card} onChange={(e) => setValues((v) => ({ ...v, card: e.target.value }))} aria-label="Card" />
      ) : null}
      {step === 2 ? <pre>{JSON.stringify(values, null, 2)}</pre> : null}
      <button type="button" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</button>
      <button type="submit">{step === 2 ? "Place order" : "Next"}</button>
    </form>
  );
}
`,
  "jobs-board": `function JobsBoard({ fetchPage }) {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPage(page).then((res) => {
      if (cancelled) return;
      setJobs((list) => {
        const seen = new Set(list.map((j) => j.id));
        return list.concat(res.items.filter((j) => !seen.has(j.id)));
      });
      setHasMore(res.hasMore);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [fetchPage, page]);
  return (
    <div>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>{job.title}</li>
        ))}
      </ul>
      {hasMore ? (
        <button type="button" disabled={loading} onClick={() => setPage((p) => p + 1)}>
          Load more
        </button>
      ) : null}
    </div>
  );
}
`,
  "timer-pause": `function Timer({ seconds }) {
  const [remaining, setRemaining] = useState(seconds * 1000);
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 50);
    return () => clearInterval(id);
  }, [running]);
  const left = running ? Math.max(0, remaining - (now - startedAt)) : remaining;
  useEffect(() => {
    if (running && left === 0) setRunning(false);
  }, [left, running]);
  return (
    <div>
      <p aria-live="polite">{Math.ceil(left / 1000)}s</p>
      <button
        type="button"
        onClick={() => {
          if (running) {
            setRemaining(left);
            setRunning(false);
          } else if (left > 0) {
            setStartedAt(Date.now());
            setNow(Date.now());
            setRunning(true);
          }
        }}
      >
        {running ? "Pause" : "Start"}
      </button>
      <button
        type="button"
        onClick={() => {
          setRunning(false);
          setRemaining(seconds * 1000);
        }}
      >
        Reset
      </button>
    </div>
  );
}
`,
  "poll-widget": `function Poll({ question, options }) {
  const [choice, setChoice] = useState(null);
  const [votes, setVotes] = useState(() => Object.fromEntries(options.map((o) => [o.id, 0])));
  const total = Object.values(votes).reduce((a, b) => a + b, 0);
  return (
    <div>
      <h2>{question}</h2>
      {options.map((o) => (
        <div key={o.id}>
          {choice == null ? (
            <button
              type="button"
              onClick={() => {
                setChoice(o.id);
                setVotes((v) => ({ ...v, [o.id]: v[o.id] + 1 }));
              }}
            >
              {o.label}
            </button>
          ) : (
            <p>
              {o.label}: {total ? Math.round((votes[o.id] / total) * 100) : 0}%
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
`,
  "use-online": `function useOnline() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("online", cb);
      window.addEventListener("offline", cb);
      return () => {
        window.removeEventListener("online", cb);
        window.removeEventListener("offline", cb);
      };
    },
    () => navigator.onLine,
    () => true,
  );
}
`,
  "mini-store": `function createStore(reducer, init) {
  let state = init;
  const listeners = new Set();
  const getState = () => state;
  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((l) => l());
  };
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  function useStore(selector = (s) => s) {
    return useSyncExternalStore(subscribe, () => selector(getState()), () => selector(init));
  }
  return { dispatch, getState, subscribe, useStore };
}
`,
  "quantity-stepper": `function QuantityStepper({ value, min = 0, max = Infinity, onChange }) {
  const clamp = (n) => Math.min(max, Math.max(min, n));
  return (
    <div>
      <button type="button" disabled={value <= min} onClick={() => onChange(clamp(value - 1))} aria-label="Decrease">
        −
      </button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(clamp(Number(e.target.value) || min))}
        onBlur={(e) => onChange(clamp(Number(e.target.value) || min))}
      />
      <button type="button" disabled={value >= max} onClick={() => onChange(clamp(value + 1))} aria-label="Increase">
        +
      </button>
    </div>
  );
}
`,
  "memory-pairs": `function MemoryGame({ cards }) {
  const [deck] = useState(cards);
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState(() => new Set());
  const [locked, setLocked] = useState(false);
  useEffect(() => {
    if (open.length !== 2) return;
    const [a, b] = open;
    const ca = deck.find((c) => c.id === a);
    const cb = deck.find((c) => c.id === b);
    if (ca.face === cb.face) {
      setMatched((m) => new Set(m).add(a).add(b));
      setOpen([]);
      return;
    }
    setLocked(true);
    const t = setTimeout(() => {
      setOpen([]);
      setLocked(false);
    }, 800);
    return () => clearTimeout(t);
  }, [open, deck]);
  return (
    <div>
      {deck.map((card) => {
        const up = open.includes(card.id) || matched.has(card.id);
        return (
          <button
            key={card.id}
            type="button"
            disabled={up || locked}
            onClick={() => setOpen((o) => (o.length < 2 ? o.concat(card.id) : o))}
          >
            {up ? card.face : "?"}
          </button>
        );
      })}
    </div>
  );
}
`,
  "drag-select-grid": `function rectsOverlap(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}
function DragSelectGrid({ rows, cols }) {
  const root = useRef(null);
  const cells = useRef(new Map());
  const [drag, setDrag] = useState(null);
  const [selected, setSelected] = useState(() => new Set());
  const marquee = drag
    ? {
        left: Math.min(drag.x0, drag.x1),
        top: Math.min(drag.y0, drag.y1),
        right: Math.max(drag.x0, drag.x1),
        bottom: Math.max(drag.y0, drag.y1),
      }
    : null;
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setSelected(new Set());
        setDrag(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const hit = (box) => {
    const next = new Set();
    cells.current.forEach((el, key) => {
      if (rectsOverlap(box, el.getBoundingClientRect())) next.add(key);
    });
    return next;
  };
  return (
    <div
      ref={root}
      style={{ display: "grid", gridTemplateColumns: "repeat(" + cols + ", 2rem)", userSelect: drag ? "none" : undefined, position: "relative" }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDrag({ x0: e.clientX, y0: e.clientY, x1: e.clientX, y1: e.clientY });
      }}
      onPointerMove={(e) => {
        if (!drag) return;
        const next = { ...drag, x1: e.clientX, y1: e.clientY };
        setDrag(next);
        setSelected(hit({
          left: Math.min(next.x0, next.x1),
          top: Math.min(next.y0, next.y1),
          right: Math.max(next.x0, next.x1),
          bottom: Math.max(next.y0, next.y1),
        }));
      }}
      onPointerUp={() => setDrag(null)}
    >
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const key = r + "," + c;
        return (
          <div
            key={key}
            ref={(el) => {
              if (el) cells.current.set(key, el);
              else cells.current.delete(key);
            }}
            data-selected={selected.has(key)}
          />
        );
      })}
      {marquee ? (
        <div
          style={{
            position: "fixed",
            pointerEvents: "none",
            left: marquee.left,
            top: marquee.top,
            width: marquee.right - marquee.left,
            height: marquee.bottom - marquee.top,
            border: "1px solid skyblue",
            background: "rgba(56,189,248,0.15)",
          }}
        />
      ) : null}
    </div>
  );
}
`,
};
