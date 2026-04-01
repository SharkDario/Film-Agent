"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface FloatingVideoProps {
  embedUrl: string;
  title: string;
}

export function FloatingVideo({ embedUrl, title }: FloatingVideoProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isFloating, setIsFloating] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFloating(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  const showFloat = isFloating && !dismissed;

  return (
    <>
      {/* Sentinel: placeholder that keeps the layout space */}
      <div 
        ref={sentinelRef} 
        className="w-full lg:w-[400px] aspect-video shrink-0"
      >
        {/* The single iframe lives here or floats */}
        <div
          className={`
            transition-all duration-300 ease-in-out rounded-xl overflow-hidden border shadow-2xl
            ${showFloat 
              ? "fixed bottom-6 right-6 z-50 w-[320px] border-white/20 shadow-black/50 group" 
              : "relative w-full h-full border-white/10"
            }
          `}
          style={showFloat ? { aspectRatio: "16/9" } : undefined}
        >
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title={`${title} Trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          ></iframe>

          {/* Close button (only when floating) */}
          {showFloat && (
            <button
              onClick={() => setDismissed(true)}
              className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
              title="Cerrar miniatura"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
