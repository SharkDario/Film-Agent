"use client";

import Image from "next/image";
import Link from "next/link";
import { StarRating } from "./StarRating";

interface FilmCardMovie {
  id: number;
  title: string;
  year: number;
  posterUrl: string;
  rating?: number;
}

interface FilmCardProps {
  movie: FilmCardMovie;
}

export function FilmCard({ movie }: FilmCardProps) {
  return (
    <Link href={`/movie/${movie.id}`} className="group block w-full max-w-[280px]">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md border border-border/50 bg-muted/20 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20">
        <Image
          src={movie.posterUrl}
          alt={`Póster de ${movie.title}`}
          fill
          className="object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        {/* Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg backdrop-blur-sm transition-transform duration-300 hover:scale-110">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="ml-1"
            >
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="font-semibold leading-none tracking-tight text-foreground line-clamp-1" title={movie.title}>
          {movie.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{movie.year}</span>
          {movie.rating !== undefined && movie.rating > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-medium text-yellow-500">{movie.rating.toFixed(1)}</span>
              <StarRating rating={movie.rating} maxStars={1} size={14} className="mt-[1px]" />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
