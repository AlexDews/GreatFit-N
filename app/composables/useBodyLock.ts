// app/composables/useBodyLock.ts
import { ref } from "vue";
import { systemConfig } from "./system.config";

/**
 ** LuminaNexus Scroll Lock Engine
 */
const isLocked = ref(false);
let bodyLockStatus = true; // Защита от дебаунса (двойных кликов)

const getScrollWidth = (): string => {
  if (!import.meta.client) return "0px";
  return `${window.innerWidth - document.documentElement.clientWidth}px`;
};

export function useBodyLock() {
  //--- Включить блокировку скролла ---
  const lock = (delay: number = systemConfig.bodyLock.delay): void => {
    if (!import.meta.client || !bodyLockStatus) return;

    const lockPadding = document.querySelectorAll<HTMLElement>(systemConfig.bodyLock.paddingAttr);
    const paddingValue = getScrollWidth();

    lockPadding.forEach((el) => {
      el.style.paddingRight = paddingValue;
    });

    document.body.style.paddingRight = paddingValue;
    document.documentElement.classList.add(systemConfig.bodyLock.lockClass);

    bodyLockStatus = false;
    isLocked.value = true;

    setTimeout(() => {
      bodyLockStatus = true;
    }, delay);
  };

  //--- Выключить блокировку скролла ---
  const unlock = (delay: number = systemConfig.bodyLock.delay): void => {
    if (!import.meta.client || !bodyLockStatus) return;

    const lockPadding = document.querySelectorAll<HTMLElement>(systemConfig.bodyLock.paddingAttr);

    lockPadding.forEach((el) => {
      el.style.paddingRight = "0px";
    });

    document.body.style.paddingRight = "0px";
    document.documentElement.classList.remove(systemConfig.bodyLock.lockClass);

    bodyLockStatus = false;
    isLocked.value = false;

    setTimeout(() => {
      bodyLockStatus = true;
    }, delay);
  };

  //--- Переключить состояние ---
  const toggleLock = (delay: number = systemConfig.bodyLock.delay): void => {
    if (!import.meta.client) return;

    if (document.documentElement.classList.contains(systemConfig.bodyLock.lockClass)) {
      unlock(delay);
    } else {
      lock(delay);
    }
  };

  return {
    isLocked,
    lock,
    unlock,
    toggleLock,
  };
}
