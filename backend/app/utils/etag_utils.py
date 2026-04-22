"""ETag and caching utilities for HTTP responses."""

import hashlib
import json
from datetime import datetime
from typing import Any


def generate_etag(data: Any) -> str:
    """
    Generate ETag from response data using SHA256 hash.

    Args:
        data: Response data (dict, list, or serializable object)

    Returns:
        ETag string (enclosed in quotes)
    """
    # Convert data to JSON string for hashing
    if isinstance(data, (dict, list)):
        json_str = json.dumps(data, sort_keys=True, default=str)
    else:
        json_str = str(data)

    # Generate SHA256 hash
    hash_value = hashlib.sha256(json_str.encode()).hexdigest()

    # Return ETag format (RFC 7232)
    return f'"{hash_value}"'


def get_cache_duration(endpoint_type: str) -> tuple[str, int]:
    """
    Get cache control header and duration for endpoint type.

    Args:
        endpoint_type: One of 'list', 'detail', 'search', 'mutable'

    Returns:
        Tuple of (Cache-Control header value, max_age in seconds)
    """
    cache_policies = {
        "list": ("public, max-age=300", 300),  # 5 minutes
        "detail": ("public, max-age=300", 300),  # 5 minutes
        "search": ("public, max-age=60", 60),  # 1 minute (search results change frequently)
        "mutable": ("no-cache, no-store, must-revalidate", 0),  # Don't cache
    }

    return cache_policies.get(endpoint_type, ("public, max-age=300", 300))


def get_last_modified(data: dict) -> str:
    """
    Extract Last-Modified date from response data (from updated_at field).

    Args:
        data: Response dictionary

    Returns:
        RFC 7231 formatted date string
    """
    if isinstance(data, dict) and "updated_at" in data:
        updated_at = data["updated_at"]
        if isinstance(updated_at, str):
            # Parse ISO format and convert to RFC 7231
            dt = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))
        else:
            dt = updated_at

        if isinstance(dt, datetime):
            # Format as RFC 7231 (HTTP-date)
            return dt.strftime("%a, %d %b %Y %H:%M:%S GMT")

    # Default: current time
    return datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S GMT")


def should_cache_request(method: str, status_code: int) -> bool:
    """
    Determine if a request/response should be cached.

    Args:
        method: HTTP method
        status_code: Response status code

    Returns:
        True if cacheable, False otherwise
    """
    # Only cache GET requests with 2xx status codes
    if method != "GET":
        return False

    if 200 <= status_code < 300:
        return True

    # Cache 304 Not Modified
    if status_code == 304:
        return True

    return False
