import React, { useState } from 'react';
import { X, Phone, MessageCircle, Copy, Check, Heart, Sparkles, User } from 'lucide-react';
import { fireWeddingConfetti } from '../utils/confetti';

export default function ContactModal({ isOpen, onClose }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const contacts = [
    {
      name: 'Geetanjali',
      relation: 'Host & RSVP Coordinator',
      phone: '+91 99100 53481',
      rawPhone: '+919910053481',
      whatsappMessage: encodeURIComponent("Hi Geetanjali! Regarding Akanksha's Twilight Toast invitation on Nov 21... 🎀"),
      avatarBg: 'from-pink-400 to-rose-500'
    },
    {
      name: 'Palak',
      relation: 'Host & RSVP Coordinator',
      phone: '+91 82873 47716',
      rawPhone: '+918287347716',
      whatsappMessage: encodeURIComponent("Hi Palak! Regarding Akanksha's Twilight Toast invitation on Nov 21... 🎀"),
      avatarBg: 'from-rose-400 to-pink-600'
    }
  ];

  const handleCopy = (phone, index) => {
    navigator.clipboard.writeText(phone);
    setCopiedIndex(index);
    fireWeddingConfetti();
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-pink-50 via-white to-pink-50 rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-pink-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-pink-400 hover:text-pink-600 rounded-full hover:bg-pink-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 rounded-full text-pink-700 text-[11px] font-semibold tracking-wider uppercase mb-2">
            <Sparkles className="w-3 h-3 text-pink-500" />
            <span>Event Hosts & Inquiries</span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-pink-950 font-script">
            Connect with Us 🎀
          </h3>
          <p className="text-xs text-pink-700/80 mt-1">
            Need directions, event info, or want to RSVP directly? Feel free to call or WhatsApp anytime!
          </p>
        </div>

        {/* Contact Cards */}
        <div className="space-y-3.5 mb-5">
          {contacts.map((c, idx) => (
            <div
              key={idx}
              className="bg-white/95 rounded-2xl p-3.5 border border-pink-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-full bg-gradient-to-tr ${c.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-sm`}
                  >
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-pink-950">{c.name}</h4>
                    <p className="text-[10px] text-pink-500 font-medium">{c.phone}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(c.phone, idx)}
                  className="p-1.5 rounded-lg text-pink-500 hover:text-pink-700 hover:bg-pink-50 border border-pink-100 transition-all text-[11px] flex items-center gap-1"
                  title="Copy Phone Number"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[10px] text-emerald-600 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Buttons: Direct Call & WhatsApp */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-pink-100">
                <a
                  href={`tel:${c.rawPhone}`}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-pink-50 hover:bg-pink-100 text-pink-900 rounded-xl text-xs font-semibold transition-all border border-pink-200/70 active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5 text-pink-600" />
                  <span>Call Now</span>
                </a>

                <a
                  href={`https://wa.me/${c.rawPhone.replace('+', '')}?text=${c.whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Note / Footer */}
        <div className="text-center pt-2 border-t border-pink-100">
          <p className="text-[11px] text-pink-600 font-medium flex items-center justify-center gap-1">
            <span>Manhas Residence</span>
            <span>•</span>
            <span>November 21, 2026</span>
          </p>
        </div>
      </div>
    </div>
  );
}

