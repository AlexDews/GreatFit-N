<template>
  <div
    v-show="isMediaMatched"
    :id="uniqueId"
    ref="showmoreRef"
    class="ln-showmore"
    :class="{ [showmoreDefaults.activeClass]: isExpanded }"
  >
    <div
      ref="contentRef"
      class="ln-showmore__content"
      :style="contentStyle"
    >
      <slot></slot>
    </div>

    <button
      v-if="isButtonVisible"
      type="button"
      class="ln-showmore__button"
      @click="toggleExpand"
    >
      <slot
        name="button"
        :is-expanded="isExpanded"
      >
        {{ isExpanded ? "Скрыть" : "Показать еще" }}
      </slot>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { showmoreDefaults } from "./config.js";

const props = defineProps({
  // Режим работы: 'size' (по пикселям) или 'items' (по количеству элементов)
  type: { type: String, default: "size" },
  // Высота в px ИЛИ количество элементов для режима items
  limit: { type: [Number, String], default: 150 },
  // Скорость анимации
  speed: { type: Number, default: showmoreDefaults.scrollSpeed },
  // Медиа-запрос, например '768,min' или '1024,max'
  media: { type: String, default: "" },
});

const showmoreRef = ref(null);
const contentRef = ref(null);
const isExpanded = ref(false); // Развернут ли блок
const isButtonVisible = ref(false); // Нужна ли кнопка вообще
const isMediaMatched = ref(true); // Проходит ли проверка по брейкпоинту
const calculatedHiddenHeight = ref(0); // Вычисленная высота ограничения
const originalHeight = ref(0); // Реальная полная высота контента
const currentHeight = ref(0); // Текущая анимируемая высота

// Генерируем уникальный ID для селектора скролла
const uniqueId = `showmore_${Math.random().toString(36).substring(2, 9)}`;

// Подключаем твой хук
const { goToBlock } = useSmoothScroll();

let mediaQueryList = null;

// Стили теперь просто фиксируют высоту, которую считает JS
const contentStyle = computed(() => {
  if (!isMediaMatched.value) return {};

  return {
    height: `${currentHeight.value}px`,
    overflow: "hidden",
  };
});

// Вычисление высот
const calculateHeights = () => {
  if (!contentRef.value) return;

  // Временно ставим авто, чтобы узнать реальный размер контента
  contentRef.value.style.height = "auto";
  originalHeight.value = contentRef.value.offsetHeight;

  if (props.type === "items") {
    const children = Array.from(contentRef.value.children);
    let itemsHeight = 0;
    const itemsLimit = Math.min(children.length, Number(props.limit));

    for (let i = 0; i < itemsLimit; i++) {
      itemsHeight += children[i].offsetHeight;
    }
    calculatedHiddenHeight.value = itemsHeight;
  } else {
    calculatedHiddenHeight.value = Number(props.limit);
  }

  isButtonVisible.value = originalHeight.value > calculatedHiddenHeight.value;

  // Задаем стартовое значение высоты в зависимости от состояния
  currentHeight.value = isExpanded.value ? originalHeight.value : calculatedHiddenHeight.value;
};

// Функция плавной анимации высоты через requestAnimationFrame
const animateHeight = (targetHeight) => {
  const startHeight = currentHeight.value;
  const duration = props.speed;
  let startTime = null;

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);

    // Эффект плавности (easeOutQuad)
    const ease = progress * (2 - progress);

    currentHeight.value = startHeight + (targetHeight - startHeight) * ease;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;

  const target = isExpanded.value ? originalHeight.value : calculatedHiddenHeight.value;

  // Запускаем плавное изменение высоты на JS
  animateHeight(target);

  // Если сворачиваем блок — плавно ведем экран к началу блока с учетом хедера через твой хук
  if (!isExpanded.value) {
    goToBlock(`#${uniqueId}`, {
      speed: props.speed,
    });
  }
};

const handleMediaChange = (e) => {
  isMediaMatched.value = e.matches;
  if (!e.matches) {
    isExpanded.value = true;
    currentHeight.value = originalHeight.value;
  } else {
    isExpanded.value = false;
    nextTick(calculateHeights);
  }
};

onMounted(() => {
  calculateHeights();

  if (props.media) {
    const [breakpoint, type] = props.media.split(",");
    const query = `(${type === "min" ? "min-width" : "max-width"}: ${breakpoint}px)`;

    mediaQueryList = window.matchMedia(query);
    isMediaMatched.value = mediaQueryList.matches;
    if (!isMediaMatched.value) isExpanded.value = true;

    mediaQueryList.addEventListener("change", handleMediaChange);
  }

  window.addEventListener("resize", calculateHeights);
});

onUnmounted(() => {
  if (mediaQueryList) {
    mediaQueryList.removeEventListener("change", handleMediaChange);
  }
  window.removeEventListener("resize", calculateHeights);
});
</script>

<style scoped>
.ln-showmore {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.ln-showmore__content {
  will-change: height;
}

.ln-showmore__button {
  align-self: flex-start;
  padding: 8px 16px;
  background-color: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}
</style>
