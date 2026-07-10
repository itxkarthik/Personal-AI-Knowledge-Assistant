# Cognolith Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the confirmed Cognolith application and dependency vulnerabilities while preserving existing user workflows.

**Architecture:** Reuse the existing JWT, ownership, rate-limit, and file-processing layers. Add small security helpers at the WebSocket and upload boundaries, fail closed for deployed placeholder secrets, and update only affected dependencies.

**Tech Stack:** FastAPI, SQLModel, SlowAPI, PyJWT, Starlette, Next.js, pnpm, Docker.

## Global Constraints

- Keep `pip-audit` and HTTP test tooling development-only.
- Do not change database schemas or public REST response shapes.
- Preserve local Docker defaults while rejecting placeholders in staging and production.
- Add regression tests before production behavior changes.

---

### Task 1: Dependency And Warning Cleanup

**Files:** `requirements-dev.txt`, `frontend/package.json`, `frontend/pnpm-lock.yaml`

- [ ] Pin `httpx2` in development requirements and prove the Starlette warning disappears.
- [ ] Upgrade Next.js and matching ESLint config to a patched compatible release.
- [ ] Move `shadcn` to development dependencies and refresh the pnpm lockfile.
- [ ] Run backend tests and both dependency audits.

### Task 2: Authenticated WebSockets

**Files:** `backend/app/api/routes/chat.py`, `backend/app/core/websocket.py`, `backend/tests/test_chat_routes.py`

- [ ] Add failing tests for missing cookies, invalid origins, cross-user sessions, malformed messages, and oversized frames.
- [ ] Add a WebSocket authentication helper that validates JWT claims, blacklist state, active/verified user state, allowed origin, and session ownership before acceptance.
- [ ] Parse frames through a strict bounded message model and close rejected connections without broadcasting.
- [ ] Run focused and complete chat tests.

### Task 3: Bounded Upload Processing

**Files:** `backend/app/utils/file_validation.py`, `backend/app/services/document_service.py`, `backend/app/core/config.py`, `backend/tests/test_security.py`, `backend/tests/test_document_cleanup.py`

- [ ] Add failing tests for streams exceeding the configured limit and hostile DOCX archive expansion.
- [ ] Validate magic bytes from a bounded prefix and stream uploads to UUID paths with incremental size enforcement and partial-file cleanup.
- [ ] Inspect DOCX archive metadata before extraction using entry-count, expanded-size, per-entry-size, and compression-ratio limits.
- [ ] Run focused upload and document tests.

### Task 4: Deployment Secrets And Public Rate Limits

**Files:** `backend/app/core/config.py`, `backend/app/api/routes/user.py`, `backend/tests/test_email_config.py`, `backend/tests/test_email_verification_routes.py`

- [ ] Add failing tests for known placeholder secrets outside local mode and route-level throttling.
- [ ] Reject known JWT, database, and administrator placeholder values in staging and production.
- [ ] Apply existing SlowAPI IP limits to signup, verification, and resend endpoints while preserving neutral resend behavior.
- [ ] Run focused configuration and verification tests.

### Task 5: Full Verification

- [ ] Run backend tests, Ruff, BasedPyright, and `pip-audit`.
- [ ] Run frontend tests, type-check, lint, build, and `pnpm audit`.
- [ ] Rebuild Docker, confirm all services healthy, and verify production images omit development audit tools.
- [ ] Browser-test registration, authentication, document upload, and chat.
- [ ] Review `git diff --check` and leave all changes uncommitted for the user.
