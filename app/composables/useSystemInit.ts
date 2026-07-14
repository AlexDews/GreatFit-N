// app/composables/useSystemInit.ts
import { onMounted } from "vue";
import { systemConfig } from "./system.config";

/**
 ** LuminaNexus Core System Bootloader
 */
export function useSystemInit(): void {
  
  //--- Проверка девайса на мобильность ---
  const isMobile = (): boolean => {
    if (!import.meta.client) return false;
    return Object.values(systemConfig.deviceDetection).some((regex) =>
      navigator.userAgent.match(regex)
    );
  };

  //~--- Проверка AVIF / WebP ---
  const initImages = async (): Promise<void> => {
    if (!import.meta.client) return;

    const checkSupport = (format: "webp" | "avif"): Promise<boolean> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img.height > 0);
        img.onerror = () => resolve(false);
        img.src = systemConfig.imageSupport[format];
      });
    };

    const [webp, avif] = await Promise.all([checkSupport("webp"), checkSupport("avif")]);

    if (avif) {
      document.documentElement.classList.add("avif");
    } else if (webp) {
      document.documentElement.classList.add("webp");
    } else {
      document.documentElement.classList.add("no-webp-avif");
    }
  };

  //~--- Класс для тач-устройств ---
  const initTouchClass = (): void => {
    if (!import.meta.client) return;
    if (isMobile()) {
      document.documentElement.classList.add("touch");
    }
  };

  //~--- Класс полной загрузки страницы ---
  const initLoadedClass = (): void => {
    if (!import.meta.client) return;

    if (document.readyState === "complete") {
      document.documentElement.classList.add("loaded");
    } else {
      window.addEventListener("load", () => document.documentElement.classList.add("loaded"), { once: true });
    }
  };

  //~--- Фикс 100vh для мобильных браузеров ---
  const initFullVHfix = (): void => {
    if (!import.meta.client) return;

    const fullScreens = document.querySelectorAll("[data-fullscreen]");
    if (!fullScreens.length || !isMobile()) return;

    let prevWidth = window.innerWidth;
    
    const fixHeight = (): void => {
      if (window.innerWidth !== prevWidth) {
        document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
        prevWidth = window.innerWidth;
      }
    };
    
    window.addEventListener("resize", fixHeight);
    fixHeight();
  };

  //~ Все триггеры запускаются строго на клиенте при монтировании приложения
  onMounted(() => {
    void initImages();
    initTouchClass();
    initLoadedClass();
    initFullVHfix();
  });
}