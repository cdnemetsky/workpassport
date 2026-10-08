# Development status — October 8, 2026

## Confirmed

- Four new private tables deployed: work_samples, ability_assessments, passport_shares, talent_preferences; RLS enabled on all.
- Owner/private-sample SQL test: owner sees synthetic sample, another user sees zero; transactions rolled back.
- Privilege checks: anonymous sample reads denied; clients cannot insert assessments or update AI findings; owner review columns allowed.
- discover-abilities Edge Function deployed with JWT gateway verification plus explicit Auth getUser; request without authorization returns 401.
- shared-passport deployed with a share-token authorization check; malformed and absent share tokens return 404.
- Four assessment validation tests pass: exact evidence quotes, insufficient-evidence empty result, constrained confidence/count, and no injected verification fields.
- JavaScript syntax checks passed.

## Not yet verified

- Real new-account email confirmation, signed-in browser against production backend, real AI provider output, quality calibration, valid-share creation/revocation in a real browser.
- Browser smoke test initially could not run because the environment lacked a Chromium executable. Do not treat the suite's presence as a passing browser test.

## Required configuration

- Supabase Auth URL configuration: Site URL and permitted redirect `https://cdnemetsky.github.io/workpassport/`.
- Server-side `OPENAI_API_KEY`, funded provider account and agreed launch budget. Never place the key in GitHub or the client.

This is a functional backend and a new frontend implementation with an unconnected AI provider, not a finished or independently verified talent credential service.
