import re

WIKI_LINK_PATTERN = re.compile(r"\[\[([^\[\]\n]+?)\]\]")


def clean_text(content: str) -> str:
    normalized = content.replace("\r\n", "\n").replace("\r", "\n")
    normalized = re.sub(r"[ \t]+", " ", normalized)
    normalized = re.sub(r"\n{3,}", "\n\n", normalized)
    return normalized.strip()


def normalize_markdown(content: str) -> str:
    """Normalize line endings without changing meaningful Markdown indentation."""
    normalized = content.replace("\r\n", "\n").replace("\r", "\n")
    normalized = "\n".join(line.rstrip() for line in normalized.split("\n"))
    normalized = re.sub(r"\n{4,}", "\n\n\n", normalized)
    return normalized.strip()


def markdown_to_plain_text(content: str) -> str:
    """Create readable preview text from the Markdown constructs used by notes."""
    text = normalize_markdown(content)
    text = WIKI_LINK_PATTERN.sub(lambda match: _wiki_link_label(match.group(1)), text)
    text = re.sub(r"```[\s\S]*?```", " ", text)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"!\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"^\s{0,3}(?:#{1,6}|>|[-+*]|\d+\.)\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"[*_~]", "", text)
    return clean_text(text)


def extract_wiki_link_titles(content: str) -> list[str]:
    """Return unique Obsidian-style wiki-link targets in source order."""
    titles: list[str] = []
    seen: set[str] = set()

    for match in WIKI_LINK_PATTERN.finditer(content):
        target = match.group(1).split("|", 1)[0].split("#", 1)[0].strip()
        key = target.casefold()
        if target and key not in seen:
            seen.add(key)
            titles.append(target)

    return titles


def _wiki_link_label(value: str) -> str:
    target, *alias = value.split("|", 1)
    return alias[0].strip() if alias else target.split("#", 1)[0].strip()


def create_content_preview(content: str, max_length: int = 500) -> str:
    text = clean_text(content)
    if len(text) <= max_length:
        return text
    return text[: max_length - 3].rstrip() + "..."


def split_text_into_chunks(content: str, chunk_size: int = 1000, overlap: int = 200) -> list[str]:
    if chunk_size <= 0:
        raise ValueError("chunk_size must be greater than 0")
    if overlap < 0:
        raise ValueError("overlap must be greater than or equal to 0")
    if overlap >= chunk_size:
        raise ValueError("overlap must be less than chunk_size")

    text = clean_text(content)
    if not text:
        return []

    chunks: list[str] = []
    step = chunk_size - overlap
    start = 0
    while start < len(text):
        chunk = text[start : start + chunk_size].strip()
        if chunk:
            chunks.append(chunk)
        start += step
    return chunks
