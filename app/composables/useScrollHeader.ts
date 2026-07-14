// app/composables/useScrollHeader.ts
import { scrollConfig } from "@/components/modules/scroll/config"; // поправь путь если надо

export function useScrollHeader() {
  const isFixed = ref(false);
  const isShow = ref(false);
  const isAnimating = ref(false);

  let lastScrollTop = 0;
  const startPoint = scrollConfig.header.startPoint;

  const handleScrollMove = (y: number) => {
    // 1. Возврат в самый верх страницы
    if (y <= 20) {
      isFixed.value = false;
      isShow.value = false;
      isAnimating.value = false;
      lastScrollTop = y;
      return;
    }

    // 2. Включаем фиксацию почти сразу
    if (y > 20) {
      isFixed.value = true;
    }

    // 3. Логика вылета выше зоны дребезжания
    if (y > startPoint) {
      isAnimating.value = true;

      if (y < lastScrollTop - 5) {
        isShow.value = true; // Скроллим ВВЕРХ
      } else if (y > lastScrollTop + 5) {
        isShow.value = false; // Скроллим ВНИЗ
      }
    }

    lastScrollTop = y;
  };

  // Слушаем как нативный скролл, так и наш кастомный из плавной анимации
  const onNativeScroll = () => handleScrollMove(window.scrollY);
  const onCustomScroll = (e: Event) => handleScrollMove((e as CustomEvent).detail.y);

  onMounted(() => {
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("smooth-scroll-move", onCustomScroll);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", onNativeScroll);
    window.removeEventListener("smooth-scroll-move", onCustomScroll);
  });

  return { isFixed, isShow, isAnimating };
}
