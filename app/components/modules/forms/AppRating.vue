<template>
  <div
    class="rating"
    :class="{ rating_set: isEditable, rating_sending: isSending }"
  >
    <div class="rating__body">
      <div
        class="rating__active"
        :style="{ width: activeWidth }"
      ></div>

      <div class="rating__items">
        <div
          v-for="star in 5"
          :key="star"
          ref="starRefs"
          class="rating__item"
          tabindex="0"
          role="button"
          :aria-label="`Оценить на ${star}`"
          @mouseover="handleMouseover(star)"
          @mouseleave="handleMouseleave"
          @click="handleRatingClick(star)"
          @keydown.enter.space.prevent="handleRatingClick(star)"
          @keydown.left.prevent="changeFocus(star, -1)"
          @keydown.right.prevent="changeFocus(star, 1)"
        ></div>
      </div>
    </div>
    <div class="rating__value">{{ hoverValue || modelValue }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    isEditable?: boolean;
    ajaxUrl?: string;
  }>(),
  {
    modelValue: 0,
    isEditable: true,
    ajaxUrl: "",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: number];
  change: [value: number];
}>();

const hoverValue = ref<number | null>(null);
const isSending = ref(false);

// Исправлено: Массив рефов в Vue 3 типизируется как компонент или элемент
const starRefs = ref<HTMLElement[]>([]);

// Вычисляем ширину активного слоя в % (теперь без костылей из formConfig)
const activeWidth = computed(() => {
  const currentVal = hoverValue.value !== null ? hoverValue.value : props.modelValue;
  return `${(currentVal / 5) * 100}%`;
});

const handleMouseover = (star: number) => {
  if (!props.isEditable) return;
  hoverValue.value = star;
};

const handleMouseleave = () => {
  hoverValue.value = null;
};

const handleRatingClick = async (star: number) => {
  if (!props.isEditable || isSending.value) return;

  if (props.ajaxUrl) {
    isSending.value = true;
    try {
      const json = await $fetch<{ newRating?: number }>(props.ajaxUrl);
      const newVal = json?.newRating || star;

      emit("update:modelValue", newVal);
      emit("change", newVal);
    } catch (e) {
      console.error("ModuX Rating: Ошибка при отправке через $fetch", e);
    } finally {
      isSending.value = false;
    }
  } else {
    emit("update:modelValue", star);
    emit("change", star);
  }
};

const changeFocus = (currentStar: number, direction: number) => {
  const nextIdx = currentStar - 1 + direction;
  const targetEl = starRefs.value[nextIdx];
  if (targetEl) {
    targetEl.focus();
  }
};
</script>
