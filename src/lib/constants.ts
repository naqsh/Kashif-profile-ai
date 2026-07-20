export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";

/** Sanity CMS — headless blog content (Studio at /studio, public listing at /blogs) */
export const BLOG_CMS = {
  provider: "Sanity CMS",
  studioPath: "/studio",
  listingPath: "/blogs",
  setupGuidePath: "docs/SANITY_SETUP_GUIDE.md",
} as const;

export const PROFILE_DATA = {
  name: "Kashif Jilani",
  initials: "KJ",
  title:
    "Senior .NET Engineer / Tech Lead | .NET Core, C#, ASP.NET | Microsoft Azure | SQL Server | 15+ Years Experience",
  location: "Lahore, Pakistan",
  email: "kashif-jilani@outlook.com",
  phone: "+92 (321) 5817137",
  linkedin: "https://www.linkedin.com/in/kjialni",
  website: "http://localhost:3000",
  github: "https://github.com/naqsh",
  profilePhotoUrl:
    process.env.NEXT_PUBLIC_PROFILE_IMAGE_URL?.trim() || "/kashif-jilani.jpg",

  /** Local CV download (docx served from /public/cv) */
  cvDownloadUrl:
    process.env.NEXT_PUBLIC_CV_URL?.trim() || "/cv/kashif-jilani-cv.docx",

  /** Local markdown resume (served from /public/cv; falls back to resume-content.ts) */
  resumeTextUrl:
    process.env.NEXT_PUBLIC_RESUME_TEXT_URL?.trim() ||
    `${SITE_URL.replace(/\/$/, "")}/cv/kashif-fullstack-cv.md`,

  summary: `Senior .NET engineer and former Principal / Tech Lead with 15+ years of experience in design, development, implementation and integration of customized software across enterprise .NET platforms.

I specialise in Microsoft technologies — .NET Core, C#, ASP.NET MVC, Web API, SQL Server and Azure CI/CD — with deep delivery in legacy modernization (Visual FoxPro migrations), digital banking, payments, legal-tech, rental and industrial systems.`,

  education: {
    degree: "Master's Degree in Computer Science",
    major: "Software Engineering & Networks",
    additional: "International Islamic University (Completed 2006)",
  },

  /** Years of hands-on experience — sourced from CV */
  skillYears: {
    "C#": 15,
    ".NET": 15,
    ".NET Core": 6,
    "ASP.NET": 15,
    "VB.NET": 10,
    JavaScript: 15,
    "SQL Server": 15,
    SQL: 15,
    Angular: 6,
    "Entity Framework": 10,
    "Microsoft Azure": 6,
    Azure: 6,
    jQuery: 12,
    Bootstrap: 10,
    React: 4,
    "Web API": 10,
    WPF: 8,
  } as Record<string, number>,

  skills: {
    frontend: [
      "ASP.NET MVC",
      "Angular",
      "React",
      "JavaScript",
      "jQuery",
      "Ajax",
      "Bootstrap",
      "WPF / WinForms",
      "HTML5 / CSS3",
    ],
    backend: [
      ".NET Core",
      "C#",
      "VB.NET",
      "ASP.NET",
      "Web API",
      "Entity Framework",
      "LINQ",
      "XML / Web Services",
    ],
    cloud: [
      "Microsoft Azure",
      "Azure CI/CD",
      "Azure DevOps",
      "SQL Server",
      "Cosmos DB",
      "Redis",
    ],
    ai: [
      "Crystal Reports",
      "SSRS",
      "ActiveReports",
      "Stripe",
      "Plaid",
      "CQRS",
      "Legacy modernization (VFP)",
    ],
    architecture: [
      "Layered Architecture",
      "REST APIs",
      "MVC",
      "CQRS Pattern",
      "Enterprise Integration",
      "Coding Standards",
    ],
    leadership: [
      "Technical Leadership",
      "Tech Lead / Mentoring",
      "Agile / Scrum",
      "Project Estimation",
      "Requirements & Design",
    ],
    aiTools: [
      "Cursor",
      "Claude",
      "OpenAI Codex",
      "Antigravity",
    ],
  },

  experience: [
    {
      company: "Macrosoft Inc.",
      role: "Technical Lead",
      period: "January 2023 - Present",
      location: "Remote",
      description: `Technical Lead delivering legal-tech and fund-accounting platforms — ActiveReports migrations, Office 365 / MS Graph integrations, Azure DevOps and Visual FoxPro modernization.`,
      achievements: [
        "Led Coyote Analytics (Surepoint) — ActiveReports 6→16 migration, case/AR/AP management and multi-gateway payments",
        "Integrated Microsoft Graph API for Outlook plugins and Office 365 collaboration",
        "Built ISS (Investment Support System) — .NET Core / Web API / Angular fund accounting with VFP→SQL Server migration",
        "Modernized Rinauer shipping management from Visual FoxPro to .NET Core Web API and Angular",
        "Established coding standards for C#, Windows Forms, ASP.NET and SQL Server; mentored engineers",
        "Owned Azure DevOps pipelines and project deliveries",
      ],
    },
    {
      company: "Khaleef Technologies",
      role: "Principal Software Engineer / Tech Lead",
      period: "March 2021 - December 2022",
      location: "Pakistan",
      description: `Principal / Tech Lead for .NET and Azure delivery — requirements, design, coding standards, DevOps and project deliveries.`,
      achievements: [
        "Developed requirements and design documents; analysed and estimated new projects",
        "Created organisation-level coding standards for C#, ASP.NET and SQL Server",
        "Performed DevOps in Azure and managed project deliveries",
        "Mentored team members in .NET development (C#, Visual Studio, JavaScript, SQL Server, ASP.NET MVC 5, Web API)",
        "Delivered My Cap for CNH Industrial — .NET Core, Azure, Entity Framework, React quotation-to-settlement with PPSR",
        "Built Renttango payment module — Stripe and Plaid with CQRS on .NET Core and Azure",
        "Implemented Advent eModal container data-ingestion dupe-check with Cosmos DB, Redis and ActiveMQ",
      ],
    },
    {
      company: "Wizlinx",
      role: "Principal Software Engineer / Project Manager",
      period: "June 2015 - March 2021",
      location: "Pakistan",
      description: `Principal engineer and project manager delivering digital banking, mobile and MIS platforms on Microsoft stack with Angular frontends.`,
      achievements: [
        "Owned requirements, design, estimation and C# / ASP.NET / SQL Server coding standards",
        "Delivered Digital Banking customer onboarding with document collection and third-party screening APIs",
        "Built Digital Banking transactions module — local/international transfers and account screening via Web API",
        "Shipped Food Book multi-platform deals/ordering app (Angular 2, Web API, Google Location API, iOS/Android)",
        "Delivered MIS for machine measurement/tag management and SG Attendance with facial scanning SDK",
      ],
    },
    {
      company: "Kohinoor Energy Ltd",
      role: "Senior Software Engineer",
      period: "July 2012 - June 2015",
      location: "Pakistan",
      description: `Senior engineer building HR, procurement, leave, gate-pass and fuel systems integrated with Infor/MP2 and Sun Financials.`,
      achievements: [
        "Built Leave Management System (ASP.NET, Web API, HTML5, Crystal Reports) for shift and general staff",
        "Delivered GPS GatePass System integrating Procurement and MP2 (Infor) item/vendor flows",
        "Developed HRIS covering employee, promotion, loans, payroll liaison and overtime modules",
        "Built end-to-end Procurement Material and Management System integrated with MP2",
        "Delivered Fuel Purchase System (VB.NET, SSRS) for invoices, shortage claims and tanker lab reports",
      ],
    },
    {
      company: "BriskSol",
      role: "Senior Software Engineer",
      period: "May 2010 - June 2012",
      location: "Pakistan",
      description: `Senior engineer delivering industrial, financial-analysis and accounting enhancement systems.`,
      achievements: [
        "Built Cane Management System for Chashma Sugar Mills (VB.NET, SQL Server, Crystal Reports)",
        "Developed Risk Application for stock-exchange client positions and daily PnL analysis",
        "Delivered Peachtree enhancements (Sales Commission Reports, Certified Payroll) via PeachTree SDK",
        "Established coding standards across C#, VB.NET, ASP.NET, SQL Server and reporting tools",
      ],
    },
  ],

  earlierRoles: [] as Array<{
    role: string;
    company: string;
    period: string;
    location: string;
  }>,

  certifications: [
    "Microsoft Certified Solution Developer (MCSD: Web Applications)",
    "MCP: Programming in HTML5 with JavaScript and CSS3",
    "MCP: Developing ASP.NET MVC 4 Web Applications",
    "MCP: Developing Windows Azure and Web Services",
  ],
};

export type SocialIconKey = "gitfut" | "github" | "linkedin" | "mail" | "globe";

export type SocialLink = {
  id: string;
  name: string;
  href: string;
  ariaLabel: string;
  analyticsLabel: string;
  gradientClass: string;
  icon: SocialIconKey;
  external: boolean;
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "github",
    name: "GitHub",
    href: PROFILE_DATA.github,
    ariaLabel: "Visit GitHub profile",
    analyticsLabel: "GitHub",
    gradientClass: "from-gray-700 to-gray-900",
    icon: "github",
    external: true,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    href: PROFILE_DATA.linkedin,
    ariaLabel: "Visit LinkedIn profile",
    analyticsLabel: "LinkedIn",
    gradientClass: "from-blue-600 to-blue-800",
    icon: "linkedin",
    external: true,
  },
  {
    id: "email",
    name: "Email",
    href: `mailto:${PROFILE_DATA.email}`,
    ariaLabel: `Email ${PROFILE_DATA.email}`,
    analyticsLabel: "Email",
    gradientClass: "from-blue-500 to-cyan-500",
    icon: "mail",
    external: false,
  },
  {
    id: "website",
    name: "Website",
    href: PROFILE_DATA.website,
    ariaLabel: "Visit personal website",
    analyticsLabel: "Website",
    gradientClass: "from-purple-600 to-pink-600",
    icon: "globe",
    external: true,
  },
];
