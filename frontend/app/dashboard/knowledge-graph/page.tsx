"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Focus, Link2, RefreshCcw } from "lucide-react";

import { GraphProvider, useGraph } from "@/context/GraphContext";
import { GraphView } from "@/components/features/knowledge-graph/GraphView";
import { GraphControls } from "@/components/features/knowledge-graph/GraphControls";
import {
  createNoteLink,
  fetchFullGraph,
  fetchNoteGraph,
  rebuildGraphFromWikiLinks,
} from "@/lib/api/graph";
import { Button } from "@/components/ui";

function GraphPageContent() {
  const router = useRouter();
  const {
    setGraphData,
    setIsLoading,
    setError,
    setSelectedNodeId,
    graphData,
    selectedNodeId,
  } = useGraph();
  const [graphMode, setGraphMode] = useState<"full" | "focused">("full");
  const [focusedNoteId, setFocusedNoteId] = useState<number | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [targetNoteId, setTargetNoteId] = useState("");
  const [isLinking, setIsLinking] = useState(false);

  const loadGraph = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      await rebuildGraphFromWikiLinks();

      const data =
        graphMode === "full"
          ? await fetchFullGraph()
          : focusedNoteId !== null
            ? await fetchNoteGraph(focusedNoteId)
            : await fetchFullGraph();

      setGraphData(data);
      if (graphMode === "focused" && focusedNoteId !== null) {
        setSelectedNodeId(focusedNoteId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load graph");
    } finally {
      setIsLoading(false);
    }
  }, [focusedNoteId, graphMode, setError, setGraphData, setIsLoading, setSelectedNodeId]);

  useEffect(() => {
    void loadGraph();
  }, [loadGraph, reloadToken]);

  const selectedNode = graphData?.nodes.find((node) => node.id === selectedNodeId) ?? null;
  const neighborIds = new Set(
    graphData?.edges.flatMap((edge) => {
      if (edge.source_note_id === selectedNodeId) return [edge.target_note_id];
      if (edge.target_note_id === selectedNodeId) return [edge.source_note_id];
      return [];
    }) ?? []
  );
  const neighbors = graphData?.nodes.filter((node) => neighborIds.has(node.id)) ?? [];
  const linkTargets = graphData?.nodes.filter(
    (node) => node.id !== selectedNodeId && !neighborIds.has(node.id)
  ) ?? [];

  const handleNodeClick = useCallback((noteId: number) => {
    setFocusedNoteId(noteId);
    setTargetNoteId("");
  }, []);

  const handleCreateLink = useCallback(async () => {
    if (selectedNodeId === null || !targetNoteId || isLinking) return;

    setIsLinking(true);
    try {
      await createNoteLink(selectedNodeId, Number(targetNoteId), "related");
      setTargetNoteId("");
      setReloadToken((value) => value + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect notes");
    } finally {
      setIsLinking(false);
    }
  }, [isLinking, selectedNodeId, setError, targetNoteId]);

  return (
    <div className="flex min-h-[calc(100dvh-6rem)] w-full flex-col gap-3 bg-background text-foreground">
      <section className="border-b border-border pb-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Knowledge graph</p>
            <h1 className="mt-1 text-xl font-bold text-foreground">Workspace relationships</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={graphMode === "focused" ? "default" : "outline"}
              disabled={focusedNoteId === null}
              onClick={() => {
                setGraphMode("focused");
              }}
            >
              <Focus className="h-4 w-4" />
              Local graph
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

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <GraphView onNodeClick={handleNodeClick} />

        <aside className="space-y-3 lg:sticky lg:top-20 lg:h-fit">
          <section className="border border-border bg-background">
            <div className="border-b border-border px-4 py-3">
              <p className="text-xs text-muted-foreground">Selected note</p>
              <h2 className="mt-1 truncate text-sm font-semibold text-foreground">
                {selectedNode?.title ?? "Nothing selected"}
              </h2>
            </div>
            {selectedNode ? (
              <div className="space-y-3 px-4 py-3">
                <p className="line-clamp-3 text-xs leading-5 text-muted-foreground">
                  {selectedNode.content_preview || "No preview available"}
                </p>
                <div className="border-t border-border pt-3">
                  <p className="mb-2 text-[10px] text-muted-foreground">CONNECTED NOTES · {neighbors.length}</p>
                  <div className="space-y-1">
                    {neighbors.slice(0, 8).map((node) => (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => {
                          setSelectedNodeId(node.id);
                          setFocusedNoteId(node.id);
                        }}
                        className="block w-full truncate border-l border-border px-2 py-1 text-left text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {node.title}
                      </button>
                    ))}
                    {neighbors.length === 0 ? <p className="text-xs text-muted-foreground">No connections</p> : null}
                  </div>
                </div>
                <div className="space-y-2 border-t border-border pt-3">
                  <label htmlFor="graph-link-target" className="text-[10px] text-muted-foreground">
                    CONNECT NOTE
                  </label>
                  <select
                    id="graph-link-target"
                    value={targetNoteId}
                    onChange={(event) => setTargetNoteId(event.target.value)}
                    className="h-9 w-full rounded-sm border border-border bg-muted px-2 text-xs text-foreground focus:border-ring focus:outline-none"
                  >
                    <option value="">Select a note</option>
                    {linkTargets.map((node) => (
                      <option key={node.id} value={node.id}>{node.title}</option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    className="w-full justify-center"
                    disabled={!targetNoteId || isLinking}
                    onClick={() => void handleCreateLink()}
                  >
                    <Link2 className="h-4 w-4" />
                    {isLinking ? "Connecting..." : "Connect"}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => router.push(`/dashboard/notes?note=${selectedNode.id}`)}
                >
                  <ExternalLink className="h-4 w-4" />
                  Open note
                </Button>
              </div>
            ) : null}
          </section>
          <GraphControls />
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
