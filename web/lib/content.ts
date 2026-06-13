export type ProjectType = "work" | "personal";

export type Project = {
  slug: string;
  type: ProjectType;
  category: string;
  title: string;
  description: string;
  tags: string[];
};

export type ExperienceRole = {
  id: string;
  period: string;
  company: string;
  location: string;
  title: string;
  bullets: string[];
  code: string;
};

export type WritingPost = {
  slug: string;
  title: string;
  category: "Engineering" | "Career";
  date: string;
  status: string;
};

export const site = {
  name: "Arshiya Sayyed",
  location: "Toronto",
  tagline: "Backend engineer @ Lyft",
  lede:
    "I design and ship backend systems in Python and TypeScript — APIs, distributed services, and AWS infrastructure across healthcare, geospatial, and mobility.",
  links: {
    linkedin: "https://www.linkedin.com/in/arshiyasayyed/",
    github: "https://github.com/ArshiyaSayyed",
  },
  stats: [
    { value: "6.1M", label: "Downstream events · Multibook launch" },
    { value: "+75%", label: "Search speed · SkyWatch API optimization" },
    { value: "+40%", label: "Sales lift · Enterprise org platform" },
  ],
  stack: ["Lyft", "Python", "TypeScript", "AWS", "PostgreSQL", "DynamoDB"],
};

export const experience: ExperienceRole[] = [
  {
    id: "lyft-se4",
    period: "2024 — present",
    company: "Lyft",
    location: "Toronto",
    title: "Software Engineer IV",
    bullets: [
      "Built backend services for Lyft Silver — ride-sharing infrastructure for seniors",
      "Designed and shipped Multibook APIs, improving ride booking efficiency at scale",
      "Systems powering 6.1M downstream events within 3 weeks of launch",
    ],
    code: "POST /api/v1/multibook/book\n→ 200 OK · p99 latency: 42ms · Python · TypeScript · AWS Lambda",
  },
  {
    id: "skywatch-se2",
    period: "2022 — 2024",
    company: "SkyWatch",
    location: "Ontario",
    title: "Software Engineer II",
    bullets: [
      "Led enterprise org management API — platform used by Azure, Al Jazeera, local gov (+40% sales)",
      "Optimized geospatial search backend — 75% faster queries via REST API redesign",
      "Stack: Python, PostgreSQL (RDS), DynamoDB, Lambda, API Gateway, GitHub Actions CI/CD",
    ],
    code: "GET /api/v2/search?q=...&bbox=...\n→ 200 OK · avg response: 180ms → 45ms after optimization",
  },
  {
    id: "ge-senior-software-engineer",
    period: "Apr — Jul 2022",
    company: "GE Healthcare",
    location: "Bangalore",
    title: "Senior Software Engineer",
    bullets: [
      "Designed and implemented data pipelines in production — extended existing flows and built new ones for the business",
      "Participated in Technical Design Reviews (TDRs) and architecture design reviews",
    ],
    code: "device.metrics → ETL pipeline → analytics store\n→ Python · AWS · pipeline design & TDR reviews",
  },
  {
    id: "ge-software-engineer",
    period: "2019 — 2022",
    company: "GE Healthcare",
    location: "Bangalore",
    title: "Software Engineer",
    bullets: [
      "Wrote and deployed Python and Java services on AWS for production healthcare workloads",
      "Owned system design — requirements, UML diagrams (sequence, class, deployment), and Confluence API docs",
      "Extended microservices with new functionality and optimized existing workflows",
      "Wrote test cases in pytest and JUnit; debugged and fixed defects across the stack",
    ],
    code: "POST /api/v1/feature\n→ pytest + JUnit · microservices on AWS · Python · Java",
  },
  {
    id: "ge-edison-engineer",
    period: "2017 — 2019",
    company: "GE Healthcare",
    location: "Bangalore",
    title: "Edison Engineer",
    bullets: [
      "Researched and delivered proof-of-concepts for teams across the organization",
      "Built a metrics visualization dashboard backend in Java with Spring Boot",
      "Collaborated cross-team to improve workflows; documented all work clearly",
    ],
    code: "GET /api/metrics/dashboard\n→ Spring Boot · Java · PoC delivery · cross-team R&D",
  },
];

export const projects: Project[] = [
  {
    slug: "multibook-lyft",
    type: "work",
    category: "Work · Backend",
    title: "Multibook API @ Lyft",
    description: "Ride booking service powering efficient multi-ride scheduling at scale.",
    tags: ["Python", "TypeScript", "AWS"],
  },
  {
    slug: "search-skywatch",
    type: "work",
    category: "Work · Backend",
    title: "Search Optimization @ SkyWatch",
    description: "REST API redesign cutting geospatial query latency by 75%.",
    tags: ["Python", "PostgreSQL", "Lambda"],
  },
  {
    slug: "enterprise-skywatch",
    type: "work",
    category: "Work · Backend",
    title: "Enterprise Org Platform @ SkyWatch",
    description: "Multi-tenant org management APIs driving 40% sales increase.",
    tags: ["REST API", "DynamoDB", "OAuth/SAML"],
  },
  {
    slug: "ge-microservices",
    type: "work",
    category: "Work · Backend",
    title: "Healthcare Microservices @ GE",
    description:
      "Python and Java services on AWS — system design, microservice extensions, and pytest/JUnit test coverage.",
    tags: ["Python", "Java", "AWS", "Microservices"],
  },
  {
    slug: "ge-data-pipelines",
    type: "work",
    category: "Work · Data Engineering",
    title: "Analytics Pipelines @ GE",
    description:
      "Designed and shipped new and existing data pipelines; contributed to TDRs and architecture reviews.",
    tags: ["Python", "AWS", "Pipelines"],
  },
  {
    slug: "side-project",
    type: "personal",
    category: "Personal",
    title: "Side Project Slot",
    description: "Space for experiments, learning builds, and open source work.",
    tags: ["Next.js", "Learning"],
  },
  {
    slug: "github-experiments",
    type: "personal",
    category: "Personal",
    title: "GitHub Experiments",
    description: "Pull from your repos — tools, scripts, and creative backend builds.",
    tags: ["Open source", "Python"],
  },
];

export const writingPosts: WritingPost[] = [
  {
    slug: "multibook-apis",
    title: "How we shipped Multibook APIs in 3 weeks",
    category: "Engineering",
    date: "Mar 2025",
    status: "Draft",
  },
  {
    slug: "startup-to-big-tech",
    title: "What I learned moving from startup to big tech",
    category: "Career",
    date: "Jan 2025",
    status: "Draft",
  },
  {
    slug: "faster-search",
    title: "Designing for 75% faster search at scale",
    category: "Engineering",
    date: "Nov 2024",
    status: "Draft",
  },
];

export const navLinks = [
  { href: "/experience", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
] as const;
