"use server";

import { db } from "@/db";
import { articles, aiElements, technicalAnalysis, documentation, essays, ratings, comments, commentLikes, articleVisits } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { checkIsAdmin } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";

export async function createMovieArticle(formData: FormData) {
  const { userId } = await auth();
  const isAdmin = await checkIsAdmin();
  
  // Si no hay usuario o no es admin, rechazamos la acción abruptamente
  if (!userId || !isAdmin) {
    throw new Error("Acción denegada. Solo los administradores pueden crear películas.");
  }

  const title = formData.get("title") as string;
  const year = parseInt(formData.get("year") as string, 10);
  const posterUrl = formData.get("poster") as string;
  const trailerUrl = formData.get("trailer") as string;
  const description = formData.get("description") as string;

  if (!title || !year || !posterUrl) {
    throw new Error("Por favor completa todos los campos básicos de la película.");
  }

  // Insertar en Neon DB
  const [newMovie] = await db.insert(articles).values({
    title,
    year,
    posterUrl,
    trailerUrl,
    description,
    views: 0
  }).returning();

  // Invalidamos la caché del home para ver la nueva película
  revalidatePath("/");
  
  return { success: true, movieId: newMovie.id };
}

// ----------------------------------------------------
// EDICIÓN DE PELÍCULAS Y TÓPICOS
// ----------------------------------------------------

export async function updateMovieBasic(articleId: number, formData: FormData) {
  const { userId } = await auth();
  const isAdmin = await checkIsAdmin();
  if (!userId || !isAdmin) throw new Error("Acceso denegado.");

  const title = formData.get("title") as string;
  const year = parseInt(formData.get("year") as string, 10);
  const posterUrl = formData.get("poster") as string;
  const trailerUrl = formData.get("trailer") as string;
  const description = formData.get("description") as string;

  await db.update(articles)
    .set({ title, year, posterUrl, trailerUrl, description })
    .where(eq(articles.id, articleId));

  revalidatePath(`/movie/${articleId}`);
  revalidatePath("/");
}

export async function addAiElement(articleId: number, formData: FormData) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) throw new Error("Acceso denegado.");

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const description = formData.get("description") as string;
  const realWorldEquivalent = formData.get("realWorldEquivalent") as string;

  await db.insert(aiElements).values({
    articleId,
    name,
    type,
    description,
    realWorldEquivalent,
  });

  revalidatePath(`/movie/${articleId}`);
}

export async function deleteAiElement(articleId: number, elementId: number) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) throw new Error("Acceso denegado.");

  await db.delete(aiElements).where(eq(aiElements.id, elementId));

  revalidatePath(`/movie/${articleId}`);
}

export async function saveTechnicalAnalysis(articleId: number, formData: FormData) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) throw new Error("Acceso denegado.");

  const data = {
    realisticElements: formData.get("realisticElements") as string,
    pureSciFi: formData.get("pureSciFi") as string,
    representationAccuracy: formData.get("representationAccuracy") as string,
  };

  const [updated] = await db.update(technicalAnalysis)
    .set(data)
    .where(eq(technicalAnalysis.articleId, articleId))
    .returning();

  if (!updated) {
    await db.insert(technicalAnalysis).values({ articleId, ...data });
  }

  revalidatePath(`/movie/${articleId}`);
}

export async function saveDocumentation(articleId: number, formData: FormData) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) throw new Error("Acceso denegado.");

  const data = {
    realEquivalentDesc: formData.get("realEquivalentDesc") as string || "",
    howItWorks: formData.get("howItWorks") as string,
    limitations: formData.get("limitations") as string,
    references: formData.get("references") as string || "",
    distanceToReality: formData.get("distanceToReality") as string,
    requiredAdvances: formData.get("requiredAdvances") as string,
    theoreticalPossibility: formData.get("theoreticalPossibility") as string || "",
  };

  const [updated] = await db.update(documentation)
    .set(data)
    .where(eq(documentation.articleId, articleId))
    .returning();

  if (!updated) {
    await db.insert(documentation).values({ articleId, ...data });
  }

  revalidatePath(`/movie/${articleId}`);
}

export async function saveEssay(articleId: number, formData: FormData) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) throw new Error("Acceso denegado.");

  const data = {
    ethicalDilemmas: formData.get("ethicalDilemmas") as string,
    socialImplications: formData.get("socialImplications") as string,
    personalStance: formData.get("personalStance") as string,
    regulations: formData.get("regulations") as string,
  };

  const [updated] = await db.update(essays)
    .set(data)
    .where(eq(essays.articleId, articleId))
    .returning();

  if (!updated) {
    await db.insert(essays).values({ articleId, ...data });
  }

  revalidatePath(`/movie/${articleId}`);
}

// ----------------------------------------------------
// INTERACTIVIDAD DE USUARIOS
// ----------------------------------------------------

export async function submitRating(articleId: number, score: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Debes iniciar sesión para calificar.");
  if (score < 1 || score > 5) throw new Error("Puntaje inválido.");

  // Check if user already rated
  const [existing] = await db.select().from(ratings)
    .where(and(eq(ratings.articleId, articleId), eq(ratings.userId, userId)));

  if (existing) {
    await db.update(ratings).set({ score }).where(eq(ratings.id, existing.id));
  } else {
    await db.insert(ratings).values({ articleId, userId, score });
  }

  revalidatePath(`/movie/${articleId}`);
}

export async function addComment(articleId: number, content: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Debes iniciar sesión para comentar.");
  if (!content.trim()) throw new Error("El comentario no puede estar vacío.");

  await db.insert(comments).values({ articleId, userId, content: content.trim() });
  revalidatePath(`/movie/${articleId}`);
}

export async function toggleLikeComment(commentId: number, articleId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Debes iniciar sesión.");

  const [existing] = await db.select().from(commentLikes)
    .where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, userId)));

  if (existing) {
    await db.delete(commentLikes).where(eq(commentLikes.id, existing.id));
  } else {
    await db.insert(commentLikes).values({ commentId, userId });
  }

  revalidatePath(`/movie/${articleId}`);
}

export async function trackVisit(articleId: number) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Increment article total views
  await db.update(articles)
    .set({ views: sql`${articles.views} + 1` })
    .where(eq(articles.id, articleId));

  // Upsert daily visit record
  const [existing] = await db.select().from(articleVisits)
    .where(and(eq(articleVisits.articleId, articleId), eq(articleVisits.visitDate, today)));

  if (existing) {
    await db.update(articleVisits)
      .set({ count: sql`${articleVisits.count} + 1` })
      .where(eq(articleVisits.id, existing.id));
  } else {
    await db.insert(articleVisits).values({ articleId, visitDate: today, count: 1 });
  }
}
