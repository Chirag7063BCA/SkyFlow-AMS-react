let frameId = null;

export function scrollToTop(duration = 220) {
  if (frameId) cancelAnimationFrame(frameId);

  const startY = window.scrollY;
  if (startY <= 0) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, 0);
    return;
  }

  const startTime = performance.now();

  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const left = 1 - progress;
    const ease = 1 - left * left * left;
    window.scrollTo(0, Math.round(startY * (1 - ease)));

    if (progress < 1) {
      frameId = requestAnimationFrame(step);
    } else {
      frameId = null;
    }
  };

  frameId = requestAnimationFrame(step);
}
