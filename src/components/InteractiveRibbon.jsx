import React, { useState, useRef, useEffect, useCallback } from 'react';
import { soundManager } from '../utils/audio';
import { fireWeddingConfetti } from '../utils/confetti';

export default function InteractiveRibbon({ onUntie, isTied = true }) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isUntying, setIsUntying] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const dragThreshold = 65; // Pixels needed to untie

  // Reset ribbon when returning to tied state
  useEffect(() => {
    if (isTied) {
      setIsUntying(false);
      setIsDragging(false);
      setDragOffset({ x: 0, y: 0 });
    }
  }, [isTied]);

  const triggerUntie = useCallback(() => {
    if (isUntying) return;
    setIsDragging(false);
    setIsUntying(true);

    // Audio effect: silky fabric glide & unravelling rustle
    soundManager.playSilkSound();

    // Burst celebration confetti
    fireWeddingConfetti();

    // Allow untie animation to play before flipping page
    setTimeout(() => {
      onUntie?.();
    }, 620);
  }, [isUntying, onUntie]);

  const handlePointerDown = (e) => {
    if (isUntying) return;
    setIsDragging(true);
    const clientX = e.clientX ?? (e.touches ? e.touches[0].clientX : 0);
    const clientY = e.clientY ?? (e.touches ? e.touches[0].clientY : 0);
    startPos.current = { x: clientX, y: clientY };
  };

  // Window-level dragging for seamless tracking across screens & touch devices
  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e) => {
      if (isUntying) return;
      const clientX = e.clientX ?? (e.touches ? e.touches[0].clientX : 0);
      const clientY = e.clientY ?? (e.touches ? e.touches[0].clientY : 0);

      const dx = clientX - startPos.current.x;
      const dy = clientY - startPos.current.y;

      // Stretch ribbon loop rightwards and slightly downwards
      const pullX = Math.max(-15, Math.min(130, dx));
      const pullY = Math.max(-15, Math.min(75, dy));

      setDragOffset({ x: pullX, y: pullY });

      const distance = Math.sqrt(pullX * pullX + pullY * pullY);
      if (distance > dragThreshold) {
        triggerUntie();
      }
    };

    const handlePointerUp = () => {
      if (isUntying) return;
      setIsDragging(false);
      // Spring back to knot if not pulled past threshold
      setDragOffset({ x: 0, y: 0 });
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, isUntying, triggerUntie]);

  if (!isTied && !isUntying) return null;

  const pullProgress = Math.min(
    1,
    Math.sqrt(dragOffset.x * dragOffset.x + dragOffset.y * dragOffset.y) / dragThreshold
  );

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-visible select-none">
      {/* Horizontal Satin Ribbon Bands wrapped around card cover */}
      <div className="absolute inset-x-0 top-[68%] -translate-y-1/2 h-8 sm:h-9 flex items-center pointer-events-none">
        {/* Left Satin Band */}
        <div
          className={`h-full w-1/2 bg-gradient-to-b from-[#ffb6cb] via-[#f472b6] to-[#db2777] transition-all duration-600 ease-in-out ${
            isUntying ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
          }`}
          style={{
            boxShadow: '0 4px 14px rgba(180, 50, 90, 0.35)',
            borderTop: '1.5px solid rgba(255, 235, 245, 0.75)',
            borderBottom: '1.5px solid rgba(190, 24, 93, 0.5)'
          }}
        >
          {/* Specular silk shimmer line */}
          <div className="w-full h-1 bg-white/45 mt-1" />
        </div>

        {/* Right Satin Band */}
        <div
          className={`h-full w-1/2 bg-gradient-to-b from-[#ffb6cb] via-[#f472b6] to-[#db2777] transition-all duration-600 ease-in-out ${
            isUntying ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
          }`}
          style={{
            boxShadow: '0 4px 14px rgba(180, 50, 90, 0.35)',
            borderTop: '1.5px solid rgba(255, 235, 245, 0.75)',
            borderBottom: '1.5px solid rgba(190, 24, 93, 0.5)'
          }}
        >
          {/* Specular silk shimmer line */}
          <div className="w-full h-1 bg-white/45 mt-1" />
        </div>
      </div>

      {/* Central Interactive Satin Bow Knot */}
      <div
        onPointerDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onClick={triggerUntie}
        className={`absolute top-[68%] -translate-y-1/2 cursor-grab active:cursor-grabbing pointer-events-auto transition-transform duration-200 select-none ${
          isUntying
            ? 'scale-150 rotate-12 opacity-0 transition-all duration-500 ease-out pointer-events-none'
            : isDragging
            ? 'scale-105'
            : 'hover:scale-105'
        }`}
        style={{
          touchAction: 'none',
          transform: isUntying
            ? 'scale(1.4) rotate(15deg)'
            : `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.12}deg)`
        }}
        title="Pull or tap the ribbon bow to untie & open invitation"
      >
        {/* Soft Golden Glow Aura */}
        <div className="absolute -inset-3 rounded-full bg-pink-400/35 blur-md pointer-events-none animate-pulse" />

        {/* SVG Detailed Satin Bow */}
        <svg
          viewBox="0 0 160 120"
          className="w-28 sm:w-34 h-auto overflow-visible filter drop-shadow-[0_6px_14px_rgba(180,40,90,0.45)]"
        >
          <defs>
            <linearGradient id="satinPinkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffd1df" />
              <stop offset="30%" stopColor="#f472b6" />
              <stop offset="70%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#be185d" />
            </linearGradient>

            <linearGradient id="satinKnotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffb3cb" />
              <stop offset="50%" stopColor="#db2777" />
              <stop offset="100%" stopColor="#9d174d" />
            </linearGradient>

            <linearGradient id="silkSheen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.75)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* Dangling Left Ribbon Tail */}
          <path
            d={`M 74,60 C 68,85 52,98 ${38 + dragOffset.x * 0.15},114 L ${
              52 + dragOffset.x * 0.15
            },116 C 65,98 78,86 80,60 Z`}
            fill="url(#satinPinkGrad)"
            opacity="0.95"
          />
          {/* Left Tail cut notch */}
          <path
            d={`M ${38 + dragOffset.x * 0.15},114 L ${45 + dragOffset.x * 0.15},108 L ${
              52 + dragOffset.x * 0.15
            },116 Z`}
            fill="#fff"
            opacity="0.2"
          />

          {/* Dangling Right Tail (Stretches when pulled) */}
          <path
            d={`M 86,60 C 94,85 110,98 ${126 + dragOffset.x * 0.45},116 L ${
              112 + dragOffset.x * 0.45
            },118 C 100,98 88,86 86,60 Z`}
            fill="url(#satinPinkGrad)"
            opacity="0.95"
          />

          {/* Left Bow Loop */}
          <path
            d={`M 74,54 C 40,25 15,35 22,54 C 30,72 58,66 74,58 Z`}
            fill="url(#satinPinkGrad)"
          />
          <path
            d="M 32,48 C 42,42 58,45 68,52"
            stroke="url(#silkSheen)"
            strokeWidth="3"
            fill="none"
            opacity="0.75"
          />
          <ellipse cx="44" cy="52" rx="10" ry="5" fill="#9d174d" opacity="0.35" />

          {/* Right Bow Loop (Stretches dynamically on drag) */}
          <path
            d={`M 86,54 C ${120 + dragOffset.x * 0.4},${25 + dragOffset.y * 0.2} ${
              145 + dragOffset.x * 0.6
            },${35 + dragOffset.y * 0.3} ${138 + dragOffset.x * 0.5},${54 + dragOffset.y * 0.2} C ${
              130 + dragOffset.x * 0.3
            },72 102,66 86,58 Z`}
            fill="url(#satinPinkGrad)"
          />
          <path
            d={`M 92,52 C ${102 + dragOffset.x * 0.2},45 ${118 + dragOffset.x * 0.3},${
              42 + dragOffset.y * 0.1
            } ${128 + dragOffset.x * 0.4},48`}
            stroke="url(#silkSheen)"
            strokeWidth="3"
            fill="none"
            opacity="0.75"
          />
          <ellipse
            cx={116 + dragOffset.x * 0.35}
            cy={52 + dragOffset.y * 0.15}
            rx="10"
            ry="5"
            fill="#9d174d"
            opacity="0.35"
          />

          {/* Central Satin Knot */}
          <rect
            x="70"
            y="44"
            width="20"
            height="22"
            rx="6"
            fill="url(#satinKnotGrad)"
            stroke="rgba(255, 235, 245, 0.75)"
            strokeWidth="1"
          />
          {/* Knot wrinkles */}
          <path d="M 75,47 L 76,63" stroke="#ffb3cb" strokeWidth="1" opacity="0.8" />
          <path d="M 85,47 L 84,63" stroke="#9d174d" strokeWidth="1" opacity="0.6" />
        </svg>

        {/* Floating Instruction Tag */}
        {!isUntying && (
          <div
            className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-pink-200/90 shadow-md text-[10px] font-bold text-pink-800 tracking-wide flex items-center gap-1.5 transition-all duration-300 pointer-events-none ${
              isDragging ? 'opacity-90 scale-95' : 'animate-bounce'
            }`}
          >
            <span>🎀</span>
            <span>
              {pullProgress > 0.5 ? 'Untying ribbon... ✨' : 'Pull or tap to untie'}
            </span>
            <span className="text-pink-400 font-bold">→</span>
          </div>
        )}
      </div>
    </div>
  );
}
