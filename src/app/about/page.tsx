import { SiteHeader } from "@/components/SiteHeader";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <SiteHeader />

      <main className="container mx-auto max-w-3xl px-4 mt-16 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Sobre <span className="text-red-600">Film Agent</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Un espacio dedicado a explorar, analizar y desmitificar la convergencia entre la inteligencia artificial y el séptimo arte.
          </p>
        </div>

        <div className="bg-card/30 border border-border/50 p-8 md:p-12 rounded-2xl shadow-sm mt-12 relative overflow-hidden">
          {/* Adorno de diseño (Glassmorphism de fondo rojo tenue) */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-red-900/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-8">
            {/* Universidad Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-4">
                <Image
                  src="/ucp-oficial.png"
                  alt="Logo Universidad de la Cuenca del Plata"
                  width={64}
                  height={64}
                  className="rounded-lg"
                />
                <div className="text-left">
                  <p className="text-sm font-bold uppercase tracking-widest text-red-500">Proyecto Académico</p>
                  <h3 className="text-xl font-serif text-white/95">Universidad de la Cuenca del Plata</h3>
                </div>
              </div>
              <h3 className="text-lg font-medium text-muted-foreground">Cátedra de Sistemas Inteligentes</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 pt-6 border-t border-white/5">
              <div>
                <h4 className="text-sm text-muted-foreground uppercase tracking-widest mb-3">Directora de Cátedra</h4>
                <ul className="space-y-2">
                  <li className="font-medium text-white/90 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block"></span>
                    Prof. Benítez Micaela
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm text-muted-foreground uppercase tracking-widest mb-3">Equipo Autoral</h4>
                <ul className="space-y-3 font-medium text-white/80">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full inline-block"></span>
                    Acosta Marianela
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full inline-block"></span>
                    Cano Brenda
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full inline-block"></span>
                    Coronel Azul
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full inline-block"></span>
                    Coronel Miguel Dario
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/5 pt-8 text-center space-y-1">
              <p className="text-sm font-medium text-muted-foreground font-mono">
                Presentado el 7 de Abril, 2026
              </p>
              <p className="text-xs text-muted-foreground/60">
                Universidad de la Cuenca del Plata · ucp.edu.ar
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

