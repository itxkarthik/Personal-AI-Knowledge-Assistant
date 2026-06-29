from unittest import TestCase

from app.api.routes.user import _parse_chat_models


class UserAISettingsTests(TestCase):
    def test_model_options_exclude_the_embedding_model(self) -> None:
        payload = {
            "models": [
                {"name": "nomic-embed-text:latest", "size": 274},
                {"name": "llama3.2:1b", "size": 1300},
                {"name": "gemma3:1b", "size": 815},
            ]
        }

        models = _parse_chat_models(payload, "nomic-embed-text")

        self.assertEqual([model.name for model in models], ["gemma3:1b", "llama3.2:1b"])
