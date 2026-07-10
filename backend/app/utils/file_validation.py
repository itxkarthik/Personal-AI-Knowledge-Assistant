from zipfile import BadZipFile, ZipFile

import magic
from fastapi import HTTPException, UploadFile

from app.core.config import settings

# Map file extensions to expected MIME types (magic bytes)
EXTENSION_MIME_MAP: dict[str, list[str]] = {
    ".pdf": ["application/pdf"],
    ".docx": [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/zip",  # .docx is a zip archive
    ],
    ".md": ["text/plain", "text/x-markdown", "text/markdown"],
    ".txt": ["text/plain"],
}


async def validate_upload_file(file: UploadFile) -> None:
    """
    Validate an uploaded file by:
    1. Checking extension is allowed
    2. Checking file size
    3. Validating magic bytes match the declared extension
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename is required")

    # 1. Extension check
    ext = _get_extension(file.filename)
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' not allowed. Allowed: {settings.ALLOWED_EXTENSIONS}",
        )

    if file.size is not None and file.size > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE // (1024 * 1024)} MB",
        )

    # Read only a bounded prefix for signature validation.
    content = await file.read(2048)
    await file.seek(0)  # Reset for downstream consumers

    # 3. Magic bytes validation
    detected_mime = magic.from_buffer(content[:2048], mime=True)
    allowed_mimes = EXTENSION_MIME_MAP.get(ext, [])

    if allowed_mimes and detected_mime not in allowed_mimes:
        raise HTTPException(
            status_code=400,
            detail=f"File content does not match extension '{ext}'. " f"Detected: {detected_mime}",
        )

    if ext == ".docx":
        _validate_docx_archive(file)
        await file.seek(0)


def _validate_docx_archive(file: UploadFile) -> None:
    try:
        with ZipFile(file.file) as archive:
            entries = archive.infolist()
            if len(entries) > settings.MAX_DOCX_ENTRIES:
                raise HTTPException(status_code=400, detail="DOCX archive contains too many files")

            total_size = 0
            for entry in entries:
                total_size += entry.file_size
                if entry.file_size > settings.MAX_DOCX_ENTRY_SIZE:
                    raise HTTPException(status_code=400, detail="DOCX archive entry is too large")
                if total_size > settings.MAX_DOCX_UNCOMPRESSED_SIZE:
                    raise HTTPException(
                        status_code=400, detail="DOCX expanded content is too large"
                    )
                if entry.file_size and (
                    entry.compress_size == 0
                    or entry.file_size / entry.compress_size > settings.MAX_DOCX_COMPRESSION_RATIO
                ):
                    raise HTTPException(
                        status_code=400, detail="Highly compressed DOCX is not allowed"
                    )
    except BadZipFile as exc:
        raise HTTPException(status_code=400, detail="Invalid DOCX archive") from exc


def _get_extension(filename: str) -> str:
    """Extract the lowercase file extension."""
    dot_index = filename.rfind(".")
    if dot_index == -1:
        return ""
    return filename[dot_index:].lower()
