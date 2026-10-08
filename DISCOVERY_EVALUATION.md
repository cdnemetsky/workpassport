# Discover Yourself — initial evidence-grounded evaluation

This checkpoint tests the **structure and judgment standard**, not a live AI provider. The production Edge Function still lacks `OPENAI_API_KEY`, so these candidate findings were written as expected examples and passed through the same exact-quote and output validator used by the application. They must not be reported as model-quality results.

## What the test asks

Can the system propose something more useful than the person's known description, point to the exact activity that supports it, state a plausible alternative, and reject attractive guesses that the evidence does not justify?

| Activity | Known description | Evidence-supported candidate discovery | Exact evidence | Rejected as guess |
|---|---|---|---|---|
| Repair-message intake | Reliable; good with repairs | Practical systems design | “I listened to the last twenty calls and wrote down which details were usually missing.” | Leadership; technical expertise; high intelligence |
| Meal-route disruption | Helpful; organized | Constraint-aware contingency planning | “I marked every delivery that had a strict time…” | Executive leadership; empathy; logistics professional |
| Correcting an AI comparison | Curious; uses AI | Assumption testing | “I asked the AI to list every assumption it had made…” | Financial expertise; high IQ; skeptical personality |

The meal-route and AI examples also include tentative demonstrated qualities. They are deliberately worded as behavior in one context, never as verified inner character.

## Pass/fail rules now automated

- Every quote must be an exact substring of the submitted activity.
- Findings must use `ability` or `demonstrated_quality`, never a personality label.
- Confidence is only `tentative` or `supported`, never fake numerical precision.
- Each finding must state uncertainty and useful next evidence.
- Candidate names must add information beyond the supplied known-strength labels.
- Explicit unsupported guesses may not appear as findings.

## What remains unproven

The tests show that the product can enforce a credible output contract and that realistic target examples can express genuinely less-obvious discoveries. They do **not** prove that the connected model can reliably generate those discoveries. That requires the live provider, blinded model runs over these and additional consented cases, and human scoring for novelty, evidence fidelity, usefulness, false positives, repeatability and privacy.
