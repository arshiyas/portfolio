export type ProjectType = "work" | "personal"

export type ProjectStat = {
  value: string
  label: string
}

export type ProjectMediaPlaceholder = {
  id: string
  caption: string
}

export type ProjectContributionItem = {
  title: string
  description: string
  link?: {
    label: string
    url: string
  }
}

export type ProjectContribution = {
  intro: string
  items: ProjectContributionItem[]
  media?: ProjectMediaPlaceholder[]
}

export type ProjectFeatureItem = {
  title: string
  description: string
}

export type ProjectTechGroup = {
  category: string
  items: string[]
}

export type ProjectPipelineStep = {
  title: string
  description: string
}

export type ProjectCaseStudyFigure = {
  src: string
  alt: string
  caption?: string
  kind?: "image" | "video" | "embed" | "link"
  credit?: {
    label: string
    url: string
  }
  embedHeight?: number
  embedWidth?: number
}

export type ProjectCaseStudySection = {
  title: string
  paragraphs: string[]
  figure?: ProjectCaseStudyFigure
}

export type ProjectCaseStudy = {
  overview: string
  problem: string
  /** Public write-up backing the claims. Omit when no public source exists. */
  source?: {
    label: string
    url: string
  }
  contextTitle?: string
  metaLine?: string
  approach?: string
  /** Work case studies default to problem/approach/contribution/features headings. */
  problemTitle?: string
  approachTitle?: string
  contributionTitle?: string
  featuresTitle?: string
  features?: string[]
  featureItems?: ProjectFeatureItem[]
  pipeline?: ProjectPipelineStep[]
  pipelineTitle?: string
  pipelineIntro?: string
  sections?: ProjectCaseStudySection[]
  techStack?: ProjectTechGroup[]
  underTheHood?: string
  learnings?: string[]
  stats?: ProjectStat[]
  myContribution?: ProjectContribution
  story?: string
  toolPreviewBlurb?: string
  figure?: ProjectCaseStudyFigure
}

export type Project = {
  slug: string
  type: ProjectType
  category: string
  title: string
  description: string
  /** Short homepage-card hook, one or two lines. */
  cardLine?: string
  tags: string[]
  toolUrl?: string
  caseStudy?: ProjectCaseStudy
  /** Hover card chrome on /projects matches the live tool theme. */
  cardTheme?: "days-gone"
}

export const site = {
  name: "Arshiya Sayyed",
  location: "Toronto",
  eyebrow: "Software engineer · Toronto",
  tagline: "Software Engineer",
  heroHeading: "Hi, I'm Arshiya",
  lede: [
    "I build backend features with Lyft Toronto. I shipped products for older and teen riders, and now I work on taking the app to Europe.",
    "I care about making the system reliable and scalable, and giving coding agents enough context so they stop recommending libraries that don't exist.",
  ],
  links: {
    linkedin: "https://www.linkedin.com/in/arshiyasayyed/",
    email: "arshiyasayyed8@gmail.com",
    calendly: "https://calendly.com/arshiyasayyed8/chat-with-arshiya",
  },
  url: "https://arshiya.dev",
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/arshiyasayyed/" },
  ],
  heroButtons: [
    { label: "Resume", href: "/resume", primary: true },
  ],
  stack: ["Python", "Go", "TypeScript", "gRPC", "AWS", "PostgreSQL"],
  featuredProjectSlugs: [
    "lyft-international",
    "ai-engineering",
    "lyft-teens",
    "lyft-silver",
    "days-gone",
  ],
}

export const projects: Project[] = [
  {
    slug: "lyft-silver",
    type: "work",
    category: "Work · Lyft",
    title: "Lyft Silver",
    description:
      "Growth and support backend for Lyft's senior rider product: invites, gift cards, trusted contacts, and a CMS-backed help API.",
    cardLine:
      "Invites, gift cards, and trusted contacts that get older riders onto Silver.",
    tags: ["Python", "TypeScript", "AWS", "Mobility"],
    caseStudy: {
      overview:
        "Lyft Silver is a product designed specifically for older riders, an AARP-endorsed alternative that helps seniors keep their independence without getting behind the wheel. Launched nationwide in early 2025, it reimagines the ride experience around accessibility, confidence, and autonomy.",
      problem:
        "Older adults use rideshare far less than younger riders. Research showed a technology gap: unfamiliar interfaces, fear of doing the wrong thing, and reliance on caregivers. They are 55% more likely to have rides requested by someone else, with 15% of platform riders acting as caregivers for older adults.",
      approach:
        "The team's hypothesis: given the right tools, seniors can build confidence and use the app independently. Design and engineering focused on reducing cognitive load, adding human support when needed, and matching rides with vehicles that are physically easier to enter.",
      figure: {
        src: "/projects/lyft-silver-ui.gif",
        alt: "Lyft Silver app walkthrough from home screen through destination search to requesting a Silver ride",
        caption:
          "Silver's simplified home screen, destination search, and ride request flow, designed for older riders with larger text and fewer choices.",
        credit: {
          label: "Under the Hood: Lyft Silver",
          url: "https://www.lyft.com/blog/posts/under-the-hood-lyft-silver",
        },
      },
      features: [
        "Simplified home screen with two primary actions (ride now and schedule later) plus 1.4× larger text for readability",
        'Live "Get Help" support connecting riders to agents daily from 8am–9pm ET',
        "Mandatory pickup and dropoff confirmation before a ride is dispatched",
        "Reduced ride modes to Standard and Extra Comfort to avoid choice overload",
        "Preferred vehicle matching that deprioritizes high step-height cars (e.g. pickup trucks) based on field research with seniors",
      ],
      stats: [
        {
          value: "86%",
          label: "Self-serve adoption once familiar with the app (USC study)",
        },
        {
          value: "55%",
          label:
            "More likely to have rides booked by someone else vs. younger riders",
        },
        {
          value: "57%",
          label:
            "Higher no-show rate among older riders before product improvements",
        },
        {
          value: "2×",
          label: "More likely to cancel when matched with a pickup truck",
        },
      ],
      myContribution: {
        intro:
          "I worked on the growth and support side of Silver: how an older rider gets invited onto the product, how their family stays connected to them, and how they get help when something goes wrong.",
        items: [
          {
            title: "Invites and onboarding",
            description:
              "Built the invite system that brings older riders onto Silver end to end: SMS and push delivery, deep links that route a tapped invite to the right place in the app, and gift cards so family can cover a first ride. Later extended it so invites sent from Lyft Family behaved identically.",
          },
          {
            title: "Trusted contacts",
            description:
              "Shipped the home card prompting riders to add a trusted contact, so a family member can follow a ride without the rider setting anything up mid-trip.",
          },
          {
            title: "Contextual help API",
            description:
              "Built the endpoints serving in-app help content and the path to a live agent, backed by a CMS so the content team can change what a rider sees without an app release. I pushed for the CMS over the static-file approach originally proposed, and added alerting so content changes are visible to the team.",
          },
          {
            title: "First-ride discount campaign",
            description:
              "Built the coupon eligibility handling and the placement behind a Grandparents Day promotion that ran as part of Lyft's Silver marketing push, plus the dashboard tracking taps through to redemption. Built it to be reused for later campaigns rather than as one-off code.",
          },
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
    title: "Lyft Teen",
    description:
      "Access-control foundation for teen rides: defining what a teen account is, and closing the flows that shouldn't be open to minors.",
    cardLine:
      "What a teen account is, and which rider flows stay closed to minors.",
    tags: ["Python", "GraphQL", "gRPC", "Access control"],
    caseStudy: {
      overview:
        "Lyft Teen lets 13 to 17 year olds request their own rides while a parent or guardian keeps full visibility: live tracking, PIN verification, audio recording, and drivers held to a higher bar. It launched in February 2026 across more than 200 US markets.",
      problem:
        "Opening the app to minors isn't a feature you add, it's a constraint on every feature that already exists. The rider platform assumed an adult account holder throughout, so before teen rides could launch someone had to answer two questions: what a teen account actually is in the system, and which of the flows built for adults must be closed. Until those answers existed, the teams building on top were blocked.",
      approach:
        "I wrote the definition first and the code second. A teen definition document and a product feature registry gave every team one shared answer for how a teen account is represented and which product surfaces it may reach. From there the work was auditing rider flows against that registry and shutting the ones that didn't belong, treating each as a safety guardrail rather than a config toggle.",
      figure: {
        src: "/projects/lyft-teen-ui.gif",
        alt: "Lyft Teen app walkthrough showing how teens request rides with guardian oversight",
        caption:
          "Lyft Teen's rider experience: teens request their own rides while guardians keep live visibility, PIN verification, and billing control.",
        credit: {
          label: "Introducing Lyft Teen",
          url: "https://www.lyft.com/blog/posts/introducing-lyft-teen",
        },
      },
      myContribution: {
        intro:
          "I owned the access-control foundation: the definition other teams built on top of, and the restriction work that came out of it.",
        items: [
          {
            title: "Teen definition and feature registry",
            description:
              "Authored the definition of a teen account and the registry of which product surfaces are open or closed to one. It was the piece downstream teams were waiting on, and it became the single source of truth they built against instead of each inferring their own age rules.",
          },
          {
            title: "Closing ride-for-others",
            description:
              "Drove the strategy and implementation to disable requesting rides on someone else's behalf from a teen account, keeping a minor's ride tied to their own verified account. The flow it replaced had high abandonment and low conversion, which made it a clear one to close.",
          },
          {
            title: "Restricting ride modes and upsells",
            description:
              "Disabled autonomous-vehicle upsells and instant matching for teens, so a minor is never offered a ride type that falls outside the vetted-driver standard the product promises guardians.",
          },
          {
            title: "Exposing restrictions to clients",
            description:
              "Surfaced teen restrictions and date of birth through the GraphQL layer and added the fields backing teen ride monitoring, so mobile and support tooling read one consistent state.",
          },
        ],
      },
      features: [
        "Guardian-created accounts: only a verified adult can add a teen, who then completes a safety tutorial",
        "PIN verification at pickup and audio recording on every ride",
        "Live ride map, driver details, and pickup and dropoff notifications for the guardian",
        "Drivers held to a higher standard: annual background checks, strong ratings, and road experience",
        "Shared family payment, so guardians keep full billing visibility",
      ],
      stats: [
        { value: "200+", label: "US markets live at launch in February 2026" },
        {
          value: "13–17",
          label: "New rider age range the platform had to support",
        },
      ],
      source: {
        label: "Introducing Lyft Teen, Lyft Blog",
        url: "https://www.lyft.com/blog/posts/introducing-lyft-teen",
      },
    },
  },
  {
    slug: "lyft-international",
    type: "work",
    category: "Work · Lyft",
    title: "International Expansion",
    description:
      "Roaming backend letting a Lyft rider request, pay for, and track a ride on the FREENOW network in Europe.",
    cardLine:
      "A Lyft rider lands in Europe and takes a FREENOW ride in the same app.",
    tags: ["Go", "Python", "gRPC", "Payments"],
    caseStudy: {
      overview:
        "After Lyft acquired FREENOW, the goal was one app: a Lyft rider lands in Europe and gets a ride without downloading anything new. I build the roaming backend that makes that ride work end to end, from the offers a rider sees through payment and tracking.",
      problem:
        "Roaming means one company's rider on another company's network. Nothing lines up for free. Pricing, payment authorization, ride states, notifications, and receipts all have to be translated between two platforms built independently, across currencies and regulatory regimes, and the rider should never see the seam. A ride abroad has to feel like a ride at home or the unified app isn't worth shipping.",
      approach:
        "The work runs through the whole stack rather than one service: the schema definitions that form the cross-platform contract, the roaming service that owns the translation, the trips layer, the notification path, the GraphQL the app reads, and the dashboards we watch it with. I take features across all of those layers rather than handing off at a service boundary, which is what a rider-visible flow needs to actually land.",
      figure: {
        kind: "embed",
        src: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7486173668218380288?collapsed=1",
        alt: "David Risher on Lyft's international expansion and FREENOW integration",
        caption:
          "Lyft CEO David Risher on bringing European rides into the Lyft app after the FREENOW acquisition.",
        credit: {
          label: "David Risher on LinkedIn",
          url: "https://www.linkedin.com/feed/update/urn:li:ugcPost:7486173668218380288",
        },
        embedHeight: 897,
        embedWidth: 504,
      },
      myContribution: {
        intro:
          "I've built roaming features end to end since the program started, taking each one from the cross-platform schema through to the dashboard we monitor it with.",
        items: [
          {
            title: "Ride offers and ride creation",
            description:
              "Built the calls that fetch available offers in a European city and create the ride on the partner network. These are the two requests every roaming trip starts with, and the foundation the rest of the features sit on.",
          },
          {
            title: "Payment authorization",
            description:
              "Owned the epic integrating the billing platform's authorization and fraud checks into ride creation, so a ride on a partner network is held to the same payment guarantees as a domestic one.",
          },
          {
            title: "Scheduled rides in Europe",
            description:
              "Owned the epic bringing scheduled rides to EU roaming, including request routing at the edge and the mobile empty states for cities where scheduling isn't offered. Shipped to production.",
          },
          {
            title: "Post-request features",
            description:
              "Past rides, ride status notifications, tipping, and receipt handling are built but not released yet. More on this once they ship.",
          },
        ],
      },
      features: [
        "Request a ride in a European city from the Lyft app you already have",
        "Payment authorized and fraud-checked before the partner ride is created",
        "Scheduled rides, with clear empty states where a city doesn't support them",
        "Post-request features built but not yet released",
      ],
      stats: [
        {
          value: "12+",
          label: "European cities live in the Lyft app beta as of Q2 2026",
        },
        {
          value: "180+",
          label: "Cities across 9 countries on the network Lyft acquired",
        },
        { value: "2027", label: "Target for one unified global Lyft app" },
      ],
      source: {
        label: "Lyft goes global: FREENOW acquisition complete, Lyft Blog",
        url: "https://www.lyft.com/blog/posts/lyft-goes-global-freenow-acquisition-complete",
      },
    },
  },
  {
    slug: "ai-engineering",
    type: "work",
    category: "Work · Developer Experience",
    title: "AI-Assisted Engineering",
    description:
      "Changing how a backend org works with coding agents: shared context standards, an evaluation to prove they help, and tooling other teams picked up.",
    cardLine:
      "Shared agent context, then an eval that proved it to the rest of the org.",
    tags: ["AI tooling", "Claude Code", "Developer experience", "Analytics"],
    caseStudy: {
      overview:
        "This isn't a product I shipped. It's the work of changing how my team and the teams around us actually build with coding agents: making repo context something engineers inherit rather than rediscover, and making the case for it with evidence instead of enthusiasm.",
      problemTitle: "Where the team was",
      problem:
        'Coding agents were arriving team by team with no shared setup. The same agent would answer correctly in one service and confidently wrong in the next, and nobody could say which was which, because there was no baseline to compare against. Engineers re-explained the same context every session, and people were hand-migrating dashboards one query at a time. The friction was obvious, but the case for fixing it was all anecdote, and "it feels faster" isn\'t an argument you can take to an engineering org.',
      approachTitle: "How I approached it",
      approach:
        "I wasn't interested in evangelizing tools, I wanted to move the default. That meant writing repo context down so every engineer inherits it instead of rebuilding it, then proving the value with a controlled evaluation rather than a demo, and publishing the results including the repos where it changed nothing. Once real numbers existed, adoption stopped being a matter of opinion.",
      contributionTitle: "What I changed",
      myContribution: {
        intro: "Three changes to how the work gets done day to day.",
        items: [
          {
            title: "Made repo context the default instead of a personal habit",
            description:
              "Rolled out AGENTS.md standards across ten backend repos, so the context an engineer used to carry in their head now lives in the repo and applies to every agent session automatically. Then I evaluated the same tasks with and without it. Three of the ten produced a real correctness regression in the baseline that the context file prevented outright. Where both passed, the win was cost: one repo went from a 30-plus turn agent run to a single-turn answer.",
          },
          {
            title: "Gave the org a shared view of its own health",
            description:
              "Co-built a dashboard tracking incidents, mean time to recovery, and deploy frequency, so conversations about how the team is doing start from data rather than impressions. I own the operational-health pillar on the cross-org working group that maintains the framework it feeds.",
          },
          {
            title:
              "Turned specialist migration work into something anyone can run",
            description:
              "Engineers were hand-converting dashboards out of our legacy analytics tool, query by query. I built a coding-agent skill that does the conversion, which took the work out of the specialist-knowledge category entirely. The platform team running the company-wide migration adopted it as the recommended interim path and assigned a pilot team to stress-test it on harder dashboards.",
          },
          {
            title: "Made the case outside my own team",
            description:
              "Gave the engineering half of \"AI at Lyft: From Data Foundations to Shipping Faster,\" a sold-out Lyft Engineering session at Toronto Tech Week 2026 with just over 100 attendees. Lyft's Head of Corporate Data & Analytics covered the data foundations; I covered delivery: how a continent-scale Lyft and FREENOW integration that should have needed a year of ramp-up didn't, and where Cursor and Claude concretely changed how we plan, write, and review code. We closed on a joint panel tying the two halves together, which is the honest version of the argument. Agent-assisted delivery only compounds when the foundations underneath it hold.",
            link: {
              label: "Toronto Tech Week 2026 event page",
              url: "https://luma.com/m7xed1iw",
            },
          },
        ],
      },
      featuresTitle: "How it spread",
      features: [
        "Ten backend repos now inherit shared agent context by default, no per-engineer setup",
        "The evaluation was published openly, including the repos where it made no difference, so adoption ran on evidence",
        "The migration skill became the recommended interim path for a company-wide tooling migration, with a pilot team assigned to it",
        "Seats on cross-org working groups for operational excellence and bug-triage automation",
        "A public account of the European build, given to a sold-out room during Toronto Tech Week",
      ],
      source: {
        label:
          "AI at Lyft: From Data Foundations to Shipping Faster, Toronto Tech Week 2026",
        url: "https://luma.com/m7xed1iw",
      },
    },
  },
  {
    slug: "search-skywatch",
    type: "work",
    category: "Work · SkyWatch",
    title: "Search Optimization @ SkyWatch",
    description:
      "Streamed multi-provider search results over WebSocket so users saw imagery as soon as the fastest provider responded.",
    cardLine:
      "Imagery as soon as the fastest provider responds, not the slowest.",
    tags: ["Python", "PostgreSQL", "WebSocket", "Lambda"],
    caseStudy: {
      overview:
        "SkyWatch's EarthCache API lets developers search satellite imagery archives by area, date, and sensor before placing an order. Search fans out to multiple imagery providers on every query. I redesigned the search flow so results stream to the client as each provider responds, instead of waiting for the slowest one, and cut average API latency from 180 ms to 45 ms on the backend path.",
      problem:
        "Users entered a search area and criteria, and the backend queried multiple imagery providers in parallel. The UI waited until every provider returned before showing anything, then ran pricing and processing on the full result set. Time to first result was effectively the slowest provider plus post-processing, so users often stared at a loading screen even when faster providers had already returned usable imagery.",
      approach:
        "I split the pipeline so pricing and processing could run in parallel with provider fetches instead of blocking the first paint. A WebSocket connection streams each provider's results to the client as they arrive, so the UI can render incrementally. We also tuned how providers return results so the streaming model could deliver value immediately rather than waiting for a complete batch.",
      myContribution: {
        intro:
          "I owned the search flow redesign end to end: decoupling fetch from enrichment, adding real-time delivery, and tightening the underlying API query path.",
        items: [
          {
            title: "Decoupled fetch from pricing and processing",
            description:
              "Moved pricing and metadata processing off the critical path to first result. Enrichment runs alongside provider fetches instead of gating the UI until every provider and every downstream step finishes.",
          },
          {
            title: "WebSocket streaming for incremental results",
            description:
              "Replaced the all-or-nothing batch response with a WebSocket stream that pushes each provider's results as they arrive. Users see imagery when the fastest provider responds, not when the slowest one finally completes.",
          },
          {
            title: "Provider return-time tuning",
            description:
              "Worked with provider integrations so return behavior fit the streaming model, letting partial results surface early instead of holding everything back for a synchronized release.",
          },
          {
            title: "Backend query path optimization",
            description:
              "Profiled and tightened the PostgreSQL-backed search path behind the REST API. Average response time dropped from 180 ms to 45 ms on the common bounding-box search case.",
          },
        ],
      },
      stats: [
        {
          value: "Fastest provider",
          label: "Time to first result, instead of waiting on the slowest",
        },
        {
          value: "180ms → 45ms",
          label: "Average search API response time on the backend path",
        },
        {
          value: "75%",
          label: "Latency reduction after the query path redesign",
        },
      ],
      source: {
        label: "SkyWatch EarthCache API documentation",
        url: "https://docs.skywatch.com/",
      },
    },
  },
  {
    slug: "enterprise-skywatch",
    type: "work",
    category: "Work · SkyWatch",
    title: "Enterprise Org Platform @ SkyWatch",
    description: "Multi-tenant org management APIs driving 40% sales increase.",
    cardLine: "Multi-tenant org APIs that helped drive a 40% sales increase.",
    tags: ["REST API", "DynamoDB", "OAuth/SAML"],
  },
  {
    slug: "ge-microservices",
    type: "work",
    category: "Work · Backend",
    title: "Healthcare Microservices @ GE",
    description:
      "Python and Java services on AWS: system design, microservice extensions, and pytest/JUnit test coverage.",
    cardLine:
      "Python and Java healthcare services on AWS, with the tests to match.",
    tags: ["Python", "Java", "AWS", "Microservices"],
  },
  {
    slug: "ge-data-pipelines",
    type: "work",
    category: "Work · Data Engineering",
    title: "Analytics Pipelines @ GE",
    description:
      "Designed and shipped new and existing data pipelines; contributed to TDRs and architecture reviews.",
    cardLine: "Analytics pipelines, plus the architecture reviews behind them.",
    tags: ["Python", "AWS", "Pipelines"],
  },
  {
    slug: "days-gone",
    type: "personal",
    category: "Personal · Citizenship",
    title: "Days Gone",
    description:
      "Reconstruct citizenship travel dates from messy records, with on-device WebLLM parsing when rules fall short.",
    cardLine:
      "Citizenship travel dates from messy records, parsed on-device in the browser.",
    tags: ["WebLLM", "WebGPU", "Next.js", "TypeScript"],
    toolUrl: "/days-gone",
    cardTheme: "days-gone",
    caseStudy: {
      metaLine: "On-device LLM · Solo build",
      contextTitle: "The problem",
      overview:
        "I built Days Gone while preparing my own citizenship application. IRCC's calculator needs every trip outside Canada, but those dates live in booking emails, loyalty exports, and scattered notes, not a ready-made list. The tool turns that mess into confirmed trip rows in the browser, including a local WebLLM path when rules are not enough.",
      toolPreviewBlurb:
        "Paste travel text, parse on-device with WebLLM, copy rows into IRCC.",
      problem:
        "The hard part is not the day math. It is reconstructing travel history from real records, then typing each row into IRCC by hand. I wanted something that could extract dates from a paste, let me review them, and never upload immigration data to a server.",
      sections: [
        {
          title: "Constraints",
          paragraphs: [
            "Pasted booking emails and timeline exports are immigration data. A server-side LLM would have been the easy path, and the wrong one. Inputs are messy too: mixed date formats, prose, footers wrapped around one useful line. Extraction had to stay in the browser, and still work when WebGPU is missing.",
          ],
        },
        {
          title: "What I shipped",
          paragraphs: [
            "A wizard with two entry paths: full eligibility (dates + absences + 1,095-day math), or parse-only for people who just need trip rows. Both use a dual parser. Structured pastes hit a rules engine first (instant, no GPU). Everything else can fall through to WebLLM: weights download once, cache in the browser, and inference runs on-device over WebGPU, returning trip fields as JSON.",
            "Both parsers feed the same review UI. Parsed trips are proposals until you confirm them. State stays in memory for the visit only. Partial rows (departure without return) stay editable in place so you can paste a second confirmation without restarting.",
          ],
          figure: {
            src: "/projects/days-gone-model-loading.mp4",
            kind: "video",
            alt: "Days Gone loading a local WebLLM model with a progress bar while parsing pasted travel history",
            caption:
              "First parse downloads the local model over WebGPU. Progress stays on-device; nothing is uploaded.",
          },
        },
        {
          title: "Why those choices",
          paragraphs: [
            "WebLLM was the technical center of the build: prove that a useful extraction model can run fully client-side for sensitive data. Server extraction would have shipped faster, but it would break the privacy constraint and make the project a thin UI over someone else's API.",
            "Rules stay first-class so common airline emails still work on machines without WebGPU, and so the happy path does not wait on a model download. The LLM covers the long tail the rules cannot. Review stays human-gated either way, because citizenship dates are not something you want auto-committed.",
          ],
        },
      ],
      pipelineTitle: "The flow",
      pipelineIntro:
        "Same steps as the app. Eligibility path shown; parse-only skips Your dates.",
      pipeline: [
        {
          title: "Start",
          description:
            "Pick a path: check eligibility, or parse travel dates only. Browser-only, no account.",
        },
        {
          title: "Your dates",
          description:
            "Application date and PR date. Sets the IRCC window before trips.",
        },
        {
          title: "Add trips",
          description:
            "Paste travel text. Rules first, WebLLM on WebGPU when needed, then review.",
        },
        {
          title: "Results",
          description:
            "Edit confirmed rows, check totals, copy into IRCC's calculator.",
        },
      ],
      techStack: [
        {
          category: "On-device AI",
          items: ["WebLLM", "WebGPU", "Rules parser"],
        },
        {
          category: "App",
          items: ["Next.js", "TypeScript", "In-memory state"],
        },
      ],
      source: {
        label: "Open Days Gone",
        url: "/days-gone",
      },
    },
  },
]

export function getFeaturedProjects(): Project[] {
  return site.featuredProjectSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => p !== undefined)
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getProjectsWithCaseStudies(): Project[] {
  return projects.filter((p) => p.caseStudy !== undefined)
}

export function getNextCaseStudy(slug: string): Project | undefined {
  const caseStudies = getProjectsWithCaseStudies()
  const index = caseStudies.findIndex((project) => project.slug === slug)
  if (index === -1 || caseStudies.length < 2) return undefined
  return caseStudies[(index + 1) % caseStudies.length]
}
