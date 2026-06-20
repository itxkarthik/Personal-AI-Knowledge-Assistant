"use client";

import type { SearchEntityType } from "@/lib/api/search";

interface SearchFiltersProps {
  selectedTypes: SearchEntityType[];
  onToggleType: (type: SearchEntityType) => void;
}

const SEARCH_TYPES: Array<{ id: SearchEntityType; label: string }> = [
  { id: "document", label: "Documents" },
  { id: "note", label: "Notes" },
  { id: "chat", label: "Chats" },
];

export function SearchFilters({ selectedTypes, onToggleType }: SearchFiltersProps) {
  return (
    <section className="border border-border bg-background p-4">
      <p className="text-xs text-muted-foreground">Filters</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {SEARCH_TYPES.map((type) => {
          const isSelected = selectedTypes.includes(type.id);
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onToggleType(type.id)}
              className={`rounded-sm border px-3 py-1.5 text-xs transition ${
                isSelected
                  ? "border-border bg-accent text-foreground"
                  : "border-border bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {type.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
