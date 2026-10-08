# Product architecture clarification — October 8, 2026

## The core proposition
**Your greatness deserves to be discovered.** The distinctive aspiration is not to catalog known skills or produce a résumé. It is to uncover *unexpected* strengths from subtle patterns in a person's authorized real activities, then substantiate each discovery as far as the evidence allows. This is a product hypothesis to test, not a claim of uniqueness or proof of an inner trait.

## One discovery technology, three connected product experiences
**Shared Living Discovery Engine:** permission-scoped observation and artifact ingestion; behavioral observations; candidate ability hypotheses; source-linked evidence; uncertainty, counterexamples and reassessment; ongoing changes over time (the Living Pulse). The engine should identify potential beyond known job titles and surface genuinely surprising insights, while never inventing proof. Avoid silent monitoring and unsupported character judgments.

**Discover Yourself (standalone experience):** a private-first discovery product useful even to someone who never shares a Passport. Show meaningful unexpected insights, why AI suggested them, confidence/limitations, and ways to challenge or refine findings. The ongoing Pulse belongs here and within the Passport experience; it is not the separate matching service.

**AI Work Passport (current implementation priority):** private portable representation of approved evidence-supported findings, provenance and consent, selective sharing, review, deletion and revocation. Its central user experience should be Discover Yourself + Living Pulse, rather than a résumé-style display. Existing sample-based assessment is an initial step toward the Pulse, not the finished Pulse.

**Opportunity Matching Platform (separate connected product; plan architecture now, do not implement as part of current Passport assignment):** with explicit opt-in, use evidence-supported Passport findings to identify where abilities could be useful. Eventually search genuine external opportunity sources as well as opted-in demand; distinguish verified opportunities from unconfirmed leads and hypothetical suggestions. Never expose private evidence, identity or contact details, or make introductions without permission. Not restricted to job seeking.

## Two distinct discovery dimensions
1. Abilities and ingenuity: unconventional thinking, creativity, problem-solving, judgment, resourcefulness, organization, emerging aptitudes.
2. Subtle qualities reflected in observable behavior: patience in communication, careful correction, fairness in decisions, consistency and helpfulness. These are tentative contextual inferences, not verified declarations of someone's inner character. Avoid sensitive-trait profiling and high-stakes automatic judgments.

## Evidence and validation rules
Capture source identity and timestamp when authorized, provenance, consent scope, relevant artifact and attribution limitations. Contemporaneous records strengthen traceability but do not independently prove authorship or the correctness of an inferred ability. Keep clear statuses for source-linked, identity-associated, independently verified, and AI-inferred. The user may share a general assessment without exposing raw private evidence; viewers must know when they cannot inspect the evidence.

## Product test that determines value
Test whether repeated authorized everyday activities allow the AI to find useful, *unexpected* abilities that people did not explicitly report, with defensible evidence and calibrated uncertainty. Evaluate false positives, novelty, usefulness, privacy, repeatability and human review. If it only relabels conventional skills, the core proposition has not yet been demonstrated.

## Current scope for the implementation agent
Build and test the Passport with its Discover Yourself and Living Pulse engine; design interfaces that a future matching product can use, but do not divert implementation effort into the separate matching service. Preserve useful existing work. Clearly label sample assessment versus ongoing capture, and prototype versus genuinely functional components.

---

# AI Work Passport — Master Product Specification
Version: 0.1 • October 8, 2026 • Working plan, not a claim of completed functionality

## Product promise
**Your greatness deserves to be discovered.**

Supporting promise: **Discover your talents. Prove your abilities. Let opportunities find you.**

AI Work Passport is a consent-based, living record that uses AI to **infer and assess abilities demonstrated through actual work**. It is not primarily a résumé maker or an accomplishment log. It helps people discover strengths they may not recognize, attaches traceable supporting evidence, and lets them selectively share credible demonstrations of capability.

## Full-spectrum discovery principle
The Passport looks for what a person's authorized activities may reveal, including strengths that conventional résumés overlook. It should recognize both visible capabilities and quieter patterns, while never turning uncertain behavioral clues into definitive character claims.

Two separately labeled families of findings are required:

1. **Demonstrated abilities** — creativity, ingenuity, practical judgment, problem-solving, strategic thinking, foresight, learning ability, curiosity, organization, initiative, resourcefulness, attention to detail, consistency, and opportunity recognition.
2. **Demonstrated personal qualities** — observable signs of patience, consideration, thoughtfulness, fairness, careful communication, correction of mistakes, dependability, responsibility, respectfulness, and helpfulness.

Every personal-quality finding must describe the behavior actually observed and use calibrated language such as “this interaction shows…” or “may suggest…”. The system must not diagnose personality, infer protected or sensitive traits, or generalize a single interaction into a global claim about character.

## Core user experience
1. **Discover my abilities**: submit a work sample or connect a supported source. Explain what is being analyzed and obtain informed permission.
2. **Ability discovery**: AI proposes skills, aptitudes, strengths and demonstrated personal qualities based on specific observed behaviors and artifacts. Every finding links to the evidence, explanation, confidence and limitations. Distinguish observed facts from inference.
3. **Review and control**: user can accept, dispute, hide, delete, or request reassessment of findings. Private by default.
4. **Living Passport**: abilities develop over time with supporting examples, dates, source records and assessment changes.
5. **Share selectively**: create a limited-scope, revocable view for employers, collaborators or other recipients. For each shared view, the holder can share a finding with selected supporting evidence, share the general finding without exposing private evidence, or omit it entirely. When evidence is withheld, recipients must be told that they cannot independently inspect it. Résumé export is optional, secondary.
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
Output: structured observations, a finding family (`ability` or `demonstrated_quality`), candidate abilities or qualities, supporting evidence references, alternative explanations, confidence/uncertainty, suggested next evidence, model/version and review status.
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
Guiding message: **Your greatness deserves to be discovered.**
Hero: **Discover your talents. Prove your abilities. Let opportunities find you.**
Supporting copy: 'Your AI Work Passport helps recognize abilities demonstrated through real work, preserves supporting evidence, and builds a living record of your strengths. You choose what to approve and share.'
Primary action: **Discover My Abilities**.
Avoid promises of 'endless opportunities', 'most provable', or universal identity verification without validation.

## Current state / open decisions
As of this document's creation, the public GitHub Pages site is an interactive prototype. Its existing browser-local storage, sample capture and résumé-oriented features should not be mistaken for the planned backend or an independently verified credential.
Decisions to make only when needed: backend hosting/database/provider; AI provider and cost budget; first supported capture integration; consent and privacy policy; identity-verification vendor; launch audience and pricing.

## Builder comparison brief
Give the same specification to each builder. Compare: actual AI evidence-grounded ability inference, working backend and access controls, provenance fidelity, selective capture feasibility, review controls, source-code ownership, deployability, cost, and independent test results. Do not score on visual polish alone.
