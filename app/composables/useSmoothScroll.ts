// app/composables/useSmoothScroll.ts
import { scrollConfig } from "@/components/modules/scroll/config";

export function useSmoothScroll() {
  const goToBlock = (targetBlockSelector: string, options = {}) => {
    if (!import.meta.client) return; // Защита от SSR в Nuxt

    const targetElement = document.querySelector(targetBlockSelector);
    if (!targetElement) return;

    const config = { ...scrollConfig.goto, ...options };

    // Авто-закрытие бургер-меню
    if (document.documentElement.classList.contains(scrollConfig.selectors.menuOpenClass)) {
      const burgerBtn = document.querySelector(scrollConfig.selectors.burgerBtn) as HTMLElement;
      if (burgerBtn) burgerBtn.click();
    }

    // Расчет позиций
    const header = !config.noHeader ? document.querySelector(scrollConfig.selectors.header) : null;
    const headerHeight = header ? (header as HTMLElement).offsetHeight : 0;
    const startPosition = window.scrollY;
    const targetPosition = targetElement.getBoundingClientRect().top + startPosition - headerHeight - config.offsetTop;
    
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    function animation(currentTime: number) {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      
      const progress = Math.min(timeElapsed / config.speed, 1);
      // Quadratic Ease-in-out
      const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

      const currentY = startPosition + distance * ease;
      window.scrollTo(0, currentY);

      // ТРИГГЕРИМ СОБЫТИЕ, чтобы шапка адекватно реагировала во время полета!
      window.dispatchEvent(new CustomEvent("smooth-scroll-move", {
        detail: { y: currentY }
      }));

      if (timeElapsed < config.speed) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  };

  return { goToBlock };
}