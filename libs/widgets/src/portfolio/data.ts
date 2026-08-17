import type { Profile, Project } from "@webdev/types";
import { findBySlug } from "@webdev/utils";

export const profile: Profile = {
  name: "Priyadarshi Kumar",
  location: "Bangalore, Karnataka · open to remote",
  headline: "Lead Software Engineer · Front-End",
  availability: "Open to full-time & contract",
  phone: "+91 77649 44858",
  bio: [
    "Front-end engineer with 6+ years shipping React products at scale — analytics dashboards, fintech onboarding, mobility platforms, and EDA tooling with AI-assisted workflows.",
    "I own features end to end: design, implementation, performance, release, and the docs that help the next engineer move faster.",
  ],
  highlights: [
    "Led analytics dashboards at Tekion adopted by dealer partners — Teams dashboard alone drove 20% of total visits.",
    "Scaled tenant capacity 10× with virtualization, infinite scroll, and pagination (15 → 200 dealers per tenant).",
    "Ship EDA tooling today: multi-tab schematics, xterm.js terminals, and mai-ai chat over server-sent events.",
    "Write the docs I wish existed: {notesCount}+ technical articles on React, Zustand, Nx, and browser APIs.",
  ],
  skillGroups: [
    {
      label: "Frontend",
      skills: ["React", "TypeScript", "Redux", "Zustand", "React Query", "Tailwind CSS", "Angular"],
    },
    {
      label: "Quality & delivery",
      skills: ["Jest", "Playwright", "Storybook", "Git", "AWS", "Terraform"],
    },
    {
      label: "Backend & data",
      skills: ["Node.js", "Express", "SQL", "Socket.io", "SSE"],
    },
    {
      label: "Browser APIs",
      skills: ["BroadcastChannel", "Web Locks", "Web Workers", "Service Workers"],
    },
  ],
  technicalSkills: [
    {
      label: "Languages",
      skills: ["HTML", "CSS", "JavaScript", "SQL", "TypeScript"],
    },
    {
      label: "Technologies & frameworks",
      skills: [
        "React",
        "React Query",
        "Zustand",
        "Tailwind CSS",
        "Redux",
        "Jest",
        "Express",
        "Storybook",
        "Git",
        "Playwright",
        "Angular",
        "Web Storage (Cache, IndexedDB)",
      ],
    },
    {
      label: "Browser APIs",
      skills: ["BroadcastChannel", "Web Locks", "Web Workers", "Service Workers"],
    },
  ],
  stack: [
    "TypeScript",
    "React",
    "Redux",
    "Zustand",
    "React Query",
    "Jest",
    "Playwright",
    "Node.js",
    "AWS",
  ],
  experience: [
    {
      company: "Maieutic Semiconductors",
      role: "Lead Software Engineer — Front-End Engineer",
      period: "November 2025 — Present",
      location: "Bangalore, Karnataka",
      highlights: [
        "Designed and developed multi-tab/panel feature to enable editing of multiple schematics/symbols simultaneously in tabs or panels.",
        "Designed and developed user interactions handling like drawing a shape, adding instance, etc. Added support for multiple interactions at once.",
        "Integrated terminal using xterm.js on UI and wrote a BE service to serve the terminal using node-pty and socket.io. Supported multiple terminals at once, connection handling, and data persistence.",
        "Worked on mai-ai chat where user can ask AI to work on a circuit, run simulation, etc. using server-sent events.",
      ],
    },
    {
      company: "Tekion",
      role: "Software Engineer 2 — Front-End Engineer",
      period: "July 2022 — November 2025",
      location: "Bangalore, Karnataka",
      highlights: [
        "Led development of analytics web and mobile applications using React, React Table, Highcharts, Jest, and Redux, delivering high-impact dashboards including Teams, Parts, Service, and Sales. Enhanced business visibility for dealer partners, with the Teams dashboard becoming the most visited and widely adopted feature, accounting for 20% of total visits.",
        "Optimized analytics pages using virtualization, infinite scroll, and pagination, scaling capacity from 10–15 dealers per tenant to efficiently support 100–200 dealers per tenant.",
        "Stabilized the Analytics dashboard, reducing monthly support issues from 8–10 to near zero. Improvements led to a 30% increase in user adoption over one year.",
        "Owned end-to-end delivery of features, including cross-functional handoffs, development, and release management.",
      ],
    },
    {
      company: "Setu — Part of Pine Labs",
      role: "Software Engineer — Web Developer",
      period: "December 2021 — June 2022",
      location: "Bangalore, Karnataka",
      highlights: [
        "Developed and maintained a Fixed Deposits web app and SDK using React.js, Playwright, and AWS, integrating multiple banking partners to provide seamless investment options. Onboarded Axis and UJVN.",
        "Contributed to the development of a unified platform (Bridge) using React, Redux, and React Query, enhancing the onboarding experience for partners by streamlining integration and reducing time-to-go-live.",
        "Implemented automated tests using Playwright, enabling confident deployments and significantly reducing testing and release cycle times.",
        "Deployed front-end applications using AWS services including S3, CloudFront, and Route 53, with infrastructure managed via Terraform.",
      ],
    },
    {
      company: "Yulu Bikes Pvt. Ltd.",
      role: "Full-Stack Developer — MTS",
      period: "July 2019 — November 2021",
      location: "Bangalore, Karnataka",
      highlights: [
        "Developed a React-Redux web application on AWS, enabling users to access Yulu app services directly via browser. Improved customer acquisition by providing key features such as journey booking, nearby bike availability, ride visualization, and billing visibility. Impact: facilitated 35K+ journeys with an average user rating of 4.4/5.",
        "Designed and developed Angular modules for internal and partner dashboards, enhancing operational visibility and strengthening partner collaboration.",
        "Built a multi-tenant platform using React and Redux, enabling partners to self-onboard, reserve assets, and monitor usage statistics.",
        "Contributed to developing a role and access-based dashboard with fine-grained permissions to ensure secure partner access, using Angular, Express, and SQL.",
        "Developed responsive, mobile-first web pages for Yulu's official website and the Pranvayu initiative—deployed to support COVID-19 patients—ensuring cross-browser compatibility (HTML, CSS, JavaScript).",
      ],
    },
  ],
  education: [
    {
      school: "Gogte Institute of Technology (VTU)",
      degree: "Computer Science Engineering (BE) — CGPA: 8.54",
      period: "May 2015 — May 2019",
      location: "Belgaum, Karnataka",
    },
  ],
};

export const projects: Project[] = [
  {
    slug: "this-site",
    title: "Personal platform (this site)",
    summary:
      "Nx monorepo with Vike SSR, Zustand state, MDX blog, portfolio, and browser tools — the same stack I would bring to a product team.",
    year: "2026",
    tags: ["React", "TypeScript", "Nx", "Vike", "Zustand", "Netlify"],
    role: "Design, architecture, and engineering",
    href: "https://github.com/Priyadarshi-Kumar/webdev",
  },
  {
    slug: "web-storage-apis",
    title: "Web Storage APIs explorer",
    summary:
      "Hands-on demos for localStorage, sessionStorage, IndexedDB, and Cache API — practical browser storage patterns in JavaScript.",
    year: "2025",
    tags: ["JavaScript", "Browser APIs", "IndexedDB"],
    role: "Solo project",
    href: "https://github.com/Priyadarshi-Kumar/web-storage-apis",
  },
  {
    slug: "chat-app",
    title: "Real-time chat app",
    summary:
      "Messaging UI with live updates — React frontend wired to a real-time backend for channels and conversations.",
    year: "2024",
    tags: ["React", "JavaScript", "Real-time"],
    role: "Solo project",
    href: "https://github.com/Priyadarshi-Kumar/chat-app",
  },
  {
    slug: "trello-clone",
    title: "Trello clone",
    summary:
      "Kanban board with drag-and-drop lists and cards — built to practice React Context, reducers, and predictable state updates.",
    year: "2022",
    tags: ["React", "Context API", "Reducers"],
    role: "Solo project",
    href: "https://github.com/Priyadarshi-Kumar/trello-clone",
  },
];

export function getProject(slug: string): Project | undefined {
  return findBySlug(projects, slug);
}
