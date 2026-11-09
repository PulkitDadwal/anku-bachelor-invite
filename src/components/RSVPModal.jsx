import React, { useState } from 'react';
import { X, Heart, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { fireWeddingConfetti } from '../utils/confetti';

export default function RSVPModal({ isOpen, onClose, onRsvpSubmit }) {
  const [name, setName] = useState('');
  const [attending, setAttending] = useState('yes');
  const [guestCount, setGuestCount] = useState('1');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const rsvpData = {
      id: Date.now(),
      name: name.trim(),
      attending: attending === 'yes',
      guestCount: attending === 'yes' ? guestCount : 0,
      message: message.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };

    onRsvpSubmit(rsvpData);
    fireWeddingConfetti();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setMessage('');
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-pink-50 via-white to-pink-50/70 rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-pink-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-pink-400 hover:text-pink-600 rounded-full hover:bg-pink-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-pink-900">Thank You, {name}! 🎀</h3>
            <p className="text-pink-700 text-sm">
              {attending === 'yes'
                ? "We can't wait to shower our Cheri Cheri Bride with you on Nov 21st!"
                : "Your warm wishes mean the world to Akanksha! 💖"}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100/80 rounded-full text-pink-600 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" /> RSVP & WISHES
              </div>
              <h3 className="text-2xl font-serif font-bold text-pink-950">Celebrate with Akanksha</h3>
              <p className="text-xs text-pink-700/80">Kindly let us know if you'll be joining the Twilight Toast</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-pink-900">Your Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priyanshu Sharma"
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/90 text-sm text-pink-950 placeholder-pink-300"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-pink-900">Will You Attend?</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAttending('yes')}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    attending === 'yes'
                      ? 'bg-pink-500 text-white border-pink-600 shadow-md shadow-pink-500/25'
                      : 'bg-white/80 text-pink-800 border-pink-200 hover:bg-pink-50'
                  }`}
                >
                  🎉 Yes, Count Me In!
                </button>
                <button
                  type="button"
                  onClick={() => setAttending('no')}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    attending === 'no'
                      ? 'bg-pink-500 text-white border-pink-600 shadow-md shadow-pink-500/25'
                      : 'bg-white/80 text-pink-800 border-pink-200 hover:bg-pink-50'
                  }`}
                >
                  💌 Sending Love
                </button>
              </div>
            </div>

            {attending === 'yes' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-pink-900">Number of Guests</label>
                <select
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/90 text-sm text-pink-950"
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 Persons</option>
                  <option value="3">3 Persons</option>
                  <option value="4">4+ Persons</option>
                </select>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-pink-900">Heartfelt Wish for Akanksha (Optional)</label>
              <textarea
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Leave a sweet message for the Cheri Cheri Bride..."
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/90 text-sm text-pink-950 placeholder-pink-300 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/30 hover:from-pink-600 hover:to-rose-500 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Send className="w-4 h-4" /> Send RSVP & Wishes 🎀
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

