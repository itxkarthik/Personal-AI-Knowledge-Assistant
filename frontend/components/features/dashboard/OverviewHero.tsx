"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

const stats = [
  { label: "Total Notes", value: "00" },
  { label: "Documents", value: "00" },
  { label: "Sessions", value: "00" },
];

const actions = [
  { title: "New Note", href: "/dashboard/notes" },
  { title: "Upload", href: "/dashboard/documents" },
  { title: "Chat", href: "/dashboard/chat" },
  { title: "Search", href: "/dashboard/search" },
];

export function OverviewHero() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="border-b border-border">
        <Badge variant="outline">Workspace overview</Badge>
        <CardTitle className="mt-3 text-3xl leading-tight text-card-foreground">
          Keep notes, documents, and chat context in one place.
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          A clean workspace for capturing ideas, finding references, and moving between notes without extra chrome.
        </p>
      </CardHeader>

      <CardContent className="space-y-6 py-5">
        <div className="grid gap-3 sm:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="border border-border bg-muted p-4">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-card-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {actions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="flex items-center justify-between border border-border bg-background px-4 py-3 text-sm text-foreground hover:bg-muted"
            >
              <span>{action.title}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
