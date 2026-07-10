from typing import Any

import pytest
from pydantic import ValidationError

from app.core.config import Settings


def test_mailpit_defaults_are_valid() -> None:
    configured = Settings(
        SECRET_KEY="test-secret",
        SMTP_HOST="mailpit",
        SMTP_PORT=1025,
        SMTP_TLS=False,
        EMAILS_FROM_EMAIL="no-reply@example.com",
    )

    assert configured.emails_enabled is True


@pytest.mark.parametrize(
    ("field", "placeholder"),
    [
        ("SECRET_KEY", "change-me-in-production"),
        ("POSTGRES_PASSWORD", "postgres"),
        ("FIRST_SUPERUSER_PASSWORD", "changethis"),
    ],
)
def test_deployed_settings_reject_known_placeholder_secrets(field: str, placeholder: str) -> None:
    values: dict[str, Any] = {
        "ENVIRONMENT": "production",
        "SECRET_KEY": "a-secure-secret-key-that-is-long-enough",
        "POSTGRES_PASSWORD": "a-secure-database-password",
        "FIRST_SUPERUSER_PASSWORD": "a-secure-administrator-password",
        "DATABASE_SSL_MODE": "require",
        "SMTP_HOST": "smtp.example.com",
        "EMAILS_FROM_EMAIL": "no-reply@example.com",
        field: placeholder,
    }

    with pytest.raises(ValidationError, match=field):
        Settings(**values)
