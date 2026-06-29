import asyncio
from unittest import TestCase

from app.ai.http_client import create_embedding_client, create_llm_client


class AIHTTPClientTests(TestCase):
    def test_factories_do_not_share_clients_across_event_loops(self) -> None:
        first = create_embedding_client()
        second = create_embedding_client()
        llm = create_llm_client()

        self.assertIsNot(first, second)
        self.assertIsNot(first, llm)

        asyncio.run(first.aclose())
        asyncio.run(second.aclose())
        asyncio.run(llm.aclose())
