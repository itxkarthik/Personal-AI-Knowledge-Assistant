"use client";

import { Clock3, Save, Trash2 } from "lucide-react";

import { TipTapEditor } from "@/components/editors/TipTapEditor";
import { cn } from "@/lib/utils/cn";
import type { NoteResponse, NoteTag } from "@/types";

interface NoteEditorProps {
  note: NoteResponse | null;
  title: string;
  content: string;
  selectedTagIds: number[];
  tags: NoteTag[];
  isSaving: boolean;
  lastSavedAt: Date | null;
  autoSaveError: string | null;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onToggleTag: (tagId: number) => void;
  onDelete: () => Promise<void>;
  isDeleting?: boolean;
  className?: string;
}

export function NoteEditor({
  note,
  title,
  content,
  selectedTagIds,
  tags,
  isSaving,
  lastSavedAt,
  autoSaveError,
  onTitleChange,
  onContentChange,
  onToggleTag,
  onDelete,
  isDeleting = false,
  className,
}: NoteEditorProps) {
  if (!note) {
    return (
      <div className={cn("border border-border bg-background p-6 text-muted-foreground", className)}>
        <p className="text-sm text-muted-foreground">Editor</p>
        <h2 className="mt-2 text-lg font-bold text-foreground">No note selected</h2>
        <p className="mt-2 text-sm">Pick a note from the list or create one from a template.</p>
      </div>
    );
  }

  return (
    <section className={cn("border border-border bg-background p-5", className)}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">Entry Editor</p>
          <input
            type="text"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Untitled note"
            className="mt-2 w-full rounded-sm border border-border bg-muted px-3 py-3 text-2xl font-bold text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              void onDelete();
            }}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-sm border border-[#ff3b30] px-3 py-2 text-sm text-[#a50011] hover:bg-[#ff3b30]/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {tags.map((tag) => {
          const active = selectedTagIds.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => onToggleTag(tag.id)}
              className={cn(
                "rounded-sm border px-2.5 py-1 text-xs transition",
                active
                  ? "border-border bg-accent text-foreground"
                  : "border-border bg-muted text-muted-foreground hover:bg-accent"
              )}
            >
              #{tag.name}
            </button>
          );
        })}
      </div>

      <TipTapEditor value={content} onChange={onContentChange} className="min-h-0 flex-1" />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="inline-flex items-center gap-2">
          {isSaving ? (
            <>
              <Save className="h-3.5 w-3.5" />
              Saving...
            </>
          ) : lastSavedAt ? (
            <>
              <Clock3 className="h-3.5 w-3.5" />
              Saved {lastSavedAt.toLocaleTimeString()}
            </>
          ) : (
            "No changes saved yet"
          )}
        </div>
        {autoSaveError ? <span className="text-[#a50011]">{autoSaveError}</span> : <span>FORMAT: HTML · MODE: AUTOSAVE</span>}
      </div>
    </section>
  );
}
