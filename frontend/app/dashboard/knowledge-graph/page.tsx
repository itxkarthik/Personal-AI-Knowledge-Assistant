"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";

import { GraphProvider, useGraph } from "@/context/GraphContext";
import { GraphView } from "@/components/features/knowledge-graph/GraphView";
import { GraphControls } from "@/components/features/knowledge-graph/GraphControls";
import { fetchFullGraph, fetchNoteGraph } from "@/lib/api/graph";
import { Button } from "@/components/ui";

function GraphPageContent() {
  const router = useRouter();
  const {
    setGraphData,
    setIsLoading,
    setError,
    setSelectedNodeId,
  } = useGraph();
  const [graphMode, setGraphMode] = useState<"full" | "focused">("full");
  const [focusedNoteId, setFocusedNoteId] = useState<number | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const loadGraph = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data =
        graphMode === "full"
          ? await fetchFullGraph()
          : await fetchNoteGraph(focusedNoteId ?? 1);

      setGraphData(data);
      setSelectedNodeId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load graph");
    } finally {
      setIsLoading(false);
    }
  }, [focusedNoteId, graphMode, setError, setGraphData, setIsLoading, setSelectedNodeId]);

  useEffect(() => {
    void loadGraph();
  }, [loadGraph, reloadToken]);

  const handleNodeClick = (noteId: number) => {
    router.push(`/dashboard/notes/${noteId}`);
  };

  return (
    <div className="flex min-h-[calc(100dvh-6rem)] w-full flex-col gap-4 bg-background text-foreground">
      <section className="border-b border-border pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs text-muted-foreground">Knowledge graph</p>
            <h1 className="mt-1 text-2xl font-bold text-foreground lg:text-3xl">
              Map the relationships inside your workspace
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Switch between a focused neighborhood and the full network of linked ideas.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={graphMode === "focused" ? "default" : "outline"}
              onClick={() => {
                setGraphMode("focused");
                setFocusedNoteId((current) => current ?? 1);
              }}
            >
              Focused
            </Button>
            <Button
              variant={graphMode === "full" ? "default" : "outline"}
              onClick={() => setGraphMode("full")}
            >
              Full graph
            </Button>
            <Button variant="outline" onClick={() => setReloadToken((value) => value + 1)}>
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <GraphView onNodeClick={handleNodeClick} />

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <GraphControls />
          <section className="border border-border bg-background px-4 py-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Link types</p>
            <p className="mt-2 leading-5">
              Related links are solid, referenced links are dashed, and parent-child links are dotted.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default function KnowledgeGraphPage() {
  return (
    <GraphProvider>
      <GraphPageContent />
    </GraphProvider>
  );
}
