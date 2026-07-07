"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { ScrollAnimate } from "@/components/ui/ScrollAnimate";
import { Camera, Image as ImageIcon, Heart, Sparkles, Map, Film } from "lucide-react";

interface GalleryItem {
  id: string;
  category: string;
  titlePlaceholder: string;
  icon: React.ReactNode;
}

const GALLERY_PLACEHOLDERS: GalleryItem[] = [
  {
    id: "1",
    category: "Dates",
    titlePlaceholder: "Romantic Dinner Date",
    icon: <Heart className="w-6 h-6 text-primary/40" />,
  },
  {
    id: "2",
    category: "Travels",
    titlePlaceholder: "Our Travel Highlights",
    icon: <Map className="w-6 h-6 text-primary/40" />,
  },
  {
    id: "3",
    category: "Sunsets",
    titlePlaceholder: "Warm Evening Skies",
    icon: <Sparkles className="w-6 h-6 text-primary/40" />,
  },
  {
    id: "4",
    category: "Silly Faces",
    titlePlaceholder: "Fun & Laughs Together",
    icon: <Camera className="w-6 h-6 text-primary/40" />,
  },
  {
    id: "5",
    category: "Anniversaries",
    titlePlaceholder: "Celebrating Milestones",
    icon: <Film className="w-6 h-6 text-primary/40" />,
  },
  {
    id: "6",
    category: "Cozy Days",
    titlePlaceholder: "Lazy Sunday Mornings",
    icon: <ImageIcon className="w-6 h-6 text-primary/40" />,
  },
];

export function GallerySection() {
  return (
    <section id="memories" className="py-24 relative overflow-hidden bg-bg-secondary/20">
      {/* Background radial glow */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold font-serif tracking-tight text-text-primary">
            Our Memory Album
          </h2>
          <p className="text-sm text-text-secondary mt-3 max-w-md mx-auto">
            A digital frame collection awaiting your favorite captured moments.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_PLACEHOLDERS.map((item, index) => (
            <ScrollAnimate
              key={item.id}
              preset="zoom-in"
              delay={index * 0.05}
              threshold={0.1}
            >
              <Card
                hoverEffect
                className="group relative overflow-hidden aspect-[4/3] flex flex-col justify-between p-4 border border-border-custom/40"
              >
                {/* Visual placeholder area */}
                <div className="w-full h-[78%] rounded-xl bg-primary/5 dark:bg-primary/10 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-center px-4 transition-all duration-300 group-hover:bg-primary/10">
                  {item.icon}
                  <span className="text-[10px] uppercase font-bold tracking-wider text-text-primary/60 mt-2 block">
                    Upload Photo
                  </span>
                  <span className="text-[8px] text-text-secondary opacity-70 mt-1 block">
                    Recommended: Landscape Aspect Ratio
                  </span>
                </div>

                {/* Footer text */}
                <div className="h-[18%] flex items-center justify-between px-1">
                  <div>
                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest block">
                      {item.category}
                    </span>
                    <span className="text-xs font-semibold text-text-primary mt-0.5 block truncate max-w-[200px]">
                      {item.titlePlaceholder}
                    </span>
                  </div>
                  <Heart className="w-3.5 h-3.5 text-primary/30 group-hover:text-primary group-hover:fill-primary/20 transition-all duration-300" />
                </div>
              </Card>
            </ScrollAnimate>
          ))}
        </div>
      </div>
    </section>
  );
}
