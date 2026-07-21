// app/composables/useScrollHeader.ts
import { useBodyLock } from "@/composables/useBodyLock";
import { scrollConfig } from "@/components/modules/scroll/config";

export function useScrollHeader() {
  const { isLocked } = useBodyLock();

  const isFixed = ref(false);
  const isShow = ref(false);
  const isAnimating = ref(false);

  let lastScrollTop = 0;

  const startPoint = scrollConfig.header.startPoint;

  const handleScroll = () => {
    if (!import.meta.client) return;

    const y = window.scrollY;

    // Пока открыт попап/бургер — игнорируем изменения
    if (isLocked.value) {
      lastScrollTop = y;
      return;
    }

    if (y <= 20) {
      isFixed.value = false;
      isShow.value = false;
      isAnimating.value = false;
      lastScrollTop = y;
      return;
    }

    isFixed.value = true;

    if (y > startPoint) {
      isAnimating.value = true;

      if (y < lastScrollTop - 5) {
        isShow.value = true;
      } else if (y > lastScrollTop + 5) {
        isShow.value = false;
      }
    }

    lastScrollTop = y;
  };

  onMounted(() => {
    handleScroll();

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
