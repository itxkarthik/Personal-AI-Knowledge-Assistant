"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils/cn";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem("pka-sidebar-expanded");
    if (stored) {
      setIsSidebarExpanded(stored === "true");
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarExpanded((current) => {
      const next = !current;
      window.localStorage.setItem("pka-sidebar-expanded", String(next));
      return next;
    });
  };

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background text-foreground">
        <div className="border border-border bg-muted px-4 py-3 text-center">
          <p className="text-sm text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-[100dvh] w-full bg-background text-foreground">
        <Sidebar expanded={isSidebarExpanded} onToggle={toggleSidebar} />
        <Header sidebarExpanded={isSidebarExpanded} />
        <main
          className={cn(
            "px-4 pb-8 pt-20 transition-[margin] duration-200 lg:px-6",
            isSidebarExpanded ? "lg:ml-64" : "lg:ml-16"
          )}
        >
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
}
