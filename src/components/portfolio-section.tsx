"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ArrowRight, Code } from "lucide-react";

const PortfolioSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const projects = [
    {
      title: "Coyote Analytics (Surepoint)",
      category: "Legal Tech Platform",
      description:
        "Law-firm practice management for cases, AR/AP and payments — ActiveReports 6→16 migration, multi-gateway payments and Office 365 via Microsoft Graph.",
      technologies: [
        ".NET Framework 4.8",
        "Windows Forms",
        "C#",
        "SQL Server",
        "Azure",
        "ActiveReports",
        "MS Graph",
      ],
      features: [
        "ActiveReports 6→16 migration",
        "Case & AR/AP workflows",
        "Multi-gateway payments",
        "Outlook / Office 365 plugins",
        "Azure-hosted delivery",
      ],
      status: "Production",
      highlight: true,
      employer: "Macrosoft Inc.",
    },
    {
      title: "ISS & Rinauer (VFP → .NET)",
      category: "Legacy Modernization",
      description:
        "Fund-accounting (ISS) and shipping-management (Rinauer) modernizations — Visual FoxPro business logic migrated to .NET Core Web API, Angular and SQL Server.",
      technologies: [".NET Core", "Web API", "Angular 8", "C#", "SQL Server", "Visual FoxPro"],
      features: [
        "VFP → SQL Server migration",
        "Fund accounting & fee processing",
        "Vessel operations digitization",
        "Side-by-side discrepancy tooling",
        "Web API + Angular clients",
      ],
      status: "Production",
      highlight: true,
      employer: "Macrosoft Inc.",
    },
    {
      title: "My Cap (CNH Industrial)",
      category: "Enterprise Platform",
      description:
        "Quotation-to-settlement platform for leasing assets/vehicles in agriculture — contract documents and PPSR integration for vehicle and guarantor verification.",
      technologies: [".NET Core", "C#", "SQL Server", "Microsoft Azure", "Entity Framework", "React"],
      features: [
        "Quotation through settlement flow",
        "PPSR history verification",
        "Azure-hosted .NET Core APIs",
        "React client experience",
        "Entity Framework data layer",
      ],
      status: "Production",
      highlight: true,
      employer: "Khaleef Technologies",
    },
    {
      title: "Renttango Payment Module",
      category: "SaaS Platform",
      description:
        "Payment integration for a rental management platform — Stripe card payments and Plaid bank payments with multi-party fee handling on a CQRS architecture.",
      technologies: [".NET Core", "C#", "SQL Server", "Azure", "Entity Framework", "Stripe", "Plaid", "CQRS"],
      features: [
        "Stripe credit-card payments",
        "Plaid bank-account payments",
        "Multi-party fee distribution",
        "CQRS pattern",
        "Azure-hosted services",
      ],
      status: "Production",
      highlight: true,
      employer: "Khaleef Technologies",
    },
    {
      title: "Digital Banking Platform",
      category: "Enterprise Software",
      description:
        "Paperless digital banking modules for corporate onboarding and transactions — document screening APIs and local/international fund-transfer channels.",
      technologies: ["ASP.NET Web API", "C#", "SQL Server", "Entity Framework", "Angular"],
      features: [
        "Customer onboarding & screening",
        "Shareholder document workflow",
        "Transaction status flags",
        "Local & international transfers",
        "Web API channel integrations",
      ],
      status: "Production",
      highlight: true,
      employer: "Wizlinx",
    },
    {
      title: "HRIS & Procurement Systems",
      category: "Enterprise Software",
      description:
        "HR information system and end-to-end procurement with Infor MP2 integration — leave, gate-pass, payroll liaison and fuel purchase reporting.",
      technologies: ["ASP.NET", "C#", "VB.NET", "SQL Server", "Crystal Reports", "SSRS", "Web API"],
      features: [
        "Employee / payroll / education modules",
        "Procurement cycle to GIN",
        "MP2 / Infor integration",
        "Leave & GatePass workflows",
        "Fuel invoice & lab reporting",
      ],
      status: "Production",
      highlight: false,
      employer: "Kohinoor Energy Ltd",
    },
    {
      title: "CompanyBrain & TaskFlowAI",
      category: "Open Source / AI",
      description:
        "Public Python repositories exploring company knowledge and AI-assisted task workflows under the naqsh GitHub profile.",
      technologies: ["Python"],
      features: [
        "Open-source experimentation",
        "CompanyBrain knowledge workflows",
        "TaskFlowAI task automation",
        "Public GitHub portfolio",
      ],
      status: "In Development",
      highlight: false,
      url: "https://github.com/naqsh",
      linkLabel: "View on GitHub",
    },
    {
      title: "Kashif Profile AI",
      category: "Portfolio / AI",
      description:
        "Personal portfolio with an AI Digital Twin — OpenRouter streaming chat, quotas, Sanity blog structure, resume endpoints and recruiter-friendly sections.",
      technologies: [
        "Next.js 16",
        "React 19",
        "TypeScript",
        "Sanity CMS",
        "Tailwind CSS v4",
        "ShadCN UI",
        "OpenRouter",
        "Vitest",
        "Playwright",
      ],
      features: [
        "AI Digital Twin (OpenRouter)",
        "SSE streaming & quotas",
        "Sanity-ready /blogs + /studio",
        "ATS-friendly resume routes",
        "Vitest + Playwright suite",
      ],
      status: "Production",
      highlight: false,
      url: "https://github.com/naqsh",
      linkLabel: "View on GitHub",
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Open Source / AI": "from-orange-500 to-red-500",
      "Enterprise Platform": "from-blue-500 to-cyan-500",
      "SaaS Platform": "from-green-500 to-emerald-500",
      "Enterprise Software": "from-purple-500 to-pink-500",
      "Portfolio / AI": "from-indigo-500 to-blue-500",
    };
    return colors[category] || "from-gray-500 to-gray-600";
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      Production: "bg-green-500/20 text-green-700 border-green-500/30",
      "In Development": "bg-blue-500/20 text-blue-700 border-blue-500/30",
      Completed: "bg-gray-500/20 text-gray-700 border-gray-500/30",
    };
    return colors[status] || "bg-gray-500/20 text-gray-700 border-gray-500/30";
  };

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-10 md:mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-gradient"
            variants={itemVariants}
          >
            Portfolio & Projects
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Verified projects from enterprise .NET / Azure delivery and public GitHub work — digital banking, payments, industrial systems and technical leadership
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {projects.map((project, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card
                className={`h-full glass-morphism hover:glow-effect transition-all duration-300 border-0 group ${
                  project.highlight ? "ring-2 ring-primary/20" : ""
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={`text-xs bg-gradient-to-r ${getCategoryColor(project.category)} text-white border-0`}
                        >
                          {project.category}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getStatusColor(project.status)}`}>
                          {project.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                      {"employer" in project && project.employer && (
                        <p className="text-sm text-muted-foreground mt-1">{project.employer}</p>
                      )}
                    </div>
                    {project.highlight && (
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2 text-primary">Key Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {project.features.slice(0, 3).map((feature, featureIndex) => (
                        <Badge key={featureIndex} variant="secondary" className="text-xs px-2 py-1 bg-muted/50">
                          {feature}
                        </Badge>
                      ))}
                      {project.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-2 text-primary">Technologies</h4>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="outline"
                          className="text-xs border-border hover:bg-accent transition-colors"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {project.url && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                        asChild
                      >
                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                          {project.linkLabel?.includes("GitHub") ? (
                            <Code className="h-3 w-3 mr-1" />
                          ) : null}
                          {project.linkLabel ?? "View project"}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={project.url} target="_blank" rel="noopener noreferrer" aria-label="Open project">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-10 md:mt-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <Card className="glass-morphism border-0 max-w-2xl mx-auto">
              <CardContent className="p-5 sm:p-8 text-center">
                <h3 className="text-xl sm:text-2xl font-bold mb-4">More on GitHub</h3>
                <p className="text-muted-foreground mb-6">
                  Explore all public repositories including Azure AI examples, FastAPI practice projects and earlier full-stack work.
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  asChild
                >
                  <a href="https://github.com/naqsh?tab=repositories" target="_blank" rel="noopener noreferrer">
                    View GitHub Profile
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioSection;
