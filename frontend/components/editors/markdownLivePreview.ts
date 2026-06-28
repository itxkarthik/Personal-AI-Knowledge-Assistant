import { HighlightStyle, syntaxHighlighting, syntaxTree } from "@codemirror/language";
import { type Extension, type Range } from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView, ViewPlugin, type ViewUpdate } from "@codemirror/view";
import { tags } from "@lezer/highlight";

function buildDecorations(view: EditorView): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  const activeLines = new Set<number>();
  view.state.selection.ranges.forEach((range) => {
    const first = view.state.doc.lineAt(range.from).number;
    const last = view.state.doc.lineAt(range.to).number;
    for (let line = first; line <= last; line += 1) activeLines.add(line);
  });

  const hiddenMarks = new Set(["HeaderMark", "EmphasisMark", "CodeMark", "LinkMark"]);
  syntaxTree(view.state).iterate({
    enter(node) {
      const line = view.state.doc.lineAt(node.from);
      if (activeLines.has(line.number)) return;
      if (hiddenMarks.has(node.name)) decorations.push(Decoration.replace({}).range(node.from, node.to));

      const className = {
        ATXHeading1: "cm-live-atxheading1",
        ATXHeading2: "cm-live-atxheading2",
        ATXHeading3: "cm-live-atxheading3",
      }[node.name];
      if (className) decorations.push(Decoration.line({ attributes: { class: className } }).range(line.from));
      else if (node.name === "StrongEmphasis") decorations.push(Decoration.mark({ class: "cm-live-strong" }).range(node.from, node.to));
      else if (node.name === "Emphasis") decorations.push(Decoration.mark({ class: "cm-live-emphasis" }).range(node.from, node.to));
      else if (node.name === "InlineCode") decorations.push(Decoration.mark({ class: "cm-live-code" }).range(node.from, node.to));
      else if (node.name === "Link") decorations.push(Decoration.mark({ class: "cm-live-link" }).range(node.from, node.to));
    },
  });

  for (let number = 1; number <= view.state.doc.lines; number += 1) {
    if (activeLines.has(number)) continue;
    const line = view.state.doc.line(number);
    for (const match of line.text.matchAll(/\[\[([^\[\]\n]+?)\]\]/g)) {
      const start = line.from + (match.index ?? 0);
      const end = start + match[0].length;
      decorations.push(Decoration.replace({}).range(start, start + 2));
      decorations.push(Decoration.mark({ class: "cm-live-wikilink" }).range(start + 2, end - 2));
      decorations.push(Decoration.replace({}).range(end - 2, end));
    }
  }
  return Decoration.set(decorations, true);
}

const livePreview = ViewPlugin.fromClass(class {
  decorations: DecorationSet;
  constructor(view: EditorView) { this.decorations = buildDecorations(view); }
  update(update: ViewUpdate) {
    if (update.docChanged || update.selectionSet || update.viewportChanged) this.decorations = buildDecorations(update.view);
  }
}, { decorations: (value) => value.decorations });

const theme = EditorView.theme({
  "&": { minHeight: "560px", maxHeight: "calc(100dvh - 19rem)", backgroundColor: "var(--background)", color: "var(--foreground)", fontFamily: "inherit", fontSize: "14px" },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": { overflow: "auto", fontFamily: "inherit" },
  ".cm-content": { minHeight: "560px", padding: "24px", caretColor: "var(--foreground)" },
  ".cm-line": { padding: "0", lineHeight: "1.75" },
  ".cm-gutters": { display: "none" },
  ".cm-cursor": { borderLeftColor: "var(--foreground)" },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": { backgroundColor: "color-mix(in srgb, var(--foreground) 12%, transparent)" },
  ".cm-live-atxheading1": { fontSize: "1.75rem", fontWeight: "700", lineHeight: "1.35" },
  ".cm-live-atxheading2": { fontSize: "1.35rem", fontWeight: "700", lineHeight: "1.45" },
  ".cm-live-atxheading3": { fontSize: "1.1rem", fontWeight: "600", lineHeight: "1.55" },
  ".cm-live-strong": { fontWeight: "700" },
  ".cm-live-emphasis": { fontStyle: "italic" },
  ".cm-live-code": { backgroundColor: "var(--muted)", border: "1px solid var(--border)", borderRadius: "2px", padding: "1px 4px" },
  ".cm-live-link, .cm-live-wikilink": { color: "var(--foreground)", textDecoration: "underline" },
});

const highlighting = HighlightStyle.define([
  { tag: tags.heading, fontWeight: "700" }, { tag: tags.strong, fontWeight: "700" },
  { tag: tags.emphasis, fontStyle: "italic" }, { tag: tags.monospace, fontFamily: "inherit" },
  { tag: tags.link, textDecoration: "underline" }, { tag: tags.meta, color: "var(--muted-foreground)" },
]);

export const markdownLivePreview: Extension = [livePreview, theme, syntaxHighlighting(highlighting)];
