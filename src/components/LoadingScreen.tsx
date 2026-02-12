'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useSettings } from '@/hooks/useSettings';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const { logoUrl, settings } = useSettings();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Usar el logo específico del preloader si existe, sino el general
  const preloaderLogo = settings?.preloader_logo_url || logoUrl;

  useEffect(() => {
    // Animación de progreso
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1.5; // Un poco más lento para apreciar la animación
        if (next >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return next;
      });
    }, 50);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3500); // 3.5 segundos para disfrutar el efecto

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  // Neural Network Animation in Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let nodes: Node[] = [];
    const nodeCount = 60;
    const connectionDistance = 150;
    const mouse = { x: 0, y: 0 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    const initNodes = () => {
      nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: Math.random() * 2 + 1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ff7300';
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            const opacity = 1 - distance / connectionDistance;
            ctx.strokeStyle = `rgba(255, 115, 0, ${opacity * 0.4})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] bg-[#050505] transition-opacity duration-700"
      style={{ opacity: progress === 100 ? 0 : 1 }}
    >
      {/* Neural Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 opacity-40"
      />

      {/* Radial Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505] z-0 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center justify-center p-4">

        {/* Logo Container with Pulse */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-orange-500/20 blur-[60px] rounded-full animate-pulse"></div>

          <div className="relative w-48 h-16 sm:w-64 sm:h-20 animate-fade-in-up">
            {preloaderLogo ? (
              <Image
                src={preloaderLogo}
                alt="Loading..."
                fill
                className="object-contain drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                priority
                unoptimized
              />
            ) : (
              <div className="text-white text-2xl font-black tracking-widest uppercase">DondeOficial</div>
            )}
          </div>
        </div>

        {/* Loading Text & Progress */}
        <div className="w-64 space-y-4">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/80 mb-2">
            <span>Conectando...</span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-600 to-amber-500 transition-all duration-100 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
            </div>
          </div>

          <p className="text-center text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-4 animate-pulse">
            Establishing Secure Connection
          </p>
        </div>
      </div>
    </div>
  );
}
