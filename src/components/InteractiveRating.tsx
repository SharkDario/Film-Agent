"use client";

import { StarRating } from "./StarRating";
import { submitRating } from "@/app/actions";
import { useState, useTransition } from "react";

interface InteractiveRatingProps {
  articleId: number;
  currentUserRating?: number;
}

export function InteractiveRating({ articleId, currentUserRating = 0 }: InteractiveRatingProps) {
  const [optimisticRating, setOptimisticRating] = useState(currentUserRating);
  const [isPending, startTransition] = useTransition();

  const handleRate = (score: number) => {
    setOptimisticRating(score);
    startTransition(async () => {
      await submitRating(articleId, score);
    });
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-muted-foreground text-sm">
        {optimisticRating > 0 ? `Tu calificación: ${optimisticRating}/5` : "Deja tu calificación:"}
      </p>
      <StarRating
        rating={optimisticRating}
        isInteractive
        maxStars={5}
        size={32}
        className="justify-center"
        onRate={handleRate}
      />
      {isPending && <p className="text-xs text-muted-foreground animate-pulse">Guardando...</p>}
    </div>
  );
}
