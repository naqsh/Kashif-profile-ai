import { describe, expect, it } from "vitest";
import { buildLlmsTxt } from "@/lib/llms-txt";

describe("buildLlmsTxt", () => {
  it("follows llmstxt.org structure with required sections and absolute URLs", () => {
    const text = buildLlmsTxt();

    expect(text.startsWith("# Kashif Jilani\n")).toBe(true);
    expect(text).toMatch(/^> .+/m);
    expect(text).toContain("## Primary");
    expect(text).toContain("## Optional");
    expect(text).toContain("[Plain-text resume](http://localhost:3000/resume.txt)");
    expect(text).toContain("[Blog](http://localhost:3000/blogs)");
    expect(text).toContain("Sanity CMS");
    expect(text).toContain("[Sitemap](http://localhost:3000/sitemap.xml)");
    expect(text).not.toContain("](/");
  });
});
