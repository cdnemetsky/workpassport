# Blind discovery and Living Pulse recurrence protocol

## Purpose

Test whether the model independently discovers useful, unexpected abilities from ordinary authorized activities, rather than echoing ability labels supplied by the evaluator.

## Blinding

The production prompt receives one activity and its ordinary context. It receives no expected answer, target ability, recurrence label or participant scoring rubric. The input corpus contains three activities for each pseudonymous participant. Activities from the same participant are assessed independently.

## Stage 1 — discovery quality

Human reviewers score each finding without seeing a target answer:

- exact evidence fidelity;
- novelty beyond the participant's known self-description;
- usefulness to the participant;
- plausible alternative explanations;
- unsupported or inflated claims;
- whether “no finding” would have been more honest.

## Stage 2 — recurrence

Only after all independent assessments are complete, reviewers compare findings across the three activities for each participant. A recurring ability passes only when at least two genuinely different activities support the same underlying capability. Similar wording alone is insufficient, and one activity copied into several forms does not count.

The current Living Pulse automatically groups identical approved finding names across distinct samples. The blind study must also check semantic recurrence when the model uses different names for the same underlying capability; that review is not yet automated.

## Current execution status

**Prepared, not run.** The corpus, production prompt, validator, runner and protocol tests are committed. The Edge Function still lacks a server-side provider key, so there is no honest blind-model result yet.

Run locally only with a securely supplied server-side key:

```text
OPENAI_API_KEY=… node scripts/run-blind-discovery.mjs
```

Never commit the key or raw results containing private participant activity.
