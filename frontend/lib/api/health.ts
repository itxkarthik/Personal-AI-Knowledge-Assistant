export interface AIReadiness {
  status: "ready" | "not_ready";
  require_ollama: boolean;
  dependencies: {
    database: "up" | "down";
    ollama: "up" | "down";
  };
  ai: {
    chat_model: string;
    embedding_model: string;
    missing_models: string[];
  };
}

export async function getAIReadiness(): Promise<AIReadiness> {
  const response = await fetch("/health/ready", {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  const payload = (await response.json()) as AIReadiness;
  if (!response.ok && !payload.dependencies) {
    throw new Error("Unable to check AI readiness.");
  }

  return payload;
}
