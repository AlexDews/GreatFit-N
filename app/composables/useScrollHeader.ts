import { scrollConfig } from "@/components/modules/scroll/config";
import { ref, onMounted, onUnmounted, nextTick } from "vue";

export function useScrollHeader() {
  const { isLocked } = useBodyLock();

  const isFixed = ref(false);
  const isShow = ref(true);
  const isAnimating = ref(false);

  let lastScrollTop = 0;
  let isTransitioning = false;

  const startPoint = scrollConfig?.header?.startPoint ?? 350;
  const endPoint = scrollConfig?.header?.endPoint ?? 250;

  const handleScroll = () => {
    if (!import.meta.client) return;

    const y = window.scrollY;

    if (isLocked.value || isTransitioning) {
      lastScrollTop = y;
      return;
    }

    const isScrollingDown = y > lastScrollTop;

    // 1. Самый верх страницы (y == 0) — полностью возвращаем стандартную шапку в потоке
    if (y <= 0) {
      isFixed.value = false;
      isShow.value = true;
      isAnimating.value = false;
      lastScrollTop = y;
      return;
    }

    // 2. Зона между 0 и endPoint — шапка должна УПЛЫВАТЬ НАВЕРХ при скролле к верху
    if (y <= endPoint) {
      if (isFixed.value) {
        isShow.value = false; // Прячем за верхний край!
      }
      lastScrollTop = y;
      return;
    }

    // 3. Зона ниже startPoint
    if (y > startPoint) {
      if (isScrollingDown) {
        // Скролл ВНИЗ: прячем
        if (isFixed.value) {
          isShow.value = false;
        }
      } else {
        // Скролл ВВЕРХ: фиксация и выезд
        if (!isFixed.value) {
          isTransitioning = true;

          isFixed.value = true;
          isShow.value = false;
          isAnimating.value = false;

          nextTick(() => {
            const headerEl = document.querySelector(".header") as HTMLElement;
            if (headerEl) {
              void headerEl.offsetHeight;
            }

            requestAnimationFrame(() => {
              isAnimating.value = true;
              isShow.value = true;

              setTimeout(() => {
                isTransitioning = false;
              }, 300);
            });
          });
        } else {
          isShow.value = true;
        }
      }
    }

    lastScrollTop = y;
  };

  onMounted(() => {
    lastScrollTop = window.scrollY;

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
  });

  return {
    isFixed,
    isShow,
    isAnimating,
  };
}
