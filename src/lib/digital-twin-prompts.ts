/**
 * Suggested questions for the AI Digital Twin, grounded in Kashif's CV and LinkedIn profile.
 */
export const DIGITAL_TWIN_STARTER_PROMPTS = [
  "Tell me about your .NET and C# experience",
  "What did you deliver at Khaleef Technologies?",
  "Explain your digital banking work at Wizlinx",
  "How do you approach Azure CI/CD and DevOps?",
  "Tell me about the Renttango payment module",
  "What is My Cap and what stack did you use?",
  "Describe your technical leadership experience",
  "What Microsoft certifications do you hold?",
] as const;

export type DigitalTwinStarterPrompt = (typeof DIGITAL_TWIN_STARTER_PROMPTS)[number];
