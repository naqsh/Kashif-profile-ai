import { PROFILE_DATA } from "@/lib/constants";
import { SEO_KEYWORDS } from "@/lib/resume-content";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";

export function getPersonJsonLd() {
  const knowsAbout = SEO_KEYWORDS.split(",").map((k) => k.trim()).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PROFILE_DATA.name,
    jobTitle: "Senior .NET Engineer / Tech Lead",
    description: PROFILE_DATA.summary.replace(/\n\n/g, " "),
    email: `mailto:${PROFILE_DATA.email}`,
    telephone: PROFILE_DATA.phone,
    url: SITE_URL,
    image: PROFILE_DATA.profilePhotoUrl.startsWith("http")
      ? PROFILE_DATA.profilePhotoUrl
      : `${SITE_URL}${PROFILE_DATA.profilePhotoUrl}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    sameAs: [PROFILE_DATA.linkedin, PROFILE_DATA.github, PROFILE_DATA.website],
    knowsAbout,
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Master in Computer Science — Software Engineering & Networks, International Islamic University",
    },
    hasCredential: PROFILE_DATA.certifications.map((name) => ({
      "@type": "EducationalOccupationalCredential",
      name,
    })),
    worksFor: {
      "@type": "Organization",
      name: "Macrosoft Inc. — Technical Lead",
    },
  };
}
