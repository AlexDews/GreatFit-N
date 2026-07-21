// app/composables/useBodyLock.ts

import { ref } from "vue";
import { systemConfig } from "./system.config";

const isLocked = ref(false);
let bodyLockStatus = true;
let scrollY = 0;

export function useBodyLock() {
  const lock = (delay: number = systemConfig.bodyLock.delay, force = false): void => {
    if (!import.meta.client) return;
    if (!bodyLockStatus && !force) return;
    if (isLocked.value) return;

    scrollY = window.scrollY;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.documentElement.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = `${scrollbarWidth}px`;

    document.documentElement.classList.add(systemConfig.bodyLock.lockClass);

    bodyLockStatus = false;
    isLocked.value = true;

    window.setTimeout(() => {
      bodyLockStatus = true;
    }, delay);
  };

  const unlock = (delay: number = systemConfig.bodyLock.delay, force = false): void => {
    if (!import.meta.client) return;
    if (!bodyLockStatus && !force) return;
    if (!isLocked.value) return;

    document.documentElement.classList.remove(systemConfig.bodyLock.lockClass);

    // Снимаем все стили, но запоминаем scrollY
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";

    // И сразу возвращаем страницу
    window.scrollTo(0, scrollY);

    isLocked.value = false;

    bodyLockStatus = false;

    window.setTimeout(() => {
      bodyLockStatus = true;
    }, delay);
  };

  const toggleLock = (delay: number = systemConfig.bodyLock.delay): void => {
    if (!import.meta.client) return;

    if (isLocked.value) {
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
