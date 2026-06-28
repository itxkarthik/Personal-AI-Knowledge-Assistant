"use client";

import { FilePlus2, LayoutTemplate } from "lucide-react";

import type { NoteTemplateData } from "@/types";

const DEFAULT_NOTE_TEMPLATES: NoteTemplateData[] = [
  {
    id: "meeting",
    name: "Meeting Intel",
    description: "Structured capture for decisions, blockers, and follow-ups.",
    tags: ["meeting", "tasks"],
    content: `## Meeting Context\n\nPurpose:\n\nParticipants:\n\nDate:\n\n### Key Decisions\n\n- \n\n### Action Items\n\n- **Owner:**  **Due:**\n\n### Risks / Blockers\n\n- `,
  },
  {
    id: "research",
    name: "Research Lab",
    description: "Hypothesis-driven template for experiments and findings.",
    tags: ["research", "analysis"],
    content: `## Research Question\n\n### Hypothesis\n\n### Findings\n\n- \n\n### Evidence Links\n\n- [[Related note]]\n\n### Next Iteration\n`,
  },
  {
    id: "study",
    name: "Study Sprint",
    description: "Learning notes with concepts, examples, and memory hooks.",
    tags: ["study", "learning"],
    content: `## Topic\n\n### Core Concepts\n\n- \n\n### Examples\n\n- \n\n### Flash Recall\n\nWhat should I remember tomorrow?`,
  },
];

interface NoteTemplatesProps {
  onUseTemplate: (template: NoteTemplateData) => void;
  templates?: NoteTemplateData[];
}

export function NoteTemplates({ onUseTemplate, templates = DEFAULT_NOTE_TEMPLATES }: NoteTemplatesProps) {
  return (
    <section className="border border-border bg-background p-6">
      <div className="mb-3 flex items-center gap-2">
        <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">Templates</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onUseTemplate(template)}
            className="group border border-border bg-muted p-3 text-left hover:bg-accent"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-foreground">{template.name}</p>
              <FilePlus2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{template.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {template.tags.map((tag) => (
                <span key={`${template.id}-${tag}`} className="rounded-sm border border-border bg-background px-2 py-0.5 text-[10px] text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export function getDefaultNoteTemplates(): NoteTemplateData[] {
  return DEFAULT_NOTE_TEMPLATES;
}
