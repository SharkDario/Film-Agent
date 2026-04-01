"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating?: number;
  maxStars?: number;
  isInteractive?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
  size?: number;
}

export function StarRating({
  rating = 0,
  maxStars = 5,
  isInteractive = false,
  onRate,
  className,
  size = 16,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = isInteractive && hoverRating > 0 ? hoverRating : Math.round(rating);

  return (
    <div className={cn("flex space-x-1", className)}>
      {Array.from({ length: maxStars }).map((_, index) => {
        const value = index + 1;
        const isFilled = value <= displayRating;

        return (
          <button
            key={value}
            type="button"
            className={cn(
              "transition-colors",
              isInteractive ? "cursor-pointer hover:scale-110" : "cursor-default",
              isFilled ? "text-yellow-400" : "text-muted-foreground/30"
            )}
            onClick={() => isInteractive && onRate?.(value)}
            onMouseEnter={() => isInteractive && setHoverRating(value)}
            onMouseLeave={() => isInteractive && setHoverRating(0)}
            disabled={!isInteractive}
          >
            <Star
              size={size}
              className={cn(isFilled && "fill-current")}
            />
          </button>
        );
      })}
    </div>
  );
}
