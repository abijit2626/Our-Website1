"use client";

import React from "react";
import { Heart, ArrowUp } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border-custom/30 py-8 bg-bg-secondary/40 backdrop-blur-md relative z-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: Brand Indicator */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-text-secondary uppercase tracking-widest">
          <span>Our Space</span>
          <Heart className="w-3.5 h-3.5 text-primary fill-primary animate-pulse" />
          <span>Made With Love</span>
        </div>

        {/* Center / Right: Placeholder Disclaimer & Back to Top */}
        <div className="flex items-center space-x-6">
          <span className="text-[11px] text-text-secondary opacity-75">
            &copy; {new Date().getFullYear()} &bull; Private Couple Showcase Placeholder
          </span>
          <button
            onClick={scrollToTop}
            className="p-2 rounded-full border border-border-custom/50 hover:border-primary/50 text-text-secondary hover:text-primary transition-all cursor-pointer shadow-sm bg-bg-secondary"
            aria-label="Scroll to top of page"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
