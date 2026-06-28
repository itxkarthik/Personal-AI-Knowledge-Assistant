from app.utils.text_processing import (
    extract_wiki_link_titles,
    markdown_to_plain_text,
    normalize_markdown,
)


def test_extract_wiki_link_titles_supports_aliases_and_headings() -> None:
    content = "See [[Research Lab]], [[Meeting#Decisions|decision log]], and [[research lab]]."

    assert extract_wiki_link_titles(content) == ["Research Lab", "Meeting"]


def test_normalize_markdown_preserves_indentation() -> None:
    content = "# Heading\r\n\r\n    indented code\r\n\r\n\r\n\r\nText  with  spaces"

    assert normalize_markdown(content) == ("# Heading\n\n    indented code\n\n\nText  with  spaces")


def test_markdown_to_plain_text_uses_wiki_link_alias() -> None:
    content = "## Topic\n\nRead [[Research Lab|the research note]] and **compare** results."

    assert markdown_to_plain_text(content) == (
        "Topic\n\nRead the research note and compare results."
    )
