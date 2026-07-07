"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMusic } from "@/context/MusicContext";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, ChevronDown, Heart } from "lucide-react";

export function MusicPlayer() {
  const {
    isPlaying,
    currentTrack,
    volume,
    progress,
    currentTime,
    duration,
    togglePlay,
    nextTrack,
    prevTrack,
    setVolume,
    seek,
    muted,
    toggleMute,
  } = useMusic();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentTrack) return null;

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleProgressBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* COLLAPSED FLOATING DISK BUTTON */
          <motion.button
            key="collapsed"
            layoutId="player-card"
            onClick={() => setIsExpanded(true)}
            aria-label="Open Music Player"
            className="flex items-center justify-center w-14 h-14 rounded-full bg-bg-secondary/80 dark:bg-bg-secondary/60 border border-border-custom/50 shadow-2xl backdrop-blur-xl hover:scale-105 active:scale-95 cursor-pointer relative group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Spinning/pulsing aura when playing */}
            {isPlaying && (
              <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            )}
            
            <motion.div
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="text-primary flex items-center justify-center"
            >
              <Music className="w-6 h-6" />
            </motion.div>

            {/* Hover tooltip */}
            <span className="absolute right-16 bg-bg-secondary border border-border-custom px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md text-text-primary">
              Play Music ♪
            </span>
          </motion.button>
        ) : (
          /* EXPANDED PANEL */
          <motion.div
            key="expanded"
            layoutId="player-card"
            className="w-80 md:w-88 bg-bg-secondary/90 dark:bg-bg-secondary/70 border border-border-custom/60 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl"
          >
            {/* Header / Minimize button */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-text-secondary text-xs font-semibold uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 text-primary fill-primary animate-pulse" />
                <span>Soundtrack of Us</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-full hover:bg-primary/10 text-text-secondary hover:text-primary transition-colors cursor-pointer"
                aria-label="Minimize Player"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Track Details */}
            <div className="mb-4">
              <h4 className="text-sm font-bold text-text-primary truncate">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-text-secondary truncate mt-0.5">
                {currentTrack.artist}
              </p>
            </div>

            {/* Seek Bar Slider */}
            <div className="space-y-1 mb-4">
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleProgressBarChange}
                  className="w-full h-1.5 bg-primary/20 accent-primary rounded-lg appearance-none cursor-pointer outline-none"
                  aria-label="Track Progress"
                />
              </div>
              <div className="flex justify-between text-[10px] text-text-secondary font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration || 0)}</span>
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              {/* Volume Controller (Left Side) */}
              <div className="flex items-center space-x-1.5 group/vol w-24">
                <button
                  onClick={toggleMute}
                  className="text-text-secondary hover:text-primary transition-colors p-1 cursor-pointer"
                  aria-label={muted ? "Unmute Volume" : "Mute Volume"}
                >
                  {muted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-primary/20 accent-primary rounded-lg appearance-none cursor-pointer outline-none transition-all"
                  aria-label="Volume Level"
                />
              </div>

              {/* Playback Controls (Center) */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={prevTrack}
                  className="p-2 rounded-full hover:bg-primary/10 text-text-secondary hover:text-primary transition-colors cursor-pointer"
                  aria-label="Previous Track"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="p-3.5 rounded-full bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/25 cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
                  aria-label={isPlaying ? "Pause Music" : "Play Music"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white" />
                  )}
                </button>

                <button
                  onClick={nextTrack}
                  className="p-2 rounded-full hover:bg-primary/10 text-text-secondary hover:text-primary transition-colors cursor-pointer"
                  aria-label="Next Track"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Visual Indicator Spacer (Right Side) */}
              <div className="w-8 flex items-center justify-end text-primary">
                {isPlaying && (
                  <div className="flex items-end space-x-0.5 h-3">
                    <span className="w-0.5 h-full bg-primary animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <span className="w-0.5 h-3/4 bg-primary animate-bounce" style={{ animationDelay: "0.3s" }} />
                    <span className="w-0.5 h-1/2 bg-primary animate-bounce" style={{ animationDelay: "0.5s" }} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
