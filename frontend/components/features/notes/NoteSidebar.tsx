"use client";

import { FolderOpen, Plus, Tag } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { NoteFolder, NoteTag } from "@/types";

interface NoteSidebarProps {
  folders: NoteFolder[];
  tags: NoteTag[];
  selectedFolderId: number | null;
  selectedTagId: number | null;
  onSelectFolder: (folderId: number | null) => void;
  onSelectTag: (tagId: number | null) => void;
  onCreateFolder: () => void;
  onCreateTag: () => void;
}

export function NoteSidebar({
  folders,
  tags,
  selectedFolderId,
  selectedTagId,
  onSelectFolder,
  onSelectTag,
  onCreateFolder,
  onCreateTag,
}: NoteSidebarProps) {
  return (
    <aside className="space-y-6 border border-border bg-background p-4">
      <section>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Folders</p>
          <button type="button" onClick={onCreateFolder} className="inline-flex items-center gap-1 rounded-sm border border-border bg-muted px-2 py-1 text-xs text-foreground hover:bg-accent">
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onSelectFolder(null)}
            className={cn(
              "flex w-full items-center gap-2 px-2 py-1.5 text-sm transition",
              selectedFolderId === null ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-muted"
            )}
          >
            <FolderOpen className="h-4 w-4" />
            All Notes
          </button>
          {folders.map((folder) => (
            <button
              key={folder.id}
              type="button"
              onClick={() => onSelectFolder(folder.id)}
              className={cn(
                "flex w-full items-center gap-2 px-2 py-1.5 text-sm transition",
                selectedFolderId === folder.id ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <FolderOpen className="h-4 w-4" />
              {folder.name}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Tags</p>
          <button type="button" onClick={onCreateTag} className="inline-flex items-center gap-1 rounded-sm border border-border bg-muted px-2 py-1 text-xs text-foreground hover:bg-accent">
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSelectTag(null)}
            className={cn(
              "rounded-sm border px-2.5 py-1 text-xs transition",
              selectedTagId === null ? "border-border bg-accent text-foreground" : "border-border bg-muted text-muted-foreground hover:bg-accent"
            )}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => onSelectTag(tag.id)}
              className={cn(
                "inline-flex items-center gap-1 rounded-sm border px-2.5 py-1 text-xs transition",
                selectedTagId === tag.id ? "border-border bg-accent text-foreground" : "border-border bg-muted text-muted-foreground hover:bg-accent"
              )}
            >
              <Tag className="h-3 w-3" />
              {tag.name}
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}
