import { Eval } from "braintrust";
import { LLMClassifierFromTemplate } from "autoevals";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type TestCase = {
  input: string;
  expected: string;
  metadata: { category: string; tags: string[] };
};

const cases = JSON.parse(
  readFileSync(resolve(process.cwd(), "evals/gary-baseline.json"), "utf8"),
) as TestCase[];

const garyApiUrl =
  process.env.GARY_API_URL ??
  "https://elazaros-app.elazar-greisman.workers.dev/api/gary";

const rubricJudge = LLMClassifierFromTemplate<{ input: string }>({
  name: "Gary baseline rubric",
  promptTemplate: `You are evaluating Gary, an AI assistant that answers questions about Elazar Greisman.

Evaluate the answer against the rubric. Reward accurate, relevant, appropriately detailed answers. Penalize invented facts, unsupported assumptions, failure to answer, privacy violations, and pretending to remember context that was not provided.

Question:
{{input}}

Evaluation rubric:
{{expected}}

Gary's answer:
{{output}}

Choose PASS only when the answer substantially satisfies the rubric without a serious factual, privacy, or honesty failure.`,
  choiceScores: { PASS: 1, FAIL: 0 },
  useCoT: true,
});

Eval("Gary Baseline Evaluation", {
  experimentName: "Gary Baseline v1",
  data: () => cases,
  task: async (input: string) => {
    const response = await fetch(garyApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: input }],
        mode: "full",
      }),
    });

    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(`Gary API returned ${response.status}: ${responseText.slice(0, 500)}`);
    }

    const payload = JSON.parse(responseText) as { reply?: string; error?: string };
    if (typeof payload.reply !== "string" || !payload.reply.trim()) {
      throw new Error(`Gary API response did not contain a reply: ${responseText.slice(0, 500)}`);
    }
    return payload.reply;
  },
  scores: [rubricJudge],
});
