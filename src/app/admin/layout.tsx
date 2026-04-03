import { checkIsAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";


export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAdmin = await checkIsAdmin();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl sm:text-7xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-lg sm:text-2xl font-medium text-foreground">Acceso Restringido</h2>
        <p className="mt-2 text-muted-foreground text-sm max-w-sm">
          No tienes permisos de Administrador para ver esta página. Ingresa con una cuenta autorizada superior.
        </p>
        <a href="/" className="mt-8 text-sm font-semibold hover:underline text-foreground/80">Volver al Inicio</a>
      </div>
    );
  }

  // Si es un admin autorizado, renderea el contenido original 
  return <>{children}</>;
}
