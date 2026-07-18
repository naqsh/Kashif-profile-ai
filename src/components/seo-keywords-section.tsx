import Link from "next/link";
import { PROFILE_DATA } from "@/lib/constants";
import { SEO_KEYWORDS } from "@/lib/resume-content";

/** Server-rendered keyword-rich copy for crawlers and recruiters */
export function SeoKeywordsSection() {
  return (
    <section
      aria-label="Technical expertise summary"
      className="border-t border-border/40 bg-muted/10 py-10"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-lg font-semibold mb-3 text-foreground">Technical Focus</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{SEO_KEYWORDS}.</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Production experience leading enterprise .NET teams — digital banking, payment
          integrations (Stripe/Plaid), Azure CI/CD, ASP.NET MVC / Web API, SQL Server, Angular and
          industrial HR/procurement systems, with a Sanity CMS-ready blog structure.
        </p>
        <p className="mt-3 text-sm">
          <Link href="/blogs" className="text-primary underline underline-offset-4 hover:opacity-80">
            Read the blog
          </Link>
          {" · "}
          <Link href="/resume" className="text-primary underline underline-offset-4 hover:opacity-80">
            View plain-text resume (ATS-friendly)
          </Link>
          {" · "}
          <a
            href={PROFILE_DATA.cvDownloadUrl}
            className="text-primary underline underline-offset-4 hover:opacity-80"
          >
            Download CV
          </a>
        </p>
      </div>
    </section>
  );
}
