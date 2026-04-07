import { SiteHeader } from "@/components/SiteHeader";
import { Film, Calendar, Image as ImageIcon } from "lucide-react";
import { createMovieArticle } from "@/app/actions";
import { redirect } from "next/navigation";

export default function NewMoviePage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <SiteHeader />
      
      <main className="container mx-auto max-w-3xl px-4 mt-12 space-y-8">
        <div>
           <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
             <span className="w-1.5 h-8 bg-red-600 rounded-sm"></span> 
             Añadir Película
           </h1>
           <p className="text-muted-foreground">Inicia el registro base para una nueva película en la que analizarás su uso de la IA.</p>
        </div>

        <form action={async (formData) => {
           "use server";
           const res = await createMovieArticle(formData);
           if (res.success) {
             redirect(`/movie/${res.movieId}`);
           }
        }} className="bg-card/30 border border-border/50 p-8 rounded-xl space-y-8 shadow-sm">
           
           {/* Form Section */}
           <div className="space-y-6">
              
              <div className="space-y-2">
                 <label htmlFor="title" className="text-sm font-medium leading-none text-foreground">
                   Título de la Película
                 </label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <Film size={16} />
                   </div>
                   <input
                     type="text"
                     name="title"
                     id="title"
                     required
                     className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                     placeholder="Ej: Blade Runner 2049"
                   />
                 </div>
              </div>

              <div className="space-y-2">
                 <label htmlFor="year" className="text-sm font-medium leading-none text-foreground">
                   Año de Lanzamiento
                 </label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <Calendar size={16} />
                   </div>
                   <input
                     type="number"
                     name="year"
                     id="year"
                     required
                     className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                     placeholder="Ej: 2017"
                   />
                 </div>
              </div>

              <div className="space-y-2">
                 <label htmlFor="poster" className="text-sm font-medium leading-none text-foreground">
                   URL de la Portada (Vertical 2:3)
                 </label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <ImageIcon size={16} />
                   </div>
                   <input
                     type="url"
                     name="poster"
                     id="poster"
                     required
                     className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                     placeholder="https://..."
                   />
                 </div>
                 <p className="text-[0.8rem] text-muted-foreground mt-1">
                   Para un estilo "Netflix", la imagen debe ser vertical.
                 </p>
              </div>

              <div className="space-y-2">
                 <label htmlFor="trailer" className="text-sm font-medium leading-none text-foreground">
                   URL del Tráiler (YouTube)
                 </label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <ImageIcon size={16} />
                   </div>
                   <input
                     type="url"
                     name="trailer"
                     id="trailer"
                     className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                     placeholder="https://www.youtube.com/watch?v=..."
                   />
                 </div>
                 <p className="text-[0.8rem] text-muted-foreground mt-1">
                   Opcional. Se mostrará en la parte superior del artículo.
                 </p>
              </div>

              <div className="space-y-2">
                 <label htmlFor="description" className="text-sm font-medium leading-none text-foreground">
                   Descripción
                 </label>
                 <textarea
                   name="description"
                   id="description"
                   rows={4}
                   className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                   placeholder="Añade una descripción de la película y cómo se relaciona con la IA..."
                 />
                 <p className="text-[0.8rem] text-muted-foreground mt-1">
                   Se mostrará principalmente como texto destacado en recomendaciones y vistas.
                 </p>
              </div>

           </div>

           <div className="border-t border-border/50 pt-6 flex items-center justify-end gap-4">
              <button 
                type="button"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground h-10 px-4 py-2 border border-transparent"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-700 h-10 px-6 py-2 shadow-sm"
              >
                Crear Artículo
              </button>
           </div>
        </form>
      </main>
    </div>
  );
}
