"""Database query optimization utilities."""

from typing import Any

from sqlalchemy import func
from sqlmodel import Session, select


def get_total_count(session: Session, statement: Any) -> int:
    """
    Get total count of results for a query efficiently using COUNT(*).

    Instead of fetching all results and using len(), this uses SQL COUNT
    which is much faster for large datasets.

    Args:
        session: Database session
        statement: SQLAlchemy select statement

    Returns:
        Total count of results
    """
    # Create a count statement without LIMIT/OFFSET
    count_statement = (
        select(func.count())
        .select_from(statement.froms[0])
        .where(*statement.whereclause.clauses if statement.whereclause is not None else [])
    )

    return session.exec(count_statement).one() or 0


def paginate_query(
    session: Session,
    statement: Any,
    skip: int = 0,
    limit: int = 20,
) -> tuple[list[Any], int]:
    """
    Execute paginated query with efficient count.

    Args:
        session: Database session
        statement: SQLAlchemy select statement
        skip: Number of records to skip
        limit: Maximum records to return

    Returns:
        Tuple of (results, total_count)
    """
    # Get total count (efficient with SQL COUNT)
    count_statement = select(func.count()).select_from(statement.froms[0])

    # Copy WHERE clauses to count statement
    if statement.whereclause is not None:
        count_statement = count_statement.where(statement.whereclause)

    total_count = session.exec(count_statement).one() or 0

    # Apply pagination to original statement
    paginated_statement = statement.offset(skip).limit(limit)

    # Get results
    results = session.exec(paginated_statement).all()

    return results, total_count
