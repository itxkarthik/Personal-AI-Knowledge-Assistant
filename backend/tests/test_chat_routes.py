from datetime import UTC, datetime
from unittest import TestCase

from app.api.routes.chat import _to_chat_message_response
from app.models.chat import ChatMessages, ChatRole


class ChatRouteSerializationTests(TestCase):
    def test_serializes_enum_role_as_api_value(self) -> None:
        now = datetime.now(UTC)
        message = ChatMessages(
            id=1,
            session_id=2,
            role=ChatRole.user,
            content="Hello",
            created_at=now,
            updated_at=now,
        )

        response = _to_chat_message_response(message)

        self.assertEqual(response.role, "user")
