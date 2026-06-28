"use client";

import { useEffect, useRef } from "react";
import { Bold, Code2, Heading2, Italic, Link2, List, ListOrdered, Quote } from "lucide-react";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import { HighlightStyle, syntaxHighlighting, syntaxTree } from "@codemirror/language";
import { EditorSelection, EditorState, type Range } from "@codemirror/state";
import {
  Decoration,
  type DecorationSet,
  drawSelection,
  EditorView,
  keymap,
  placeholder,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view";
import { tags } from "@lezer/highlight";

import { cn } from "@/lib/utils/cn";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  editable?: boolean;
  className?: string;
}

interface ToolbarButtonProps {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolbarButton({ label, onClick, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-background text-muted-foreground transition hover:bg-accent hover:text-foreground active:translate-y-px focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      {children}
    </button>
  );
}

function activeLineNumbers(state: EditorState): Set<number> {
  const activeLines = new Set<number>();
  state.selection.ranges.forEach((range) => {
    const first = state.doc.lineAt(range.from).number;
    const last = state.doc.lineAt(range.to).number;
    for (let line = first; line <= last; line += 1) activeLines.add(line);
  });
  return activeLines;
}

function buildLivePreviewDecorations(view: EditorView): DecorationSet {
  const decorations: Range<Decoration>[] = [];
  const activeLines = activeLineNumbers(view.state);
  const hiddenMarks = new Set(["HeaderMark", "EmphasisMark", "CodeMark", "LinkMark"]);

  syntaxTree(view.state).iterate({
    enter(node) {
      const line = view.state.doc.lineAt(node.from);
      if (activeLines.has(line.number)) return;

      if (hiddenMarks.has(node.name)) {
        decorations.push(Decoration.replace({}).range(node.from, node.to));
      }

      if (node.name === "ATXHeading1" || node.name === "ATXHeading2" || node.name === "ATXHeading3") {
        decorations.push(
          Decoration.line({ attributes: { class: `cm-live-${node.name.toLowerCase()}` } }).range(line.from)
        );
      } else if (node.name === "StrongEmphasis") {
        decorations.push(Decoration.mark({ class: "cm-live-strong" }).range(node.from, node.to));
      } else if (node.name === "Emphasis") {
        decorations.push(Decoration.mark({ class: "cm-live-emphasis" }).range(node.from, node.to));
      } else if (node.name === "InlineCode") {
        decorations.push(Decoration.mark({ class: "cm-live-code" }).range(node.from, node.to));
      } else if (node.name === "Link") {
        decorations.push(Decoration.mark({ class: "cm-live-link" }).range(node.from, node.to));
      }
    },
  });

  for (let lineNumber = 1; lineNumber <= view.state.doc.lines; lineNumber += 1) {
    if (activeLines.has(lineNumber)) continue;
    const line = view.state.doc.line(lineNumber);
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

const livePreview = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = buildLivePreviewDecorations(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.selectionSet || update.viewportChanged) {
        this.decorations = buildLivePreviewDecorations(update.view);
      }
    }
  },
  { decorations: (value) => value.decorations }
);

const editorTheme = EditorView.theme({
  "&": {
    minHeight: "560px",
    maxHeight: "calc(100dvh - 19rem)",
    backgroundColor: "var(--background)",
    color: "var(--foreground)",
    fontFamily: "inherit",
    fontSize: "14px",
  },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": { overflow: "auto", fontFamily: "inherit" },
  ".cm-content": { minHeight: "560px", padding: "24px", caretColor: "var(--foreground)" },
  ".cm-line": { padding: "0", lineHeight: "1.75" },
  ".cm-gutters": { display: "none" },
  ".cm-cursor": { borderLeftColor: "var(--foreground)" },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
    backgroundColor: "color-mix(in srgb, var(--foreground) 12%, transparent)",
  },
  ".cm-live-atxheading1": { fontSize: "1.75rem", fontWeight: "700", lineHeight: "1.35" },
  ".cm-live-atxheading2": { fontSize: "1.35rem", fontWeight: "700", lineHeight: "1.45" },
  ".cm-live-atxheading3": { fontSize: "1.1rem", fontWeight: "600", lineHeight: "1.55" },
  ".cm-live-strong": { fontWeight: "700" },
  ".cm-live-emphasis": { fontStyle: "italic" },
  ".cm-live-code": {
    backgroundColor: "var(--muted)",
    border: "1px solid var(--border)",
    borderRadius: "2px",
    padding: "1px 4px",
  },
  ".cm-live-link, .cm-live-wikilink": { color: "var(--foreground)", textDecoration: "underline" },
});

const markdownHighlighting = HighlightStyle.define([
  { tag: tags.heading, fontWeight: "700" },
  { tag: tags.strong, fontWeight: "700" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.monospace, fontFamily: "inherit" },
  { tag: tags.link, textDecoration: "underline" },
  { tag: tags.meta, color: "var(--muted-foreground)" },
]);

export function MarkdownEditor({ value, onChange, editable = true, className }: MarkdownEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!hostRef.current) return;

    const view = new EditorView({
      parent: hostRef.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          markdown(),
          history(),
          drawSelection(),
          livePreview,
          editorTheme,
          syntaxHighlighting(markdownHighlighting),
          keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
          placeholder("Start writing in Markdown..."),
          EditorView.editable.of(editable),
          EditorView.contentAttributes.of({ "aria-label": "Markdown note editor" }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) onChangeRef.current(update.state.doc.toString());
          }),
        ],
      }),
    });
    viewRef.current = view;

    const navigate = (event: Event) => {
      const offset = Math.min(
        Math.max(0, (event as CustomEvent<number>).detail),
        view.state.doc.length
      );
      view.dispatch({
        selection: EditorSelection.cursor(offset),
        effects: EditorView.scrollIntoView(offset, { y: "center" }),
      });
      view.focus();
    };
    window.addEventListener("note-editor:navigate", navigate);

    return () => {
      window.removeEventListener("note-editor:navigate", navigate);
      view.destroy();
      viewRef.current = null;
    };
  }, [editable]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view || view.state.doc.toString() === value) return;
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } });
  }, [value]);

  const replaceSelection = (prefix: string, suffix = "", placeholderText = "text") => {
    const view = viewRef.current;
    if (!view) return;
    const range = view.state.selection.main;
    const selected = view.state.sliceDoc(range.from, range.to) || placeholderText;
    view.dispatch({
      changes: { from: range.from, to: range.to, insert: `${prefix}${selected}${suffix}` },
      selection: EditorSelection.range(range.from + prefix.length, range.from + prefix.length + selected.length),
    });
    view.focus();
  };

  const prefixLines = (prefix: string) => {
    const view = viewRef.current;
    if (!view) return;
    const range = view.state.selection.main;
    const start = view.state.doc.lineAt(range.from).from;
    const end = range.empty ? view.state.doc.lineAt(range.to).to : range.to;
    const selected = view.state.sliceDoc(start, end) || "List item";
    const replacement = selected
      .split("\n")
      .map((line, index) => `${prefix === "1. " ? `${index + 1}. ` : prefix}${line}`)
      .join("\n");
    view.dispatch({
      changes: { from: start, to: end, insert: replacement },
      selection: EditorSelection.range(start, start + replacement.length),
    });
    view.focus();
  };

  return (
    <div className={cn("overflow-hidden border border-border bg-background", className)}>
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted px-3 py-2">
        <ToolbarButton label="Heading" onClick={() => prefixLines("## ")}>
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Bold" onClick={() => replaceSelection("**", "**")}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Italic" onClick={() => replaceSelection("*", "*")}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <div className="mx-1 h-6 w-px bg-border" />
        <ToolbarButton label="Bullet list" onClick={() => prefixLines("- ")}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" onClick={() => prefixLines("1. ")}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Quote" onClick={() => prefixLines("> ")}>
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Code" onClick={() => replaceSelection("`", "`", "code")}>
          <Code2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Link note" onClick={() => replaceSelection("[[", "]]", "Note title")}>
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
        <span className="ml-auto hidden text-[10px] text-muted-foreground sm:inline">LIVE PREVIEW</span>
      </div>
      <div ref={hostRef} id="note-markdown-editor" />
    </div>
  );
}
