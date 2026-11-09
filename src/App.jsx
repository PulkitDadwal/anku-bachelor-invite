import React, { useState, useEffect } from 'react';
import TurnCardBook from './components/TurnCardBook';
import RSVPModal from './components/RSVPModal';
import QRModal from './components/QRModal';
import ContactModal from './components/ContactModal';
import { Heart, Sparkles, PhoneCall, Share2 } from 'lucide-react';
import { fireWeddingConfetti } from './utils/confetti';

export default function App() {
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const [rsvpList, setRsvpList] = useState(() => {
    try {
      const saved = localStorage.getItem('akanksha_wishes');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 1,
              name: 'Geetanjali & Family',
              message: 'So excited for the most fabulous Cheri Cheri Bride! 💖✨',
              date: 'Nov 9'
            },
            {
              id: 2,
              name: 'Palak',
              message: 'Can’t wait to celebrate under the twilight! 🥂🎀',
              date: 'Nov 9'
            }
          ];
    } catch {
      return [];
    }
  });

  const handleRsvpSubmit = (newRsvp) => {
    const updated = [newRsvp, ...rsvpList];
    setRsvpList(updated);
    try {
      localStorage.setItem('akanksha_wishes', JSON.stringify(updated));
    } catch {}
  };

  // Launch initial gentle confetti celebration on first mount
  useEffect(() => {
    const timer = setTimeout(() => {
      fireWeddingConfetti();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-between py-3 sm:py-5 overflow-x-hidden">
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
      <header className="relative z-10 w-full text-center px-4 mb-1">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/85 backdrop-blur-md rounded-full border border-pink-200/90 shadow-xs text-pink-700 text-[11px] font-bold tracking-wider uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin" />
          <span>Interactive Invitation Card</span>
          <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-pink-950 font-script tracking-wide">
          Akanksha's Twilight Toast
        </h1>
        <p className="text-xs sm:text-sm text-pink-800/80 font-medium font-serif italic mt-0.5">
          Celebrating our ultimate Cheri Cheri Bride 🎀
        </p>
      </header>

      {/* Main 3D Turn Card Book Area */}
      <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center">
        <TurnCardBook
          onOpenRSVP={() => setIsRSVPOpen(true)}
          onOpenQR={() => setIsQROpen(true)}
          onOpenContact={() => setIsContactOpen(true)}
          rsvpList={rsvpList}
        />
      </main>

      {/* Bottom Footer with Contact Shortcut */}
      <footer className="relative z-10 w-full text-center py-2.5 px-4 text-xs text-pink-800/80">
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
