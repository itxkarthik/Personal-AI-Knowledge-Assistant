import { apiClient } from "@/lib/api/client";
import type { UserAISettings } from "@/types";


export async function getUserAISettings(): Promise<UserAISettings> {
  const response = await apiClient.get<UserAISettings>("/users/me/ai-settings");
  return response.data;
}


export async function updateUserAISettings(llmModel: string): Promise<UserAISettings> {
  const response = await apiClient.patch<UserAISettings>("/users/me/ai-settings", {
    llm_model: llmModel,
  });
  return response.data;
}
