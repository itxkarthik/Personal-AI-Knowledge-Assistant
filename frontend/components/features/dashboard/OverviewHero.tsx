"use client";

import { ArrowUpRight, FileText, MessageSquare, Search, Upload } from "lucide-react";

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Separator } from "@/components/ui";

export function OverviewHero() {
  const cards = [
    { label: "Total Notes", value: 0 },
    { label: "Total Documents", value: 0 },
    { label: "Quick Actions", value: 5 },
  ];

  return (
    <Card className="overflow-hidden border-white/10 bg-[#171717]/90 shadow-[0_24px_100px_rgba(0,0,0,0.45)]">
      <CardHeader className="gap-4 border-b border-white/8 bg-[linear-gradient(135deg,rgba(192,193,255,0.08),rgba(188,255,95,0.03))] px-8 py-8">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="rounded-full bg-white/8 text-white/80">
            Overview
          </Badge>
          <Badge variant="outline" className="rounded-full border-[#bcff5f]/20 bg-[#bcff5f]/8 text-[#dfffa8]">
            Live workspace
          </Badge>
        </div>
        <div className="max-w-3xl space-y-3">
          <CardTitle className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Your Knowledge Hub
          </CardTitle>
          <CardDescription className="text-base text-white/70 sm:text-lg">
            Keep everything in one place: notes, documents, and AI conversations in a high-contrast, distraction-free workspace.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-8 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">{card.label}</p>
              <p className="mt-3 text-4xl font-black tracking-tight text-[#bcff5f]">{card.value}</p>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "New Note", href: "/dashboard/notes", icon: FileText, description: "Create a note" },
            { title: "Upload", href: "/dashboard/documents", icon: Upload, description: "Add documents" },
            { title: "Chat", href: "/dashboard/chat", icon: MessageSquare, description: "Talk to Ether" },
            { title: "Search", href: "/dashboard/search", icon: Search, description: "Find anything" },
          ].map((action) => {
            const Icon = action.icon
            return (
              <a key={action.title} href={action.href} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#bcff5f]/25 hover:bg-white/[0.06]">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-[#c0c1ff] transition group-hover:bg-[#bcff5f]/12 group-hover:text-[#dfffa8]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-white/30 transition group-hover:text-[#c0c1ff]" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-white">{action.title}</h3>
                <p className="mt-1 text-sm text-white/60">{action.description}</p>
              </a>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
