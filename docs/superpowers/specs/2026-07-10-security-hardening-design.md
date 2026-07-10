# Cognolith Security Hardening Design

## Goal

Close the confirmed application and dependency vulnerabilities without weakening existing authentication, chat, upload, or local Docker workflows.

## Authentication And WebSockets

The chat WebSocket endpoint will authenticate with the existing HTTP-only access-token cookie. Before accepting a connection, it will validate the JWT signature and claims, reject blacklisted tokens, require an active verified user, confirm that the requested chat session belongs to that user, and validate the request origin against the configured frontend origins. Failed checks close the socket with an appropriate WebSocket policy or authentication code without revealing session existence.

Incoming frames will be bounded by a configured maximum size and parsed into a strict message schema. Only non-empty chat message payloads are accepted. Malformed or oversized frames close the connection instead of entering the broadcast path. The frontend continues using same-origin cookies and does not place credentials in URLs.

## Dependencies And Test Client

The frontend will move to patched compatible Next.js and transitive dependency versions. The `shadcn` CLI will move from production dependencies to development dependencies. The backend will add Starlette's recommended `httpx2` package to development requirements so tests no longer use the deprecated compatibility path. Both Python and pnpm audits must report no known critical or high vulnerabilities; lower findings require an explicit relevance assessment.

## Deployment Configuration

Local Docker keeps usable defaults. Staging and production configuration fail at startup when JWT, database, or administrator credentials match known placeholders such as `changethis`, `postgres`, or `change-me-in-production`. Production continues requiring database TLS and configured SMTP. Documentation and example environments use generated-secret placeholders without containing real credentials.

## Upload Boundaries

Uploads will be copied to their UUID destination incrementally while counting bytes. Processing stops and the partial file is deleted as soon as the configured limit is exceeded. File signature validation uses a bounded prefix rather than reading the complete upload into memory. DOCX archives are inspected before parsing and rejected when entry count, expanded total size, per-entry size, or compression ratio exceeds conservative limits. Existing PDF, Markdown, text, and DOCX behavior remains unchanged for valid files.

## Public Endpoint Rate Limits

Signup, verification, and resend routes receive IP-based limits through the existing SlowAPI limiter. Account-level OTP cooldowns, hourly send limits, failed-attempt lockout, and neutral resend responses remain authoritative. Verification errors continue avoiding information that would reveal whether another account exists.

## Testing And Acceptance

Regression tests will first demonstrate unauthenticated and cross-user WebSocket rejection, origin rejection, frame validation, placeholder-secret rejection, streamed upload limits, DOCX archive limits, and public-route throttling. Each test must fail before implementation and pass afterward.

Completion requires backend tests, Ruff, BasedPyright, frontend tests, type-checking, linting, production builds, `pip-audit`, `pnpm audit`, Docker health checks, and browser checks for registration, authentication, document upload, and chat. Test output must contain no project-controlled warnings; externally deprecated interfaces must be removed or explicitly documented when no supported replacement exists.

## Compatibility

No database migration or public REST contract changes are required. Existing cookies, sessions, notes, documents, and chat records remain valid. WebSocket clients now require a valid authenticated browser session, which matches the dashboard's existing access model.
