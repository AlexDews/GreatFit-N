// app/components/modules/popup/popupStore.ts
import { reactive } from "vue";
import { popupConfig } from "./config";
import { useBodyLock } from "~/composables/useBodyLock";

interface PopupState {
  activePopup: string | null;
  previousPopup: string | null;
}

export const popupState = reactive<PopupState>({
  activePopup: null,
  previousPopup: null,
});

export const popupStore = {
  get activePopup() {
    return popupState.activePopup;
  },

  get previousPopup() {
    return popupState.previousPopup;
  },

  open(name: string) {
    if (!name) return;

    popupConfig.on?.beforeOpen?.(name);

    popupState.previousPopup = popupState.activePopup;
    popupState.activePopup = name;

    if (popupConfig.bodyLock && import.meta.client) {
      const { lock } = useBodyLock();
      lock(undefined, true);

      document.documentElement.classList.add(popupConfig.classes.bodyActive);
    }

    if (popupConfig.hashSettings?.location && import.meta.client) {
      history.pushState("", "", `#popup-${name}`);
    }

    popupConfig.on?.afterOpen?.(name);
  },

  close() {
    if (!popupState.activePopup) return;

    popupConfig.on?.beforeClose?.(popupState.activePopup);

    const closedName = popupState.activePopup;

    popupState.activePopup = null;

    if (popupConfig.bodyLock && import.meta.client) {
      const { unlock } = useBodyLock();

      document.documentElement.classList.remove(popupConfig.classes.bodyActive);

      unlock(undefined, true);
    }

    if (popupConfig.hashSettings?.location && import.meta.client) {
      history.pushState("", "", window.location.pathname + window.location.search);
    }

    popupConfig.on?.afterClose?.(closedName);
  },
};

// -----------------------------
// Hash Navigation
// -----------------------------

if (import.meta.client && popupConfig.hashSettings?.goHash) {
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.slice(1);

    if (!hash) {
      popupStore.close();
      return;
    }

    if (!hash.startsWith("popup-")) {
      return;
    }

    popupStore.open(hash.replace("popup-", ""));
  });
}
