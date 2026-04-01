import { getMovies } from "@/lib/data";
import { getMovieRatings } from "@/lib/data";
import { FilmCard } from "@/components/FilmCard";
import { SiteHeader } from "@/components/SiteHeader";

export default async function Home() {
  const movies = await getMovies();
  const moviesWithRatings = await getMovieRatings(movies);
  
  // Asumiremos que la primera película es la 'Destacada' (Hero)
  const featuredMovie = movies[0];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-red-500/30">
      <SiteHeader />
      
      <main className="pb-16">
        {/* Hero Section */}
        {featuredMovie && (
          <section className="relative h-[60vh] min-h-[500px] w-full mt-[-64px]">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${featuredMovie.posterUrl})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
            </div>
            
            <div className="container relative mx-auto flex h-full max-w-7xl items-end px-4 pb-12 pt-24 sm:pb-16">
              <div className="max-w-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-sm bg-red-600 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                    Destacado
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">{featuredMovie.year}</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
                  {featuredMovie.title}
                </h1>
                <p className="max-w-xl text-lg text-muted-foreground/90 font-medium">
                  Una obra maestra de la ciencia y los algoritmos que reescribe la ética moderna e introduce dilemas que nos cuestionan qué significa estar vivo.
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <a
                    href={`/movie/${featuredMovie.id}`}
                    className="inline-flex h-11 items-center justify-center rounded-md bg-white px-8 font-medium text-black transition-colors hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/20 shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="mr-2"
                    >
                      <path d="M5 3l14 9-14 9V3z" />
                    </svg>
                    Análisis
                  </a>
                  <button className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-800/80 px-8 font-medium text-white backdrop-blur-sm transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-white/20 border border-white/10">
                    Más Información
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Movie Grid Section */}
        <section className="container mx-auto max-w-7xl px-4 mt-8">
          <h2 className="text-xl font-bold mb-6 tracking-tight flex items-center gap-2">
            <span className="w-1 h-6 bg-red-600 rounded-full inline-block"></span>
            Últimos Artículos
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
            {moviesWithRatings.map((movie) => (
              <FilmCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
