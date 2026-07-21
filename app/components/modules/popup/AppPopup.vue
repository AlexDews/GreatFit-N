<!-- app\components\modules\popup\AppPopup.vue -->
<script setup lang="ts">
import { popupStore } from "./popupStore";
import { popupConfig } from "./config";
import { popupEnter, popupLeave } from "./animations";

const props = defineProps<{
  name: string; // Уникальное имя попапа (id)
  className?: string; // Пойдет на весь попап (оверлей)
}>();

const popupContent = ref<HTMLElement | null>(null);
let lastFocusEl: HTMLElement | null = null;

// Попап открыт, если его имя совпадает с именем в глобальном сторе
const isOpen = computed(() => popupStore.activePopup === props.name);

// Список селекторов для Focus Trap
const focusableSelectors: string[] = [
  "a[href]",
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  "button:not([disabled]):not([aria-hidden])",
  "select:not([disabled]):not([aria-hidden])",
  "textarea:not([disabled]):not([aria-hidden])",
  "[contenteditable]",
  '[tabindex]:not([tabindex^="-"])',
];

const closeMe = () => popupStore.close();

// Закрытие по Esc
const handleEsc = (e: KeyboardEvent) => {
  if (popupConfig!.closeEsc && e.code === "Escape" && isOpen.value) {
    closeMe();
  }
};

// Функция-хелпер для получения элементов
const getFocusableElements = (): HTMLElement[] => {
  if (!popupContent.value) return [];
  const selector = focusableSelectors.join(",");
  return Array.from(popupContent.value.querySelectorAll<HTMLElement>(selector));
};

// Focus Catch алгоритм с TS-типизацией
const handleTabFocus = (e: KeyboardEvent) => {
  const focusable = getFocusableElements();
  if (focusable.length === 0) return;

  const currentFocused = document.activeElement as HTMLElement | null;
  const focusedIndex = currentFocused ? focusable.indexOf(currentFocused) : -1;

  if (e.shiftKey && focusedIndex === 0) {
    const lastEl = focusable[focusable.length - 1];
    if (lastEl) {
      lastEl.focus();
      e.preventDefault();
    }
  } else if (!e.shiftKey && focusedIndex === focusable.length - 1) {
    const firstEl = focusable[0];
    if (firstEl) {
      firstEl.focus();
      e.preventDefault();
    }
  }
};

// Хуки после анимации (Focus Trap инициализация)
const onAfterEnter = () => {
  if (typeof document !== "undefined") {
    lastFocusEl = document.activeElement as HTMLElement | null;
  }
  const focusable = getFocusableElements();
  if (focusable.length > 0) {
    const firstEl = focusable[0];
    if (firstEl) {
      firstEl.focus();
    }
  }
};

const onAfterLeave = () => {
  if (lastFocusEl && typeof lastFocusEl.focus === "function") {
    lastFocusEl.focus();
  }
};

// Следим за клавиатурой, только когда окно активно
watch(isOpen, (active) => {
  if (active) {
    window.addEventListener("keydown", handleEsc);
  } else {
    window.removeEventListener("keydown", handleEsc);
  }
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleEsc);
});

onMounted(() => {
  const settings = popupConfig!.hashSettings;
  if (settings && settings.goHash && window.location.hash.replace("#", "") === props.name) {
    setTimeout(() => {
      popupStore.open(props.name);
    }, 50);
  }
});
</script>

<template>
  <Transition
    :css="false"
    @enter="popupEnter"
    @leave="popupLeave"
    @after-enter="onAfterEnter"
    @after-leave="onAfterLeave"
  >
    <div
      v-if="isOpen"
      class="popup"
      :class="className"
      role="dialog"
      aria-modal="true"
      @click.self="closeMe"
      @keydown.tab="handleTabFocus"
    >
      <div class="popup__wrapper">
        <button
          type="button"
          class="popup__close"
          aria-label="Закрыть"
          @click="closeMe"
        >
          ×
        </button>

        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup__wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: end;

  // justify-content: flex-end;
}

.popup__close {
  position: sticky;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  width: 31px;
  height: 31px;
  border-radius: 15px 15px 0 0;
  background-color: $colorAccent;
  color: $colorBg;
  transition:
    color 0.3s ease 0s,
    background-color 0.3s ease 0s;

  @media (any-hover: hover) {
    &:hover {
      width: 31px;
      height: 31px;
      border-radius: 15px 15px 0 0;
      background-color: #f1efe5;
      color: $colorAccent;
    }
  }
}
</style>
