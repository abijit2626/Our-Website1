"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  baseSpeedY: number;
  speedX: number;
  opacity: number;
  twinkleSpeed: number;
  phase: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Graceful exit if client prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const getParticleCount = () => {
      // Scale count based on screen width
      if (window.innerWidth < 768) {
        return 18; // Mobile-friendly density
      }
      return 40;  // Desktop density
    };

    const initParticles = () => {
      const count = getParticleCount();
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5, // 0.5px to 2.5px
          baseSpeedY: -(Math.random() * 0.15 + 0.05), // Slowly drift upwards
          speedX: (Math.random() - 0.5) * 0.1, // Drifts slightly sideways
          opacity: Math.random() * 0.5 + 0.1,
          twinkleSpeed: Math.random() * 0.015 + 0.005,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render background gradient if canvas was transparent, but here we just render
      // particles on top of our existing CSS backgrounds.
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update position (drift upwards)
        p.y += p.baseSpeedY;
        p.x += p.speedX;
        p.phase += p.twinkleSpeed;

        // Reset if drifted off screen top or sides
        if (p.y < -5) {
          p.y = canvas.height + 5;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -5 || p.x > canvas.width + 5) {
          p.x = p.x < -5 ? canvas.width + 5 : -5;
        }

        // Twinkle opacity calculation
        const currentOpacity = Math.max(0.05, p.opacity + Math.sin(p.phase) * 0.2);

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        // Soft yellow-gold glow for particles
        ctx.fillStyle = `rgba(251, 191, 36, ${currentOpacity})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Observer to pause animation loop when scrolled out of viewport
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
      { threshold: 0.01 }
    );

    observer.observe(canvas);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
