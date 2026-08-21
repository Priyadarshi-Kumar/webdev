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
];
