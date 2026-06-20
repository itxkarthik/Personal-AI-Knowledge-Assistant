"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/hooks/useAuth";
import { Bell, LogOut, Search, User, Settings, MoonStar, SunMedium } from "lucide-react";
import {
  Button,
  Input,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";

export function Header() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <header className="fixed left-0 right-0 top-0 z-20 border-b border-border bg-background/95 backdrop-blur-0 lg:left-64">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        <div className="relative min-w-0 flex-1 max-w-2xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search notes, documents, and chats"
            type="text"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="border-border bg-background"
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {mounted && currentTheme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          </Button>

          <Button variant="outline" size="icon" className="border-border bg-background">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="border-border bg-background">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  if (isLoggingOut) return;
                  setIsLoggingOut(true);
                  try {
                    await logout();
                    router.replace("/auth/login");
                  } finally {
                    setIsLoggingOut(false);
                  }
                }}
                variant="destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
