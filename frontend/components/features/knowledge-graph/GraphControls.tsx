"use client";

import React from "react";
import { Filter, Search, RotateCcw } from "lucide-react";

import { useGraph } from "@/context/GraphContext";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

export const GraphControls: React.FC = () => {
  const { filters, toggleLinkTypeFilter, setFilters, resetFilters, graphData, filteredEdges, visibleNodes } = useGraph();
  const linkTypes = ["related", "referenced", "parent", "child"] as const;

  return (
    <section className="border border-border bg-background">
      <div className="px-4 py-3">
        <p className="text-xs text-muted-foreground">Graph controls</p>
        <h2 className="text-sm font-semibold text-foreground">Search and narrow the graph</h2>
      </div>

      <div className="space-y-4 border-t border-border px-4 py-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Search className="h-3.5 w-3.5" />
            Search notes
          </label>
          <Input
            type="text"
            placeholder="Search by title or content"
            value={filters.searchQuery}
            onChange={(e) => setFilters({ searchQuery: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            Link types
          </label>
          <div className="flex flex-wrap gap-2">
            {linkTypes.map((type) => {
              const active = filters.linkTypes.has(type);

              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleLinkTypeFilter(type)}
                  className={cn(
                    "border px-3 py-1 text-xs transition-all duration-200 active:translate-y-px",
                    active
                      ? "border-border bg-accent text-foreground"
                      : "border-border bg-muted text-muted-foreground hover:bg-accent"
                  )}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={filters.showArchived}
            onChange={(e) => setFilters({ showArchived: e.target.checked })}
            className="h-4 w-4 rounded-sm border-border text-foreground focus:ring-ring/10"
          />
          <span className="text-xs text-muted-foreground">Include archived notes</span>
        </label>

        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            {visibleNodes.length}/{graphData?.nodes.length ?? 0} nodes visible
          </span>
          <span>{filteredEdges.length} links</span>
        </div>

        <Button variant="outline" className="w-full justify-center" onClick={resetFilters}>
          <RotateCcw className="h-4 w-4" />
          Reset filters
        </Button>
      </div>
    </section>
  );
};
