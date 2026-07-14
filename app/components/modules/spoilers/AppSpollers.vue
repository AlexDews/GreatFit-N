<template>
  <div
    ref="spollersContainer"
    class="ln-spollers"
    :class="{ 'spollerInit': isMediaMatched }"
    :style="spollersStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, computed, provide, onMounted, onUnmounted } from "vue";
import { spollerDefaults } from "./config.js";

const props = defineProps({
  // Забираем дефолтное значение напрямую из центрального конфига
  oneSpoller: { type: Boolean, default: spollerDefaults.oneSpoller },
  media: { type: String, default: "" },
  speed: { type: Number, default: spollerDefaults.speed },
});

const spollersContainer = ref(null);
const activeIds = ref(new Set());
const isMediaMatched = ref(true);
const currentMinHeight = ref(""); // Временная фиксация высоты при смене спойлеров

const { goToBlock } = useSmoothScroll();
let mediaQueryList = null;

// Динамические стили для удержания высоты в момент анимации аккордеона
const spollersStyle = computed(() => {
  return currentMinHeight.value ? { minHeight: currentMinHeight.value } : {};
});

const toggleSpoller = (id, elementRef) => {
  if (!isMediaMatched.value) return;

  // 1. Фиксируем текущую высоту контейнера перед анимацией
  if (spollersContainer.value) {
    currentMinHeight.value = `${spollersContainer.value.offsetHeight}px`;
  }

  const isOpening = !activeIds.value.has(id);

  if (activeIds.value.has(id)) {
    activeIds.value.delete(id);
  } else {
    if (props.oneSpoller) {
      activeIds.value.clear();
    }
    activeIds.value.add(id);
  }

  // 2. Если спойлер открывается, и его заголовок улетает вверх за экран — плавно доскролливаем
  if (isOpening && elementRef) {
    // Даем микротаймаут, чтобы DOM перестроился и мы могли точно замерить позицию заголовка
    setTimeout(() => {
      const rect = elementRef.getBoundingClientRect();
      if (rect.top < 0) {
        // Генерируем временный селектор по id спойлера, чтобы проскроллить именно к нему
        const targetSelector = `[data-spoller-id="${id}"]`;
        goToBlock(targetSelector, { speed: props.speed });
      }
    }, 50);
  }
};

const clearMinHeight = () => {
  currentMinHeight.value = "";
};

provide("spollersState", {
  activeIds,
  toggleSpoller,
  clearMinHeight,
  isMediaMatched,
  speed: props.speed,
});

const handleMediaChange = (e) => {
  isMediaMatched.value = e.matches;
  if (!e.matches) activeIds.value.clear();
};

const handleOutsideClick = (e) => {
  if (spollersContainer.value && !spollersContainer.value.contains(e.target)) {
    activeIds.value.clear();
  }
};

onMounted(() => {
  if (props.media) {
    const [breakpoint, type] = props.media.split(",");
    const query = `(${type === "min" ? "min-width" : "max-width"}: ${breakpoint}px)`;
    mediaQueryList = window.matchMedia(query);
    isMediaMatched.value = mediaQueryList.matches;
    mediaQueryList.addEventListener("change", handleMediaChange);
  }
  document.addEventListener("click", handleOutsideClick);
});

onUnmounted(() => {
  if (mediaQueryList) mediaQueryList.removeEventListener("change", handleMediaChange);
  document.removeEventListener("click", handleOutsideClick);
});
</script>

<style scoped>
.ln-spollers {
  display: flex;
  flex-direction: column;
  width: 100%;
  will-change: min-height;
}
</style>