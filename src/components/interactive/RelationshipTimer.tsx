"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface RelationshipTimerProps {
  /**
   * The start date of the relationship. Format: YYYY-MM-DD
   * Default is Valentine's Day 2024.
   */
  startDate?: string;
}

interface TimeDiff {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function RelationshipTimer({ startDate = "2024-02-14" }: RelationshipTimerProps) {
  const [timeDiff, setTimeDiff] = useState<TimeDiff | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const parts = startDate.split("-");
      const start = new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10)
      );
      const now = new Date();

      if (isNaN(start.getTime())) {
        console.error("Invalid start date provided to RelationshipTimer");
        return;
      }

      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      let days = now.getDate() - start.getDate();
      let hours = now.getHours() - start.getHours();
      let minutes = now.getMinutes() - start.getMinutes();
      let seconds = now.getSeconds() - start.getSeconds();

      // Adjust seconds
      if (seconds < 0) {
        seconds += 60;
        minutes--;
      }
      // Adjust minutes
      if (minutes < 0) {
        minutes += 60;
        hours--;
      }
      // Adjust hours
      if (hours < 0) {
        hours += 24;
        days--;
      }
      // Adjust days (accounting for days in preceding month)
      if (days < 0) {
        const prevMonthDate = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonthDate.getDate();
        months--;
      }
      // Adjust months
      if (months < 0) {
        months += 12;
        years--;
      }

      setTimeDiff({ years, months, days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  if (!timeDiff) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-pulse flex items-center space-x-2 text-primary font-medium">
          <Heart className="w-5 h-5 animate-ping text-primary" />
          <span>Calibrating hearts...</span>
        </div>
      </div>
    );
  }

  const timerItems = [
    { label: "Years", value: timeDiff.years },
    { label: "Months", value: timeDiff.months },
    { label: "Days", value: timeDiff.days },
    { label: "Hours", value: timeDiff.hours },
    { label: "Minutes", value: timeDiff.minutes },
    { label: "Seconds", value: timeDiff.seconds },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-bg-secondary/40 dark:bg-bg-secondary/20 backdrop-blur-xl border border-border-custom/40 p-8 md:p-10 rounded-3xl shadow-2xl"
      >
        {/* Floating Heart Icon Ring */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-bg-secondary dark:bg-bg-secondary border border-border-custom shadow-lg w-16 h-16 rounded-full flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <Heart className="w-8 h-8 text-primary fill-primary" />
          </motion.div>
        </div>

        <h3 className="text-xs uppercase tracking-widest text-text-secondary dark:text-pink-300 font-semibold mb-8 mt-4">
          Time Spent Together
        </h3>

        {/* Counter Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {timerItems.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center bg-bg-primary/50 dark:bg-bg-primary/30 p-3 md:p-4 rounded-2xl border border-border-custom/25"
            >
              {/* Animated number roll-over effect */}
              <div className="h-10 md:h-12 flex items-center justify-center overflow-hidden font-mono text-2xl md:text-3xl font-extrabold text-primary select-none">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={item.value}
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -25, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="block"
                  >
                    {String(item.value).padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
              </div>

              <span className="text-[10px] md:text-xs font-medium text-text-secondary mt-2 uppercase tracking-wider">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
