export interface MarkdownHeading {
  id: string;
  title: string;
  level: number;
  offset: number;
}

export function htmlToMarkdown(content: string): string {
  return content
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "# $1\n\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "## $1\n\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "### $1\n\n")
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, value: string) =>
      `${stripHtml(value).split("\n").map((line) => `> ${line}`).join("\n")}\n\n`
    )
    .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, "```\n$1\n```\n\n")
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`")
    .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**")
    .replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n")
    .replace(/<\/?(?:ul|ol)[^>]*>/gi, "\n")
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n\n")
    .replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function ensureMarkdown(content: string, contentType?: string): string {
  return contentType === "html" || /<\/?[a-z][\s\S]*>/i.test(content)
    ? htmlToMarkdown(content)
    : content;
}

export function extractMarkdownHeadings(content: string): MarkdownHeading[] {
  const headings: MarkdownHeading[] = [];
  const pattern = /^(#{1,3})\s+(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null && headings.length < 24) {
    headings.push({
      id: `heading-${match.index}`,
      title: stripMarkdown(match[2]),
      level: match[1].length,
      offset: match.index,
    });
  }

  return headings;
}

export function extractWikiLinkTitles(content: string): string[] {
  const titles: string[] = [];
  const seen = new Set<string>();

  for (const match of content.matchAll(/\[\[([^\[\]\n]+?)\]\]/g)) {
    const title = match[1].split("|", 1)[0].split("#", 1)[0].trim();
    const key = title.toLocaleLowerCase();
    if (title && !seen.has(key)) {
      seen.add(key);
      titles.push(title);
    }
  }

  return titles;
}

export function markdownToPlainText(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g, (_, title, alias) => alias || title)
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}(?:#{1,6}|>|[-+*]|\d+\.)\s+/gm, "")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(content: string): string {
  return content.replace(/<[^>]+>/g, "").trim();
}

function stripMarkdown(content: string): string {
  return content.replace(/[`*_~]/g, "").trim();
}
