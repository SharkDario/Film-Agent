import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  date,
} from 'drizzle-orm/pg-core';

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  year: integer('year').notNull(),
  posterUrl: text('poster_url').notNull(),
  trailerUrl: text('trailer_url'),
  views: integer('views').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const aiElements = pgTable('ai_elements', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id').references(() => articles.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull(),
  realWorldEquivalent: text('real_world_equivalent').notNull(),
});

export const technicalAnalysis = pgTable('technical_analysis', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id').references(() => articles.id, { onDelete: 'cascade' }).notNull(),
  realisticElements: text('realistic_elements').notNull(),
  pureSciFi: text('pure_sci_fi').notNull(),
  representationAccuracy: text('representation_accuracy').notNull(),
});

export const documentation = pgTable('documentation', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id').references(() => articles.id, { onDelete: 'cascade' }).notNull(),
  realEquivalentDesc: text('real_equivalent_desc').notNull(),
  howItWorks: text('how_it_works').notNull(),
  limitations: text('limitations').notNull(),
  references: text('references').notNull(),
  distanceToReality: text('distance_to_reality').notNull(),
  requiredAdvances: text('required_advances').notNull(),
  theoreticalPossibility: text('theoretical_possibility').notNull(),
});

export const essays = pgTable('essays', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id').references(() => articles.id, { onDelete: 'cascade' }).notNull(),
  ethicalDilemmas: text('ethical_dilemmas').notNull(),
  socialImplications: text('social_implications').notNull(),
  personalStance: text('personal_stance').notNull(),
  regulations: text('regulations').notNull(),
});

export const ratings = pgTable('ratings', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id').references(() => articles.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').notNull(), // From Clerk
  score: integer('score').notNull(), // 1 to 5
});

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id').references(() => articles.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').notNull(), // From Clerk
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const commentLikes = pgTable('comment_likes', {
  id: serial('id').primaryKey(),
  commentId: integer('comment_id').references(() => comments.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').notNull(), // From Clerk
});

export const articleVisits = pgTable('article_visits', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id').references(() => articles.id, { onDelete: 'cascade' }).notNull(),
  visitDate: date('visit_date').notNull(), // using date type for timeline
  count: integer('count').default(1).notNull(),
});
