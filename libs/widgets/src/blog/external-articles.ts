export type ExternalArticle = {
  title: string;
  href: string;
  source: string;
  description: string;
};

export const EXTERNAL_ARTICLES: ExternalArticle[] = [
  {
    title: "Learn to make the web fast, accessible, and reliable",
    href: "https://web.dev/",
    source: "web.dev",
    description: "Google’s guides on performance, HTML, CSS, JavaScript, and modern browser APIs.",
  },
  {
    title: "MDN Web Docs",
    href: "https://developer.mozilla.org/en-US/docs/Web",
    source: "MDN",
    description: "The reference for HTML, CSS, JavaScript, and HTTP — start here when the spec is the source of truth.",
  },
  {
    title: "JavaScript Tutorial",
    href: "https://javascript.info/",
    source: "javascript.info",
    description: "A structured walk through the language, from primitives to async, with examples you can run.",
  },
  {
    title: "Patterns.dev",
    href: "https://www.patterns.dev/",
    source: "Patterns.dev",
    description: "Design patterns for modern web apps — rendering, performance, and JavaScript architecture.",
  },
  {
    title: "Overreacted",
    href: "https://overreacted.io/",
    source: "Dan Abramov",
    description: "Deep dives on React, JavaScript, and the ideas behind the tools we use every day.",
  },
  {
    title: "Josh Comeau’s blog",
    href: "https://www.joshwcomeau.com/",
    source: "Josh W. Comeau",
    description: "CSS, React, and animation explained with interactive examples.",
  },
  {
    title: "Kent C. Dodds blog",
    href: "https://kentcdodds.com/blog",
    source: "Kent C. Dodds",
    description: "Testing, React, and how to ship software you can change without fear.",
  },
  {
    title: "CSS-Tricks",
    href: "https://css-tricks.com/",
    source: "CSS-Tricks",
    description: "Practical CSS, layout, and front-end notes — still one of the fastest ways to unstick a styling problem.",
  },
  {
    title: "TkDodo’s blog",
    href: "https://tkdodo.eu/blog/",
    source: "Dominik Dorfmeister",
    description: "The TanStack Query maintainer on caching, query keys, and why server state is not client state.",
  },
  {
    title: "ARIA Authoring Practices Guide",
    href: "https://www.w3.org/WAI/ARIA/apg/",
    source: "W3C WAI",
    description: "The reference implementations for accessible widgets — keyboard behaviour and roles, pattern by pattern.",
  },
  {
    title: "OWASP Cheat Sheet Series",
    href: "https://cheatsheetseries.owasp.org/",
    source: "OWASP",
    description: "Short, opinionated security guidance — sessions, auth, XSS, and CSRF, written for people shipping code.",
  },
];
