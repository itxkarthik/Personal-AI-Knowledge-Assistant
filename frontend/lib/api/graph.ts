import type { GraphNode, GraphEdge } from "@/context/GraphContext";
import { apiClient } from "@/lib/api/client";

export interface GraphAllResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
  cursor?: string;
  has_more: boolean;
}

export interface GraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
  center_node_id?: number;
}

/**
 * Fetch the knowledge graph for a specific note (depth=1)
 */
export async function fetchNoteGraph(noteId: number): Promise<GraphResponse> {
  const response = await apiClient.get<GraphResponse>(`/notes/${noteId}/graph`);
  return response.data;
}

/**
 * Fetch the full user knowledge graph with pagination
 */
export async function fetchFullGraph(
  limit: number = 500,
  offset: number = 0
): Promise<GraphAllResponse> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  const response = await apiClient.get<GraphAllResponse>(`/notes/graph/all?${params}`);
  return response.data;
}

export async function rebuildGraphFromWikiLinks(): Promise<void> {
  await apiClient.post("/notes/graph/rebuild");
}

/**
 * Create a link between two notes
 */
export async function createNoteLink(
  sourceId: number,
  targetId: number,
  linkType: 'related' | 'referenced' | 'parent' | 'child' = 'related',
  description?: string
): Promise<void> {
  const params = new URLSearchParams({
    link_type: linkType,
  });
  if (description) {
    params.append('description', description);
  }

  await apiClient.post(`/notes/${sourceId}/links/${targetId}?${params}`);
}

/**
 * Delete a link between two notes
 */
export async function deleteNoteLink(sourceId: number, targetId: number): Promise<void> {
  await apiClient.delete(`/notes/${sourceId}/links/${targetId}`);
}
