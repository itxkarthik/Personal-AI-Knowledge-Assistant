"use client";

import { ArrowUpRight, FileText, MessageSquare, Search, Upload } from "lucide-react";
import { useState } from "react";

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Separator } from "@/components/ui";

export function OverviewHero() {
  const cards = [
    { label: "Total Notes", value: 0 },
    { label: "Total Documents", value: 0 },
    { label: "Quick Actions", value: 5 },
  ];

  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-magenta-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <Card className="relative overflow-hidden border-cyan-500/30 bg-gradient-to-br from-[#1a1f3a]/80 via-[#0a0e27]/50 to-[#1a1f3a]/60 shadow-2xl">
        {/* Animated glow line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        
        <CardHeader className="gap-4 border-b border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-magenta-500/5 px-8 py-8 relative">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 neon-glow">
              Overview
            </Badge>
            <Badge variant="outline" className="rounded-full border-magenta-500/30 bg-magenta-500/10 text-magenta-300" style={{ textShadow: '0 0 8px rgba(255, 0, 255, 0.3)' }}>
              Live workspace
            </Badge>
          </div>
          <div className="max-w-3xl space-y-3">
            <CardTitle className="text-4xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-magenta-400 to-cyan-400 bg-clip-text text-transparent sm:text-5xl" style={{ animation: 'neon-flicker 6s ease-in-out infinite' }}>
              Your Knowledge Hub
            </CardTitle>
            <CardDescription className="text-base text-cyan-200/70 sm:text-lg">
              Keep everything in one place: notes, documents, and AI conversations in a high-contrast, distraction-free workspace.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 py-8 relative">
          <div className="grid gap-4 sm:grid-cols-3">
            {cards.map((card, idx) => (
              <div 
                key={card.label} 
                className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all duration-300 cursor-pointer group"
                style={{
                  animation: `float-up ${3 + idx * 0.5}s ease-in-out infinite`,
                  boxShadow: '0 0 15px rgba(0, 255, 255, 0.1)'
                }}
              >
                <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-400/60 group-hover:text-cyan-400/80">{card.label}</p>
                <p className="mt-3 text-4xl font-black tracking-tight text-cyan-400 group-hover:text-cyan-300" style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.4)' }}>{card.value}</p>
              </div>
            ))}
          </div>

          <Separator className="my-8 bg-cyan-500/15" />

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "New Note", href: "/dashboard/notes", icon: FileText, description: "Create a note", color: "cyan" },
              { title: "Upload", href: "/dashboard/documents", icon: Upload, description: "Add documents", color: "magenta" },
              { title: "Chat", href: "/dashboard/chat", icon: MessageSquare, description: "Talk to Ether", color: "lime" },
              { title: "Search", href: "/dashboard/search", icon: Search, description: "Find anything", color: "yellow" },
            ].map((action) => {
              const Icon = action.icon;
              const colorMap = {
                cyan: { border: 'border-cyan-500/20', bg: 'bg-cyan-500/5', text: 'text-cyan-400', hover: 'hover:border-cyan-500/50 hover:bg-cyan-500/15', shadow: 'rgba(0, 255, 255, 0.2)' },
                magenta: { border: 'border-magenta-500/20', bg: 'bg-magenta-500/5', text: 'text-magenta-400', hover: 'hover:border-magenta-500/50 hover:bg-magenta-500/15', shadow: 'rgba(255, 0, 255, 0.2)' },
                lime: { border: 'border-lime-500/20', bg: 'bg-lime-500/5', text: 'text-lime-400', hover: 'hover:border-lime-500/50 hover:bg-lime-500/15', shadow: 'rgba(0, 255, 0, 0.2)' },
                yellow: { border: 'border-yellow-500/20', bg: 'bg-yellow-500/5', text: 'text-yellow-400', hover: 'hover:border-yellow-500/50 hover:bg-yellow-500/15', shadow: 'rgba(255, 255, 0, 0.2)' },
              };
              const colors = colorMap[action.color as keyof typeof colorMap];
              
              return (
                <a
                  key={action.title}
                  href={action.href}
                  onMouseEnter={() => setHoveredAction(action.title)}
                  onMouseLeave={() => setHoveredAction(null)}
                  className={`group rounded-2xl border ${colors.border} ${colors.bg} p-5 transition-all duration-300 ${colors.hover} relative overflow-hidden`}
                  style={{ boxShadow: `0 0 20px ${colors.shadow}` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent opacity-0 group-hover:opacity-30 transition-opacity" />
                  
                  <div className="relative flex items-start justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-${action.color}-500/20 to-${action.color}-500/10 ${colors.text} transition-all duration-300`} style={{ boxShadow: `0 0 12px ${colors.shadow}` }}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className={`h-5 w-5 ${colors.text}/50 transition-all duration-300 group-hover:${colors.text} group-hover:translate-x-1 group-hover:-translate-y-1`} />
                  </div>
                  <h3 className={`mt-5 text-base font-semibold ${colors.text}`}>{action.title}</h3>
                  <p className={`mt-1 text-sm ${colors.text}/60`}>{action.description}</p>
                </a>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
