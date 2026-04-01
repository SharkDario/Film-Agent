"use client";

import { trackVisit } from "@/app/actions";
import { useEffect, useRef } from "react";

export function VisitTracker({ articleId }: { articleId: number }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      trackVisit(articleId);
    }
  }, [articleId]);

  return null; // Invisible component
}
