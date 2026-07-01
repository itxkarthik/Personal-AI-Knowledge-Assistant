"""Common schemas for API requests and responses."""

from pydantic import BaseModel, Field


class PaginationParams(BaseModel):
    """Pagination parameters for list endpoints."""

    skip: int = Field(
        default=0,
        ge=0,
        description="Number of records to skip",
    )
    limit: int = Field(
        default=20,
        ge=1,
        le=100,
        description="Maximum number of records to return (max 100)",
    )
    sort_by: str | None = Field(
        default=None,
        description="Field to sort by (e.g., 'created_at', 'updated_at', 'title')",
    )
    sort_order: str = Field(
        default="desc",
        pattern="^(asc|desc)$",
        description="Sort order: 'asc' or 'desc'",
    )


class PaginatedResponse[T](BaseModel):
    """Generic paginated response wrapper."""

    data: list[T] = Field(description="List of results")
    count: int = Field(description="Total number of records (unfiltered)")
    has_more: bool = Field(description="Whether there are more records beyond current page")
    page_size: int = Field(description="Number of records in this page")


class PaginationMeta(BaseModel):
    """Pagination metadata for responses."""

    total: int = Field(description="Total number of records")
    skip: int = Field(description="Number of records skipped")
    limit: int = Field(description="Maximum records returned")
    has_more: bool = Field(description="Whether more records exist")
