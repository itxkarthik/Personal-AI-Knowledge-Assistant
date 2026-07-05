import { describe, expect, it } from "vitest";

import { getSearchResultHref } from "../searchResultHref";

describe("getSearchResultHref", () => {
  it("opens the selected note in the notes workspace", () => {
    expect(getSearchResultHref({ entity_type: "note", id: 138 })).toBe(
      "/dashboard/notes?note=138",
    );
  });

  it("opens the selected document detail page", () => {
    expect(getSearchResultHref({ entity_type: "document", id: 12 })).toBe(
      "/dashboard/documents/12",
    );
  });

  it("opens the selected chat session", () => {
    expect(getSearchResultHref({ entity_type: "chat", id: 35 })).toBe(
      "/dashboard/chat/35",
    );
  });
});
