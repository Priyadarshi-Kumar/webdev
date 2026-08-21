/** Curated copy for the PDF resume — tighter than the portfolio page. */
export const resumeContent = {
  summary:
    "Full-stack engineer with 6+ years shipping products at scale. React and TypeScript on the client; Node.js, Python, and FastAPI on the server. I own features end to end — design, implementation, performance, release, and documentation.",
  highlights: [
    "Led analytics dashboards at Tekion adopted by dealer partners — Teams dashboard drove 20% of total visits.",
    "Scaled tenant capacity 10x with virtualization and pagination (15 to 200 dealers per tenant).",
    "Stabilized a high-traffic analytics product — cut monthly support issues to near zero; 30% adoption growth in one year.",
    "Ship EDA tooling: multi-tab schematics, xterm.js terminals, and mai-ai chat over SSE and MCP.",
    "Deployed on AWS (S3, CloudFront, Route 53) with Terraform; onboarded banking partners at Setu.",
    "Shipped consumer web at Yulu — 35K+ journeys through the browser app with a 4.4/5 rating.",
  ],
  experience: [
    {
      company: "Maieutic Semiconductors",
      role: "Lead Software Engineer — Front-End",
      period: "Nov 2025 — Present",
      location: "Bangalore, Karnataka",
      bullets: [
        "Built multi-tab schematics editor for simultaneous symbol and circuit editing.",
        "Integrated xterm.js terminals with a node-pty backend; multi-session support and persistence.",
        "Shipped mai-ai chat over server-sent events and MCP for circuit work and simulation.",
      ],
    },
    {
      company: "Tekion",
      role: "Software Engineer 2 — Front-End",
      period: "Jul 2022 — Nov 2025",
      location: "Bangalore, Karnataka",
      bullets: [
        "Led analytics dashboards (Teams, Parts, Service, Sales); Teams became the most-visited feature at 20% of traffic.",
        "Scaled tenant capacity 10x via virtualization, infinite scroll, and pagination.",
        "Stabilized Analytics — cut support issues to near zero and grew adoption 30% in one year.",
      ],
    },
    {
      company: "Setu — Part of Pine Labs",
      role: "Software Engineer — Web",
      period: "Dec 2021 — Jun 2022",
      location: "Bangalore, Karnataka",
      bullets: [
        "Built Fixed Deposits web app and SDK; onboarded Axis and UJVN banking partners.",
        "Contributed to Bridge platform (React, Redux, React Query) and Playwright E2E on AWS/Terraform.",
      ],
    },
    {
      company: "Yulu Bikes Pvt. Ltd.",
      role: "Full-Stack Developer — MTS",
      period: "Jul 2019 — Nov 2021",
      location: "Bangalore, Karnataka",
      bullets: [
        "React web app on AWS — 35K+ journeys with a 4.4/5 average user rating.",
        "Multi-tenant partner platform and role-based dashboards (Angular, Express, SQL).",
      ],
    },
  ],
  skills: [
    { label: "Frontend", skills: ["React", "TypeScript", "Redux", "Zustand", "React Query", "Tailwind CSS"] },
    { label: "Backend", skills: ["Node.js", "Express", "Python", "FastAPI", "SQL", "Socket.io", "SSE", "MCP"] },
    { label: "Quality & cloud", skills: ["Jest", "Playwright", "Storybook", "Git", "AWS", "Terraform"] },
    { label: "Browser & security", skills: ["Web Workers", "Service Workers", "IndexedDB", "CSP", "CORS", "XSS"] },
  ],
};
