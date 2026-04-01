import { db } from "@/db";
import { articles, aiElements, technicalAnalysis, documentation, essays, ratings, comments, commentLikes, articleVisits } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";

export async function getMovies() {
  try {
    const result = await db.select().from(articles).orderBy(desc(articles.createdAt));
    return result;
  } catch (error) {
    console.error("[Film Agent] Error al obtener películas desde Neon DB:", error);
    return [];
  }
}

export async function getMovieRatings(movies: { id: number; title: string; year: number; posterUrl: string; views: number }[]) {
  try {
    return await Promise.all(
      movies.map(async (movie) => {
        const movieRatings = await db.select().from(ratings).where(eq(ratings.articleId, movie.id));
        const avg = movieRatings.length > 0
          ? movieRatings.reduce((acc, curr) => acc + curr.score, 0) / movieRatings.length
          : 0;
        return { ...movie, rating: avg };
      })
    );
  } catch {
    return movies.map(m => ({ ...m, rating: 0 }));
  }
}

export async function getMovieById(id: number) {
  try {
    const [movie] = await db.select().from(articles).where(eq(articles.id, id));
    
    if (!movie) return null;

    const elements = await db.select().from(aiElements).where(eq(aiElements.articleId, id));
    const [tech] = await db.select().from(technicalAnalysis).where(eq(technicalAnalysis.articleId, id));
    const [doc] = await db.select().from(documentation).where(eq(documentation.articleId, id));
    const [essay] = await db.select().from(essays).where(eq(essays.articleId, id));
    const movieRatings = await db.select().from(ratings).where(eq(ratings.articleId, id));
    const movieComments = await db.select().from(comments).where(eq(comments.articleId, id)).orderBy(desc(comments.createdAt));
    const visits = await db.select().from(articleVisits).where(eq(articleVisits.articleId, id)).orderBy(desc(articleVisits.visitDate));

    // Get likes count + user info for each comment
    const client = await clerkClient();
    const commentsWithLikes = await Promise.all(
      movieComments.map(async (comment) => {
        const likes = await db.select().from(commentLikes).where(eq(commentLikes.commentId, comment.id));
        
        // Fetch user profile from Clerk
        let userName = "Usuario Anónimo";
        let userImage = "";
        try {
          const user = await client.users.getUser(comment.userId);
          userName = user.firstName 
            ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}` 
            : (user.username || user.emailAddresses[0]?.emailAddress?.split('@')[0] || "Usuario");
          userImage = user.imageUrl || "";
        } catch {
          // User might have been deleted
        }

        return {
          ...comment,
          userName,
          userImage,
          likeCount: likes.length,
          likedByUserIds: likes.map(l => l.userId),
        };
      })
    );

    const averageRating = movieRatings.length > 0 
      ? movieRatings.reduce((acc, curr) => acc + curr.score, 0) / movieRatings.length 
      : 0;

    return {
      ...movie,
      rating: averageRating,
      ratingCount: movieRatings.length,
      allRatings: movieRatings,
      aiElements: elements,
      technicalAnalysis: tech || null,
      documentation: doc || null,
      essay: essay || null,
      comments: commentsWithLikes,
      visits: visits,
    };
  } catch (error) {
    console.error("[Film Agent] Error al obtener película:", error);
    return null;
  }
}

export async function getComparisonData() {
  try {
    const allArticles = await db.select().from(articles).orderBy(desc(articles.views));
    
    const comparison = await Promise.all(
      allArticles.map(async (article) => {
        const movieRatings = await db.select().from(ratings).where(eq(ratings.articleId, article.id));
        const avg = movieRatings.length > 0
          ? (movieRatings.reduce((acc, curr) => acc + curr.score, 0) / movieRatings.length).toFixed(1)
          : "N/A";
        return {
          title: article.title,
          views: article.views,
          rating: avg,
        };
      })
    );

    return comparison;
  } catch (error) {
    console.error("[Film Agent] Error al obtener comparativa:", error);
    return [];
  }
}
