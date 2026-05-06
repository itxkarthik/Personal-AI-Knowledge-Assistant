"use client";

import { OverviewHero } from "@/components/features/dashboard/OverviewHero";
import { StatusTerminal } from "@/components/features/dashboard/StatusTerminal";
import { ArrowUpRight, FileText, MessageSquare, Search, Upload } from "lucide-react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/ui";

export default function DashboardPage() {
  const quickActions = [
    {
      title: "New Note",
      href: "/dashboard/notes",
      icon: FileText,
      description: "Create a new note",
    },
    {
      title: "Upload Document",
      href: "/dashboard/documents",
      icon: Upload,
      description: "Add a document",
    },
    {
      title: "Start Chat",
      href: "/dashboard/chat",
      icon: MessageSquare,
      description: "Talk with Ether",
    },
    {
      title: "Search Knowledge",
      href: "/dashboard/search",
      icon: Search,
      description: "Query knowledgebase",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      <StatusTerminal />

      <OverviewHero />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Card
              key={action.title}
              className="group border-white/10 bg-[#171717]/90 transition hover:border-[#bcff5f]/25 hover:bg-[#1a1a1a]"
            >
              <CardContent className="flex h-full flex-col gap-4 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-[#c0c1ff] transition group-hover:bg-[#bcff5f]/12 group-hover:text-[#dfffa8]">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-white/30 transition group-hover:text-[#c0c1ff]" />
                </div>

                <div className="space-y-1">
                  <h2 className="text-base font-semibold text-white">{action.title}</h2>
                  <p className="text-sm text-white/60">{action.description}</p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <Badge variant="outline" className="border-white/10 bg-white/5 text-white/65">
                    Quick action
                  </Badge>
                  <Button asChild variant="ghost" size="sm" className="h-8 rounded-full px-3 text-white/70 hover:bg-white/8 hover:text-white">
                    <a href={action.href}>Open</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card className="border-white/10 bg-[#171717]/90">
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
          <div>
            <Badge variant="secondary" className="rounded-full bg-white/8 text-white/75">
              Recent activity
            </Badge>
            <CardTitle className="mt-3 text-lg text-white">Latest updates</CardTitle>
            <CardDescription className="mt-1 text-white/60">
              Your workspace is quiet for now. Start by creating a note or uploading a document.
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="rounded-full text-white/70 hover:bg-white/8 hover:text-white" asChild>
            <a href="/dashboard/search">View all</a>
          </Button>
        </CardHeader>

        <Separator className="bg-white/10" />

        <CardContent className="py-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Notes",
                description: "Capture an idea, summary, or reference point.",
                cta: "Create note",
                href: "/dashboard/notes",
              },
              {
                title: "Documents",
                description: "Bring PDFs, docs, and screenshots into the vault.",
                cta: "Upload file",
                href: "/dashboard/documents",
              },
              {
                title: "Chat",
                description: "Ask questions and keep the conversation attached to context.",
                cta: "Open chat",
                href: "/dashboard/chat",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm text-white/60">{item.description}</p>
                <Button asChild variant="link" className="mt-4 h-auto p-0 text-[#bcff5f] hover:text-[#dfffa8]">
                  <a href={item.href}>{item.cta}</a>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
