# AI Work Passport

Discover abilities demonstrated through actual work, with permission, evidence and owner review. The master plan is `PRODUCT_SPEC.md`.

## Current implementation

- Responsive ability-centered website on GitHub Pages.
- Supabase account sign-in/signup, password confirmation and visibility, email confirmation resend.
- Private text/file sample submission with permission, SHA-256 content hash and context.
- Server-side AI assessment endpoint: exact-source-quote validation, explicit uncertainty, private review and no independent-verification claims.
- Approve, dispute, hide, delete sample and related assessments; Passport JSON export.
- Selected seven-day shared views with revocation. Original samples, account email and context are excluded.
- Private future Talent Pulse preferences. No discovery network or automated outreach exists yet.

## Live dependencies

Supabase project `fszgfgxipwnbwqtsphub`; database extension is `database-abilities.sql`. Both Edge Functions are deployed. Browser configuration contains only a public publishable key.

**AI is not connected until `OPENAI_API_KEY` is set as a Supabase Edge Function secret.** Without it, work samples save privately and assessment returns an explicit unavailable message. No fake model results are substituted. Default model is `gpt-4.1-mini`; `OPENAI_MODEL` can override it. Keep secrets out of this repository.

Signup redirect is `https://cdnemetsky.github.io/workpassport/`. Supabase Auth's Site URL and allowed redirect must include this exact URL. Existing tester reported a confirmation link failure; server-side URL configuration has not yet been inspected or corrected through the available connector. Email delivery and real signup require end-to-end testing.

## Run locally

Serve the repository with `python -m http.server 8765`. The production backend's CORS origin is `https://cdnemetsky.github.io`; use the production site for real backend calls. Local front-end tests mock the SDK.

Run quote/structure tests: `node --test tests/assessment.test.mjs`.
Browser smoke test: install Playwright and its Chromium browser, then `node tests/browser-smoke.mjs`. This suite mocks the Supabase SDK and is not a real account/provider test.

## Limits before production launch

- No AI provider secret configured by this development session; no real AI-output or model-quality evaluation completed.
- Confirmation redirect service configuration still needs checking; broken previously issued links may need to be resent.
- No continuous capture, source ownership verification, independent skill verification, identity verification or employer network.
- File loading accepts text only. No private binary object uploads, PDF parser or background assessment queue.
- Assessment quota is a basic daily completed-assessment check, not a fully atomic concurrency limit. Add reservations and stronger abuse controls before broad launch.
- Sharing is a bearer link: anyone with it may view the selected quotes until revoked/expired; copied/downloaded material cannot be recalled.
- No append-only assessment review history yet. Source sample bodies are immutable through client privileges; owner review is separate from server-owned findings.
- Supabase reports compromised-password protection disabled. Enable it when supported by the project's plan.

The earlier prototype remains recoverable through GitHub commit history.
