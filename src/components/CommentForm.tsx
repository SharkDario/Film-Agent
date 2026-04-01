"use client";

import { addComment } from "@/app/actions";
import { useState, useTransition } from "react";
import { Send } from "lucide-react";

interface CommentFormProps {
  articleId: number;
}

export function CommentForm({ articleId }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      await addComment(articleId, content);
      setContent("");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe tu comentario sobre el artículo..."
          rows={2}
          className="w-full p-3 rounded-md border border-input bg-background/50 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={isPending || !content.trim()}
        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium transition flex items-center gap-2 h-10 shrink-0"
      >
        <Send size={14} />
        {isPending ? "Enviando..." : "Comentar"}
      </button>
    </form>
  );
}
