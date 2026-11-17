export type KnowledgeVisibility = "public" | "shidduch" | "personal" | "private" | "sensitive";
export type KnowledgeConfidence = "explicit" | "inferred" | "uncertain";
export type AnswerStrategy = "direct" | "short" | "contextual" | "illustrative" | "detail_on_request" | "do_not_surface";

export interface KnowledgeItem {
  id: string;
  subject: string;
  fact: string;
  category: string;
  visibility: KnowledgeVisibility;
  confidence: KnowledgeConfidence;
  answerStrategy: AnswerStrategy;
  relatedIds?: string[];
  negativeKnowledge?: string[];
  source?: string;
  lastUpdated?: string;
}

export interface KnowledgeQueryContext {
  mode: "professional" | "shidduch" | "full";
  userQuestion: string;
}

export const VISIBILITY_ORDER: KnowledgeVisibility[] = [
  "public",
  "shidduch",
  "personal",
  "private",
  "sensitive",
];

export function canSurface(item: KnowledgeItem, mode: KnowledgeQueryContext["mode"]): boolean {
  if (item.visibility === "private" || item.visibility === "sensitive") return false;
  if (item.visibility === "shidduch") return mode === "shidduch" || mode === "full";
  if (item.visibility === "personal") return mode !== "professional";
  return true;
}
