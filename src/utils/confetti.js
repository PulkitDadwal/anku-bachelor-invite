import confetti from 'canvas-confetti';

export function fireWeddingConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  // Romantic pink, rose, gold, and white confetti mix
  const colors = ['#f472b6', '#fb7185', '#fda4af', '#fcd34d', '#ffffff', '#e879f9'];

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: colors
  });
  fire(0.2, {
    spread: 60,
    colors: colors
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: colors
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#f472b6', '#fb7185', '#fcd34d']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: colors
  });
}

// Delicate floating hearts shower
export function fireHearts() {
  confetti({
    particleCount: 40,
    spread: 80,
    origin: { y: 0.6 },
    shapes: ['star', 'circle'],
    colors: ['#f43f5e', '#ec4899', '#f472b6', '#fda4af'],
    scalar: 1.3
  });
}

