import asyncio
import logging
from collections.abc import Sequence
from datetime import datetime
from typing import Any

from fastapi import APIRouter, HTTPException, Query, status
from sqlmodel import col, select

from app.ai.embeddings import generate_embedding
from app.ai.rag import ensure_workspace_embeddings
from app.ai.vectorstore import ChatVectorSearchResult, PgVectorStore
from app.api.deps import CurrentUser, SessionDep
from app.models.document import Document
from app.models.note import Notes
from app.schemas.error import StandardErrorResponse
from app.schemas.search import SearchResponse, SearchResultItem
from app.utils.text_processing import create_content_preview

router = APIRouter(prefix="/search", tags=["search"])
logger = logging.getLogger(__name__)

SEMANTIC_SIMILARITY_THRESHOLD = 0.61
SUPPORTED_ENTITY_TYPES = {"document", "note", "chat"}


def _merge_result(
    results: dict[tuple[str, int], SearchResultItem], candidate: SearchResultItem
) -> None:
    key = (candidate.entity_type, candidate.id)
    existing = results.get(key)
    if existing is None:
        results[key] = candidate
        return

    if (candidate.score or 0) > (existing.score or 0):
        existing.score = candidate.score
        existing.snippet = candidate.snippet or existing.snippet


def _is_relevant_semantic_score(score: float) -> bool:
    return score >= SEMANTIC_SIMILARITY_THRESHOLD


def _chat_results_from_hits(
    hits: Sequence[ChatVectorSearchResult],
) -> list[SearchResultItem]:
    strongest_by_session: dict[int, ChatVectorSearchResult] = {}
    for hit in hits:
        if not _is_relevant_semantic_score(hit.score):
            continue
        current = strongest_by_session.get(hit.session_id)
        if current is None or hit.score > current.score:
            strongest_by_session[hit.session_id] = hit

    return [
        SearchResultItem(
            id=hit.session_id,
            entity_type="chat",
            title=hit.session_title or "Chat session",
            snippet=create_content_preview(hit.content, max_length=180),
            score=hit.score,
            created_at=hit.created_at,
            updated_at=hit.updated_at,
        )
        for hit in sorted(strongest_by_session.values(), key=lambda item: item.score, reverse=True)
    ]


@router.get(
    path="",
    response_model=SearchResponse,
    responses={
        400: {"model": StandardErrorResponse, "description": "Invalid query parameters"},
        401: {"model": StandardErrorResponse, "description": "Authentication required"},
        503: {"model": StandardErrorResponse, "description": "Semantic search unavailable"},
    },
)
def unified_search(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    query: str = Query(min_length=1),
    entity_types: str
    | None = Query(default=None, description="Comma-separated: document,note,chat"),
    folder_id: int | None = Query(default=None),
    date_from: datetime | None = Query(default=None),
    date_to: datetime | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
) -> Any:
    enabled_types = {
        item.strip().lower()
        for item in (entity_types.split(",") if entity_types else SUPPORTED_ENTITY_TYPES)
        if item.strip().lower() in SUPPORTED_ENTITY_TYPES
    }
    if not enabled_types:
        return SearchResponse(
            query=query,
            results=[],
            total=0,
            page=page,
            page_size=page_size,
            filters=None,
        )
    if current_user.id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user")

    try:
        query_embedding, embedding_model = asyncio.run(
            generate_embedding(session=session, user_id=current_user.id, text=query)
        )
        vector_store = PgVectorStore(session=session)
        vector_store.ensure_schema(embedding_dimensions=len(query_embedding))
        ensure_workspace_embeddings(
            session=session,
            vector_store=vector_store,
            user_id=current_user.id,
            embedding_model=embedding_model,
            include_documents="document" in enabled_types,
            include_notes="note" in enabled_types,
            include_chats="chat" in enabled_types,
        )
        session.commit()

        results: list[SearchResultItem] = []

        if "document" in enabled_types:
            document_hits = vector_store.similarity_search(
                user_id=current_user.id,
                query_embedding=query_embedding,
                top_k=100,
                similarity_threshold=SEMANTIC_SIMILARITY_THRESHOLD,
            )
            document_ids = sorted({hit.document_id for hit in document_hits})
            document_map: dict[int, Document] = {}
            if document_ids:
                statement = select(Document).where(
                    Document.user_id == current_user.id,
                    col(Document.is_deleted).is_(False),
                    col(Document.id).in_(document_ids),
                )
                if date_from is not None:
                    statement = statement.where(Document.created_at >= date_from)
                if date_to is not None:
                    statement = statement.where(Document.created_at <= date_to)
                document_map = {
                    document.id: document
                    for document in session.exec(statement).all()
                    if document.id is not None
                }
            for hit in document_hits:
                document = document_map.get(hit.document_id)
                if document is None or not _is_relevant_semantic_score(hit.score):
                    continue
                results.append(
                    SearchResultItem(
                        id=hit.document_id,
                        entity_type="document",
                        title=document.title,
                        snippet=create_content_preview(hit.content, max_length=180),
                        score=hit.score,
                        created_at=document.created_at,
                        updated_at=document.updated_at,
                    )
                )

        if "note" in enabled_types:
            note_hits = vector_store.note_similarity_search(
                user_id=current_user.id,
                query_embedding=query_embedding,
                top_k=100,
                similarity_threshold=SEMANTIC_SIMILARITY_THRESHOLD,
            )
            note_ids = sorted({hit.note_id for hit in note_hits})
            note_map: dict[int, Notes] = {}
            if note_ids:
                statement = select(Notes).where(
                    Notes.user_id == current_user.id,
                    col(Notes.is_deleted).is_not(True),
                    col(Notes.id).in_(note_ids),
                )
                if folder_id is not None:
                    statement = statement.where(Notes.folder_id == folder_id)
                if date_from is not None:
                    statement = statement.where(Notes.created_at >= date_from)
                if date_to is not None:
                    statement = statement.where(Notes.created_at <= date_to)
                note_map = {
                    note.id: note for note in session.exec(statement).all() if note.id is not None
                }
            for hit in note_hits:
                note = note_map.get(hit.note_id)
                if note is None or not _is_relevant_semantic_score(hit.score):
                    continue
                results.append(
                    SearchResultItem(
                        id=hit.note_id,
                        entity_type="note",
                        title=note.title,
                        snippet=create_content_preview(hit.content, max_length=180),
                        score=hit.score,
                        created_at=note.created_at,
                        updated_at=note.updated_at,
                    )
                )

        if "chat" in enabled_types:
            chat_hits = vector_store.chat_similarity_search(
                user_id=current_user.id,
                query_embedding=query_embedding,
                top_k=100,
                similarity_threshold=SEMANTIC_SIMILARITY_THRESHOLD,
                date_from=date_from,
                date_to=date_to,
            )
            results.extend(_chat_results_from_hits(chat_hits))
    except HTTPException:
        raise
    except Exception as exc:
        session.rollback()
        logger.exception("Semantic search failed")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Semantic search is temporarily unavailable.",
        ) from exc

    results.sort(key=lambda item: item.score or 0, reverse=True)
    total = len(results)
    start = (page - 1) * page_size
    return SearchResponse(
        query=query,
        results=results[start : start + page_size],
        total=total,
        page=page,
        page_size=page_size,
        filters=None,
    )
