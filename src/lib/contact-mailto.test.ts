import { describe, expect, it } from "vitest";
import { buildContactMailtoUrl } from "@/lib/contact-mailto";

describe("buildContactMailtoUrl", () => {
  it("builds a mailto link with encoded subject and body", () => {
    const url = buildContactMailtoUrl("kashif-jilani@outlook.com", {
      name: "Jane Doe",
      email: "jane@example.com",
      subject: "Project enquiry",
      message: "Hello Kashif,\n\nI would like to discuss a role.",
    });

    expect(url.startsWith("mailto:kashif-jilani@outlook.com?")).toBe(true);
    expect(url).toContain("subject=Project+enquiry");
    expect(url).toContain("Name%3A+Jane+Doe");
    expect(url).toContain("jane%40example.com");
    expect(url).toContain("discuss+a+role");
  });
});
