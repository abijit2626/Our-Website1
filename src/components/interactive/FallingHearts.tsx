"use client";

import React, { useEffect, useRef } from "react";

interface Heart {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  drift: number;
  driftSpeed: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
}

export function FallingHearts() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let hearts: Heart[] = [];
    const maxHearts = 40; // Maintain good performance, not too crowded

    const colors = [
      "rgba(219, 39, 119, 0.6)",   // pink-600
      "rgba(244, 63, 94, 0.6)",    // rose-500
      "rgba(251, 113, 133, 0.5)",  // rose-400
      "rgba(252, 165, 180, 0.4)",  // rose-300
      "rgba(251, 191, 36, 0.4)",   // amber-400 (Warm gold sparkles)
    ];

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Create a new heart instance
    const createHeart = (x?: number, y?: number, sizeScale = 1): Heart => {
      const size = (Math.random() * 12 + 6) * sizeScale;
      return {
        x: x !== undefined ? x : Math.random() * canvas.width,
        y: y !== undefined ? y : -size - 10,
        size,
        speed: Math.random() * 1.5 + 0.8,
        opacity: Math.random() * 0.6 + 0.2,
        drift: Math.random() * 2,
        driftSpeed: Math.random() * 0.02 + 0.01,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    // Initialize initial hearts distributed vertically
    for (let i = 0; i < maxHearts * 0.6; i++) {
      const heart = createHeart();
      heart.y = Math.random() * canvas.height;
      hearts.push(heart);
    }

    // Draw a single heart path
    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, rotation: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      c.fillStyle = color;
      c.beginPath();
      // Draw heart via cubic bezier curves
      c.moveTo(0, -size / 4);
      c.bezierCurveTo(-size / 2, -size * 0.7, -size, -size * 0.2, 0, size * 0.7);
      c.bezierCurveTo(size, -size * 0.2, size / 2, -size * 0.7, 0, -size / 4);
      c.closePath();
      c.fill();
      c.restore();
    };

    // Click burst handler
    const handleWindowClick = (e: MouseEvent) => {
      // Spawn a burst of 5-8 hearts on click
      const burstCount = Math.floor(Math.random() * 4) + 4;
      for (let i = 0; i < burstCount; i++) {
        // Spawn slightly offset from pointer
        const px = e.clientX + (Math.random() - 0.5) * 40;
        const py = e.clientY + (Math.random() - 0.5) * 40;
        const heart = createHeart(px, py, 1.2);
        // Make click burst hearts float upwards instead of down
        heart.speed = -(Math.random() * 2 + 1.5);
        hearts.push(heart);
      }
    };

    window.addEventListener("click", handleWindowClick);

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add hearts if density is low
      if (hearts.length < maxHearts && Math.random() < 0.03) {
        hearts.push(createHeart());
      }

      // Loop backward to safely remove out-of-bound hearts
      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];
        
        // Update positions
        h.y += h.speed;
        h.drift += h.driftSpeed;
        h.x += Math.sin(h.drift) * 0.4;
        h.rotation += h.rotationSpeed;

        // Render heart
        drawHeart(ctx, h.x, h.y, h.size, h.color, h.rotation);

        // Remove conditions: off-bottom, off-top (for click burst) or faded
        const isOffBottom = h.y > canvas.height + h.size;
        const isOffTop = h.speed < 0 && h.y < -h.size - 20;
        const isOffSides = h.x < -h.size || h.x > canvas.width + h.size;

        if (isOffBottom || isOffTop || isOffSides) {
          hearts.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Use IntersectionObserver to pause loop if canvas not in view (e.g. scroll down)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(animationFrameId);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(canvas);

    // Initial trigger
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("click", handleWindowClick);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-10"
      aria-hidden="true"
    />
  );
}
