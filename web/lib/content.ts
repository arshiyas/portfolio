export type ProjectType = "work" | "personal";

export type ProjectStat = {
  value: string;
  label: string;
};

export type ProjectMediaPlaceholder = {
  id: string;
  caption: string;
};

export type ProjectContributionItem = {
  title: string;
  description: string;
};

export type ProjectContribution = {
  intro: string;
  items: ProjectContributionItem[];
  media?: ProjectMediaPlaceholder[];
};

export type ProjectFeatureItem = {
  title: string;
  description: string;
};

export type ProjectTechGroup = {
  category: string;
  items: string[];
};

export type ProjectPipelineStep = {
  title: string;
  description: string;
};

export type ProjectCaseStudySection = {
  title: string;
  paragraphs: string[];
};

export type ProjectCaseStudy = {
  overview: string;
  problem: string;
  source: {
    label: string;
    url: string;
  };
  contextTitle?: string;
  metaLine?: string;
  approach?: string;
  features?: string[];
  featureItems?: ProjectFeatureItem[];
  pipeline?: ProjectPipelineStep[];
  pipelineTitle?: string;
  pipelineIntro?: string;
  sections?: ProjectCaseStudySection[];
  techStack?: ProjectTechGroup[];
  underTheHood?: string;
  learnings?: string[];
  stats?: ProjectStat[];
  myContribution?: ProjectContribution;
  story?: string;
  toolPreviewBlurb?: string;
};

export type Project = {
  slug: string;
  type: ProjectType;
  category: string;
  title: string;
  description: string;
  tags: string[];
  toolUrl?: string;
  caseStudy?: ProjectCaseStudy;
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
  eyebrow: "Backend engineer · Toronto",
  tagline: "Software Engineer IV",
  lede:
    "I build backend systems that hold up in production: APIs, data pipelines, and AWS infrastructure. At Lyft, I work on Silver, teens, and international expansion.",
  links: {
    linkedin: "https://www.linkedin.com/in/arshiyasayyed/",
    github: "https://github.com/ArshiyaSayyed",
  },
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/arshiyasayyed/" },
    { label: "GitHub", href: "https://github.com/ArshiyaSayyed" },
  ],
  heroButtons: [
    { label: "View projects", href: "/projects", primary: true },
    { label: "About me", href: "/about", primary: false },
  ],
  stats: [
    {
      value: "86%",
      label: "Lyft Silver",
      detail: "Older adults who use the app themselves once familiar (USC study)",
    },
    {
      value: "TBD",
      label: "Teens",
      detail: "Teen ride experience, metric coming soon",
    },
    {
      value: "TBD",
      label: "International expansion",
      detail: "Scaling ride-share to new markets, metric coming soon",
    },
  ],
  stack: ["Python", "TypeScript", "AWS", "PostgreSQL", "DynamoDB"],
  featuredProjectSlugs: ["lyft-silver", "lyft-teens", "lyft-international"],
};

export const experience: ExperienceRole[] = [
  {
    id: "lyft-se4",
    period: "2024 to present",
    company: "Lyft",
    location: "Toronto",
    title: "Software Engineer IV",
    bullets: [
      "Redesigned the Silver app home screen with larger buttons and simpler messaging for senior riders",
      "Built invite flows across internal messaging systems for new and older user types",
      "Shipped a backend-driven senior discount homecard to onboard first-time senior riders",
    ],
    code: "POST /api/v1/invites · homecard placement · Silver home\n→ Python · TypeScript · AWS",
  },
  {
    id: "skywatch-se2",
    period: "2022 to 2024",
    company: "SkyWatch",
    location: "Ontario",
    title: "Software Engineer II",
    bullets: [
      "Led enterprise org management API, the platform used by Azure, Al Jazeera, local gov (+40% sales)",
      "Optimized geospatial search backend for 75% faster queries via REST API redesign",
      "Stack: Python, PostgreSQL (RDS), DynamoDB, Lambda, API Gateway, GitHub Actions CI/CD",
    ],
    code: "GET /api/v2/search?q=...&bbox=...\n→ 200 OK · avg response: 180ms → 45ms after optimization",
  },
  {
    id: "ge-senior-software-engineer",
    period: "Apr to Jul 2022",
    company: "GE Healthcare",
    location: "Bangalore",
    title: "Senior Software Engineer",
    bullets: [
      "Designed and implemented data pipelines in production, extending existing flows and building new ones for the business",
      "Participated in Technical Design Reviews (TDRs) and architecture design reviews",
    ],
    code: "device.metrics → ETL pipeline → analytics store\n→ Python · AWS · pipeline design & TDR reviews",
  },
  {
    id: "ge-software-engineer",
    period: "2019 to 2022",
    company: "GE Healthcare",
    location: "Bangalore",
    title: "Software Engineer",
    bullets: [
      "Wrote and deployed Python and Java services on AWS for production healthcare workloads",
      "Owned system design: requirements, UML diagrams (sequence, class, deployment), and Confluence API docs",
      "Extended microservices with new functionality and optimized existing workflows",
      "Wrote test cases in pytest and JUnit; debugged and fixed defects across the stack",
    ],
    code: "POST /api/v1/feature\n→ pytest + JUnit · microservices on AWS · Python · Java",
  },
  {
    id: "ge-edison-engineer",
    period: "2017 to 2019",
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
    slug: "lyft-silver",
    type: "work",
    category: "Work · Lyft",
    title: "Lyft Silver",
    description:
      "Backend for senior ride-sharing: home screen redesign, invite flows, and a discount homecard to onboard first-time senior riders.",
    tags: ["Python", "TypeScript", "AWS", "Mobility"],
    caseStudy: {
      overview:
        "Lyft Silver is a product designed specifically for older riders, an AARP-endorsed alternative that helps seniors keep their independence without getting behind the wheel. Launched nationwide in early 2025, it reimagines the ride experience around accessibility, confidence, and autonomy.",
      problem:
        "Older adults use rideshare far less than younger riders. Research showed a technology gap: unfamiliar interfaces, fear of doing the wrong thing, and reliance on caregivers. They are 55% more likely to have rides requested by someone else, with 15% of platform riders acting as caregivers for older adults.",
      approach:
        "The team's hypothesis: given the right tools, seniors can build confidence and use the app independently. Design and engineering focused on reducing cognitive load, adding human support when needed, and matching rides with vehicles that are physically easier to enter.",
      features: [
        "Simplified home screen with two primary actions (ride now and schedule later) plus 1.4× larger text for readability",
        "Live \"Get Help\" support connecting riders to agents daily from 8am–9pm ET",
        "Mandatory pickup and dropoff confirmation before a ride is dispatched",
        "Reduced ride modes to Standard and Extra Comfort to avoid choice overload",
        "Preferred vehicle matching that deprioritizes high step-height cars (e.g. pickup trucks) based on field research with seniors",
      ],
      stats: [
        { value: "86%", label: "Self-serve adoption once familiar with the app (USC study)" },
        { value: "55%", label: "More likely to have rides booked by someone else vs. younger riders" },
        { value: "57%", label: "Higher no-show rate among older riders before product improvements" },
        { value: "2×", label: "More likely to cancel when matched with a pickup truck" },
      ],
      myContribution: {
        intro:
          "I worked on the backend and product systems that power the Silver experience, from the redesigned home screen to growth mechanics that bring new senior riders onto the platform.",
        items: [
          {
            title: "Silver home screen redesign",
            description:
              "Redesigned the Silver app home screen with larger primary buttons and simpler messaging, reducing cognitive load so older riders can book with confidence.",
          },
          {
            title: "Invite flows for new and senior users",
            description:
              "Built the mechanism for sending invites to new and older users, integrating across internal messaging systems and handling new user types end-to-end on the backend.",
          },
          {
            title: "Senior growth homecard",
            description:
              "Led a comms initiative to onboard more seniors onto Lyft, shipping a backend-driven homecard placement offering first-ride discounts to first-time senior users, prompting them to book.",
          },
        ],
        media: [
          { id: "silver-home", caption: "Silver home screen redesign" },
          { id: "invite-flow", caption: "Invite flow for new and senior users" },
          { id: "senior-homecard", caption: "Senior discount homecard placement" },
        ],
      },
      source: {
        label: "Under the Hood: Lyft Silver, Lyft Blog",
        url: "https://www.lyft.com/blog/posts/under-the-hood-lyft-silver",
      },
    },
  },
  {
    slug: "lyft-teens",
    type: "work",
    category: "Work · Lyft",
    title: "Teens @ Lyft",
    description: "Backend for the teen ride experience: safety, scheduling, and scale.",
    tags: ["Python", "TypeScript", "AWS"],
  },
  {
    slug: "lyft-international",
    type: "work",
    category: "Work · Lyft",
    title: "International Expansion",
    description: "Infrastructure and APIs to bring ride-sharing to new markets.",
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
      "Python and Java services on AWS: system design, microservice extensions, and pytest/JUnit test coverage.",
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
    slug: "days-in-canada",
    type: "personal",
    category: "Personal · Citizenship",
    title: "Days in Canada",
    description:
      "Personal tool for citizenship travel dates: wizard UX, client-side parsing, in-browser AI via WebLLM.",
    tags: ["Next.js", "TypeScript", "WebLLM", "Privacy"],
    toolUrl: "/days-in-canada",
    caseStudy: {
      metaLine: "Citizenship tool · Solo build",
      contextTitle: "Background",
      overview:
        "IRCC's Physical Presence Calculator counts citizenship days, but it does not help you find when you traveled. You still have to enter every trip by hand, and those dates usually live in booking emails, loyalty exports, and scattered inboxes, not a ready-made list. I built Days in Canada for my own application to close that gap: paste messy travel records, extract and review trip dates in the browser, then copy confirmed rows into IRCC. Nothing uploads. I also wanted it for people who never kept a travel log and for anyone who has a log but wants to verify it against real data points (confirmations, exports, timeline snippets) before they submit.",
      toolPreviewBlurb: "Paste travel text, review parsed trips, copy rows into IRCC.",
      problem:
        "I built this while preparing my own application. The citizenship process looks like a day-counting exercise until you sit down to list every trip. Many applicants never kept a travel log; others have a spreadsheet or notes but are not sure the dates are right. Both groups end up digging through the same scattered records.",
      story: `To apply for Canadian citizenship, you must show at least 1,095 days of physical presence in Canada within the five years before you sign, and at least 730 days as a permanent resident. IRCC's Physical Presence Calculator takes your signing date, PR date, and every trip outside Canada (date left, date returned).

The calculator does not connect to email, airlines, or border records. You rebuild the list from confirmations and exports, then type each row by hand. If you did not track trips as you went, that reconstruction is the whole task. If you did keep a log, you still need source-of-truth dates from somewhere else to trust it. IRCC only counts full calendar days entirely outside Canada; the day you leave and the day you return both count as days in Canada. That math is straightforward once you have the dates. Finding and verifying them is the work.`,
      sections: [
        {
          title: "Design",
          paragraphs: [
            "Citizenship prep mixes IRCC rules, travel reconstruction, parsing, and eligibility math. Putting that on one screen is too much. The tool is a four-step wizard with one concern per step: start (local-only, paste-friendly), key dates (signing date and PR date), add trips, then results.",
            "Trip entry uses a segmented control so you pick paste or manual input, not both at once. Parse results stay hidden until you paste and run the parser. That keeps the default path simple while still supporting hand entry for a single trip.",
            "Incomplete parses get their own micro-flow. When parsing finds a departure but not a return, the row stays visible with a warning and a paste field expands underneath. You drop in a return confirmation from another email without restarting. Complete rows get add or discard; partial rows get find return or edit manually.",
            "Review is the gate throughout. Parsed trips are proposals until you add them. The results step merges an editable trip table with eligibility totals so you fix rows and see day counts before copying into IRCC's calculator. That review step matters whether you are building a list from scratch or checking a travel log you already have against what your records actually say.",
          ],
        },
        {
          title: "Parsing",
          paragraphs: [
            "Paste is the primary input because that is how records actually exist: booking emails, Aeroplan exports, Google Timeline snippets, notes. A rules parser runs first on structured patterns (labeled depart and return lines, ISO and named dates, route strings like YVR → DEL). It is instant and works without a GPU.",
            "Real inboxes exceed what rules cover: timeline prose, mixed date formats in one paste, footers wrapped around one useful line. That is where WebLLM comes in. A small language model running on WebGPU reads the pasted text and returns structured trip fields as JSON. Weights download once and cache in the browser; inference stays in the tab.",
            "Server-side extraction would be simpler to ship, but pasted travel history is immigration data. In-browser parsing keeps the same privacy promise as the rest of the tool: nothing transits an API. Rules remain a first-class path for common airline email and for devices without WebGPU. Both parsers feed the same review UI, and nothing auto-saves. You confirm dates before they hit localStorage.",
          ],
        },
      ],
      pipelineTitle: "The flow",
      pipelineIntro: "Four steps, one concern per screen.",
      pipeline: [
        {
          title: "Start",
          description:
            "Set expectations: local-only, paste-friendly, about five minutes. No forms yet.",
        },
        {
          title: "Key dates",
          description:
            "Signing date and PR date only. Defines the IRCC eligibility window before any trip entry.",
        },
        {
          title: "Add trips",
          description:
            "Paste or manual, parse and review, fill missing returns in place. Parsing complexity lives here.",
        },
        {
          title: "Results",
          description:
            "Editable trip table plus eligibility summary. Copy confirmed rows into IRCC's calculator.",
        },
      ],
      techStack: [
        {
          category: "App",
          items: ["Next.js", "TypeScript", "localStorage"],
        },
        {
          category: "Parsing",
          items: ["Rules parser", "WebLLM", "WebGPU"],
        },
      ],
      source: {
        label: "Open Days in Canada",
        url: "/days-in-canada",
      },
    },
  },
  {
    slug: "github-experiments",
    type: "personal",
    category: "Personal",
    title: "GitHub Experiments",
    description: "Pull from your repos: tools, scripts, and creative backend builds.",
    tags: ["Open source", "Python"],
  },
];

export const writingPosts: WritingPost[] = [
  {
    slug: "lyft-silver-backend",
    title: "Building backend for Lyft Silver",
    category: "Engineering",
    date: "Draft",
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

export function getFeaturedProjects(): Project[] {
  return site.featuredProjectSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => p !== undefined);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectsWithCaseStudies(): Project[] {
  return projects.filter((p) => p.caseStudy !== undefined);
}
