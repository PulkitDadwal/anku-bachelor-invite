import React, { useState, useEffect } from 'react';
import TurnCardBook from './components/TurnCardBook';
import RSVPModal from './components/RSVPModal';
import QRModal from './components/QRModal';
import ContactModal from './components/ContactModal';
import EnvelopeIntro from './components/EnvelopeIntro';
import { Heart, PhoneCall, Mail } from 'lucide-react';
import { fireWeddingConfetti } from './utils/confetti';

export default function App() {
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);

  // Initialize guest wishes empty for clean manual testing
  const [rsvpList, setRsvpList] = useState(() => {
    try {
      localStorage.removeItem('akanksha_wishes');
      const saved = localStorage.getItem('akanksha_wishes_live');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleRsvpSubmit = (newRsvp) => {
    const updated = [newRsvp, ...rsvpList];
    setRsvpList(updated);
    try {
      localStorage.setItem('akanksha_wishes_live', JSON.stringify(updated));
    } catch {}
  };

  return (
    <div className="app-shell relative overflow-x-hidden">
      {/* 3D Wax-Seal Envelope Intro Screen */}
      {!isEnvelopeOpen && (
        <EnvelopeIntro onOpen={() => setIsEnvelopeOpen(true)} />
      )}

      {/* Subtle Floating Ambient Background Particles */}
      <div className="ambient-particles pointer-events-none">
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            className="ambient-particle text-pink-300"
            style={{
              left: `${(i * 7.5 + 4) % 94}%`,
              animationDelay: `${(i * 1.8) % 8}s`,
              animationDuration: `${12 + (i % 6) * 2}s`,
              fontSize: `${14 + (i % 3) * 6}px`
            }}
          >
            {i % 3 === 0 ? '🎀' : i % 3 === 1 ? '💖' : '✨'}
          </div>
        ))}
      </div>

      {/* Top Header */}
      <header className="app-header relative z-10 w-full text-center px-4 pt-2 pb-1">
        <h1 className="font-serif font-bold text-pink-950 font-script tracking-wide leading-none text-[clamp(1.7rem,5.2vw,3.15rem)]">
          Akanksha's Twilight Toast
        </h1>
        <p className="text-[11px] sm:text-sm text-pink-800/80 font-medium font-serif italic mt-1">
          Celebrating our ultimate Cheri Cheri Bride 🎀
        </p>
      </header>

      {/* Main 3D Turn Card Book Area */}
      <main className="app-main relative z-10">
        <TurnCardBook
          onOpenRSVP={() => setIsRSVPOpen(true)}
          onOpenQR={() => setIsQROpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
          rsvpList={rsvpList}
        />
      </main>

      {/* Bottom Footer with Contact & Re-seal Envelope Shortcuts */}
      <footer className="app-footer relative z-10 w-full text-center py-2 px-4 text-[11px] sm:text-xs text-pink-800/80">
        <div className="flex flex-wrap items-center justify-center gap-2 font-medium">
          <span className="flex items-center gap-1">
            <span>Celebrating with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span className="font-semibold text-pink-950">Akanksha Manhas</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span>Manhas Residence</span>
          <span className="hidden sm:inline">•</span>
          <button
            onClick={() => setIsContactOpen(true)}
            className="inline-flex items-center gap-1 text-pink-700 hover:text-pink-950 underline font-semibold"
          >
            <PhoneCall className="w-3 h-3 text-pink-600" />
            <span>Contact Hosts</span>
          </button>
          <span className="hidden sm:inline">•</span>
          <button
            onClick={() => setIsEnvelopeOpen(false)}
            className="inline-flex items-center gap-1 text-pink-700 hover:text-pink-950 underline font-semibold"
            title="Re-play Wax Seal Envelope Opening"
          >
            <Mail className="w-3 h-3 text-pink-600" />
            <span>Re-seal Envelope</span>
          </button>
        </div>
      </footer>

      {/* Interactive Modals */}
      <RSVPModal
        isOpen={isRSVPOpen}
        onClose={() => setIsRSVPOpen(false)}
        onRsvpSubmit={handleRsvpSubmit}
      />

      <QRModal isOpen={isQROpen} onClose={() => setIsQROpen(false)} />

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
