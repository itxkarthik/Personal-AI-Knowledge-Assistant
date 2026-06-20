import { LifeBuoy, Mail, MessageSquareText, ShieldAlert } from "lucide-react";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

const supportItems = [
  {
    title: "Email support",
    description: "For account, sync, and setup help.",
    icon: Mail,
    action: "support@example.com",
    href: "mailto:support@example.com",
  },
  {
    title: "Report a bug",
    description: "Send a reproducible issue with screenshots or logs.",
    icon: ShieldAlert,
    action: "Open issue",
    href: "mailto:support@example.com?subject=Bug%20report",
  },
  {
    title: "Usage questions",
    description: "Ask how to organize notes, documents, or graph data.",
    icon: MessageSquareText,
    action: "Ask a question",
    href: "mailto:support@example.com?subject=Usage%20question",
  },
];

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <Badge variant="outline">Support</Badge>
        <h1 className="text-2xl font-bold text-foreground">Help and contact</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Use this page for setup issues, bug reports, and workflow questions.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border">
            <CardTitle>Contact options</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 py-5">
            {supportItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start justify-between gap-4 border border-border bg-muted p-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="shrink-0">
                    <a href={item.href}>{item.action}</a>
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border">
            <CardTitle>What to include</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 py-5 text-sm text-muted-foreground">
            <div className="flex items-center gap-3 border border-border bg-muted px-3 py-3">
              <LifeBuoy className="h-4 w-4 text-muted-foreground" />
              <span>What you were trying to do.</span>
            </div>
            <div className="flex items-center gap-3 border border-border bg-muted px-3 py-3">
              <LifeBuoy className="h-4 w-4 text-muted-foreground" />
              <span>What happened instead.</span>
            </div>
            <div className="flex items-center gap-3 border border-border bg-muted px-3 py-3">
              <LifeBuoy className="h-4 w-4 text-muted-foreground" />
              <span>Any error text, screenshots, or session details.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
