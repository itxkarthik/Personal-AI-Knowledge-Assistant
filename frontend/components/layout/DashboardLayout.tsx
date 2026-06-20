"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { useAuthStore } from "@/store/authStore";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useAuthStore();

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
        <Sidebar />
        <Header />
        <main className="px-4 pb-12 pt-20 lg:ml-64 lg:px-8">
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
}
