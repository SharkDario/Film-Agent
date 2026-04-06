import { SignInButton, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { Film } from 'lucide-react';
import { checkIsAdmin } from '@/lib/auth';

export async function SiteHeader() {
  const { userId } = await auth();
  const isAdmin = await checkIsAdmin();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Film className="h-6 w-6 text-red-600" />
            <span className="font-bold text-xl inline-block">Film Agent</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Películas
            </Link>
            <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Sobre el Blog
            </Link>
          </nav>
        </div>
        <div className="flex items-center justify-end space-x-4">
          {!userId ? (
            <div className="[&>button]:bg-red-600 [&>button]:text-white [&>button]:rounded-md [&>button]:px-4 [&>button]:py-2 [&>button]:font-medium [&>button]:hover:bg-red-700 [&>button]:transition">
              <SignInButton mode="modal" />
            </div>
          ) : (
            <>
              {isAdmin && (
                <Link
                  href="/admin/movies/new"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition"
                >
                  ➕ Añadir Película
                </Link>
              )}
              <UserButton />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
