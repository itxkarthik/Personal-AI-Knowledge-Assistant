"use client";

import Link from "next/link";
import { FileText, MessageSquare, Search, Upload } from "lucide-react";

import { OverviewHero } from "@/components/features/dashboard/OverviewHero";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export default function DashboardPage() {
  const quickActions = [
    {
      title: "New Note",
      href: "/dashboard/notes",
      icon: FileText,
      description: "Capture ideas and structured notes.",
    },
    {
      title: "Upload Document",
      href: "/dashboard/documents",
      icon: Upload,
      description: "Add reference files and extract text.",
    },
    {
      title: "Start Chat",
      href: "/dashboard/chat",
      icon: MessageSquare,
      description: "Ask contextual questions from your vault.",
    },
    {
      title: "Search Knowledge",
      href: "/dashboard/search",
      icon: Search,
      description: "Query across notes and docs in one place.",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <OverviewHero />

      <section className="space-y-3">
        <h2 className="text-base font-bold text-foreground">Quick actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="border border-border bg-background p-4 transition-colors hover:bg-muted"
              >
                <div className="flex items-start justify-between gap-3">
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-foreground">{action.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <Card className="border-border bg-card">
        <CardHeader className="border-b border-border">
          <CardTitle>Latest updates</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your workspace is ready. Create a note, upload a document, or start a new chat session.
          </p>
        </CardHeader>
        <CardContent className="py-5">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                title: "Notes",
                description: "Capture an idea, summary, or reference point.",
                cta: "Create note",
                href: "/dashboard/notes",
              },
              {
                title: "Documents",
                description: "Bring PDFs, docs, and images into your vault.",
                cta: "Upload file",
                href: "/dashboard/documents",
              },
              {
                title: "Chat",
                description: "Ask questions with retrieved context.",
                cta: "Open chat",
                href: "/dashboard/chat",
              },
            ].map((item) => (
              <div key={item.title} className="border border-border bg-muted p-4">
                <p className="text-sm font-bold text-card-foreground">{item.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                <Button asChild variant="link" className="mt-4 h-auto p-0">
                  <Link href={item.href}>{item.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
