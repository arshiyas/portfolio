export type ResumeRole = {
  company: string;
  companyUrl?: string;
  location: string;
  title: string;
  period: string;
  bullets: string[];
};

export type ResumeEducation = {
  degree: string;
  school: string;
  detail?: string;
};

export const resume = {
  name: "Arshiya Sayyed",
  headline: "SWE · Lyft",
  location: "Toronto, Ontario, Canada",
  email: "arshiyasayyed8@gmail.com",
  phone: "(647) 673-2138",
  linkedin: "https://www.linkedin.com/in/arshiyasayyed/",
  portfolio: "https://arshiya.dev",
  portfolioLabel: "arshiya.dev",
  productLinks: [
    { label: "Lyft's European expansion", url: "https://www.lyft.com/blog/posts/lyft-expands-in-europe-diversifies-by-acquiring-freenow" },
    { label: "FREENOW network", url: "https://www.lyft.com/blog/posts/lyft-expands-in-europe-diversifies-by-acquiring-freenow" },
    { label: "FREENOW", url: "https://www.lyft.com/blog/posts/lyft-expands-in-europe-diversifies-by-acquiring-freenow" },
    { label: "Lyft Teen", url: "https://www.lyft.com/rider/teen" },
    { label: "Lyft Silver", url: "https://www.lyft.com/rider/silver" },
  ],
  summary:
    "I build backend systems across mobility, geospatial, and healthcare. At Lyft, I shipped rider products for older adults and teens and now work on the backend bringing the app to Europe. At SkyWatch, I built enterprise org management APIs for a satellite imagery platform. At GE Healthcare, I built event-driven microservices on AWS for medical imaging workloads.",
  skills: [
    "Languages: Python, TypeScript, Java, SQL, Go",
    "Data and storage: PostgreSQL (Amazon RDS), DynamoDB, OpenSearch",
    "Distributed systems: AWS Lambda, API Gateway, SQS, SNS, ECS, EKS and Kubernetes, microservices, gRPC",
    "Practices: REST API design, system design and design reviews, data consistency and idempotency, multi-tenancy and entitlements, on-call, SLOs and alerting, incident response and postmortems, pytest, JUnit, GitHub Actions CI/CD",
  ],
  experience: [
    {
      company: "Lyft",
      companyUrl: "https://www.lyft.com/",
      location: "Toronto, Ontario",
      title: "Software Engineer IV",
      period: "2024 to present",
      bullets: [
        "Build the roaming backend behind Lyft's European expansion: ride creation, payment authorization, and scheduled rides across the FREENOW network",
        "Owned the access-control foundation for Lyft Teen ahead of launch in 200+ US markets",
        "Shipped growth and support surfaces for Lyft Silver: invites, gift cards, trusted contacts, and a CMS-backed contextual help API",
        "Rolled out agent coding standards across ten backend repos with a published before/after eval, and co-built the operational-health dashboard",
      ],
    },
    {
      company: "SkyWatch",
      companyUrl: "https://skywatch.com/",
      location: "Ontario",
      title: "Software Engineer II",
      period: "2022 to 2024",
      bullets: [
        "Led enterprise org management APIs (orgs, membership, roles, and access) at SkyWatch, a satellite imagery platform used by Microsoft Azure, Al Jazeera, etc., contributing to a 40 percent increase in sales",
        "Modeled enterprise contract terms and usage entitlements so per-customer quotas and permissions were enforced consistently across services",
        "Redesigned multi-provider satellite search to stream results over WebSocket as each provider responds, decoupling pricing and processing from fetch so time-to-first-result tracked the fastest provider; cut backend API latency from 180 ms to 45 ms",
      ],
    },
    {
      company: "GE Healthcare",
      companyUrl: "https://www.gehealthcare.com/en-in",
      location: "Bangalore, India",
      title: "Senior Software Engineer · Software Engineer · Edison Engineer",
      period: "2017 to 2022",
      bullets: [
        "Built event-driven backend services for medical device and imaging workloads on AWS, using SQS and SNS with DynamoDB and OpenSearch",
        "Built and deployed Python and Java microservices on AWS (ECS, EKS) for production healthcare workloads, including the backend for a DICOM medical image viewer",
        "Owned system design end to end: requirements, UML diagrams, API documentation, and Technical Design Reviews with architects across the organization",
        "Built a metrics visualization dashboard backend in Java and Spring Boot; wrote pytest and JUnit coverage; mentored junior engineers",
      ],
    },
  ] satisfies ResumeRole[],
  education: [
    {
      degree: "Master of Science, Software Engineering",
      school: "Pennsylvania State University",
    },
    {
      degree: "Bachelor of Engineering",
      school: "University of Pune, Pune, India",
    },
  ] satisfies ResumeEducation[],
};
