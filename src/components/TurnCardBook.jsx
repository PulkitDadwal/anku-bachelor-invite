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
  ExternalLink,
  Download
} from 'lucide-react';
import LiveCountdown from './LiveCountdown';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
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
  const [isFlipping, setIsFlipping] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [likedWishes, setLikedWishes] = useState({});

  const minSwipeDistance = 45;

  const toggleWishLike = (id) => {
    setLikedWishes((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
    fireHearts();
  };

  // Sound & confetti on opening
  const goToPage = (target) => {
    if (isFlipping || target === currentPage || target < 0 || target > 3) return;

    soundManager.playPageTurn();
    setIsFlipping(true);
    setCurrentPage(target);

    if (target === 1 || target === 2) {
      fireWeddingConfetti();
    } else if (target === 3) {
      fireHearts();
    }

    setTimeout(() => {
      setIsFlipping(false);
    }, 550);
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
  }, [currentPage, isFlipping]);

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

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Top Floating Utility Bar */}
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl flex items-center justify-between px-3 py-2 mb-2.5">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMusic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm transition-all active:scale-95 ${
              isMusicOn
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-400 shadow-pink-500/30 animate-pulse'
                : 'bg-white/90 text-pink-700 border-pink-200/80 hover:bg-pink-50'
            }`}
            title={isMusicOn ? 'Mute Music' : 'Play Celebration Melody'}
          >
            {isMusicOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isMusicOn ? 'Music Playing 🎶' : 'Play Music 🎵'}</span>
          </button>

          <button
            onClick={() => {
              fireWeddingConfetti();
              soundManager.playChime();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-pink-700 border border-pink-200/80 hover:bg-pink-50 shadow-sm transition-all active:scale-95"
            title="Celebrate with Confetti!"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span className="hidden sm:inline">Celebrate</span> 🎀
          </button>
        </div>

        {/* Page Indicator & Share */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full border border-pink-200 shadow-sm text-xs font-medium text-pink-800">
            <span>Page {currentPage + 1} of 4</span>
          </div>

          <button
            onClick={onOpenQR}
            className="p-1.5 rounded-full bg-white/90 text-pink-700 border border-pink-200 hover:bg-pink-50 shadow-sm transition-all active:scale-95"
            title="Share & QR Code"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Card Viewport */}
      <div
        className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl aspect-[1/1.5] max-h-[82vh] perspective-container px-3 sm:px-4"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Book Container with realistic 3D depth and luxury card framing */}
        <div
          className={`relative w-full h-full rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-500 overflow-hidden border-2 sm:border-4 border-pink-200/90 ${
            isFlipping ? 'scale-[0.98]' : 'scale-100'
          }`}
          style={{
            boxShadow:
              '0 25px 50px -12px rgba(180, 83, 107, 0.35), 0 0 0 1px rgba(244, 114, 182, 0.25)'
          }}
        >
          {/* ================= PAGE 0: FRONT COVER ================= */}
          {currentPage === 0 && (
            <div className="relative w-full h-full bg-white flex flex-col items-center justify-between animate-fadeIn">
              <img
                src="/card-cover.jpg"
                alt="Cheri Cheri Lady - Akanksha"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />

              {/* Top ambient tag */}
              <div className="relative z-10 mt-3 sm:mt-4 px-3.5 py-1 bg-white/85 backdrop-blur-md rounded-full shadow-sm border border-pink-200/90 text-[10px] sm:text-[11px] font-semibold text-pink-700 tracking-wider flex items-center gap-1.5 animate-bounce">
                <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
                <span>TAP TO OPEN INVITATION</span>
                <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
              </div>

              {/* Bottom Interactive Open Button */}
              <div className="relative z-10 mb-4 sm:mb-5 px-4 w-full flex flex-col items-center gap-2">
                <button
                  onClick={nextPage}
                  className="px-6 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 text-white font-semibold rounded-full shadow-lg shadow-pink-500/35 hover:shadow-pink-500/50 hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm flex items-center gap-2 border border-pink-200"
                >
                  <span>Open Invitation</span>
                  <ChevronRight className="w-4 h-4 animate-pulse" />
                </button>
                <span className="text-[10px] text-pink-700 font-medium bg-white/80 backdrop-blur-md px-3 py-0.5 rounded-full border border-pink-100 shadow-sm">
                  Swipe left or tap arrows 🎀
                </span>
              </div>
            </div>
          )}

          {/* ================= PAGE 1: INVITATION DETAILS ================= */}
          {currentPage === 1 && (
            <div className="relative w-full h-full bg-[#fcf2f4] flex flex-col items-center justify-between p-2 sm:p-4 animate-fadeIn">
              <img
                src="/card-invite.jpg"
                alt="Akanksha's Twilight Toast Details"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />

              {/* Interactive Actions Overlay */}
              <div className="relative z-10 w-full flex justify-between items-center pt-1.5 sm:pt-2 px-1 sm:px-2">
                <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-semibold text-pink-800 shadow-sm border border-pink-200">
                  Nov 21, 2026 • 7 PM
                </span>
                <button
                  onClick={onOpenRSVP}
                  className="px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-semibold rounded-full shadow-sm hover:from-pink-600 hover:to-rose-600 transition-all flex items-center gap-1 active:scale-95"
                >
                  <Heart className="w-3 h-3 fill-white" /> RSVP Now
                </button>
              </div>

              {/* Bottom Interactive Quick-Action Links */}
              <div className="relative z-10 w-full pb-2 sm:pb-3 px-1 sm:px-2 flex flex-col gap-1.5">
                {/* Calendar & Map Buttons */}
                <div className="grid grid-cols-2 gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-pink-200 shadow-md">
                  <a
                    href={getGoogleCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-pink-50/90 hover:bg-pink-100 text-pink-900 rounded-xl text-[10px] sm:text-[11px] font-semibold transition-all border border-pink-200/60"
                  >
                    <Calendar className="w-3.5 h-3.5 text-pink-600" />
                    <span>Add to Calendar</span>
                  </a>

                  <a
                    href="https://maps.google.com/?q=Manhas+Residence"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-pink-50/90 hover:bg-pink-100 text-pink-900 rounded-xl text-[10px] sm:text-[11px] font-semibold transition-all border border-pink-200/60"
                  >
                    <MapPin className="w-3.5 h-3.5 text-pink-600" />
                    <span>View Venue Map</span>
                  </a>
                </div>

                {/* Direct Call / Contact Pills with WhatsApp & Phone options */}
                <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-pink-200 shadow-md">
                  <div className="flex items-center justify-between px-1 mb-1">
                    <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider">
                      RSVP & Contact Hosts
                    </span>
                    <button
                      onClick={onOpenContact}
                      className="text-[10px] font-semibold text-pink-700 hover:text-pink-900 underline flex items-center gap-0.5"
                    >
                      <span>All Options</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {/* Geetanjali Contact Button */}
                    <div className="flex items-center gap-1 bg-pink-50/90 p-1 rounded-xl border border-pink-200/70">
                      <button
                        onClick={onOpenContact}
                        className="flex-1 text-left px-1 truncate text-[10px] font-bold text-pink-950 hover:text-pink-700"
                        title="Geetanjali (+91 99100 53481)"
                      >
                        Geetanjali
                      </button>
                      <a
                        href="tel:+919910053481"
                        className="p-1 rounded-lg bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-200 shadow-xs"
                        title="Call Geetanjali"
                      >
                        <Phone className="w-3 h-3" />
                      </a>
                      <a
                        href="https://wa.me/919910053481?text=Hi%20Geetanjali!%20Regarding%20Akanksha's%20Twilight%20Toast...%20🎀"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 shadow-xs"
                        title="WhatsApp Geetanjali"
                      >
                        <MessageCircle className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Palak Contact Button */}
                    <div className="flex items-center gap-1 bg-pink-50/90 p-1 rounded-xl border border-pink-200/70">
                      <button
                        onClick={onOpenContact}
                        className="flex-1 text-left px-1 truncate text-[10px] font-bold text-pink-950 hover:text-pink-700"
                        title="Palak (+91 82873 47716)"
                      >
                        Palak
                      </button>
                      <a
                        href="tel:+918287347716"
                        className="p-1 rounded-lg bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-200 shadow-xs"
                        title="Call Palak"
                      >
                        <Phone className="w-3 h-3" />
                      </a>
                      <a
                        href="https://wa.me/918287347716?text=Hi%20Palak!%20Regarding%20Akanksha's%20Twilight%20Toast...%20🎀"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 shadow-xs"
                        title="WhatsApp Palak"
                      >
                        <MessageCircle className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= PAGE 2: LIVE COUNTDOWN & QR CODE (REDESIGNED) ================= */}
          {currentPage === 2 && (
            <div className="relative w-full h-full bg-[#fffafb] flex flex-col items-center justify-between animate-fadeIn overflow-hidden">
              {/* Ribbon frame backdrop provided by user */}
              <img
                src="/ribbon-frame.jpg"
                alt="Ribbon Frame"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
              />

              {/* Framed Content Container: Positioned carefully inside the satin bow and ribbons */}
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-between px-6 sm:px-9 pt-[14%] pb-[14%] text-center">
                {/* Top Section: Header & Event Tag */}
                <div className="w-full flex flex-col items-center">
                  <div className="inline-flex items-center gap-1 px-3 py-0.5 bg-pink-100/90 backdrop-blur-md rounded-full text-pink-700 text-[10px] font-bold tracking-widest uppercase mb-1 border border-pink-200/80 shadow-xs">
                    <Sparkles className="w-3 h-3 text-pink-500" />
                    <span>Cheri Cheri Countdown</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-pink-950 font-script leading-tight">
                    Akanksha's Twilight Toast
                  </h2>
                  <p className="text-[10px] sm:text-[11px] font-medium text-pink-800/85 mt-0.5">
                    Saturday, November 21, 2026 • 7:00 PM IST
                  </p>
                </div>

                {/* Middle Section: Live Countdown Clock */}
                <div className="w-full flex flex-col items-center my-auto py-1">
                  <div className="bg-white/85 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-sm border border-pink-200/90 mx-auto">
                    <div className="text-[9px] font-bold text-pink-600 uppercase tracking-widest text-center mb-1">
                      Time Remaining Until Celebration
                    </div>
                    <LiveCountdown compact={true} />
                  </div>
                </div>

                {/* QR Section: Crisp User QR Code in Luxury Porcelain Card */}
                <div className="w-full flex flex-col items-center">
                  <div
                    onClick={onOpenQR}
                    className="group cursor-pointer bg-white/95 rounded-2xl p-2.5 shadow-md border-2 border-pink-200/90 hover:border-pink-400 hover:shadow-lg transition-all flex flex-col items-center max-w-[150px] sm:max-w-[165px]"
                  >
                    <img
                      src="/qr-code.png"
                      alt="Scan to open Akanksha's Twilight Toast"
                      className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-lg transition-transform group-hover:scale-105"
                    />
                    <div className="text-[9px] font-bold text-pink-700 mt-1 flex items-center gap-1">
                      <QrCode className="w-3 h-3 text-pink-500" />
                      <span>Tap to Enlarge & Share</span>
                    </div>
                  </div>

                  {/* Action Buttons under QR */}
                  <div className="flex items-center justify-center gap-2 mt-2 w-full max-w-xs">
                    <button
                      onClick={onOpenQR}
                      className="flex-1 py-1.5 px-3 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white rounded-full text-[10px] font-semibold shadow-sm transition-all flex items-center justify-center gap-1 active:scale-95"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Share QR</span>
                    </button>

                    <a
                      href={getGoogleCalendarUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 px-3 bg-white/90 hover:bg-pink-50 text-pink-800 rounded-full text-[10px] font-semibold border border-pink-200 shadow-sm transition-all flex items-center justify-center gap-1 active:scale-95"
                    >
                      <Calendar className="w-3 h-3 text-pink-600" />
                      <span>Add to Cal</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= PAGE 3: BACK COVER / BLESSINGS & RSVP ================= */}
          {currentPage === 3 && (
            <div className="relative w-full h-full bg-gradient-to-b from-pink-100 via-white to-pink-50 flex flex-col items-center justify-between p-4 sm:p-5 text-center animate-fadeIn overflow-y-auto">
              {/* Decorative top header */}
              <div className="w-full flex flex-col items-center pt-1">
                <span className="text-2xl sm:text-3xl mb-0.5">🎀</span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-pink-950 font-script">
                  With Love & Best Wishes
                </h2>
                <p className="text-[11px] sm:text-xs text-pink-700/85 mt-0.5 max-w-xs">
                  Celebrating our beautiful bride Akanksha as she begins her sweetest journey!
                </p>
              </div>

              {/* RSVP Action & Wishes Wall */}
              <div className="w-full my-2 space-y-2.5">
                <button
                  onClick={onOpenRSVP}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg shadow-pink-500/30 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm border border-pink-300"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Send a Blessing or RSVP 💖</span>
                </button>

                {/* Wishes Display Container */}
                <div className="bg-white/90 rounded-2xl p-2.5 sm:p-3 border border-pink-200/90 shadow-inner max-h-40 overflow-y-auto text-left space-y-2">
                  <div className="text-[10px] sm:text-[11px] font-bold text-pink-600 uppercase tracking-wider flex items-center justify-between">
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
                          <p className="text-[11px] text-pink-800/90 mt-0.5 italic">
                            "{item.message}"
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-3 text-xs text-pink-400 italic">
                      Be the first to leave a sweet wish for Akanksha! 🌸
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Turn Back Button & Signature */}
              <div className="w-full pb-1 flex flex-col items-center gap-1">
                <button
                  onClick={() => goToPage(0)}
                  className="px-4 py-1.5 bg-pink-100 hover:bg-pink-200 text-pink-900 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border border-pink-200 active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Turn Back to Cover</span>
                </button>
                <span className="text-[9px] text-pink-500 font-mono">
                  Cheri Cheri Lady • November 21, 2026
                </span>
              </div>
            </div>
          )}

          {/* Book Spine Fold Overlay in Center for authentic card feel */}
          <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/15 to-transparent pointer-events-none z-20"></div>
          <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-black/10 to-transparent pointer-events-none z-20"></div>
        </div>

        {/* Floating Page Flip Navigation Buttons (Desktop & Tablet) */}
        {currentPage > 0 && (
          <button
            onClick={prevPage}
            disabled={isFlipping}
            className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 bg-white/95 text-pink-700 hover:text-pink-900 rounded-full shadow-xl border border-pink-200 hover:scale-110 active:scale-95 transition-all"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {currentPage < 3 && (
          <button
            onClick={nextPage}
            disabled={isFlipping}
            className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 bg-white/95 text-pink-700 hover:text-pink-900 rounded-full shadow-xl border border-pink-200 hover:scale-110 active:scale-95 transition-all"
            aria-label="Next Page"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Bottom Page Thumbnails / Navigation Dots */}
      <div className="flex items-center gap-2 mt-3.5">
        {[
          { label: 'Cover', icon: '🌸' },
          { label: 'Invite', icon: '💌' },
          { label: 'Countdown', icon: '⏳' },
          { label: 'Wishes', icon: '💖' }
        ].map((tab, idx) => (
          <button
            key={idx}
            onClick={() => goToPage(idx)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentPage === idx
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30 scale-105 border border-pink-400'
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
