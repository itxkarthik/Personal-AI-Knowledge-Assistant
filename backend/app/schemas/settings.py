from datetime import datetime

from pydantic import BaseModel, Field


class OllamaModelOption(BaseModel):
    name: str
    size: int = 0
    modified_at: datetime | None = None


class UserAISettingsResponse(BaseModel):
    llm_model: str
    embedding_model: str
    ollama_available: bool
    available_models: list[OllamaModelOption] = Field(default_factory=list)


class UserAISettingsUpdate(BaseModel):
    llm_model: str = Field(min_length=1, max_length=100)
