"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  LayoutDashboard,
  Database,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  HelpCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui";

const iconMap: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard className="h-4 w-4" />,
  database: <Database className="h-4 w-4" />,
  description: <FileText className="h-4 w-4" />,
  smart_toy: <MessageSquare className="h-4 w-4" />,
  monitoring: <BarChart3 className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
  help: <HelpCircle className="h-4 w-4" />,
};

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/dashboard/knowledge-graph", label: "Knowledge Base", icon: "database" },
  { href: "/dashboard/documents", label: "Documents", icon: "description" },
  { href: "/dashboard/notes", label: "Notes", icon: "description" },
  { href: "/dashboard/chat", label: "Chat Assistant", icon: "smart_toy" },
  { href: "/dashboard/search", label: "Analytics", icon: "monitoring" },
];

const secondaryNavItems = [
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
  { href: "/dashboard/support", label: "Support", icon: "help" },
];

interface NavItemProps {
  item: { href: string; label: string; icon: string };
  isActive: boolean;
}

function NavItem({ item, isActive }: NavItemProps) {
  return (
    <Link
      href={item.href}
      className={`group flex items-center gap-2 border px-3 py-2 text-sm transition-colors ${
        isActive
          ? "border-border bg-accent text-foreground"
          : "border-transparent text-muted-foreground hover:border-border hover:bg-muted"
      }`}
    >
      <span className="text-muted-foreground">{iconMap[item.icon] || iconMap.dashboard}</span>
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-full w-64 border-r border-border bg-background lg:flex lg:flex-col">
      <div className="border-b border-border p-5">
        <p className="text-xs text-muted-foreground">Personal Knowledge Assistant</p>
        <h1 className="mt-1 text-base font-bold text-foreground">Workspace UI</h1>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          Notes, documents, chats, and graph relationships in one workspace.
        </p>
      </div>

      <div className="p-4">
        <Button className="mb-4 w-full justify-center" variant="default">
          <Plus className="h-4 w-4" />
          New Entry
        </Button>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return <NavItem key={item.href} item={item} isActive={isActive} />;
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-border p-4">
        <nav className="space-y-1">
          {secondaryNavItems.map((item) => {
            const isActive = pathname === item.href;
            return <NavItem key={item.href} item={item} isActive={isActive} />;
          })}
        </nav>

        <div className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
          <p className="truncate">{user?.full_name ?? "User"}</p>
          <p className="truncate">{user?.email ?? "No email"}</p>
        </div>
      </div>
    </aside>
  );
}
