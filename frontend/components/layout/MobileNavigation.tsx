"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Database,
  FileText,
  HelpCircle,
  Home,
  Menu,
  MessageSquare,
  NotebookPen,
  Plus,
  Search,
  Settings,
} from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils/cn";

const dockItems = [
  { href: "/dashboard", label: "Home", icon: Home, primary: false },
  { href: "/dashboard/notes", label: "Notes", icon: NotebookPen, primary: false },
  { href: "/dashboard/notes?new=1", label: "New", icon: Plus, primary: true },
  { href: "/dashboard/chat", label: "Chat", icon: MessageSquare, primary: false },
] as const;

const moreItems = [
  { href: "/dashboard/knowledge-graph", label: "Knowledge graph", icon: Database },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/search", label: "Search", icon: Search },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/support", label: "Support", icon: HelpCircle },
] as const;

function isRouteActive(pathname: string, href: string) {
  const route = href.split("?")[0];
  return pathname === route || (route !== "/dashboard" && pathname.startsWith(route));
}

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile primary navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="grid h-16 grid-cols-5 px-2">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const active = !item.primary && isRouteActive(pathname, item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-1 text-[10px] transition-colors active:translate-y-px",
                item.primary
                  ? "mx-auto my-2 h-12 w-12 rounded-sm bg-foreground text-background"
                  : active
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="max-w-full truncate px-1 leading-none">{item.label}</span>
            </Link>
          );
        })}

        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-1 text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:translate-y-px",
                moreItems.some((item) => isRouteActive(pathname, item.href)) && "bg-accent text-foreground"
              )}
              aria-label="Open full navigation"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
              <span className="leading-none">More</span>
            </button>
          </SheetTrigger>

          <SheetContent side="bottom" className="max-h-[80dvh] border-border pb-[env(safe-area-inset-bottom)]">
            <SheetHeader className="border-b border-border px-5 py-4">
              <SheetTitle>Workspace</SheetTitle>
              <SheetDescription className="sr-only">Open another section of your workspace.</SheetDescription>
            </SheetHeader>

            <div className="grid gap-1 overflow-y-auto p-3">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const active = isRouteActive(pathname, item.href);

                return (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-12 items-center gap-3 border border-transparent px-3 text-sm transition-colors active:translate-y-px",
                        active
                          ? "border-border bg-accent text-foreground"
                          : "text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  </SheetClose>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
