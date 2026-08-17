export type PostFrontmatter = {
  title: string;
  description: string;
  slug: string;
  date: string;
  tags: string[];
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
