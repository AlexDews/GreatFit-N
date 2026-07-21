// app/composables/useSmoothScroll.ts

export interface ScrollOptions {
  speed?: number;
  offsetTop?: number;
}

export function useSmoothScroll() {
  const scrollTo = (target: HTMLElement, { speed = 500, offsetTop = 0 }: ScrollOptions = {}) => {
    if (!import.meta.client) return;

    const startY = window.scrollY;
    const endY = target.getBoundingClientRect().top + startY - offsetTop;

    const distance = endY - startY;

    let startTime: number | null = null;

    const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    const animate = (time: number) => {
      if (!startTime) startTime = time;

      const progress = Math.min((time - startTime) / speed, 1);

      window.scrollTo(0, startY + distance * easeInOutQuad(progress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  return {
    scrollTo,
  };
}
