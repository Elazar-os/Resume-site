import type { KnowledgeItem, KnowledgeVisibility, KnowledgeConfidence, AnswerStrategy } from './schema';
import { IDENTITY_KNOWLEDGE } from './identity';
import { PERSONALITY_KNOWLEDGE } from './personality';
import { INTEREST_KNOWLEDGE } from './interests';
import { CAREER_KNOWLEDGE } from './career';

const item = (
  id: string,
  category: string,
  fact: string,
  visibility: KnowledgeVisibility = 'public',
  confidence: KnowledgeConfidence = 'explicit',
  answerStrategy: AnswerStrategy = 'contextual',
  negativeKnowledge: string[] = [],
): KnowledgeItem => ({
  id,
  category,
  fact,
  visibility,
  confidence,
  answerStrategy,
  negativeKnowledge,
  source: 'Elazar knowledge base',
  lastUpdated: '2026-08-20',
});

export const KNOWLEDGE_BASE: KnowledgeItem[] = [
  item('identity.name', 'identity', `Elazar's name is ${IDENTITY_KNOWLEDGE.name}.`, 'public', 'explicit', 'direct'),
  item('identity.role', 'identity', `Elazar is ${IDENTITY_KNOWLEDGE.role}.`, 'public', 'explicit', 'direct'),
  item('identity.location', 'identity', `Elazar is in ${IDENTITY_KNOWLEDGE.location}.`, 'public', 'explicit', 'direct'),
  item('personality.core-pattern', 'personality', PERSONALITY_KNOWLEDGE.corePattern, 'public', 'explicit', 'contextual'),
  item('personality.social-style', 'personality', PERSONALITY_KNOWLEDGE.socialStyle, 'public', 'explicit', 'contextual', [
    'Reserved does not mean unapproachable.',
    'Calm does not mean emotionally detached.',
    'Quiet does not mean antisocial.',
  ]),
  item('personality.humor', 'personality', PERSONALITY_KNOWLEDGE.humor, 'public', 'explicit', 'contextual', [
    'Do not use the same anecdote repeatedly as the default evidence of Elazar\'s personality.',
  ]),
  item('career.direction', 'career', CAREER_KNOWLEDGE.careerDirection, 'public', 'explicit', 'contextual', CAREER_KNOWLEDGE.negativeKnowledge),
  item('interests.favorite-food', 'food', `Elazar's favorite food is ${INTEREST_KNOWLEDGE.favorites.food}.`, 'personal', 'explicit', 'direct'),
  item('interests.favorite-meal', 'food', `Elazar's favorite meal is a ${INTEREST_KNOWLEDGE.favorites.meal}.`, 'personal', 'explicit', 'short', INTEREST_KNOWLEDGE.explicitNonInterests),
  item('interests.favorite-meal-details', 'food', `The chicken rice bowl includes ${INTEREST_KNOWLEDGE.favorites.mealDetails.join(', ')}.`, 'personal', 'explicit', 'detail_on_request'),
  item('interests.kosher-chipotle', 'food', INTEREST_KNOWLEDGE.foodContext.kosherNote, 'personal', 'explicit', 'direct'),
  item('interests.off-roading', 'interests', 'Elazar does not like off-roading; the one-time experience should not be described as an ongoing hobby.', 'personal', 'explicit', 'direct'),
  item('technical.identity', 'technical', CAREER_KNOWLEDGE.technicalIdentity, 'public', 'explicit', 'contextual'),
];

export const KNOWLEDGE_RULES = {
  answerFirst: true,
  avoidFactDumps: true,
  useExamplesOnlyWhenRelevant: true,
  respectAnswerStrategy: true,
  neverTreatInferenceAsFact: true,
  neverOverrideVisibility: true,
};
