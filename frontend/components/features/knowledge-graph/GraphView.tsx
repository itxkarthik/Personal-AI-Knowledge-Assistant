"use client";

import React, { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import COSEBilkent from "cytoscape-cose-bilkent";
import { RotateCcw, Maximize2 } from "lucide-react";

import { useGraph } from "@/context/GraphContext";
import { Button } from "@/components/ui";

cytoscape.use(COSEBilkent);

interface GraphViewProps {
  onNodeClick?: (nodeId: number) => void;
}

export const GraphView: React.FC<GraphViewProps> = ({ onNodeClick }) => {
  const {
    graphData,
    filteredEdges,
    visibleNodes,
    selectedNodeId,
    setSelectedNodeId,
    isLoading,
    error,
    resetFilters,
  } = useGraph();
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const fitTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || !graphData) {
      cyRef.current?.destroy();
      cyRef.current = null;
      return;
    }

    const rootStyle = getComputedStyle(document.documentElement);
    const palette = {
      foreground: rootStyle.getPropertyValue("--ink").trim() || "#201d1d",
      mutedForeground: rootStyle.getPropertyValue("--mute").trim() || "#646262",
      border: rootStyle.getPropertyValue("--hairline-strong").trim() || "#646262",
    };

    const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));
    const degreeByNodeId = new Map<number, number>();
    filteredEdges.forEach((edge) => {
      degreeByNodeId.set(edge.source_note_id, (degreeByNodeId.get(edge.source_note_id) ?? 0) + 1);
      degreeByNodeId.set(edge.target_note_id, (degreeByNodeId.get(edge.target_note_id) ?? 0) + 1);
    });

    const nodeElements: cytoscape.ElementDefinition[] = visibleNodes.map((node) => ({
        data: {
          id: node.id.toString(),
          label: node.title,
          color: node.color || palette.mutedForeground,
          size: Math.min(44, 18 + (degreeByNodeId.get(node.id) ?? 0) * 4),
        },
      classes: [
        node.is_favorite ? "favorite" : "",
        node.is_pinned ? "pinned" : "",
        node.is_archived ? "archived" : "",
        node.id === graphData.center_node_id ? "center" : "",
        (degreeByNodeId.get(node.id) ?? 0) === 0 ? "unconnected" : "",
      ]
        .filter(Boolean)
        .join(" "),
    }));

    const edgeElements: cytoscape.ElementDefinition[] = filteredEdges
      .filter((edge) => visibleNodeIds.has(edge.source_note_id) && visibleNodeIds.has(edge.target_note_id))
      .map((edge) => ({
        data: {
          id: `${edge.source_note_id}-${edge.target_note_id}`,
          source: edge.source_note_id.toString(),
          target: edge.target_note_id.toString(),
          linkType: edge.link_type,
        },
        classes: edge.link_type,
      }));

    if (cyRef.current) {
      cyRef.current.destroy();
      cyRef.current = null;
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements: [...nodeElements, ...edgeElements],
      style: [
        {
          selector: "node",
          style: {
            "background-color": "data(color)",
            "border-color": palette.border,
            "border-width": 2,
            color: palette.foreground,
            label: "data(label)",
            "font-size": 11,
            "text-halign": "center",
            width: "data(size)",
            height: "data(size)",
            "text-wrap": "wrap",
            "text-max-width": "110",
            "text-valign": "bottom",
            "text-margin-y": 9,
          },
        },
        {
          selector: "node.selected, node.center",
          style: {
            "border-width": 3,
            "border-color": palette.foreground,
          },
        },
        {
          selector: "node.archived",
          style: {
            opacity: 0.5,
          },
        },
        {
          selector: "node.unconnected",
          style: {
            opacity: 0.55,
          },
        },
        {
          selector: "edge",
          style: {
            "line-color": palette.mutedForeground,
            width: 1.5,
            opacity: 0.8,
            "curve-style": "bezier",
          },
        },
        {
          selector: "edge.parent, edge.child",
          style: {
            "line-style": "dotted",
          },
        },
      ],
      layout: {
        name: "cose-bilkent",
        animate: true,
        animationDuration: 300,
        avoidOverlap: true,
        nodeSeparation: 130,
      } as cytoscape.LayoutOptions,
      wheelSensitivity: 0.1,
      autoungrabify: false,
      minZoom: 0.15,
      maxZoom: 1.75,
    });

    cyRef.current = cy;

    const resizeObserver = new ResizeObserver(() => {
      cy.resize();
    });
    resizeObserver.observe(containerRef.current);

    cy.on("tap", "node", (event) => {
      const node = event.target;
      const nodeId = Number(node.data("id"));
      setSelectedNodeId(nodeId);
      onNodeClick?.(nodeId);
    });

    cy.on("tap", (event) => {
      if (event.target === cy) {
        setSelectedNodeId(null);
      }
    });

    cy.panningEnabled(true);
    cy.zoomingEnabled(true);

    fitTimerRef.current = window.setTimeout(() => {
      cy.fit(undefined, 40);
    }, 120);

    return () => {
      if (fitTimerRef.current) {
        window.clearTimeout(fitTimerRef.current);
        fitTimerRef.current = null;
      }
      resizeObserver.disconnect();
      cy.destroy();
      if (cyRef.current === cy) {
        cyRef.current = null;
      }
    };
  }, [graphData, visibleNodes, filteredEdges, setSelectedNodeId, onNodeClick]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.nodes().removeClass("selected");
    if (selectedNodeId !== null) {
      cy.getElementById(selectedNodeId.toString()).addClass("selected");
    }
  }, [selectedNodeId]);

  return (
    <section className="relative min-h-[680px] w-full overflow-hidden border border-border bg-background lg:min-h-[calc(100dvh-9.5rem)]">
      <div className="absolute inset-0">
        <div ref={containerRef} className="h-full w-full" />
      </div>

      <div className="absolute right-4 top-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-border bg-muted text-xs"
          onClick={() => cyRef.current?.fit(undefined, 40)}
          title="Fit graph to view"
        >
          <Maximize2 className="h-4 w-4" />
          Fit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-border bg-muted text-xs"
          onClick={() => cyRef.current?.reset()}
          title="Reset zoom and pan"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90">
          <p className="text-sm text-muted-foreground">Loading knowledge graph...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 px-6">
          <div className="max-w-md text-center">
            <p className="text-sm font-semibold text-foreground">Graph load failed</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{error}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && graphData && visibleNodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 px-6">
          <div className="max-w-md text-center">
            <p className="text-sm font-semibold text-foreground">No nodes match the current filters</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Reset the search or link filters to bring the graph back into view.
            </p>
            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <RotateCcw className="h-4 w-4" />
                Reset filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {!graphData && !isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 px-6">
          <div className="max-w-md text-center">
            <p className="text-sm font-semibold text-foreground">No graph loaded yet</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Pick a mode or open a note to populate the knowledge graph.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
