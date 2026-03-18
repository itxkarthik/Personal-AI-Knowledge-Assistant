from __future__ import annotations

from datetime import datetime

from fastapi import HTTPException
from sqlmodel import Session, col, or_, select

from app.models.chat import ChatMessages, ChatSession
from app.models.document import Document
from app.models.note import Notes
from app.models.user import User
from app.schemas.chat import ChatCreate, ChatMessageCreate
from app.utils.text_processing import create_content_preview


def create_chat_session(*, session: Session, current_user: User, payload: ChatCreate) -> ChatSession:
	chat_session = ChatSession(
		user_id=current_user.id,
		title=payload.title,
		description=payload.description,
	)
	session.add(chat_session)
	session.commit()
	session.refresh(chat_session)
	return chat_session


def list_chat_sessions(*, session: Session, current_user: User, skip: int = 0, limit: int = 20) -> tuple[list[ChatSession], int]:
	statement = (
		select(ChatSession)
		.where(ChatSession.user_id == current_user.id)
		.order_by(col(ChatSession.last_message_at).desc())
	)
	sessions = session.exec(statement).all()
	total = len(sessions)
	return sessions[skip : skip + limit], total


def send_message_and_get_response(
	*,
	session: Session,
	current_user: User,
	chat_session_id: int,
	payload: ChatMessageCreate,
) -> tuple[ChatMessages, ChatMessages]:
	chat_session = get_chat_session_by_id(
		session=session,
		current_user=current_user,
		chat_session_id=chat_session_id,
	)

	user_message = ChatMessages(
		session_id=chat_session.id,
		role="user",
		content=payload.content,
	)
	session.add(user_message)
	session.commit()
	session.refresh(user_message)

	rag_answer, rag_sources = _invoke_rag(session=session, current_user=current_user, query=payload.content)

	assistant_message = ChatMessages(
		session_id=chat_session.id,
		role="assistant",
		content=rag_answer,
		model_used="rag-v1",
		sources=rag_sources,
		tokens_used=len(rag_answer.split()),
	)
	session.add(assistant_message)

	chat_session.last_message_at = datetime.now()
	if not chat_session.title:
		chat_session.title = create_content_preview(payload.content, max_length=80)
	session.add(chat_session)

	session.commit()
	session.refresh(assistant_message)
	return user_message, assistant_message


def convert_chat_to_note(
	*,
	session: Session,
	current_user: User,
	chat_session_id: int,
	title: str | None = None,
	folder_id: int | None = None,
) -> Notes:
	chat_session = get_chat_session_by_id(
		session=session,
		current_user=current_user,
		chat_session_id=chat_session_id,
	)
	messages = session.exec(
		select(ChatMessages)
		.where(ChatMessages.session_id == chat_session.id)
		.order_by(col(ChatMessages.created_at).asc())
	).all()
	if not messages:
		raise HTTPException(status_code=400, detail="Cannot convert empty chat session to note")

	if folder_id is not None:
		folder_exists = session.exec(
			select(Notes).where(Notes.user_id == current_user.id, Notes.folder_id == folder_id)
		).first()
		if folder_exists is None:
			from app.models.note import NoteFolders

			folder = session.exec(
				select(NoteFolders).where(
					NoteFolders.id == folder_id,
					NoteFolders.user_id == current_user.id,
					NoteFolders.is_deleted == False,
				)
			).first()
			if not folder:
				raise HTTPException(status_code=404, detail="Folder not found")

	content_lines = [f"### {message.role.title()}\n{message.content}" for message in messages]
	note_content = "\n\n".join(content_lines)
	note_title = title or chat_session.title or f"Chat Session {chat_session.id}"

	note = Notes(
		user_id=current_user.id,
		folder_id=folder_id,
		title=note_title,
		content=note_content,
		content_preview=create_content_preview(note_content, max_length=200),
		content_type="markdown",
		linked_chat_session_id=chat_session.id,
		word_count=len(note_content.split()),
		char_count=len(note_content),
		read_time_minutes=max(1, len(note_content.split()) // 200),
	)
	session.add(note)
	session.commit()
	session.refresh(note)
	return note


def get_chat_session_by_id(*, session: Session, current_user: User, chat_session_id: int) -> ChatSession:
	chat_session = session.exec(
		select(ChatSession).where(
			ChatSession.id == chat_session_id,
			ChatSession.user_id == current_user.id,
		)
	).first()
	if not chat_session:
		raise HTTPException(status_code=404, detail="Chat session not found")
	return chat_session


def _invoke_rag(*, session: Session, current_user: User, query: str) -> tuple[str, dict]:
	like_query = f"%{query}%"

	note_hits = session.exec(
		select(Notes)
		.where(
			Notes.user_id == current_user.id,
			Notes.is_deleted == False,
			or_(
				col(Notes.title).ilike(like_query),
				col(Notes.content).ilike(like_query),
			),
		)
		.order_by(col(Notes.updated_at).desc())
		.limit(3)
	).all()

	document_hits = session.exec(
		select(Document)
		.where(
			Document.user_id == current_user.id,
			Document.is_deleted == False,
			or_(
				col(Document.title).ilike(like_query),
				col(Document.content).ilike(like_query),
			),
		)
		.order_by(col(Document.updated_at).desc())
		.limit(3)
	).all()

	snippets: list[str] = []
	for note in note_hits:
		snippets.append(f"Note {note.id}: {create_content_preview(note.content or note.title, 160)}")
	for document in document_hits:
		snippets.append(f"Document {document.id}: {create_content_preview(document.content or document.title, 160)}")

	if snippets:
		answer = "I found relevant context in your knowledge base:\n\n" + "\n".join(f"- {item}" for item in snippets)
	else:
		answer = "I could not find relevant context in your notes/documents yet. Add more content and try again."

	sources = {
		"notes": [note.id for note in note_hits],
		"documents": [document.id for document in document_hits],
	}
	return answer, sources
