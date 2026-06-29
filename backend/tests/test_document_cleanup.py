from pathlib import Path
from tempfile import TemporaryDirectory
from unittest import TestCase

from app.services.document_service import _remove_uploaded_file


class DocumentCleanupTests(TestCase):
    def test_remove_uploaded_file_deletes_saved_upload(self) -> None:
        with TemporaryDirectory() as temporary_directory:
            upload = Path(temporary_directory) / "broken.pdf"
            upload.write_bytes(b"not a pdf")

            _remove_uploaded_file(str(upload))

            self.assertFalse(upload.exists())
