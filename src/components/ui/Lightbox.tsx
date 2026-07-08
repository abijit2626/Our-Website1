"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxItem {
  src: string;
  isVideo: boolean;
  caption?: string;
}

interface LightboxProps {
  items: LightboxItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const reducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function LockBodyScroll() {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  return null;
}

export function Lightbox({ items, currentIndex, onClose, onNavigate }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  const current = items[currentIndex];
  const hasPrev = items.length > 1;
  const hasNext = items.length > 1;

  const goPrev = useCallback(() => {
    if (!hasPrev) return;
    const prev = (currentIndex - 1 + items.length) % items.length;
    onNavigate(prev);
  }, [currentIndex, items.length, hasPrev, onNavigate]);

  const goNext = useCallback(() => {
    if (!hasNext) return;
    const next = (currentIndex + 1) % items.length;
    onNavigate(next);
  }, [currentIndex, items.length, hasNext, onNavigate]);

  useEffect(() => {
    prevFocusRef.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      prevFocusRef.current?.focus();
    };
  }, [onClose, goPrev, goNext]);

  return (
    <>
      <LockBodyScroll />
      <AnimatePresence>
        <motion.div
          key="lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Media lightbox"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Close button */}
          <button
            ref={closeRef}
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter */}
          {items.length > 1 && (
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-semibold font-mono">
              {currentIndex + 1} / {items.length}
            </div>
          )}

          {/* Previous button */}
          {hasPrev && (
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Previous media"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>
          )}

          {/* Next button */}
          {hasNext && (
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Next media"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          )}

          {/* Media content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center max-w-[90vw] max-h-[85vh]"
            >
              {current.isVideo ? (
                <video
                  key={`video-${currentIndex}`}
                  src={current.src}
                  controls
                  autoPlay
                  className="max-w-full max-h-[80vh] rounded-xl shadow-2xl"
                  style={{ objectFit: "contain" }}
                />
              ) : (
                <img
                  key={`img-${currentIndex}`}
                  src={current.src}
                  alt={current.caption ?? ""}
                  className="max-w-full max-h-[80vh] rounded-xl shadow-2xl select-none"
                  style={{ objectFit: "contain" }}
                />
              )}

              {current.caption && (
                <p className="mt-4 text-sm text-white/80 text-center max-w-lg px-4">
                  {current.caption}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
