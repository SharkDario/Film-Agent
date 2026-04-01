import { SiteHeader } from "@/components/SiteHeader";
import { getMovieById } from "@/lib/data";
import { notFound } from "next/navigation";
import { 
  updateMovieBasic, 
  saveTechnicalAnalysis, 
  saveDocumentation, 
  saveEssay, 
  addAiElement, 
  deleteAiElement 
} from "@/app/actions";
import { Film, Brain, Microscope, BookOpen, Scale, Trash2 } from "lucide-react";
import Image from "next/image";

interface EditPageProps {
  params: { id: string };
}

export default async function EditMoviePage({ params }: EditPageProps) {
  const resolvedParams = await params;
  const movieId = parseInt(resolvedParams.id, 10);
  
  if (isNaN(movieId)) notFound();

  const movie = await getMovieById(movieId);
  if (!movie) notFound();

  // Bind the articleId to the server actions
  const actionBasic = updateMovieBasic.bind(null, movieId);
  const actionTech = saveTechnicalAnalysis.bind(null, movieId);
  const actionDoc = saveDocumentation.bind(null, movieId);
  const actionEssay = saveEssay.bind(null, movieId);
  const actionAddAi = addAiElement.bind(null, movieId);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <SiteHeader />
      
      <main className="container mx-auto max-w-4xl px-4 mt-12 space-y-12">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-24 rounded-md overflow-hidden shrink-0 border border-white/10">
            <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Editor: {movie.title}</h1>
            <p className="text-muted-foreground mt-1">Modifica el contenido por secciones separadas.</p>
          </div>
        </div>

        {/* 1. Datos Básicos */}
        <section className="bg-card/40 border border-border/50 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-black/20 p-4 border-b border-white/5 flex items-center gap-2">
            <Film className="text-red-500" size={20} />
            <h2 className="text-lg font-bold">Datos Básicos</h2>
          </div>
          <form action={actionBasic} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-foreground">Título</label>
                <input type="text" name="title" defaultValue={movie.title} required className="w-full h-10 rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground">Año</label>
                <input type="number" name="year" defaultValue={movie.year} required className="w-full h-10 rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-foreground">Cover URL</label>
              <input type="url" name="poster" defaultValue={movie.posterUrl} required className="w-full h-10 rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-foreground">Trailer URL (YouTube)</label>
              <input type="url" name="trailer" defaultValue={movie.trailerUrl || ''} className="w-full h-10 rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-white" placeholder="https://www.youtube.com/watch?v=..." />
            </div>
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition">Actualizar Película</button>
          </form>
        </section>

        {/* 2. Catálogo de IA */}
        <section className="bg-card/40 border border-border/50 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-black/20 p-4 border-b border-white/5 flex items-center gap-2">
            <Brain className="text-purple-500" size={20} />
            <h2 className="text-lg font-bold">Catálogo de IA</h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Lista actual de IA */}
            {movie.aiElements && movie.aiElements.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Inteligencias Registradas</h3>
                {movie.aiElements.map(ai => (
                  <div key={ai.id} className="flex items-center justify-between p-3 bg-background/80 rounded-md border border-white/5">
                    <div>
                      <span className="font-semibold text-white mr-2">{ai.name}</span>
                      <span className="text-xs px-2 py-0.5 bg-purple-900/30 text-purple-300 rounded">{ai.type}</span>
                    </div>
                    <form action={deleteAiElement.bind(null, movieId, ai.id)}>
                      <button type="submit" className="text-red-400 hover:text-red-300 p-1" title="Borrar Elemento"><Trash2 size={16} /></button>
                    </form>
                  </div>
                ))}
              </div>
            )}

            {/* Nuevo Elemento */}
            <form action={actionAddAi} className="p-4 bg-black/10 rounded-md border border-white/5 border-dashed space-y-4">
              <h3 className="text-sm font-medium text-white">Añadir Nueva IA al Catálogo</h3>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="name" placeholder="Nombre (Ej: HAL 9000)" required className="h-9 rounded-md border border-input bg-background/50 px-3 text-sm" />
                <input type="text" name="type" placeholder="Tipo (Ej: AGI, LLM, Robot)" required className="h-9 rounded-md border border-input bg-background/50 px-3 text-sm" />
              </div>
              <textarea name="description" placeholder="Descripción de sus capacidades en la película..." required rows={2} className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm" />
              <textarea name="realWorldEquivalent" placeholder="Equivalencia en el mundo real actual..." required rows={2} className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm" />
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition">➕ Agregar Elemento IA</button>
            </form>
          </div>
        </section>

        {/* 3. Análisis Técnico */}
        <section className="bg-card/40 border border-border/50 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-black/20 p-4 border-b border-white/5 flex items-center gap-2">
            <Microscope className="text-green-500" size={20} />
            <h2 className="text-lg font-bold">Análisis Técnico vs Realismo</h2>
          </div>
          <form action={actionTech} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-foreground">¿Qué elementos son realistas?</label>
              <textarea name="realisticElements" defaultValue={movie.technicalAnalysis?.realisticElements} className="w-full p-3 rounded-md border border-input bg-background/50 text-sm h-24" placeholder="Describe lo que se alinea con la ciencia real..."></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-foreground">¿Qué es pura ciencia ficción?</label>
              <textarea name="pureSciFi" defaultValue={movie.technicalAnalysis?.pureSciFi} className="w-full p-3 rounded-md border border-input bg-background/50 text-sm h-24" placeholder="Describe los elementos fantasiosos..."></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-foreground">Veredicto Resumido de Representación</label>
              <input type="text" name="representationAccuracy" defaultValue={movie.technicalAnalysis?.representationAccuracy} className="w-full h-10 rounded-md border border-input bg-background/50 px-3 text-sm" placeholder="Ej: Película altamente realista con libertad artística en X..." />
            </div>
            <button type="submit" className="bg-green-600/80 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition">Guardar Análisis</button>
          </form>
        </section>

        {/* 4. Documentación Científica y Papers */}
        <section className="bg-card/40 border border-border/50 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-black/20 p-4 border-b border-white/5 flex items-center gap-2">
            <BookOpen className="text-blue-500" size={20} />
            <h2 className="text-lg font-bold">Documentación Científica</h2>
          </div>
          <form action={actionDoc} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-foreground">¿Cómo funciona la IA equivalente hoy?</label>
              <textarea name="howItWorks" defaultValue={movie.documentation?.howItWorks} className="w-full p-3 rounded-md border border-input bg-background/50 text-sm h-24" required></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-foreground">Limitaciones Actuales</label>
              <textarea name="limitations" defaultValue={movie.documentation?.limitations} className="w-full p-3 rounded-md border border-input bg-background/50 text-sm h-24" required></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-foreground">Distancia a la Realidad (Años / Barreras)</label>
              <textarea name="distanceToReality" defaultValue={movie.documentation?.distanceToReality} className="w-full p-3 rounded-md border border-input bg-background/50 text-sm h-24" required></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-foreground">Descubrimientos o Avances Requeridos</label>
              <textarea name="requiredAdvances" defaultValue={movie.documentation?.requiredAdvances} className="w-full p-3 rounded-md border border-input bg-background/50 text-sm h-24" required></textarea>
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm text-foreground">Referencias (Formato APA / Bibliografía)</label>
              <textarea name="references" defaultValue={movie.documentation?.references || ''} className="w-full p-3 rounded-md border border-input bg-background/50 text-sm h-32" placeholder="Agrega aquí los papers, sitios web y fuentes consultadas..."></textarea>
            </div>
            
            <div className="md:col-span-2 pt-2 border-t border-white/5">
              <button type="submit" className="bg-blue-600/80 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition">Guardar Documentación</button>
            </div>
          </form>
        </section>

        {/* 5. Ensayos y Ética */}
        <section className="bg-card/40 border border-border/50 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-black/20 p-4 border-b border-white/5 flex items-center gap-2">
            <Scale className="text-amber-500" size={20} />
            <h2 className="text-lg font-bold">Ensayos y Ética</h2>
          </div>
          <form action={actionEssay} className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-foreground">Dilemas Éticos Tratados en la Trama</label>
              <textarea name="ethicalDilemmas" defaultValue={movie.essay?.ethicalDilemmas} className="w-full p-3 rounded-md border border-input bg-background/50 text-sm h-32" required></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-foreground">Implicaciones Sociales Positivas/Negativas</label>
              <textarea name="socialImplications" defaultValue={movie.essay?.socialImplications} className="w-full p-3 rounded-md border border-input bg-background/50 text-sm h-32" required></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-foreground capitalize">Postura Personal / Profesional (Análisis)</label>
              <textarea name="personalStance" defaultValue={movie.essay?.personalStance} className="w-full p-3 rounded-md border border-input bg-background/50 text-sm h-32" required></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-foreground">Legislación y Regulaciones Sugeridas</label>
              <textarea name="regulations" defaultValue={movie.essay?.regulations} className="w-full p-3 rounded-md border border-input bg-background/50 text-sm h-24" required></textarea>
            </div>
            <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium transition">Guardar Ensayo Final</button>
          </form>
        </section>
        
        <div className="pt-8 pb-12 flex justify-center">
            <a href={`/movie/${movie.id}`} className="px-6 py-3 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-full transition">
               ← Volver a ver el Artículo Público
            </a>
        </div>

      </main>
    </div>
  );
}
