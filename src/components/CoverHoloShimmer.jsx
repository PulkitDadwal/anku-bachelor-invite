import React, { useState, useRef, useCallback } from 'react';

export default function CoverHoloShimmer({ src, alt, className = '' }) {
  const containerRef = useRef(null);
  const [style, setStyle] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
    holoAngle: 135
  });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    // Gentle 3D tilt: max 7 degrees
    const rY = ((percentX - 50) / 50) * 7;
    const rX = -((percentY - 50) / 50) * 7;

    // Angle of holographic rainbow reflection
    const angle = Math.atan2(y - rect.height / 2, x - rect.width / 2) * (180 / Math.PI) + 90;

    setStyle({
      rotateX: rX,
      rotateY: rY,
      glareX: percentX,
      glareY: percentY,
      glareOpacity: 0.65,
      holoAngle: angle
    });
    setIsHovered(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setStyle({
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
      holoAngle: 135
    });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerLeave}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden cursor-pointer select-none perspective-[1000px] ${className}`}
      style={{ touchAction: 'pan-y' }}
    >
      {/* 3D Tilting Card Wrapper */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${style.rotateX}deg) rotateY(${style.rotateY}deg) scale3d(1.015, 1.015, 1.015)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
        }}
      >
        {/* Base Cover Image */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain object-center pointer-events-none select-none"
        />

        {/* Dynamic Holographic Foil Rainbow Sheen */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-color-dodge"
          style={{
            opacity: isHovered ? 0.42 : 0.08,
            background: `repeating-linear-gradient(
              ${style.holoAngle}deg,
              rgba(255, 182, 193, 0.2) 0%,
              rgba(255, 230, 160, 0.38) 18%,
              rgba(200, 245, 255, 0.32) 36%,
              rgba(235, 180, 255, 0.35) 54%,
              rgba(255, 192, 203, 0.22) 72%,
              rgba(255, 235, 180, 0.3) 90%
            )`,
            backgroundSize: '250% 250%'
          }}
        />

        {/* Specular Glare Spotlight Following Cursor */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-200 mix-blend-screen"
          style={{
            opacity: isHovered ? style.glareOpacity : 0,
            background: `radial-gradient(
              circle at ${style.glareX}% ${style.glareY}%,
              rgba(255, 255, 255, 0.75) 0%,
              rgba(255, 225, 235, 0.32) 28%,
              transparent 65%
            )`
          }}
        />

        {/* Micro-sparkle Glitter Accents */}
        {isHovered && (
          <>
            <div
              className="absolute pointer-events-none text-amber-200 text-xs animate-ping"
              style={{
                left: `${Math.min(90, Math.max(10, style.glareX - 12))}%`,
                top: `${Math.min(90, Math.max(10, style.glareY - 10))}%`
              }}
            >
              ✦
            </div>
            <div
              className="absolute pointer-events-none text-pink-200 text-sm animate-pulse"
              style={{
                left: `${Math.min(88, Math.max(12, style.glareX + 14))}%`,
                top: `${Math.min(88, Math.max(12, style.glareY + 12))}%`
              }}
            >
              ✧
            </div>
          </>
        )}
      </div>

      {/* Subtle Hint Pill (Shows when not hovered) */}
      <div
        className={`absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-500 z-10 ${
          isHovered ? 'opacity-0' : 'opacity-85'
        }`}
      >
        <span className="px-2.5 py-0.5 rounded-full bg-white/80 backdrop-blur-md text-[9px] font-semibold text-pink-700 shadow-2xs border border-pink-200/70 flex items-center gap-1">
          <span>✨</span>
          <span>Tilt & Explore Hologram</span>
        </span>
      </div>
    </div>
  );
}
