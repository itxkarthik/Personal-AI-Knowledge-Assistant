import type { SearchResultItem } from "@/types";

type SearchResultIdentity = Pick<SearchResultItem, "entity_type" | "id">;

export function getSearchResultHref(result: SearchResultIdentity): string {
  if (result.entity_type === "document") {
    return `/dashboard/documents/${result.id}`;
  }

  if (result.entity_type === "note") {
    return `/dashboard/notes?note=${result.id}`;
  }

  return `/dashboard/chat/${result.id}`;
}
