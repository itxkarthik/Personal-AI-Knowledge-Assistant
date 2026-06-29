from unittest import TestCase

from app.ai.document_summary import build_summary_input


class DocumentSummaryInputTests(TestCase):
    def test_short_content_is_preserved(self) -> None:
        content = "Atlas is the launch project."

        self.assertEqual(build_summary_input(content), content)

    def test_long_content_samples_beginning_middle_and_end(self) -> None:
        content = "A" * 1000 + "B" * 1000 + "C" * 1000

        result = build_summary_input(content, max_chars=900)

        self.assertIn("[Beginning]", result)
        self.assertIn("[Middle]", result)
        self.assertIn("[End]", result)
        self.assertIn("A" * 100, result)
        self.assertIn("B" * 100, result)
        self.assertIn("C" * 100, result)
