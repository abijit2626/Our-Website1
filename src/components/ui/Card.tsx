"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
  hoverEffect?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Card({
  hoverEffect = false,
  className = "",
  children,
  ...props
}: CardProps) {
  const baseStyles =
    "bg-bg-secondary/60 dark:bg-bg-secondary/40 backdrop-blur-md border border-border-custom/50 rounded-2xl p-6 md:p-8 shadow-xl shadow-indigo-950/[0.02] dark:shadow-black/[0.15]";

  const hoverStyles = hoverEffect ? "cursor-pointer" : "";

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`${baseStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
