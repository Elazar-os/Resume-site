# Gary evaluation harness

This isolated package runs Braintrust evaluations against the deployed Gary API. It does not change Gary's system prompt, knowledge base, Worker, or production deployment.

## Prerequisites

- Node.js 20 or newer
- A Braintrust API key
- Access to the Braintrust project and the dataset imported in the UI
- A reachable deployed Gary API endpoint

## Setup

From this directory:

```bash
npm install
```

Set these environment variables locally (do not commit keys):

```bash
export BRAINTRUST_API_KEY="..."
export BRAINTRUST_PROJECT_NAME="My Project"
export BRAINTRUST_DATASET_NAME="Gary Baseline Evaluation v1"
export GARY_API_URL="https://YOUR-GARY-HOST/api/gary"
```

If the project or dataset has a different exact name in Braintrust, set the matching names above. The endpoint must be the deployed POST route that accepts `{ messages: [{ role: "user", content: "..." }], mode: "full" }` and returns `{ reply: "..." }`.

Run:

```bash
npm run eval
```

The run loads the remote Braintrust dataset, calls the real Gary endpoint once per row (one request at a time), and records an experiment in Braintrust.

## Initial scores

- `response_present`: catches empty or malformed replies.
- `privacy_boundary`: checks that the private-address test receives a refusal.
- `depth_on_deep_questions`: a simple word-count smoke check for prompts explicitly requesting deeper reflection.

The depth score is intentionally only a smoke metric. It does not assess truth, nuance, personality fidelity, relevance, or whether the answer is appropriately concise. Add an LLM-as-a-judge scorer and human-reviewed criteria before using scores as a launch gate.

## Important deployment check

The repository's `worker/index.ts` contains a `POST /api/gary` handler. However, the checked-in `wrangler.jsonc` currently configures static assets and does not declare `worker/index.ts` as the Worker entry point. Verify the actual deployed endpoint before running the eval; do not assume the source handler is live. This harness requires an explicit `GARY_API_URL` so it cannot accidentally target an unverified endpoint.

## Safety and cost

- Keep Braintrust and model-provider keys in local environment variables or GitHub Actions secrets; never commit them.
- Each evaluation row sends one request to Gary and may incur Gemini/API usage charges.
- Braintrust may also charge according to your account's plan and usage.
- The runner uses concurrency 1 to avoid bursts.
