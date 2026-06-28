import { describe, expect, it } from "vitest";

import {
  ensureMarkdown,
  extractMarkdownHeadings,
  extractWikiLinkTitles,
  markdownToPlainText,
} from "../markdown";

describe("markdown note helpers", () => {
  it("converts legacy rich text notes to Markdown", () => {
    expect(ensureMarkdown("<h2>Research</h2><p>Read <strong>this</strong>.</p>", "html")).toBe(
      "## Research\n\nRead **this**."
    );
  });

  it("extracts headings with source offsets", () => {
    expect(extractMarkdownHeadings("# One\n\nText\n\n## Two")).toEqual([
      { id: "heading-0", title: "One", level: 1, offset: 0 },
      { id: "heading-13", title: "Two", level: 2, offset: 13 },
    ]);
  });

  it("deduplicates Obsidian wiki-link targets", () => {
    expect(extractWikiLinkTitles("[[Research]] [[Meeting#Notes|log]] [[research]]")).toEqual([
      "Research",
      "Meeting",
    ]);
  });

  it("creates readable previews from Markdown", () => {
    expect(markdownToPlainText("## Topic\n\nRead [[Research|the report]] and **compare**.")).toBe(
      "Topic Read the report and compare."
    );
  });
});
