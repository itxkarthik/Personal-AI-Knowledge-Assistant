from app.core.migrations import SchemaState, classify_schema

CORE_TABLES = {
    "users",
    "documents",
    "notes",
    "chat_sessions",
    "chat_messages",
    "refresh_tokens",
}


def test_empty_database_is_fresh() -> None:
    assert classify_schema(set()) is SchemaState.FRESH


def test_known_unversioned_database_is_legacy() -> None:
    assert classify_schema(CORE_TABLES) is SchemaState.LEGACY


def test_alembic_database_is_versioned() -> None:
    assert classify_schema({"alembic_version", *CORE_TABLES}) is SchemaState.VERSIONED


def test_partial_database_is_rejected() -> None:
    assert classify_schema({"users", "notes"}) is SchemaState.UNKNOWN
