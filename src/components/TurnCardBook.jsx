import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Phone,
  QrCode,
  Heart,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Share2,
  MapPin,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import LiveCountdown from './LiveCountdown';
import CoverHoloShimmer from './CoverHoloShimmer';
import InteractiveRibbon from './InteractiveRibbon';
import { getGoogleCalendarUrl } from '../utils/calendar';
import { fireWeddingConfetti, fireHearts } from '../utils/confetti';
import { soundManager } from '../utils/audio';

export default function TurnCardBook({
  onOpenRSVP,
  onOpenQR,
  onOpenContact,
  rsvpList = []
}) {
  // Current page state:
  // 0: Cover (Front)
  // 1: Inside Left (Invite details)
  // 2: Inside Right (Countdown & QR)
  // 3: Back Cover (Blessing Wall & RSVP)
  const [currentPage, setCurrentPage] = useState(0);
  const [flip, setFlip] = useState(null);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [likedWishes, setLikedWishes] = useState({});

  const minSwipeDistance = 45;

  // Auto-play background music on mount and subscribe to audio state
  useEffect(() => {
    const unsubscribe = soundManager.subscribe((playing) => {
      setIsMusicOn(playing);
    });

    soundManager.setupAutoplay((playing) => {
      setIsMusicOn(playing);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const toggleWishLike = (id) => {
    setLikedWishes((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
    fireHearts();
  };

  // Sound & confetti on opening
  const goToPage = (target) => {
    if (flip || target === currentPage || target < 0 || target > 3) return;

    soundManager.playPageTurn();
    setFlip({
      from: currentPage,
      to: target,
      dir: target > currentPage ? 'forward' : 'back'
    });

    if (target === 1 || target === 2) {
      fireWeddingConfetti();
    } else if (target === 3) {
      fireHearts();
    }

    window.setTimeout(() => {
      setCurrentPage(target);
      setFlip(null);
    }, 740);
  };

  const nextPage = () => {
    if (currentPage < 3) goToPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) goToPage(currentPage - 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextPage();
      } else if (e.key === 'ArrowLeft') {
        prevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, flip]);

  // Touch Swipe Handlers for Mobile
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextPage();
    } else if (isRightSwipe) {
      prevPage();
    }
  };

  const toggleMusic = () => {
    soundManager.toggleBGM((playing) => {
      setIsMusicOn(playing);
    });
  };

  const renderSheet = (sheetPage) => (
    <>
      {sheetPage === 0 && (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <CoverHoloShimmer
            src="/card-cover.jpg"
            alt="Cheri Cheri Lady - Akanksha"
          />
          <InteractiveRibbon
            isTied={currentPage === 0 && !flip}
            onUntie={nextPage}
          />
        </div>
      )}

      {sheetPage === 1 && (
        <div className="relative w-full h-full bg-[#fdf5f7] flex items-center justify-center overflow-hidden">
          <img
            src="/card-invite.jpg"
            alt="Akanksha's Twilight Toast Details"
            className="w-full h-full object-contain object-center select-none"
          />
        </div>
      )}

      {sheetPage === 2 && (
        <div className="relative w-full h-full bg-[#fffafb] flex flex-col items-center overflow-hidden">
          <img
            src="/ribbon-frame.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-contain object-center pointer-events-none select-none"
          />

          <div className="countdown-layout">
            {/* Header under the top satin bow */}
            <div className="w-full flex flex-col items-center shrink-0">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/92 backdrop-blur-md rounded-full text-pink-700 text-[9px] sm:text-[10px] font-bold tracking-widest uppercase border border-pink-200/80 shadow-2xs">
                <Sparkles className="w-3 h-3 text-pink-500 shrink-0" />
                <span>Cheri Cheri Countdown</span>
              </div>
              <h2 className="font-serif font-bold text-pink-950 font-script leading-tight text-[clamp(1.45rem,6.8cqw,2.25rem)] mt-0.5">
                Akanksha's Twilight Toast
              </h2>
              <p className="text-[10px] sm:text-[11px] font-semibold text-pink-800/85 tracking-wide mt-0.5">
                Saturday, Nov 21, 2026 • 7:00 PM IST
              </p>
            </div>

            {/* Middle Section: Live Countdown Clock */}
            <div className="w-full bg-white/92 backdrop-blur-md py-1.5 px-2.5 rounded-2xl shadow-sm border border-pink-200/90 max-w-full shrink-0">
              <div className="text-[8px] sm:text-[9px] font-bold text-pink-600 uppercase tracking-widest text-center mb-1">
                Time Remaining Until Celebration ⏳
              </div>
              <LiveCountdown compact={true} />
            </div>

            {/* Poetic calligraphy link */}
            <p className="font-script text-pink-900 leading-none text-[clamp(1.2rem,5.2cqw,1.75rem)] tracking-wide px-1 shrink-0">
              Let the map lead you ✨
            </p>

            {/* Lower Section: QR Code Card (sits gracefully above bottom ribbon key) */}
            <div
              onClick={onOpenQR}
              className="group cursor-pointer bg-white/95 backdrop-blur-md rounded-xl p-2 shadow-sm border border-pink-200/90 hover:border-pink-400 hover:shadow-md transition-all flex flex-col items-center shrink-0"
            >
              <img
                src="/qr-code.png"
                alt="Scan to open Akanksha's Twilight Toast"
                className="countdown-qr object-contain rounded-md transition-transform group-hover:scale-105"
              />
              <div className="text-[8px] sm:text-[9px] font-bold text-pink-700 mt-1 flex items-center gap-1">
                <QrCode className="w-3 h-3 text-pink-500" />
                <span>Tap to Enlarge & Share</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {sheetPage === 3 && (
        <div className="relative w-full h-full bg-[#fff7f4] flex flex-col items-center justify-between p-4 sm:p-5 text-center overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, rgba(255, 214, 226, 0.55) 0px, rgba(255, 214, 226, 0.55) 11px, transparent 11px, transparent 24px)'
            }}
          />
          <div className="relative w-full flex flex-col items-center pt-1 shrink-0">
            <span className="text-2xl mb-0.5">🎀</span>
            <h2 className="text-xl sm:text-3xl font-serif font-bold text-pink-950 font-script leading-tight">
              With Love & Best Wishes
            </h2>
            <p className="text-[11px] text-pink-700/85 mt-0.5 max-w-xs leading-snug">
              Celebrating our beautiful bride Akanksha as she begins her sweetest journey!
            </p>
          </div>

          <div className="relative w-full flex-1 min-h-0 my-2 bg-white/92 rounded-2xl p-2.5 sm:p-3 border border-pink-200/90 shadow-inner overflow-y-auto text-left space-y-2">
            <div className="text-[10px] font-bold text-pink-600 uppercase tracking-wider flex items-center justify-between sticky top-0 bg-white/95 pb-1 z-10">
              <span>Guest Blessings ({rsvpList.length})</span>
              <Sparkles className="w-3 h-3 text-pink-400" />
            </div>

            {rsvpList.length > 0 ? (
              rsvpList.map((item) => (
                <div
                  key={item.id}
                  className="bg-pink-50/80 p-2 rounded-xl border border-pink-100/90 text-xs transition-all hover:bg-pink-50"
                >
                  <div className="flex items-center justify-between font-semibold text-pink-900">
                    <span className="text-xs">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-pink-500">{item.date}</span>
                      <button
                        onClick={() => toggleWishLike(item.id)}
                        className="text-pink-400 hover:text-rose-500 transition-colors"
                        title="Like wish"
                      >
                        <Heart
                          className={`w-3 h-3 ${
                            likedWishes[item.id] ? 'text-rose-500 fill-rose-500' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  {item.message && (
                    <p className="text-[11px] text-pink-800/90 mt-0.5 italic">"{item.message}"</p>
                  )}
                </div>
              ))
            ) : (
              <div className="h-full min-h-[140px] flex flex-col items-center justify-center py-5 px-3 text-center">
                <div className="w-11 h-11 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center text-lg mb-2 shadow-inner">
                  💌
                </div>
                <h4 className="text-xs sm:text-sm font-serif font-bold text-pink-950">
                  Guestbook Ready for Wishes
                </h4>
                <p className="text-[10px] sm:text-[11px] text-pink-700/80 mt-1 max-w-[210px] leading-relaxed">
                  Be the very first to shower our bride Akanksha with love & blessings!
                </p>
                <button
                  onClick={onOpenRSVP}
                  className="mt-2.5 px-3.5 py-1.5 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-full text-[10px] sm:text-[11px] font-semibold shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Heart className="w-3 h-3 fill-white" />
                  <span>Write First Blessing 💖</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative w-full pt-1 text-center shrink-0">
            <span className="text-[10px] text-pink-500 font-mono">
              Cheri Cheri Lady • November 21, 2026
            </span>
          </div>
        </div>
      )}

      <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/18 to-transparent pointer-events-none z-20" />
      <div className="absolute inset-y-0 right-0 w-2.5 bg-gradient-to-l from-black/10 to-transparent pointer-events-none z-20" />
    </>
  );

  const underPage = flip ? (flip.dir === 'forward' ? flip.to : flip.from) : currentPage;
  const leafPage = flip ? (flip.dir === 'forward' ? flip.from : flip.to) : null;

  return (
    <div className="book-layout select-none">
      {/* Top Utility Bar */}
      <div className="book-toolbar">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMusic}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-xs transition-all active:scale-95 ${
              isMusicOn
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-400 shadow-pink-500/30 animate-pulse'
                : 'bg-white/90 text-pink-700 border-pink-200/80 hover:bg-pink-50'
            }`}
            title={isMusicOn ? 'Pause Music' : 'Play Thodi Si Daaru - AP Dhillon'}
          >
            {isMusicOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isMusicOn ? 'Music On 🎶' : 'Play Music 🎵'}</span>
          </button>

          <button
            onClick={() => {
              fireWeddingConfetti();
              soundManager.playChime();
            }}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-pink-700 border border-pink-200/80 hover:bg-pink-50 shadow-xs transition-all active:scale-95"
            title="Celebrate with Confetti!"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Celebrate 🎀</span>
          </button>
        </div>

        {/* Page Indicator & Share */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full border border-pink-200 shadow-2xs text-xs font-medium text-pink-800">
            <span>{currentPage + 1} / 4</span>
          </div>

          <button
            onClick={onOpenQR}
            className="p-1.5 rounded-full bg-white/90 text-pink-700 border border-pink-200 hover:bg-pink-50 shadow-2xs transition-all active:scale-95"
            title="Share & QR Code"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Card Viewport */}
      <div className="stage-slot">
      <div
        className="invite-stage"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="stack-sheet stack-b" />
        <div className="stack-sheet stack-a" />

        <div className="invite-book">
          <div className="settled-page">
            {renderSheet(underPage)}
            {flip?.dir === 'forward' && <div className="reveal-shadow" />}
          </div>

          {flip && (
            <div className={`page-leaf ${flip.dir}`} key={`${flip.from}-${flip.to}`}>
              <div className="leaf-face leaf-front">
                {renderSheet(leafPage)}
                <div className="leaf-shade" />
              </div>
              <div className="leaf-face leaf-back" />
            </div>
          )}

          {currentPage < 3 && !flip && <div className="page-curl" aria-hidden="true" />}
        </div>

        {currentPage > 0 && (
          <button
            onClick={prevPage}
            disabled={!!flip}
            className="absolute -left-2.5 sm:-left-5 top-1/2 -translate-y-1/2 z-40 p-1.5 sm:p-2 bg-white/95 text-pink-700 hover:text-pink-900 rounded-full shadow-lg border border-pink-200 hover:scale-110 active:scale-95 transition-all disabled:opacity-40"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {currentPage < 3 && (
          <button
            onClick={nextPage}
            disabled={!!flip}
            className="absolute -right-2.5 sm:-right-5 top-1/2 -translate-y-1/2 z-40 p-1.5 sm:p-2 bg-white/95 text-pink-700 hover:text-pink-900 rounded-full shadow-lg border border-pink-200 hover:scale-110 active:scale-95 transition-all disabled:opacity-40"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
      </div>
      </div>

      {/* ================= INTERACTIVE BUTTONS RESTING BELOW THE IMAGE ================= */}
      <div className="book-actions">
        {/* Page 0 Buttons */}
        {currentPage === 0 && (
          <div className="w-full flex flex-col items-center gap-1.5 animate-fadeIn">
            <button
              onClick={nextPage}
              className="w-full py-2.5 px-6 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 text-white font-semibold rounded-2xl shadow-md shadow-pink-500/30 hover:scale-[1.02] active:scale-98 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 border border-pink-200"
            >
              <span>Untie & Open Invitation</span>
              <ChevronRight className="w-4 h-4 animate-pulse" />
            </button>
            <span className="text-[10px] text-pink-700 font-medium">
              Pull ribbon or tap button to open 🎀
            </span>
          </div>
        )}

        {/* Page 1 Buttons: Calendar, Venue, RSVP & Contact Hosts */}
        {currentPage === 1 && (
          <div className="w-full flex flex-col gap-1.5 animate-fadeIn">
            {/* Quick Actions Row */}
            <div className="grid grid-cols-3 gap-1.5">
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 py-2 px-2 bg-white/95 hover:bg-pink-50 text-pink-900 rounded-xl text-[10px] sm:text-[11px] font-semibold border border-pink-200 shadow-2xs transition-all active:scale-95 text-center"
              >
                <Calendar className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                <span>Add to Cal</span>
              </a>

              <a
                href="https://maps.google.com/?q=Manhas+Residence"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 py-2 px-2 bg-white/95 hover:bg-pink-50 text-pink-900 rounded-xl text-[10px] sm:text-[11px] font-semibold border border-pink-200 shadow-2xs transition-all active:scale-95 text-center"
              >
                <MapPin className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                <span>Venue Map</span>
              </a>

              <button
                onClick={onOpenRSVP}
                className="flex items-center justify-center gap-1 py-2 px-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl text-[10px] sm:text-[11px] font-semibold shadow-2xs transition-all active:scale-95 text-center"
              >
                <Heart className="w-3.5 h-3.5 fill-white shrink-0" />
                <span>RSVP Now</span>
              </button>
            </div>

            {/* Host Contacts Row (Geetanjali & Palak) */}
            <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-pink-200 shadow-2xs">
              <div className="flex items-center justify-between px-1 mb-1">
                <span className="text-[9px] font-bold text-pink-600 uppercase tracking-wider">
                  Contact Hosts (Geetanjali & Palak)
                </span>
                <button
                  onClick={onOpenContact}
                  className="text-[9px] font-semibold text-pink-700 hover:text-pink-900 underline flex items-center gap-0.5"
                >
                  <span>More Options</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {/* Geetanjali */}
                <div className="flex items-center gap-1 bg-pink-50/90 px-1.5 py-1 rounded-lg border border-pink-100">
                  <span className="flex-1 truncate text-[10px] font-bold text-pink-950">Geetanjali</span>
                  <a
                    href="tel:+919910053481"
                    className="p-1 rounded bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-200 shadow-2xs"
                    title="Call Geetanjali"
                  >
                    <Phone className="w-3 h-3" />
                  </a>
                  <a
                    href="https://wa.me/919910053481?text=Hi%20Geetanjali!%20Regarding%20Akanksha's%20Twilight%20Toast...%20🎀"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded bg-emerald-500 text-white hover:bg-emerald-600 shadow-2xs"
                    title="WhatsApp Geetanjali"
                  >
                    <MessageCircle className="w-3 h-3" />
                  </a>
                </div>

                {/* Palak */}
                <div className="flex items-center gap-1 bg-pink-50/90 px-1.5 py-1 rounded-lg border border-pink-100">
                  <span className="flex-1 truncate text-[10px] font-bold text-pink-950">Palak</span>
                  <a
                    href="tel:+918287347716"
                    className="p-1 rounded bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-200 shadow-2xs"
                    title="Call Palak"
                  >
                    <Phone className="w-3 h-3" />
                  </a>
                  <a
                    href="https://wa.me/918287347716?text=Hi%20Palak!%20Regarding%20Akanksha's%20Twilight%20Toast...%20🎀"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded bg-emerald-500 text-white hover:bg-emerald-600 shadow-2xs"
                    title="WhatsApp Palak"
                  >
                    <MessageCircle className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page 2 Buttons: QR & Calendar */}
        {currentPage === 2 && (
          <div className="w-full flex items-center justify-center gap-2 animate-fadeIn">
            <button
              onClick={onOpenQR}
              className="flex-1 py-2.5 px-3 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share & Save QR</span>
            </button>

            <button
              onClick={onOpenContact}
              className="flex-1 py-2.5 px-3 bg-white/95 hover:bg-pink-50 text-pink-800 rounded-xl text-xs font-semibold border border-pink-200 shadow-2xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 text-pink-600" />
              <span>Contact Hosts</span>
            </button>

            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-white/95 hover:bg-pink-50 text-pink-800 rounded-xl text-xs font-semibold border border-pink-200 shadow-2xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5 text-pink-600" />
              <span>Add Cal</span>
            </a>
          </div>
        )}

        {/* Page 3 Buttons: RSVP & Turn to Cover */}
        {currentPage === 3 && (
          <div className="w-full flex items-center justify-center gap-2 animate-fadeIn">
            <button
              onClick={onOpenRSVP}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 text-white font-semibold rounded-xl shadow-md shadow-pink-500/25 hover:from-pink-600 hover:to-rose-600 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-95 border border-pink-300"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Send a Blessing or RSVP</span>
            </button>

            <button
              onClick={() => goToPage(0)}
              className="py-2.5 px-4 bg-white/95 hover:bg-pink-100 text-pink-900 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-pink-200 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cover</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Page Thumbnails / Navigation Dots */}
      <div className="book-dots">
        {[
          { label: 'Cover', icon: '🌸' },
          { label: 'Invite', icon: '💌' },
          { label: 'Countdown', icon: '⏳' },
          { label: 'Wishes', icon: '💖' }
        ].map((tab, idx) => (
          <button
            key={idx}
            onClick={() => goToPage(idx)}
            aria-label={tab.label}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all ${
              currentPage === idx
                ? 'bg-pink-500 text-white shadow-xs shadow-pink-500/30 scale-105 border border-pink-400'
                : 'bg-white/85 text-pink-700 hover:bg-pink-100/90 border border-pink-200/70'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
