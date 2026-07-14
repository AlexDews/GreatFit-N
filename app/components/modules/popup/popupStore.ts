// app/components/modules/popup/popupStore.ts
import { reactive } from "vue";
import { popupConfig } from "./config";
import { useBodyLock } from "~/composables/useBodyLock";

// Инициализируем хук блокировки скролла из нашей общей папки композаблов
const { lock: bodyLock, unlock: bodyUnlock } = useBodyLock();

interface PopupStore {
  activePopup: string | null;
  previousPopup: string | null;
  open: (name: string) => void;
  close: () => void;
}

export const popupStore = reactive<PopupStore>({
  activePopup: null,
  previousPopup: null,

  open(name: string) {
    if (!name) return;

    // ИСПРАВЛЕНО: Добавлен безопасный вызов ?.
    popupConfig.on?.beforeOpen?.(name);

    this.previousPopup = this.activePopup;
    this.activePopup = name;

    if (popupConfig.bodyLock && import.meta.client) {
      bodyLock();
      document.documentElement.classList.add(popupConfig.classes.bodyActive);
    }

    if (popupConfig.hashSettings?.location && import.meta.client) {
      history.pushState("", "", `#${name}`);
    }

    // ИСПРАВЛЕНО: Добавлен безопасный вызов ?.
    popupConfig.on?.afterOpen?.(name);
  },

  close() {
    if (!this.activePopup) return;

    // ИСПРАВЛЕНО: Добавлен безопасный вызов ?.
    popupConfig.on?.beforeClose?.(this.activePopup);
    const closedName = this.activePopup;

    this.activePopup = null;

    if (popupConfig.bodyLock && import.meta.client) {
      document.documentElement.classList.remove(popupConfig.classes.bodyActive);
      bodyUnlock();
    }

    if (popupConfig.hashSettings?.location && import.meta.client) {
      history.pushState("", "", window.location.href.split("#")[0]);
    }

    // ИСПРАВЛЕНО: Добавлен безопасный вызов ?.
    popupConfig.on?.afterClose?.(closedName);
  },
});

// Слушаем изменение хэша (только на клиенте)
if (import.meta.client && popupConfig.hashSettings?.goHash) {
  const checkHash = () => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      popupStore.open(hash);
    } else {
      popupStore.close();
    }
  };
  window.addEventListener("hashchange", checkHash);
}
