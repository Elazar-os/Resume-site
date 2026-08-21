import { KNOWLEDGE_BASE } from './knowledge';
import type { KnowledgeItem, KnowledgeVisibility } from './schema';

export type GaryMode = 'professional' | 'shidduch' | 'full';

const STOP_WORDS = new Set([
  'what', 'what’s', 'whats', 'is', 'are', 'the', 'a', 'an', 'of', 'and', 'to',
  'for', 'about', 'does', 'do', 'did', 'how', 'like', 'with', 'he', 'his',
  'elazar', 'gary', 'tell', 'me', 'can', 'you', 'please', 'in', 'on', 'at',
]);

const DETAIL_TOKENS = new Set([
  'ingredient', 'ingredients', 'recipe', 'recipes', 'contains', 'contain',
  'made', 'made-of', 'components', 'details', 'detail', 'breakdown', 'what-in',
]);

const MODE_VISIBILITY: Record<GaryMode, Set<KnowledgeVisibility>> = {
  professional: new Set(['public']),
  shidduch: new Set(['public', 'shidduch', 'personal']),
  full: new Set(['public', 'shidduch', 'personal']),
};

const ALIASES: Record<string, string[]> = {
  food: ['meal', 'eat', 'eating', 'favorite', 'kosher', 'restaurant'],
  meal: ['food', 'eat', 'eating', 'bowl'],
  personality: ['person', 'social', 'friendly', 'quiet', 'comfortable', 'humor', 'funny'],
  career: ['job', 'work', 'future', 'development', 'career', 'ambition'],
  projects: ['built', 'build', 'app', 'software', 'menu', 'invoice', 'elazaros'],
  interests: ['like', 'likes', 'enjoy', 'hobby', 'off-road', 'offroading', 'jeep'],
  shidduch: ['wife', 'marriage', 'relationship', 'dating', 'partner', 'woman'],
};

function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !STOP_WORDS.has(token));
}

function expandedTokens(query: string): Set<string> {
  const tokens = normalize(query);
  const expanded = new Set(tokens);
  for (const token of tokens) {
    for (const alias of ALIASES[token] ?? []) expanded.add(alias);
  }
  return expanded;
}

function asksForDetails(queryTokens: Set<string>): boolean {
  return [...queryTokens].some((token) => DETAIL_TOKENS.has(token));
}

function score(queryTokens: Set<string>, knowledge: KnowledgeItem): number {
  const haystack = `${knowledge.id} ${knowledge.subject} ${knowledge.category} ${knowledge.fact} ${knowledge.negativeKnowledge.join(' ')}`.toLowerCase();
  const words = new Set(normalize(haystack));
  let points = 0;

  for (const token of queryTokens) {
    if (words.has(token)) points += 3;
  }

  if (queryTokens.has(knowledge.category.toLowerCase())) points += 4;
  if (knowledge.answerStrategy === 'direct') points += 1;
  return points;
}

export function retrieveKnowledge(
  query: string,
  mode: GaryMode,
  limit = 8,
): KnowledgeItem[] {
  const allowed = MODE_VISIBILITY[mode];
  const queryTokens = expandedTokens(query);
  const wantsDetails = asksForDetails(queryTokens);

  return KNOWLEDGE_BASE
    .filter((knowledge) => allowed.has(knowledge.visibility))
    .filter((knowledge) => knowledge.answerStrategy !== 'detail_on_request' || wantsDetails)
    .map((knowledge) => ({ knowledge, score: score(queryTokens, knowledge) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ knowledge }) => knowledge);
}

export function formatRetrievedKnowledge(items: KnowledgeItem[]): string {
  if (!items.length) return 'No specific knowledge items were retrieved. Do not invent details.';

  return items.map((knowledge) => {
    const negative = knowledge.negativeKnowledge.length
      ? `\nDo not infer or overstate: ${knowledge.negativeKnowledge.join(' | ')}`
      : '';

    return `[${knowledge.category} | strategy=${knowledge.answerStrategy} | confidence=${knowledge.confidence}] ${knowledge.fact}${negative}`;
  }).join('\n');
}
