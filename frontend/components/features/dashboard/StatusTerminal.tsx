"use client";

import { useNetworkStatus } from "@/lib/hooks/useNetworkStatus";
import { requestQueue } from "@/lib/utils/requestQueue";
import { useState, useEffect } from "react";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export function StatusTerminal() {
  const { isOnline } = useNetworkStatus();
  const [queueCount, setQueueCount] = useState(() => requestQueue.size());
  const [latency, setLatency] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setQueueCount(requestQueue.size()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const start = performance.now();
    fetch("/health/live", { method: "GET", cache: "no-store" })
      .then(() => setLatency(Math.round(performance.now() - start)))
      .catch(() => setLatency(-1));
  }, []);

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border">
        <CardTitle className="text-sm">Workspace status</CardTitle>
        <Badge variant={isOnline ? "secondary" : "destructive"}>
          {isOnline ? "ONLINE" : "OFFLINE"}
        </Badge>
      </CardHeader>
      <CardContent className="pt-4 text-sm text-muted-foreground">
        <p>latency: {latency}ms</p>
        <p>pending sync: {queueCount}</p>
        <p>endpoint: /health/live</p>
      </CardContent>
    </Card>
  );
}
