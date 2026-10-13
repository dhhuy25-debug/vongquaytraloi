import confetti from 'canvas-confetti';

export function fireClassroomCelebration() {
  // Center burst
  confetti({
    particleCount: 80,
    spread: 90,
    origin: { y: 0.6 },
    colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8E53', '#A8E6CF', '#FF8B94', '#9B5DE5'],
    disableForReducedMotion: true,
  });

  // Left cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 65,
      origin: { x: 0.1, y: 0.75 },
      colors: ['#FFD166', '#06D6A0', '#118AB2', '#EF476F'],
    });
  }, 180);

  // Right cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 65,
      origin: { x: 0.9, y: 0.75 },
      colors: ['#FFD166', '#06D6A0', '#118AB2', '#EF476F'],
    });
  }, 360);

  // Big star shower
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 100,
      origin: { y: 0.5 },
      shapes: ['star'],
      colors: ['#FFD700', '#FFA500', '#FF4500'],
      scalar: 1.2,
    });
  }, 550);
}

export function fireMiniBurst(x = 0.5, y = 0.5) {
  confetti({
    particleCount: 30,
    spread: 50,
    origin: { x, y },
    colors: ['#FFD700', '#FF6B6B', '#4ECDC4'],
  });
}
