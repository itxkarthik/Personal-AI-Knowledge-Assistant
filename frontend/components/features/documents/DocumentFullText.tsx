"use client";

import { Clock3, FileText } from "lucide-react";

import { formatDate, getStatusClasses } from "@/components/features/documents/utils";
import { cn } from "@/lib/utils/cn";
import type { DocumentContentResponse } from "@/types";

interface DocumentFullTextProps {
  document: DocumentContentResponse;
}

export function DocumentFullText({ document }: DocumentFullTextProps) {
  return (
    <div className="flex h-[calc(100dvh-11rem)] min-h-[32rem] flex-col gap-4">
      <section className="flex-none border border-border bg-background p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              Full Text View
            </p>
            <h1 className="mt-2 text-3xl font-bold text-foreground">{document.title}</h1>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground"><Clock3 className="h-4 w-4" />Updated {formatDate(document.updated_at)}</p>
          </div>

          <span className={cn("rounded-sm border px-2 py-1 text-xs font-medium capitalize", getStatusClasses(document.status))}>{document.status}</span>
        </div>
      </section>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden border border-border bg-background p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-foreground">Document Content</h2>
          <p className="text-xs text-muted-foreground">{document.content.length.toLocaleString()} characters</p>
        </div>
        {document.content ? (
          <pre className="mt-4 min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-words border border-border bg-muted p-4 font-mono text-sm leading-6 text-foreground">
            {document.content}
          </pre>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">Full text content is not available yet for this document.</p>
        )}
      </section>
    </div>
  );
}
