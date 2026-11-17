# Gary + Braintrust baseline evaluation

This adds a repeatable Braintrust evaluation for the 16 cases in `gary-baseline.json`.

## What it tests

The task sends each question to the existing Gary Cloudflare Worker:

`POST https://elazaros-app.elazar-greisman.workers.dev/api/gary`

Request shape follows the Worker contract in `worker/index.ts`:

```json
{
  "messages": [{ "role": "user", "content": "..." }],
  "mode": "full"
}
```

Gary returns `{ "reply": "...", "mode": "full" }`. The evaluation grades the reply against each case's natural-language rubric using Braintrust's LLM-as-a-judge scorer.

## Setup

From the repository root, install the evaluation-only packages:

```bash
npm install --save-dev braintrust autoevals tsx
```

Set a Braintrust API key in your local environment. The scorer uses Braintrust's configured AI Gateway by default.

macOS / Linux:

```bash
export BRAINTRUST_API_KEY="your-braintrust-api-key"
export GARY_API_URL="https://elazaros-app.elazar-greisman.workers.dev/api/gary"
npx braintrust eval evals/gary-baseline.eval.ts
```

PowerShell:

```powershell
$env:BRAINTRUST_API_KEY="your-braintrust-api-key"
$env:GARY_API_URL="https://elazaros-app.elazar-greisman.workers.dev/api/gary"
npx braintrust eval evals/gary-baseline.eval.ts
```

The Braintrust key is used by the evaluation runner and judge; it is not sent to Gary. Gary's Gemini key remains in the Cloudflare Worker environment and is never exposed to this test script.

## Important baseline limitation

Each CSV row is sent as a fresh, one-message conversation. That is appropriate for factual, reasoning, personalization, unknown-information, and privacy checks. The two conversation-continuity cases are therefore testing whether Gary honestly recognizes that prior context was not included; they are not multi-turn memory tests yet. A separate multi-turn fixture can be added after this first baseline is running.

## Scoring

Each case receives PASS (1) or FAIL (0), with judge rationale recorded in Braintrust. Review the individual outputs and rationales rather than treating the aggregate score as the whole story—especially for privacy and factuality cases.
