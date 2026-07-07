from __future__ import annotations

from enum import StrEnum
from pathlib import Path

from alembic import command
from alembic.config import Config
from sqlalchemy import Engine, inspect

from app.core.config import settings

BASELINE_REVISION = "0001_baseline"
CORE_TABLES = {
    "users",
    "documents",
    "notes",
    "chat_sessions",
    "chat_messages",
    "refresh_tokens",
}


class SchemaState(StrEnum):
    FRESH = "fresh"
    LEGACY = "legacy"
    VERSIONED = "versioned"
    UNKNOWN = "unknown"


def classify_schema(table_names: set[str]) -> SchemaState:
    if "alembic_version" in table_names:
        return SchemaState.VERSIONED
    if not table_names:
        return SchemaState.FRESH
    if CORE_TABLES.issubset(table_names):
        return SchemaState.LEGACY
    return SchemaState.UNKNOWN


def _alembic_config() -> Config:
    backend_root = Path(__file__).resolve().parents[2]
    config = Config(str(backend_root / "alembic.ini"))
    config.set_main_option("script_location", str(backend_root / "alembic"))
    config.set_main_option("sqlalchemy.url", settings.get_database_url().replace("%", "%%"))
    return config


def upgrade_database(engine: Engine) -> SchemaState:
    state = classify_schema(set(inspect(engine).get_table_names()))
    if state is SchemaState.UNKNOWN:
        raise RuntimeError(
            "Database schema is incomplete or unrecognized. Restore a backup or migrate it "
            "manually before starting the application."
        )

    config = _alembic_config()
    if state is SchemaState.LEGACY:
        command.stamp(config, BASELINE_REVISION)
    command.upgrade(config, "head")
    return state
