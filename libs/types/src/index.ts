export type PostFrontmatter = {
  title: string;
  description: string;
  slug: string;
  date: string;
  tags: string[];
  /** Rail bucket. When omitted, the first matching subject tag is used. */
  subject?: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  year: string;
  tags: string[];
  href?: string;
  role: string;
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  highlights: string[];
};

export type Education = {
  school: string;
  degree: string;
  period: string;
  location: string;
  detail?: string;
};

export type SkillGroup = {
  label: string;
  skills: string[];
};

export type Profile = {
  name: string;
  location: string;
  headline: string;
  phone: string;
  availability: string;
  /** Public path, e.g. `/portrait.jpg` in `apps/web/public`. */
  photo?: string;
  bio: string[];
  highlights: string[];
  skillGroups: SkillGroup[];
  technicalSkills: SkillGroup[];
  stack: string[];
  experience: Experience[];
  education: Education[];
};

export type PracticeGroup = "basics" | "arrays" | "objects" | "functions" | "async";

export type PracticeDifficulty = "easy" | "medium";

export type PracticeExample = {
  call: string;
  result: string;
};

export type PracticeTest = {
  label: string;
  expected: unknown;
  args?: unknown[];
  /** Body of `async () => { ... }` with `fn` bound to the user’s function. Must `return` the value to compare. */
  run?: string;
};

export type PracticeQuestion = {
  slug: string;
  title: string;
  description: string;
  group: PracticeGroup;
  difficulty: PracticeDifficulty;
  fnName: string;
  signature: string;
  prompt: string;
  examples: PracticeExample[];
  notes: string[];
  hint: string;
  starter: string;
  tests: PracticeTest[];
};

export type ToolGroup = "encode" | "format" | "generate" | "inspect";

export type ToolMeta = {
  slug: string;
  title: string;
  description: string;
  group: ToolGroup;
  featured?: boolean;
};

export type Theme = "dark" | "light";

export type Site = {
  name: string;
  shortName: string;
  role: string;
  tagline: string;
  description: string;
  email: string;
  url: string;
  socials: {
    github: string;
    linkedin: string;
  };
};
