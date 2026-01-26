'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSettings } from '@/hooks/useSettings';

interface Particle {
  size: number;
  left: number;
  top: number;
  opacity: number;
  animationDuration: number;
  animationDelay: number;
  backgroundColor: string;
}

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { logoUrl } = useSettings();

  useEffect(() => {
    // Generar partículas solo en el cliente para evitar problemas de hidratación
    setIsMounted(true);
    const generatedParticles: Particle[] = [...Array(12)].map((_, i) => {
      const baseSize = 3;
      return {
        size: baseSize + Math.random() * 2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.2,
        animationDuration: 3 + Math.random() * 2,
        animationDelay: Math.random() * 2,
        backgroundColor: i % 3 === 0 ? '#FF5A00' : '#f1f1f1',
      };
    });
    setParticles(generatedParticles);
  }, []);

  useEffect(() => {
    // Animación de progreso
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return next;
      });
    }, 40);

    // Mostrar loading por 2 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-500 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #161617 0%, #1a1a1b 50%, #161617 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 8s ease infinite',
      }}
    >
      {/* Efecto de gradiente animado de fondo */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 30% 50%, #FF5A00 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(255, 90, 0, 0.3) 0%, transparent 50%)',
          animation: 'gradientMove 10s ease infinite',
        }}
      ></div>

      {/* Efecto de ondas concéntricas mejoradas - Responsive */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {[0, 1, 2, 3].map((i) => {
          // Usar unidades viewport para hacer las ondas responsive
          const baseSize = 30; // 30vw como base
          const sizeMultiplier = baseSize + (i * 10); // Incremento de 10vw por cada onda
          return (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                width: `min(${sizeMultiplier}vw, ${sizeMultiplier}vh)`,
                height: `min(${sizeMultiplier}vw, ${sizeMultiplier}vh)`,
                borderColor: '#FF5A00',
                opacity: 0.15 - (i * 0.03),
                animation: `pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite ${i * 0.4}s`,
                boxShadow: `0 0 ${sizeMultiplier / 2}px rgba(255, 90, 0, 0.1)`,
              }}
            ></div>
          );
        })}
      </div>

      {/* Partículas flotantes animadas - Responsive */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                backgroundColor: particle.backgroundColor,
                opacity: particle.opacity,
                animation: `float ${particle.animationDuration}s ease-in-out infinite`,
                animationDelay: `${particle.animationDelay}s`,
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Contenido principal - Responsive */}
      <div className="text-center relative z-10 animate-fade-in px-4 py-4 sm:py-8 md:py-12 lg:py-16 max-w-7xl mx-auto w-full flex flex-col items-center justify-center">
        {/* Logo con efecto de entrada */}
        <div className="mb-8 w-full">
          <div className="flex justify-center mb-8">
            <div
              className="relative animate-scale-in"
              style={{
                animation: 'scaleIn 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <div className="relative w-48 h-48 sm:w-64 sm:h-64">
                {/* Glow effect alrededor del logo */}
                <div
                  className="absolute inset-0 rounded-full blur-3xl opacity-30 animate-pulse"
                  style={{
                    background: 'radial-gradient(circle, #FF5A00 0%, transparent 70%)',
                    transform: 'scale(1.2)',
                  }}
                ></div>
                <div className="relative w-full h-full flex items-center justify-center z-10">
                  <Image
                    src={logoUrl}
                    alt="DondeOficial Logo"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                    sizes="(max-width: 480px) 192px, (max-width: 640px) 256px, 320px"
                    unoptimized={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subtítulo */}
          <p
            className="text-lg sm:text-2xl font-bold tracking-widest px-2 sm:px-4 animate-slide-up uppercase"
            style={{
              color: '#f1f1f1',
              animation: 'slideUp 0.8s ease-out 0.5s both',
              textShadow: '0 0 20px rgba(255, 90, 0, 0.5)'
            }}
          >
            DondeOficial
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="w-full max-w-xs sm:max-w-md mx-auto mb-8">
          <div
            className="h-1.5 rounded-full overflow-hidden relative bg-white/10"
          >
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #FF5A00, #ff9d66)',
                boxShadow: '0 0 20px rgba(255, 90, 0, 0.8)',
              }}
            ></div>
          </div>
          <p className="text-xs mt-4 font-black uppercase tracking-[0.3em] text-white/40">
            Cargando {progress}%
          </p>
        </div>
      </div>

      {/* Estilos CSS inline para animaciones */}
      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 0.1;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0) translateY(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.2) translateY(-8px);
            opacity: 1;
          }
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes gradientMove {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(20px, -20px) scale(1.1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes cubeRotate {
          0%, 100% {
            transform: rotateX(0deg) rotateY(0deg);
            opacity: 0.8;
          }
          25% {
            transform: rotateX(15deg) rotateY(-10deg);
            opacity: 1;
          }
          50% {
            transform: rotateX(0deg) rotateY(0deg);
            opacity: 0.8;
          }
          75% {
            transform: rotateX(-15deg) rotateY(10deg);
            opacity: 1;
          }
        }

        @keyframes radarWave {
          0% {
            r: 18;
            opacity: 0.5;
            stroke-width: 1.5;
          }
          100% {
            r: 45;
            opacity: 0;
            stroke-width: 0.5;
          }
        }

        @keyframes pinBounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-4px) scale(1.05);
          }
        }

        @keyframes pinPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.15);
          }
        }

        @keyframes pinShadowPulse {
          0%, 100% {
            opacity: 0.4;
            transform: scaleX(1);
          }
          50% {
            opacity: 0.6;
            transform: scaleX(1.2);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-scale-in {
          animation: scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-slide-up {
          animation: slideUp 0.8s ease-out 0.3s both;
        }

        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.6s both;
        }
      `}</style>
    </div>
  );
}
