"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PROFILE_DATA } from "@/lib/constants";
import { useAnalytics } from "@/lib/analytics";
import { useScrollTracking } from "@/hooks/use-scroll-tracking";
import { Code, Cpu, Cloud, Zap, ArrowRight } from "lucide-react";

const AboutSection = () => {
  const { trackEvent, trackClick } = useAnalytics();
  useScrollTracking({ threshold: [25, 50, 75] });
  
  const handleExpertiseClick = (title: string) => {
    trackClick({
      element: 'expertise_area',
      text: title,
      position: { x: 0, y: 0 },
    });
    trackEvent({
      action: 'expertise_click',
      category: 'user_interaction',
      label: title,
    });
  };
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

  const expertiseAreas = [
    {
      title: "Frontend Engineering",
      description: "Building responsive web UIs with ASP.NET MVC, Angular, React and modern JavaScript",
      icon: Code,
      color: "from-purple-500 to-pink-500",
      skills: ["ASP.NET MVC", "Angular", "React", "JavaScript"]
    },
    {
      title: "Backend Architecture",
      description: "Designing scalable .NET APIs and enterprise data layers with solid coding standards",
      icon: Cpu,
      color: "from-blue-500 to-cyan-500",
      skills: [".NET Core", "C#", "Web API", "Entity Framework"]
    },
    {
      title: "Integrations & Reporting",
      description: "Payment, screening and ERP integrations with rich operational reporting",
      icon: Zap,
      color: "from-orange-500 to-red-500",
      skills: ["Stripe", "Plaid", "Crystal Reports", "SSRS"]
    },
    {
      title: "Cloud & DevOps",
      description: "Delivering and operating workloads with Microsoft Azure CI/CD and DevOps practices",
      icon: Cloud,
      color: "from-green-500 to-emerald-500",
      skills: ["Azure", "Azure DevOps", "CI/CD", "SQL Server"]
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center mb-10 md:mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-gradient"
            variants={itemVariants}
          >
            About Me
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed"
            variants={itemVariants}
          >
            {PROFILE_DATA.summary}
          </motion.p>
        </motion.div>

        <motion.div
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 md:mb-16"
            variants={containerVariants}
          >
            {expertiseAreas.map((area, index) => (
              <motion.div key={index} variants={itemVariants}>
                <motion.div
                  onClick={() => handleExpertiseClick(area.title)}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full cursor-pointer"
                >
                  <Card className="h-full glass-morphism hover:glow-effect transition-all duration-300 border-0 group relative overflow-hidden">
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    <CardContent className="p-6 text-center relative z-10">
                      <motion.div
                        className={`w-16 h-16 mx-auto mb-4 rounded-lg bg-gradient-to-br ${area.color} flex items-center justify-center`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <area.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-3">{area.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {area.description}
                      </p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {area.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <motion.div
                        className="mt-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ y: 10 }}
                        whileHover={{ y: 0 }}
                      >
                        <ArrowRight className="h-4 w-4 mx-auto" />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-morphism border-0 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"
                animate={{
                  background: [
                    "linear-gradient(to bottom right, rgba(168, 85, 247, 0.05), rgba(59, 130, 246, 0.05))",
                    "linear-gradient(to bottom right, rgba(59, 130, 246, 0.05), rgba(168, 85, 247, 0.05))",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <CardContent className="p-5 sm:p-8 relative z-10">
                <motion.h3 
                  className="text-2xl font-bold mb-6 text-center"
                  whileHover={{ scale: 1.02 }}
                >
                  Engineering Philosophy
                </motion.h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="text-lg font-semibold mb-3 text-primary flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Principles
                    </h4>
                    <ul className="space-y-3 text-muted-foreground">
                      {[
                        "Clean, maintainable code that scales",
                        "User-centric design thinking",
                        "Security-first approach",
                        "Continuous learning and adaptation"
                      ].map((principle, index) => (
                        <motion.li
                          key={index}
                          className="flex items-start"
                          initial={{ x: -10, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          <span>{principle}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="text-lg font-semibold mb-3 text-primary flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      Approach
                    </h4>
                    <ul className="space-y-3 text-muted-foreground">
                      {[
                        "Transform complex requirements into elegant solutions",
                        "Bridge the gap between business needs and technical implementation",
                        "Mentor teams and foster engineering excellence",
                        "Deliver production-ready, enterprise-grade applications"
                      ].map((approach, index) => (
                        <motion.li
                          key={index}
                          className="flex items-start"
                          initial={{ x: 10, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          <span className="text-blue-500 mr-2 mt-1">→</span>
                          <span>{approach}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
                
                <motion.div
                  className="mt-8 text-center"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => handleExpertiseClick('Contact')}
                    className="group relative overflow-hidden h-auto min-h-11 whitespace-normal text-center px-4 py-3"
                  >
                    <span className="relative z-10">Let&apos;s discuss how I can help your project</span>
                    <ArrowRight className="ml-2 h-4 w-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
