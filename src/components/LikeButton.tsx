"use client";

import { toggleLikeComment } from "@/app/actions";
import { useState, useTransition } from "react";
import { ThumbsUp } from "lucide-react";

interface LikeButtonProps {
  commentId: number;
  articleId: number;
  likeCount: number;
  isLiked: boolean;
}

export function LikeButton({ commentId, articleId, likeCount, isLiked }: LikeButtonProps) {
  const [optimisticLiked, setOptimisticLiked] = useState(isLiked);
  const [optimisticCount, setOptimisticCount] = useState(likeCount);
  const [isPending, startTransition] = useTransition();
  const [animating, setAnimating] = useState(false);

  const handleToggle = () => {
    // Optimistic instant update
    const newLiked = !optimisticLiked;
    setOptimisticLiked(newLiked);
    setOptimisticCount(prev => newLiked ? prev + 1 : prev - 1);
    
    // Trigger pop animation
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);

    startTransition(async () => {
      await toggleLikeComment(commentId, articleId);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`text-xs flex items-center gap-1.5 transition-all duration-150 ${
        optimisticLiked 
          ? "text-blue-400 hover:text-blue-300" 
          : "text-muted-foreground hover:text-white"
      }`}
    >
      <ThumbsUp 
        size={13} 
        className={`transition-all duration-200 ${optimisticLiked ? "fill-current" : ""} ${animating ? "scale-125" : "scale-100"}`} 
      />
      <span className={`transition-all duration-200 ${animating ? "scale-110 font-bold" : ""}`}>
        {optimisticCount} me gusta
      </span>
    </button>
  );
}
