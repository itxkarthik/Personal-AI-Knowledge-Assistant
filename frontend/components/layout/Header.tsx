"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Search, Bell, Settings, User, LogOut } from "lucide-react";
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Separator,
} from "@/components/ui";

export function Header() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <header className="fixed left-64 right-0 top-0 z-30 border-b border-white/10 bg-[#111111]/80 backdrop-blur-2xl">
      <div className="flex h-16 items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <div className="relative w-[22rem] max-w-[42vw]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <Input
              className="h-11 rounded-full border-white/10 bg-white/5 pl-10 text-sm text-white placeholder:text-white/35 focus-visible:ring-[#bcff5f]/30"
              placeholder="Search knowledge graph..."
              type="text"
            />
          </div>
          <div className="hidden items-center gap-2 xl:flex">
            <Badge variant="secondary" className="rounded-full bg-white/8 px-3 py-1 text-white/80">
              Systems
            </Badge>
            <Badge variant="outline" className="rounded-full border-white/10 bg-transparent px-3 py-1 text-white/70">
              Logs
            </Badge>
            <Badge variant="outline" className="rounded-full border-white/10 bg-transparent px-3 py-1 text-white/70">
              Terminal
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full text-white/70 hover:bg-white/8 hover:text-[#bcff5f]">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-white/70 hover:bg-white/8 hover:text-[#bcff5f]">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl border-white/10 bg-[#171717] p-2 text-white shadow-2xl">
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings")}
                className="cursor-pointer rounded-xl px-3 py-2 text-sm text-white/85 hover:bg-white/8"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-white/10" />
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
                className="cursor-pointer rounded-xl px-3 py-2 text-sm text-[#ffb4ab] hover:bg-[#ffb4ab]/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator className="bg-white/10" />
    </header>
  );
}
