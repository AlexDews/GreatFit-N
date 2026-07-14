// app/composables/useBurger.ts
import { ref, watch, onUnmounted } from "vue";
import { useRoute } from "#app";
import { useBodyLock } from "./useBodyLock";
import { systemConfig } from "./system.config";
import { burgerConfig } from "~/components/modules/burger/config";

/**
 ** LuminaNexus Burger Menu Controller
 */
const isMenuOpen = ref(false);
const { lock, unlock } = useBodyLock();

export function useBurger() {
  const route = useRoute();

  //~--- Обработчик нажатия Escape ---
  const handleEscape = (e: KeyboardEvent): void => {
    if (e.key === "Escape" && isMenuOpen.value) {
      closeMenu();
    }
  };

  //~--- Открыть меню ---
  const openMenu = (): void => {
    if (!import.meta.client) return;

    lock(systemConfig.bodyLock.delay);
    isMenuOpen.value = true;
    document.documentElement.classList.add(burgerConfig.menuOpenClass);

    // Вешаем слушатель на Escape
    document.addEventListener("keydown", handleEscape);
  };

  //~--- Закрыть меню ---
  const closeMenu = (): void => {
    if (!import.meta.client) return;

    unlock();
    isMenuOpen.value = false;
    document.documentElement.classList.remove(burgerConfig.menuOpenClass);

    // Снимаем слушатель Escape
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

  //~--- Обработчик клика по бэкграунду или ссылкам ---
  const handleMenuClick = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;

    // Закрываем, если кликнули по тегу ссылки (включая якорные <a>)
    const isLink = target.closest("a");

    // Закрываем, если кликнули по оверлею (проверяем класс или специальный data-атрибут)
    const isBackdrop = target.classList.contains("menu-backdrop") || target.hasAttribute("data-click-dismiss");

    if (isLink || isBackdrop) {
      closeMenu();
    }
  };

  //~--- Автозакрытие при переходе на другую страницу ---
  watch(
    () => route.path,
    () => {
      if (isMenuOpen.value) {
        closeMenu();
      }
    },
  );

  // Безопасно чистим за собой глобальные события при уничтожении компонента
  onUnmounted(() => {
    if (import.meta.client) {
      document.removeEventListener("keydown", handleEscape);
    }
  });

  return {
    isMenuOpen,
    openMenu,
    closeMenu,
    toggleMenu,
    handleMenuClick,
  };
}
