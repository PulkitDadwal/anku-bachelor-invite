import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { fireWeddingConfetti } from '../utils/confetti';
import { soundManager } from '../utils/audio';

export default function EnvelopeIntro({ onOpen }) {
  const [isOpening, setIsOpening] = useState(false);
  const [isFadedOut, setIsFadedOut] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpening) return;
    setIsOpening(true);

    // 1. Play wax seal crack + paper whoosh + chimes
    soundManager.playUnsealSound();

    // 2. Start celebration background music (genuine user interaction)
    soundManager.startBGM();

    // 3. Fire confetti
    fireWeddingConfetti();

    // 4. Transition to book view
    setTimeout(() => {
      setIsFadedOut(true);
      setTimeout(() => {
        onOpen();
      }, 500);
    }, 1100);
  };

  if (isFadedOut) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#fff2f6]/95 via-[#fde8ef]/95 to-[#fbcfe8]/95 backdrop-blur-md transition-opacity duration-500 ${
        isOpening && isFadedOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Ambient Floating Sparkles */}
      <div className="absolute top-8 text-center px-4 animate-fadeIn">
        <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-white/90 backdrop-blur-md rounded-full border border-pink-200/90 shadow-sm text-pink-700 text-xs font-semibold tracking-widest uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin" />
          <span>Exclusive Twilight Invitation</span>
          <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-pink-950 font-script tracking-wide">
          Akanksha's Twilight Toast
        </h1>
        <p className="text-xs sm:text-sm text-pink-800/80 font-serif italic mt-1">
          A bespoke invitation crafted just for you 🎀
        </p>
      </div>

      {/* 3D Stationery Envelope */}
      <div
        className={`relative w-full max-w-sm sm:max-w-md aspect-[1.42/1] my-auto transition-transform duration-700 select-none ${
          isOpening ? 'scale-105' : 'hover:scale-[1.01]'
        }`}
        style={{ perspective: '1600px' }}
      >
        {/* Envelope Back Base */}
        <div className="absolute inset-0 bg-[#fde8f0] rounded-2xl shadow-2xl border-2 border-pink-200/80 overflow-hidden">
          {/* Subtle paper grain texture */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #f472b6 0px, #f472b6 1px, transparent 1px, transparent 16px)'
            }}
          />
        </div>

        {/* The Emerging Invitation Card inside envelope */}
        <div
          className={`absolute inset-x-4 bottom-3 top-3 bg-white rounded-xl shadow-lg border border-pink-200/90 overflow-hidden flex items-center justify-center transition-all duration-1000 ease-out ${
            isOpening ? '-translate-y-20 scale-100 opacity-100' : 'translate-y-0 opacity-90'
          }`}
          style={{ zIndex: 10 }}
        >
          <img
            src="/card-cover.jpg"
            alt="Akanksha's Twilight Toast Preview"
            className="w-full h-full object-contain p-2"
          />
        </div>

        {/* Envelope Side & Bottom Pocket Flaps (Folded Over Card) */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
          style={{ zIndex: 20 }}
        >
          {/* Bottom Triangular Pocket Flap */}
          <div
            className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#ffd9e6] via-[#ffe2ec] to-[#fff1f5] border-t border-pink-200/70 shadow-md"
            style={{
              clipPath: 'polygon(0% 100%, 50% 18%, 100% 100%)'
            }}
          />

          {/* Left Pocket Flap */}
          <div
            className="absolute inset-y-0 left-0 w-[55%] bg-gradient-to-r from-[#ffd4e3] to-[#ffe5ee] opacity-85"
            style={{
              clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)'
            }}
          />

          {/* Right Pocket Flap */}
          <div
            className="absolute inset-y-0 right-0 w-[55%] bg-gradient-to-l from-[#ffd4e3] to-[#ffe5ee] opacity-85"
            style={{
              clipPath: 'polygon(100% 0%, 0% 50%, 100% 100%)'
            }}
          />

          {/* Gold Foil Border Trim */}
          <div className="absolute inset-3 rounded-xl border border-dashed border-amber-300/60 pointer-events-none" />

          {/* Calligraphic Recipient Note */}
          <div className="absolute bottom-5 inset-x-0 text-center pointer-events-none z-30">
            <span className="font-script text-pink-900 text-lg sm:text-xl font-bold tracking-wider drop-shadow-xs">
              With Love for Our Cheri Cheri Bride 🎀
            </span>
          </div>
        </div>

        {/* 3D Top Flap (Opens Upwards when Unsealed) */}
        <div
          className={`absolute inset-x-0 top-0 h-[58%] rounded-t-2xl transition-transform duration-700 ease-in-out ${
            isOpening ? '-rotate-x-180' : 'rotate-x-0'
          }`}
          style={{
            zIndex: 35,
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Flap Outer Surface */}
          <div
            className="w-full h-full bg-gradient-to-b from-[#fce3ec] via-[#fed4e2] to-[#fdc4d7] shadow-lg border-b border-pink-300/80"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)'
            }}
          />
        </div>

        {/* Ornate Royal Wax Seal (In Center of Flap) */}
        <div
          onClick={handleOpenEnvelope}
          className={`absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 ${
            isOpening
              ? 'scale-125 opacity-0 pointer-events-none'
              : 'hover:scale-110 active:scale-95'
          }`}
          style={{ zIndex: 50 }}
          role="button"
          tabIndex={0}
          aria-label="Break wax seal and open invitation"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleOpenEnvelope();
          }}
        >
          {/* Glowing Aura */}
          <div className="absolute -inset-2.5 rounded-full bg-gradient-to-tr from-pink-400 via-rose-400 to-amber-300 opacity-75 blur-md animate-pulse" />

          {/* Wax Seal Medallion */}
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700 shadow-2xl border-3 border-amber-200/90 flex flex-col items-center justify-center text-white">
            {/* Outer embossed ring */}
            <div className="absolute inset-1 rounded-full border border-rose-300/60" />

            {/* Royal Monogram 'A' with Crown / Bow */}
            <span className="text-[10px] leading-none mb-0.5 select-none">🎀</span>
            <span className="font-serif font-black text-xl sm:text-2xl text-amber-100 tracking-tighter drop-shadow-md select-none font-script">
              A
            </span>
            <span className="text-[7px] font-bold text-amber-200 tracking-widest uppercase select-none">
              TOAST
            </span>
          </div>

          {/* Prompt Tag */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-pink-200 shadow-sm text-[10px] sm:text-[11px] font-bold text-pink-800 tracking-wide flex items-center gap-1.5 animate-bounce">
            <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
            <span>Tap Wax Seal to Open</span>
          </div>
        </div>
      </div>

      {/* Bottom Skip Option */}
      <div className="relative z-10 mt-6 flex items-center gap-3">
        <button
          onClick={handleOpenEnvelope}
          className="text-xs text-pink-700/80 hover:text-pink-950 font-semibold underline underline-offset-4 transition-colors"
        >
          Skip to Invitation →
        </button>
      </div>
    </div>
  );
}
