import { KNOWLEDGE_BASE } from './knowledge';
import { canSurface, type KnowledgeItem, type KnowledgeQueryContext } from './schema';

export type GaryMode = KnowledgeQueryContext['mode'];

/**
 * Return every knowledge item permitted in the active Gary mode.
 * The model, not a lexical top-N search, decides what matters to the question.
 */
export function getKnowledgeForMode(mode: GaryMode): KnowledgeItem[] {
  return KNOWLEDGE_BASE.filter((item) => canSurface(item, mode));
}

/**
 * Compact, loss-aware representation of the complete approved knowledge base.
 * Retains facts, confidence, answer strategy, update date, relationships,
 * and explicit negative knowledge. Omits only redundant source labels.
 */
export function formatCondensedKnowledge(items: KnowledgeItem[]): string {
  if (!items.length) return 'No knowledge items are approved for this mode. Do not invent details.';

  return items.map((item) => {
    const header = [
      item.id,
      item.subject,
      item.category,
      item.visibility,
      item.confidence,
      item.answerStrategy,
      item.lastUpdated ?? '',
    ].filter(Boolean).join(' | ');
    const lines = [`[${header}] ${item.fact.trim()}`];
    if (item.negativeKnowledge?.length) {
      lines.push(`  DO NOT INFER: ${item.negativeKnowledge.join(' | ')}`);
    }
    if (item.relatedIds?.length) {
      lines.push(`  RELATED: ${item.relatedIds.join(', ')}`);
    }
    return lines.join('\n');
  }).join('\n');
}
