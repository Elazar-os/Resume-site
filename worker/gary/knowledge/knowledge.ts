import type { KnowledgeItem, KnowledgeVisibility, KnowledgeConfidence, AnswerStrategy } from './schema';
import { IDENTITY_KNOWLEDGE } from './identity';
import { PERSONALITY_KNOWLEDGE } from './personality';
import { INTEREST_KNOWLEDGE } from './interests';
import { CAREER_KNOWLEDGE } from './career';
import { PROJECT_KNOWLEDGE } from './projects';
import { SHIDDUCH_KNOWLEDGE } from './shidduch';

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
  lastUpdated: '2026-11-17',
});

export const KNOWLEDGE_BASE: KnowledgeItem[] = [
  item('identity.name', 'Elazar', 'identity', `Elazar's name is ${IDENTITY_KNOWLEDGE.name}. Nickname: ${IDENTITY_KNOWLEDGE.nickname}. About 23 in 2026. Never give a birth date.`, 'public', 'explicit', 'direct'),
  item('identity.role', 'work', 'identity', `Elazar is ${IDENTITY_KNOWLEDGE.role}. ${IDENTITY_KNOWLEDGE.restaurantExperience}. King of Delancey is his job, not his identity. Only lead with it when the question is about work.`, 'public', 'explicit', 'direct', [
    'Do not make the restaurant his whole identity.',
    'Do not add the menu app or invoice tracker unless the question is about tools or building.',
  ]),
  item('identity.location', 'location', 'identity', `Elazar is in ${IDENTITY_KNOWLEDGE.location}. Never give a specific town or address.`, 'public', 'explicit', 'direct'),
  item('identity.appearance', 'appearance', 'identity', `Appearance: ${IDENTITY_KNOWLEDGE.appearance.height}, ${IDENTITY_KNOWLEDGE.appearance.build}, ${IDENTITY_KNOWLEDGE.appearance.hair}, ${IDENTITY_KNOWLEDGE.appearance.eyes}, ${IDENTITY_KNOWLEDGE.appearance.glasses}, ${IDENTITY_KNOWLEDGE.appearance.facialHair}, warm approachable smile.`, 'personal', 'explicit', 'direct'),
  item('identity.education', 'education', 'identity', `Education: ${IDENTITY_KNOWLEDGE.education.join('; ')}. No college degree.`, 'public', 'explicit', 'short'),
  item('identity.learning', 'learning', 'identity', `${IDENTITY_KNOWLEDGE.jewishLife.currentLearning}. ${IDENTITY_KNOWLEDGE.jewishLife.shabbosLearning}. He goes to night seder every night. If he talks about skipping, he is usually joking. Mention only when relevant.`, 'public', 'explicit', 'contextual', [
    'Do not force PTI, Kollel, or night seder into unrelated answers.',
  ]),

  item('personality.core-pattern', 'problem-solving', 'personality', PERSONALITY_KNOWLEDGE.corePattern, 'public', 'explicit', 'contextual'),
  item('personality.traits', 'personality', 'personality', `Traits Elazar uses for himself: ${PERSONALITY_KNOWLEDGE.traits.join(', ')}.`, 'public', 'explicit', 'short'),
  item('personality.social-style', 'social style', 'personality', PERSONALITY_KNOWLEDGE.socialStyle, 'public', 'explicit', 'contextual', [
    'Reserved does not mean unapproachable.',
    'Calm does not mean emotionally detached.',
    'Quiet does not mean antisocial.',
  ]),
  item('personality.humor', 'humor', 'personality', PERSONALITY_KNOWLEDGE.humor + ' With close friends he is dry, blunt, and a little ridiculous. The humor is deadpan, not performative.', 'public', 'explicit', 'contextual', [
    'Do not use the same anecdote repeatedly as the default evidence of Elazar\'s personality.',
  ]),
  item('personality.values', 'values', 'personality', `Values: ${PERSONALITY_KNOWLEDGE.values.join(', ')}. Dislikes: ${PERSONALITY_KNOWLEDGE.dislikes.join(', ')}.`, 'public', 'explicit', 'contextual'),
  item('personality.hosting', 'hosting', 'personality', 'Elazar enjoys cooking and hosting. These are genuine interests, but do not imply he currently hosts or cooks frequently unless current activity is explicitly supported.', 'personal', 'explicit', 'contextual', [
    'Do not describe cooking or hosting as a regular routine without evidence of current frequency.',
  ]),

  item('career.direction', 'career direction', 'career', CAREER_KNOWLEDGE.careerDirection, 'public', 'explicit', 'do_not_surface', CAREER_KNOWLEDGE.negativeKnowledge),
  item('technical.identity', 'technical identity', 'technical', CAREER_KNOWLEDGE.technicalIdentity + ' He is not a senior engineer or professional software engineer.', 'public', 'explicit', 'contextual', [
    'Building software does not make Elazar a professional software engineer or expert programmer.',
  ]),
  item('projects.menu', 'menu', 'projects', `${PROJECT_KNOWLEDGE.kodDigitalMenu.name}: ${PROJECT_KNOWLEDGE.kodDigitalMenu.description} Why: ${PROJECT_KNOWLEDGE.kodDigitalMenu.why}`, 'public', 'explicit', 'contextual', [
    'Only mention when the question is about tools, building, or the restaurant system.',
  ]),
  item('projects.invoice', 'invoice', 'projects', `${PROJECT_KNOWLEDGE.kodInvoiceTracker.name}: ${PROJECT_KNOWLEDGE.kodInvoiceTracker.description}`, 'public', 'explicit', 'contextual'),
  item('projects.elazaros', 'ElazarOS', 'projects', `${PROJECT_KNOWLEDGE.elazarOS.name}: ${PROJECT_KNOWLEDGE.elazarOS.description} ${PROJECT_KNOWLEDGE.elazarOS.origin}`, 'public', 'explicit', 'short'),

  item('interests.favorite-food', 'favorite food', 'food', `Elazar's favorite food is ${INTEREST_KNOWLEDGE.favorites.food}.`, 'personal', 'explicit', 'direct'),
  item('interests.favorite-meal', 'favorite meal', 'food', `Elazar's favorite meal is a ${INTEREST_KNOWLEDGE.favorites.meal}.`, 'personal', 'explicit', 'short', [
    'Do not automatically list the ingredients unless the user asks for meal details.',
    'Do not infer that Elazar eats at the Chipotle restaurant from the name of the meal.',
  ]),
  item('interests.favorite-meal-details', 'favorite meal ingredients', 'food', `The chicken rice bowl includes ${INTEREST_KNOWLEDGE.favorites.mealDetails.join(', ')}.`, 'personal', 'explicit', 'detail_on_request'),
  item('interests.kosher-chipotle', 'Chipotle restaurant', 'food', INTEREST_KNOWLEDGE.foodContext.kosherNote, 'personal', 'explicit', 'direct'),
  item('interests.favorites', 'favorites', 'food', `Other favorites: acai bowl, pistachio ice cream, black, Batman, The Arrow, virgin mojito, spring, Pesach, Wednesday. Use one or two, not the whole list.`, 'personal', 'explicit', 'short'),
  item('interests.cooks', 'cooking', 'food', `Foods Elazar has cooked include ${INTEREST_KNOWLEDGE.makes.join(', ')}.`, 'personal', 'explicit', 'short', [
    'Do not imply he currently cooks these foods regularly.',
  ]),
  item('interests.enjoys', 'hobbies', 'interests', `He genuinely enjoys ${INTEREST_KNOWLEDGE.enjoys.join(', ')}. ${INTEREST_KNOWLEDGE.activityFrequencyNote} Fun answers should paint one picture, not dump the list.`, 'personal', 'explicit', 'short', [
    'Interests are not automatically current or frequent activities.',
  ]),
  item('interests.jeep', 'Jeep', 'interests', `He owns and drives a ${INTEREST_KNOWLEDGE.vehicle}.`, 'personal', 'explicit', 'direct', [
    'Owning a Jeep does not mean he likes off-roading.',
  ]),
  item('interests.off-roading', 'off-roading', 'interests', 'Elazar does not like off-roading. A one-time experience is not a hobby.', 'personal', 'explicit', 'direct'),
  item('interests.music', 'music', 'interests', `Music and shows he likes: ${INTEREST_KNOWLEDGE.musicExamples.join(', ')}.`, 'personal', 'explicit', 'short'),

  item('friends.moshe', 'Moshe', 'friends', 'Moshe Klagsbrun is a close friend, not just a reference name. Do not share his private details.', 'personal', 'explicit', 'short'),
  item('friends.shaya', 'Shaya', 'friends', 'Shaya Weisenfeld is a friend. Do not share private details.', 'personal', 'explicit', 'short'),
  item('friends.moshe-hungry', 'Moshe Hungry', 'friends', 'Optional bit, use rarely: a friend called the restaurant and said "Hi, I\'m Moshe and I\'m hungry," so he was entered as Moshe Hungry.', 'personal', 'explicit', 'illustrative', [
    'Do not use this as the default personality story.',
  ]),

  item('family.parents', 'family', 'family', 'Father: Moshie Greisman, Tax Attorney at Goldman Sachs. Mother: Elisheva (Schechter) Greisman, Resource Room Teacher.', 'shidduch', 'explicit', 'short'),
  item('family.grandparents', 'family', 'family', 'Grandparents: Meyer and Toby (Fink) Greisman, Lakewood. Dov Schechter and Miriam (Seidman) Schechter, a"h (Miriam only), Lakewood.', 'shidduch', 'explicit', 'short'),
  item('family.siblings', 'family', 'family', 'Siblings, Elazar is second oldest: Esther Baila (25), married to Shmuel Levenson (BMG), software developer; Elazar (23); Hillel (22), Hamptons Healthcare; Shloimy (18), Yeshivas Toras Maeir; Perri (15), Breuer\'s Bais Yaakov.', 'shidduch', 'explicit', 'short'),

  item('shidduch.process', 'shidduch', 'shidduch', 'He finds the formal shadchan process a little stiff. His line: a commercial shadchan setting up a date is the equivalent of "this could have been an email." Use only when the process comes up. Do not rant. Do not volunteer it.', 'shidduch', 'explicit', 'contextual'),
  item('shidduch.values', 'relationship', 'shidduch', `What he wants when this is the topic: ${SHIDDUCH_KNOWLEDGE.desiredPartnerQualities.join(', ')}. Marriage as best friends. ${SHIDDUCH_KNOWLEDGE.socialBalance}`, 'shidduch', 'explicit', 'contextual'),
  item('shidduch.home', 'home', 'shidduch', `Jewish home: ${SHIDDUCH_KNOWLEDGE.jewishHome.join(', ')}. Mention only when relationships, faith, or the future is the topic.`, 'shidduch', 'explicit', 'contextual'),
];

export const KNOWLEDGE_RULES = {
  answerFirst: true,
  avoidFactDumps: true,
  useExamplesOnlyWhenRelevant: true,
  respectAnswerStrategy: true,
  neverTreatInferenceAsFact: true,
  neverOverrideVisibility: true,
};
