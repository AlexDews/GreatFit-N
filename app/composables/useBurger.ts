// app/composables/useBurger.ts
import { ref, watch, onUnmounted } from "vue";
import { useRoute } from "#app";
import { useBodyLock } from "./useBodyLock";
import { systemConfig } from "./system.config";
import { burgerConfig } from "~/components/modules/burger/config";

/**
 * Lumina Nexus Burger Menu Controller
 */
const isMenuOpen = ref(false);

const { isLocked, lock, unlock } = useBodyLock();

export function useBurger() {
  const route = useRoute();

  //~--- Обработчик Escape ---
  const handleEscape = (e: KeyboardEvent): void => {
    if (e.key === "Escape" && isMenuOpen.value) {
      closeMenu();
    }
  };

  //~--- Открыть меню ---
  const openMenu = (): void => {
    if (!import.meta.client || isMenuOpen.value) return;

    isMenuOpen.value = true;
    document.documentElement.classList.add(burgerConfig.menuOpenClass);

    if (!isLocked.value) {
      lock(systemConfig.bodyLock.delay);
    }

    document.addEventListener("keydown", handleEscape);
  };

  //~--- Закрыть меню ---
  const closeMenu = (): void => {
    if (!import.meta.client || !isMenuOpen.value) return;

    isMenuOpen.value = false;
    document.documentElement.classList.remove(burgerConfig.menuOpenClass);

    if (isLocked.value) {
      unlock();
    }

    document.removeEventListener("keydown", handleEscape);
  };

  //~--- Переключить меню ---
  const toggleMenu = (): void => {
    if (isMenuOpen.value) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  //~--- Клик по ссылке или фону ---
  const handleMenuClick = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;

    const isLink = target.closest("a") !== null;
    const isBackdrop = target.classList.contains("menu-backdrop") || target.hasAttribute("data-click-dismiss");

    if (isLink || isBackdrop) {
      closeMenu();
    }
  };

  //~--- Автозакрытие при смене маршрута ---
  watch(
    () => route.path,
    () => {
      closeMenu();
    },
  );

  //~--- Очистка ---
  onUnmounted(() => {
    if (!import.meta.client) return;

    document.removeEventListener("keydown", handleEscape);
  });

  return {
    isMenuOpen,
    openMenu,
    closeMenu,
    toggleMenu,
    handleMenuClick,
  };
}
