import React, { useState, useEffect } from 'react';

// Target date: November 21, 2026 at 7:00 PM (19:00 IST)
const EVENT_DATE = new Date('2026-11-21T19:00:00+05:30').getTime();

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const difference = EVENT_DATE - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isPast: false };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return timeLeft;
}

export default function LiveCountdown({ className = '', compact = false }) {
  const { days, hours, minutes, seconds } = useCountdown();

  const pad = (n) => String(n).padStart(2, '0');

  const units = [
    { label: 'Days', value: pad(days) },
    { label: 'Hours', value: pad(hours) },
    { label: 'Mins', value: pad(minutes) },
    { label: 'Secs', value: pad(seconds), pulse: true }
  ];

  return (
    <div className={`flex items-center justify-center gap-1 sm:gap-2 ${className}`}>
      {units.map((unit, idx) => (
        <React.Fragment key={unit.label}>
          <div className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center font-bold font-mono tracking-tight text-pink-900 bg-white/95 rounded-lg border border-pink-200/90 shadow-2xs transition-all ${
                compact
                  ? 'w-[clamp(1.9rem,6.4cqw,2.7rem)] h-[clamp(1.7rem,5.6cqw,2.3rem)] text-[clamp(0.85rem,2.8cqw,1.1rem)]'
                  : 'w-12 h-11 sm:w-14 sm:h-12 text-lg sm:text-xl'
              } ${unit.pulse ? 'ring-2 ring-pink-300/40' : ''}`}
            >
              <span className="bg-gradient-to-b from-pink-700 via-rose-600 to-pink-900 bg-clip-text text-transparent">
                {unit.value}
              </span>
            </div>
            <span className="text-[8px] sm:text-[9px] font-bold tracking-wider text-pink-700/80 mt-0.5 uppercase">
              {unit.label}
            </span>
          </div>

          {idx < units.length - 1 && (
            <span className="text-pink-400 font-bold text-xs sm:text-sm select-none self-center mb-2.5">
              :
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
