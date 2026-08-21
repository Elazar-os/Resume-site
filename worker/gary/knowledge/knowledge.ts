import type { KnowledgeItem, KnowledgeVisibility, KnowledgeConfidence, AnswerStrategy } from './schema';
import { IDENTITY_KNOWLEDGE } from './identity';
import { PERSONALITY_KNOWLEDGE } from './personality';
import { INTEREST_KNOWLEDGE } from './interests';
import { CAREER_KNOWLEDGE } from './career';

const item = (
  id: string,
  subject: string,
  category: string,
  fact: string,
  visibility: KnowledgeVisibility = 'public',
  confidence: KnowledgeConfidence = 'explicit',
  answerStrategy: AnswerStrategy = 'contextual',
  negativeKnowledge: string[] = [],
): KnowledgeItem => ({
  id,
  subject,
  category,
  fact,
  visibility,
  confidence,
  answerStrategy,
  negativeKnowledge,
  source: 'Elazar knowledge base',
  lastUpdated: '2026-08-21',
});

export const KNOWLEDGE_BASE: KnowledgeItem[] = [
  item('identity.name', 'Elazar', 'identity', `Elazar's name is ${IDENTITY_KNOWLEDGE.name}.`, 'public', 'explicit', 'direct'),
  item('identity.role', 'work', 'identity', `Elazar is ${IDENTITY_KNOWLEDGE.role}.`, 'public', 'explicit', 'direct'),
  item('identity.location', 'location', 'identity', `Elazar is in ${IDENTITY_KNOWLEDGE.location}.`, 'public', 'explicit', 'direct'),
  item('personality.core-pattern', 'problem-solving', 'personality', PERSONALITY_KNOWLEDGE.corePattern, 'public', 'explicit', 'contextual'),
  item('personality.social-style', 'social style', 'personality', PERSONALITY_KNOWLEDGE.socialStyle, 'public', 'explicit', 'contextual', [
    'Reserved does not mean unapproachable.',
    'Calm does not mean emotionally detached.',
    'Quiet does not mean antisocial.',
  ]),
  item('personality.humor', 'humor', 'personality', PERSONALITY_KNOWLEDGE.humor, 'public', 'explicit', 'contextual', [
    'Do not use the same anecdote repeatedly as the default evidence of Elazar\'s personality.',
  ]),
  item('personality.ambition', 'ambition', 'personality', 'Elazar can be quietly ambitious. His low-key demeanor should not be interpreted as a lack of drive or big-picture thinking.', 'public', 'explicit', 'contextual', [
    'A calm or practical demeanor does not mean Elazar lacks ambition.',
  ]),
  item('career.direction', 'career direction', 'career', CAREER_KNOWLEDGE.careerDirection, 'public', 'explicit', 'contextual', CAREER_KNOWLEDGE.negativeKnowledge),
  item('technical.identity', 'technical identity', 'technical', CAREER_KNOWLEDGE.technicalIdentity, 'public', 'explicit', 'contextual', [
    'Building software does not make Elazar a professional software engineer or expert programmer.',
  ]),
  item('interests.favorite-food', 'favorite food', 'food', `Elazar's favorite food is ${INTEREST_KNOWLEDGE.favorites.food}.`, 'personal', 'explicit', 'direct'),
  item('interests.favorite-meal', 'favorite meal', 'food', `Elazar's favorite meal is a ${INTEREST_KNOWLEDGE.favorites.meal}.`, 'personal', 'explicit', 'short', [
    'Do not automatically list the ingredients unless the user asks for meal details.',
    'Do not infer that Elazar eats at the Chipotle restaurant from the name of the meal.',
  ]),
  item('interests.favorite-meal-details', 'favorite meal ingredients', 'food', `The chicken rice bowl includes ${INTEREST_KNOWLEDGE.favorites.mealDetails.join(', ')}.`, 'personal', 'explicit', 'detail_on_request'),
  item('interests.kosher-chipotle', 'Chipotle restaurant', 'food', INTEREST_KNOWLEDGE.foodContext.kosherNote, 'personal', 'explicit', 'direct'),
  item('interests.off-roading', 'off-roading', 'interests', 'Elazar does not like off-roading; a one-time experience should not be described as an ongoing hobby.', 'personal', 'explicit', 'direct'),
];

export const KNOWLEDGE_RULES = {
  answerFirst: true,
  avoidFactDumps: true,
  useExamplesOnlyWhenRelevant: true,
  respectAnswerStrategy: true,
  neverTreatInferenceAsFact: true,
  neverOverrideVisibility: true,
};
