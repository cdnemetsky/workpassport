# AI Work Passport — Master Product Specification
Version: 0.1 • October 8, 2026 • Working plan, not a claim of completed functionality

## Product promise
**Discover your talents. Prove your abilities. Let opportunities find you.**

AI Work Passport is a consent-based, living record that uses AI to **infer and assess abilities demonstrated through actual work**. It is not primarily a résumé maker or an accomplishment log. It helps people discover strengths they may not recognize, attaches traceable supporting evidence, and lets them selectively share credible demonstrations of capability.

## Core user experience
1. **Discover my abilities**: submit a work sample or connect a supported source. Explain what is being analyzed and obtain informed permission.
2. **Ability discovery**: AI proposes skills, aptitudes and strengths based on specific observed behaviors and artifacts. Every finding links to the evidence, explanation, confidence and limitations. Distinguish observed facts from inference.
3. **Review and control**: user can accept, dispute, hide, delete, or request reassessment of findings. Private by default.
4. **Living Passport**: abilities develop over time with supporting examples, dates, source records and assessment changes.
5. **Share selectively**: create a limited-scope, revocable view for employers, collaborators or other recipients. Résumé export is optional, secondary.
6. **Opportunities**: in a later Talent Pulse Network, opted-in users may be discovered for opportunities based on evidence-backed abilities, with user-controlled introductions.

## Evidence and credibility
- Preserve original source identifier, timestamp, extraction method, consent state, relevant excerpt/artifact, hash where appropriate, and assessment version.
- Separate **user-provided**, **source-linked**, **identity-associated**, and **independently verified** evidence. Never label an AI inference as independently verified.
- Work captured as it happens may offer stronger provenance than later uploads, but does not by itself establish authorship.
- Account authentication, optional stronger identity verification, source authorization and tamper-evident audit logs are separate components; do not claim biometrics or verified identity until implemented.
- Protect other people's data: redact sensitive information, minimize retention, honor source permissions.

## Capture approach
- Start with explicit sample upload/paste and supported, user-authorized integrations.
- Later support selective ongoing capture with clear start/stop, source scope, preview, consent revocation and deletion.
- Prefer event metadata and selected artifacts to indiscriminate screen recording.
- Never silently capture third-party communications or claim continuous monitoring when a browser tab or service cannot actually run it.

## AI assessment engine
Input: permitted work artifact + source context + user-provided role/context.
Output: structured observations, candidate abilities, supporting evidence references, alternative explanations, confidence/uncertainty, suggested next evidence, model/version and review status.
Guardrails: no fabricated proof; no unsupported personality diagnoses; avoid sensitive-trait inference; flag teamwork attribution ambiguity; allow correction and appeals. Use clear language: 'AI-suggested ability' until validated.
Evaluation: build a small consented test set, compare outputs to human review, track false positives, evidence traceability and repeatability. Avoid numerical precision without calibration.

## Proposed architecture
- Frontend: responsive accessible discovery flow, review queue, Passport dashboard, source/permission settings, sharing controls.
- Backend API: authenticated users, work artifacts, source connections, assessment jobs, evidence references, reviews, audit events, share grants.
- Data: relational database for identities and relationships; private object storage for artifacts; queue/worker for asynchronous AI assessment.
- AI: server-side provider integration with secrets kept off GitHub Pages; prompt and model versioning; structured output validation; evidence-linked assessments.
- Security: per-user authorization, encrypted transport/storage, retention controls, signed expiring links, abuse protection, logging without sensitive payloads.
- GitHub Pages can host a prototype frontend but **cannot by itself provide a secure backend, private database or server-side AI key**.

## Development milestones and acceptance checks
**M0 — Honest prototype (existing):** interactive browser-only pages and sample flows. Clearly mark simulation and unverified states. No claim of production-grade authentication or verification.
**M1 — First real intelligence:** consented text/work-sample submission, server-side AI assessment returning 2–5 abilities with precise source quotes, rationale and uncertainty; review/edit/reject; persistent private record. Test with diverse examples.
**M2 — Trustworthy evidence:** source records, timestamps, provenance metadata, account authentication, access controls, deletion and share/revoke.
**M3 — Living capture:** one authorized integration, selective new-work detection, review-before-save, disconnect and monitoring controls, documented limits.
**M4 — Portable passport:** compelling ability-centered display, export, selective share, optional résumé.
**M5 — Talent Pulse Network (later):** opt-in discoverability, permission-based introductions, evidence-aware matching, privacy and fairness review.

## Product language and first impression
Hero: **Discover your talents. Prove your abilities. Let opportunities find you.**
Supporting copy: 'Your AI Work Passport helps recognize abilities demonstrated through real work, preserves supporting evidence, and builds a living record of your strengths. You choose what to approve and share.'
Primary action: **Discover My Abilities**.
Avoid promises of 'endless opportunities', 'most provable', or universal identity verification without validation.

## Current state / open decisions
As of this document's creation, the public GitHub Pages site is an interactive prototype. Its existing browser-local storage, sample capture and résumé-oriented features should not be mistaken for the planned backend or an independently verified credential.
Decisions to make only when needed: backend hosting/database/provider; AI provider and cost budget; first supported capture integration; consent and privacy policy; identity-verification vendor; launch audience and pricing.

## Builder comparison brief
Give the same specification to each builder. Compare: actual AI evidence-grounded ability inference, working backend and access controls, provenance fidelity, selective capture feasibility, review controls, source-code ownership, deployability, cost, and independent test results. Do not score on visual polish alone.
