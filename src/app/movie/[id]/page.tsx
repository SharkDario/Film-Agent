import { getMovieById, getComparisonData } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { StarRating } from "@/components/StarRating";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { checkIsAdmin } from "@/lib/auth";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { InteractiveRating } from "@/components/InteractiveRating";
import { CommentForm } from "@/components/CommentForm";
import { LikeButton } from "@/components/LikeButton";
import { VisitTracker } from "@/components/VisitTracker";
import { FloatingVideo } from "@/components/FloatingVideo";

interface MoviePageProps {
  params: {
    id: string;
  };
}

function getYouTubeEmbedUrl(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
}

export default async function MoviePage({ params }: MoviePageProps) {
  // En Next.js >14.2 el objeto params puede venir como Promesa, lo resolvemos primero.
  const resolvedParams = await params;
  const movieId = parseInt(resolvedParams.id, 10);
  
  if (isNaN(movieId)) {
    notFound();
  }

  const movie = await getMovieById(movieId);
  const { userId } = await auth();
  const isAdmin = await checkIsAdmin();

  if (!movie) {
    notFound();
  }

  // Fetch comparison data for analytics table
  const comparison = await getComparisonData();

  // Find the current user's rating if logged in
  const userRating = userId 
    ? movie.allRatings.find(r => r.userId === userId)?.score ?? 0
    : 0;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <SiteHeader />
      
      {/* Immersive Header */}
      <section className="relative h-[60vh] min-h-[500px] w-full mt-[-64px]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[2px] opacity-40"
          style={{ backgroundImage: `url(${movie.posterUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
        
        <div className="container relative mx-auto h-full max-w-5xl px-4 flex items-end pb-8">
          <div className="flex gap-8 items-end w-full">
            <div className="hidden sm:block relative w-48 aspect-[2/3] rounded-md overflow-hidden shadow-2xl border border-white/10 shrink-0">
               <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  fill
                  className="object-cover"
               />
            </div>
             <div className="pb-4 flex-1 flex flex-col lg:flex-row justify-between items-end gap-8">
               <div className="flex-1">
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                   <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                     {movie.title}
                   </h1>
                   {isAdmin && (
                     <a 
                       href={`/admin/movies/${movie.id}/edit`}
                       className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600/20 text-red-500 border border-red-900/50 hover:bg-red-600 hover:text-white h-9 px-4 py-2"
                     >
                       ⚙️ Editar Artículo
                     </a>
                   )}
                 </div>
                 <div className="flex items-center flex-wrap gap-4 text-muted-foreground font-medium">
                   <span className="bg-red-600/20 text-red-500 border border-red-900/50 px-2 py-0.5 rounded text-sm">
                     Película
                   </span>
                   <span>{movie.year}</span>
                   {movie.rating && (
                     <div className="flex items-center gap-1 text-yellow-500">
                       <span className="text-white">{movie.rating.toFixed(1)}</span>
                       <StarRating rating={movie.rating} size={16} />
                     </div>
                   )}
                   <span>{movie.views.toLocaleString()} vistas</span>
                 </div>
               </div>
               
               {/* YouTube Trailer Embed (Floating PiP) */}
               {movie.trailerUrl && getYouTubeEmbedUrl(movie.trailerUrl) && (
                 <FloatingVideo 
                   embedUrl={getYouTubeEmbedUrl(movie.trailerUrl)!}
                   title={movie.title}
                 />
               )}
            </div>
          </div>
        </div>
      </section>

      {/* Topics Content Container */}
      <main className="container mx-auto max-w-4xl px-4 mt-12 space-y-16">
        
        {/* Catálogo IA */}
        {movie.aiElements && movie.aiElements.length > 0 && (
          <section className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold border-b border-border/50 pb-2 flex gap-2 items-center">
              <span className="w-1.5 h-6 bg-red-600 rounded-sm"></span> Catálogo de IA
            </h2>
            <div className="grid gap-6">
              {movie.aiElements.map((el) => (
                <div key={el.id} className="bg-muted/30 p-6 rounded-lg border border-white/5 shadow-sm">
                  <h3 className="text-xl font-semibold mb-2 text-red-100">{el.name}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{el.description}</p>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm bg-black/40 p-4 rounded-md">
                    <div>
                      <span className="block font-medium text-white/70 uppercase text-xs tracking-wider mb-1">Tipo de IA</span>
                      <span className="text-white/90">{el.type}</span>
                    </div>
                    <div>
                      <span className="block font-medium text-white/70 uppercase text-xs tracking-wider mb-1">Equivalente Real</span>
                      <span className="text-white/90">{el.realWorldEquivalent}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Análisis Técnico */}
        {movie.technicalAnalysis && (
          <section className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold border-b border-border/50 pb-2 flex gap-2 items-center">
              <span className="w-1.5 h-6 bg-red-600 rounded-sm"></span> Análisis Técnico
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
               <div className="flex gap-4 p-4 border-l-2 border-green-500/50 bg-green-950/20">
                 <div>
                   <h4 className="font-semibold text-green-200 mb-1">Elementos Realistas</h4>
                   <p>{movie.technicalAnalysis.realisticElements}</p>
                 </div>
               </div>
               <div className="flex gap-4 p-4 border-l-2 border-purple-500/50 bg-purple-950/20">
                 <div>
                   <h4 className="font-semibold text-purple-200 mb-1">Ciencia Ficción Pura</h4>
                   <p>{movie.technicalAnalysis.pureSciFi}</p>
                 </div>
               </div>
               <p className="px-4 py-2 border-l-4 border-muted italic text-foreground/80">
                 <strong className="block not-italic text-sm text-muted-foreground mr-2">Veredicto de Representación:</strong>
                 {movie.technicalAnalysis.representationAccuracy}
               </p>
            </div>
          </section>
        )}

        {/* Documentación */}
        {movie.documentation && (
          <section className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold border-b border-border/50 pb-2 flex gap-2 items-center">
              <span className="w-1.5 h-6 bg-red-600 rounded-sm"></span> Documentación Científica
            </h2>
            <div className="grid sm:grid-cols-2 gap-8 text-muted-foreground">
               <div className="space-y-4">
                 <div>
                   <h4 className="font-medium text-white mb-1">¿Cómo funciona hoy?</h4>
                   <p className="text-sm leading-relaxed">{movie.documentation.howItWorks}</p>
                 </div>
                 <div>
                   <h4 className="font-medium text-white mb-1">Limitaciones Actuales</h4>
                   <p className="text-sm leading-relaxed">{movie.documentation.limitations}</p>
                 </div>
               </div>
               <div className="space-y-4">
                 <div>
                   <h4 className="font-medium text-white mb-1">Distancia a la Realidad</h4>
                   <p className="text-sm leading-relaxed">{movie.documentation.distanceToReality}</p>
                 </div>
                 <div>
                   <h4 className="font-medium text-white mb-1">Avances Requeridos</h4>
                   <p className="text-sm leading-relaxed">{movie.documentation.requiredAdvances}</p>
                 </div>
               </div>
            </div>
            
            {/* Bibliografía APA Section */}
            {movie.documentation.references && (
              <div className="mt-8 p-6 bg-muted/20 border border-white/5 rounded-lg">
                <h4 className="text-sm font-bold uppercase tracking-widest text-blue-500 mb-4 inline-flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-500 rounded-full"></span> Bibliografía Académica (APA)
                </h4>
                <div className="text-muted-foreground italic text-sm whitespace-pre-line prose prose-sm prose-invert max-w-none">
                  {movie.documentation.references}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Ensayos y Ética */}
        {movie.essay && (
          <section className="scroll-mt-24 space-y-6">
            <h2 className="text-2xl font-bold border-b border-border/50 pb-2 flex gap-2 items-center">
              <span className="w-1.5 h-6 bg-red-600 rounded-sm"></span> Ensayos y Ética
            </h2>
            <article className="prose prose-invert prose-p:text-muted-foreground prose-h3:text-red-50 max-w-none">
              <h3>Dilemas Éticos Centrales</h3>
              <p>{movie.essay.ethicalDilemmas}</p>
              
              <h3>Implicaciones Sociales</h3>
              <p>{movie.essay.socialImplications}</p>
              
              <div className="bg-muted/20 p-6 rounded-md my-8 border border-muted/50">
                <h4 className="text-xl font-serif italic mb-3 text-white/90">Perspectiva Profesional</h4>
                <p className="text-muted-foreground font-medium">{movie.essay.personalStance}</p>
                <hr className="my-4 border-white/10" />
                <strong className="block text-sm uppercase tracking-wide text-muted-foreground/80 mb-2">Legislación Propuesta:</strong>
                <p className="text-sm text-foreground/70">{movie.essay.regulations}</p>
              </div>
            </article>
          </section>
        )}

        {/* Interactive Zone: Comments and Ratings */}
        <section className="border-t border-border/50 pt-10 mt-16 space-y-10">
          
          {/* Visit Tracker (invisible) */}
          <VisitTracker articleId={movie.id} />

          {/* Analytics Chart with real data */}
          <div className="bg-card/30 border border-border/50 p-6 rounded-xl">
             <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
               <span className="w-1.5 h-6 bg-red-600 rounded-sm"></span> Analíticas de Visitas
             </h3>
             <p className="text-muted-foreground text-sm">{movie.views.toLocaleString()} visualizaciones totales</p>
             <AnalyticsChart 
               visitData={movie.visits.map(v => ({ date: String(v.visitDate), views: v.count }))}
               comparison={comparison}
               currentTitle={movie.title}
             />
          </div>

          {/* Rating Section */}
          <div className="bg-card/50 border border-border/50 p-6 rounded-xl text-center flex flex-col items-center justify-center space-y-4">
            <h3 className="text-xl font-bold text-white">¿Qué te pareció el artículo y película?</h3>
            {movie.ratingCount > 0 && (
              <p className="text-sm text-muted-foreground">
                Promedio: <span className="text-yellow-500 font-bold">{movie.rating.toFixed(1)}</span> / 5 ({movie.ratingCount} {movie.ratingCount === 1 ? "voto" : "votos"})
              </p>
            )}
            {!userId ? (
              <>
                 <p className="text-muted-foreground">Inicia sesión para poder calificar y comentar.</p>
                 <div className="[&>button]:bg-red-600 [&>button]:text-white [&>button]:rounded-md [&>button]:px-6 [&>button]:py-2 [&>button]:mt-2 [&>button]:hover:bg-red-700 [&>button]:transition">
                   <SignInButton mode="modal" />
                 </div>
              </>
            ) : (
              <InteractiveRating articleId={movie.id} currentUserRating={userRating} />
            )}
          </div>
          
          {/* Comments Section */}
          <div>
            <h3 className="text-lg font-bold mb-6">
              Comentarios ({movie.comments.length})
            </h3>
            
            {/* Comment Form (only for logged-in users) */}
            {userId && (
              <div className="mb-6">
                <CommentForm articleId={movie.id} />
              </div>
            )}

            <div className="space-y-4">
              {movie.comments.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-8 border border-dashed border-white/10 rounded-lg">
                  No hay comentarios todavía. ¡Sé el primero en opinar!
                </p>
              )}
              {movie.comments.map((comment) => {
                const timeAgo = getTimeAgo(comment.createdAt);
                const isLikedByUser = userId ? comment.likedByUserIds.includes(userId) : false;

                return (
                  <div key={comment.id} className="p-4 bg-muted/20 rounded-md border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        {comment.userImage ? (
                          <img 
                            src={comment.userImage} 
                            alt={comment.userName}
                            className="w-7 h-7 rounded-full object-cover border border-white/10"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-muted/50 border border-white/10 flex items-center justify-center text-xs font-bold text-muted-foreground">
                            {comment.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-sm text-white/80">
                          {comment.userName}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{timeAgo}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{comment.content}</p>
                    {userId ? (
                      <LikeButton 
                        commentId={comment.id}
                        articleId={movie.id}
                        likeCount={comment.likeCount}
                        isLiked={isLikedByUser}
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        👍 {comment.likeCount} me gusta
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Justo ahora";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Hace ${diffHours}h`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `Hace ${diffDays}d`;
  
  return new Date(date).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
}
