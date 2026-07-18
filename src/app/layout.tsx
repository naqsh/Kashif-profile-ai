import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { Toaster } from "@/components/ui/sonner";
import { SkipLink } from "@/components/skip-link";
import { getPersonJsonLd } from "@/lib/person-json-ld";
import { PROFILE_DATA, SITE_URL } from "@/lib/constants";
import { SEO_KEYWORDS } from "@/lib/resume-content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Senior .NET Engineer / Tech Lead with 15+ years of experience. .NET Core, C#, ASP.NET MVC, Web API, SQL Server, Microsoft Azure, Angular, Entity Framework, legacy modernization, digital banking and enterprise integrations.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kashif Jilani — Senior .NET Engineer / Tech Lead",
    template: "%s | Kashif Jilani",
  },
  description,
  keywords: SEO_KEYWORDS.split(",").map((k) => k.trim()),
  authors: [{ name: PROFILE_DATA.name, url: SITE_URL }],
  creator: PROFILE_DATA.name,
  alternates: {
    canonical: SITE_URL,
    types: {
      "text/plain": `${SITE_URL.replace(/\/$/, "")}/resume.txt`,
    },
  },
  openGraph: {
    title: "Kashif Jilani — Senior .NET Engineer / Tech Lead",
    description,
    url: SITE_URL,
    siteName: PROFILE_DATA.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Kashif Jilani — Senior .NET Engineer / Tech Lead",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kashif Jilani — Senior .NET Engineer / Tech Lead",
    description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = getPersonJsonLd();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID && (
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");`,
            }}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col">
        <SkipLink />
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
        <Toaster />
      </body>
    </html>
  );
}
