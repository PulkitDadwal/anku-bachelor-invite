import React, { useState } from 'react';
import { X, QrCode, Share2, Copy, Check, Download, Sparkles } from 'lucide-react';
import { fireWeddingConfetti } from '../utils/confetti';

export default function QRModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    fireWeddingConfetti();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🎀 Akanksha's Twilight Toast Invitation 🎀\nJoin us on Nov 21, 2026, 7 PM onwards at Manhas Residence to celebrate our ultimate Cheri Cheri Bride!\n\nOpen digital invitation: ${currentUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = '/qr-code.png';
    link.download = 'Akanksha-Twilight-Toast-QR.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    fireWeddingConfetti();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-pink-50 via-white to-pink-50 rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-pink-200 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-pink-400 hover:text-pink-600 rounded-full hover:bg-pink-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-12 h-12 bg-pink-100 text-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-2.5 shadow-inner">
          <QrCode className="w-6 h-6" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-pink-100/80 rounded-full text-pink-700 text-[10px] font-semibold tracking-wider uppercase mb-1.5">
          <Sparkles className="w-3 h-3 text-pink-500" />
          <span>Interactive QR Pass</span>
        </div>

        <h3 className="text-xl font-serif font-bold text-pink-950 font-script text-2xl">
          Scan or Share Invitation 🎀
        </h3>
        <p className="text-xs text-pink-700/80 mt-1 mb-4">
          Scan with any smartphone camera to open this interactive invitation!
        </p>

        {/* High Resolution QR Code Preview */}
        <div className="p-3.5 bg-white rounded-2xl shadow-lg border-2 border-pink-100 inline-block mb-4 relative group">
          <img
            src="/qr-code.png"
            alt="Akanksha's Twilight Toast QR Code"
            className="w-44 h-44 object-contain rounded-xl transition-transform group-hover:scale-105"
          />
        </div>

        {/* Actions Grid */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleShareWhatsApp}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" /> Share via WhatsApp
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownloadQR}
              className="py-2.5 px-3 bg-pink-50 hover:bg-pink-100 text-pink-800 rounded-xl text-xs font-semibold border border-pink-200 flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-pink-600" />
              <span>Save QR</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="py-2.5 px-3 bg-pink-50 hover:bg-pink-100 text-pink-800 rounded-xl text-xs font-semibold border border-pink-200 flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-pink-600" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
