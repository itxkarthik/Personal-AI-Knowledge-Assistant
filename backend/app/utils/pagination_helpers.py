"""Pagination utilities and helpers."""

from typing import Any


def calculate_pagination_metadata(
    total: int,
    skip: int,
    limit: int,
) -> dict[str, Any]:
    """
    Calculate pagination metadata for response.

    Args:
        total: Total number of records
        skip: Number of records skipped
        limit: Records per page

    Returns:
        Dictionary with pagination metadata
    """
    has_more = (skip + limit) < total
    page_size = min(limit, total - skip) if skip < total else 0

    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": has_more,
        "page_size": page_size,
        "page_number": (skip // limit) + 1 if limit > 0 else 1,
        "total_pages": ((total + limit - 1) // limit if limit > 0 else 1),  # Ceiling division
    }


def create_link_headers(
    base_url: str,
    total: int,
    skip: int,
    limit: int,
    params: dict[str, Any] | None = None,
) -> str:
    """
    Create RFC 5988 Link headers for pagination.

    Args:
        base_url: Base URL for links (e.g., '/api/v1/notes')
        total: Total number of records
        skip: Current skip value
        limit: Current limit value
        params: Additional query parameters to include

    Returns:
        Link header value (RFC 5988)
    """
    links = []

    # Build query string from params
    query_params = params or {}
    query_params["limit"] = limit

    def build_url(offset: int) -> str:
        """Build URL with query parameters."""
        query_params["skip"] = offset
        query_str = "&".join(f"{k}={v}" for k, v in query_params.items())
        return f"{base_url}?{query_str}"

    # First link
    links.append(f'<{build_url(0)}>; rel="first"')

    # Previous link
    if skip > 0:
        prev_skip = max(0, skip - limit)
        links.append(f'<{build_url(prev_skip)}>; rel="prev"')

    # Next link
    if (skip + limit) < total:
        next_skip = skip + limit
        links.append(f'<{build_url(next_skip)}>; rel="next"')

    # Last link
    if total > 0:
        last_skip = ((total - 1) // limit) * limit if limit > 0 else 0
        if last_skip != skip:  # Only add if different from current
            links.append(f'<{build_url(last_skip)}>; rel="last"')

    return ", ".join(links)


def sort_results(
    results: list[Any],
    sort_by: str | None = None,
    sort_order: str = "desc",
    default_field: str = "created_at",
) -> list[Any]:
    """
    Sort results by field (fallback for in-memory sorting).

    Note: Prefer database-level sorting when possible.

    Args:
        results: List of results (dictionaries or objects)
        sort_by: Field to sort by
        sort_order: 'asc' or 'desc'
        default_field: Default field if sort_by not specified

    Returns:
        Sorted list
    """
    sort_field = sort_by or default_field

    # Handle both dict and object attribute access
    def get_value(item: Any) -> Any:
        if isinstance(item, dict):
            return item.get(sort_field)
        else:
            return getattr(item, sort_field, None)

    reverse = sort_order.lower() == "desc"

    try:
        return sorted(results, key=get_value, reverse=reverse)
    except (AttributeError, KeyError):
        # Field doesn't exist, return unsorted
        return results
