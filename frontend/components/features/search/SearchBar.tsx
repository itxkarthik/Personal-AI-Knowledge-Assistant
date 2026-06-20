"use client";

import { Loader2, Search } from "lucide-react";

interface SearchBarProps {
  query: string;
  isLoading?: boolean;
  onQueryChange: (query: string) => void;
  onSubmit: () => void;
}

export function SearchBar({ query, isLoading = false, onQueryChange, onSubmit }: SearchBarProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="flex flex-wrap items-center gap-2"
    >
      <div className="relative w-full max-w-2xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search across documents, notes, and chat conversations"
          className="w-full rounded-sm border border-border bg-muted py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        className="inline-flex items-center gap-2 rounded-sm border border-border bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        Search
      </button>
    </form>
  );
}
