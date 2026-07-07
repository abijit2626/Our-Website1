"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "gold" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  // Base classes for a premium button
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer tracking-wide";

  // Variant mappings
  const variantStyles = {
    primary:
      "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 dark:shadow-primary/10 border border-transparent",
    secondary:
      "bg-transparent hover:bg-primary/5 text-primary border border-primary/30 dark:border-primary/20",
    gold: "bg-accent hover:bg-amber-600 text-white shadow-lg shadow-accent/20 border border-transparent",
    ghost:
      "bg-transparent hover:bg-primary/5 text-text-primary border border-transparent",
  };

  // Size mappings
  const sizeStyles = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
