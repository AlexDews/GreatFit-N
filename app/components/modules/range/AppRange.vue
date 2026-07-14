<template>
  <div class="ln-range">
    <div
      ref="inputsContainer"
      class="ln-range__inputs"
    >
      <div class="ln-range__field">
        <span class="ln-range__label">от</span>
        <input
          type="text"
          class="ln-range__input"
          :value="displayMin"
          @change="onInputChange(0, ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="ln-range__field">
        <span class="ln-range__label">до</span>
        <input
          type="text"
          class="ln-range__input"
          :value="displayMax"
          @change="onInputChange(1, ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <div
      ref="sliderContainer"
      class="ln-range__slider"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";
import { rangeDefaults } from "./config";
import { gsap } from "gsap";

const props = withDefaults(
  defineProps<{
    modelValue?: [number, number];
    min?: number;
    max?: number;
    step?: number;
  }>(),
  {
    modelValue: () => [...rangeDefaults.start] as [number, number],
    min: () => rangeDefaults.range.min,
    max: () => rangeDefaults.range.max,
    step: () => rangeDefaults.step,
  },
);

const emit = defineEmits<{
  (_e: "update:modelValue" | "change", _value: number[]): void;
}>();

const sliderContainer = ref<HTMLElement | null>(null);
const inputsContainer = ref<HTMLElement | null>(null);
let sliderInstance: noUiSlider.API | null = null;

// Строковые значения для отображения в инпутах (с пробелами)
const displayMin = ref<string>("");
const displayMax = ref<string>("");

// Инициализация слайдера
onMounted(() => {
  if (!sliderContainer.value) return;

  sliderInstance = noUiSlider.create(sliderContainer.value, {
    start: [...props.modelValue],
    connect: rangeDefaults.connect,
    step: props.step,
    range: {
      min: props.min,
      max: props.max,
    },
    format: rangeDefaults.format,
  });

  // Событие update срабатывает ПРИ КАЖДОМ движении ползунка
  sliderInstance.on("update", (values: (string | number)[], handle: number) => {
    const stringValues = values as string[];
    if (handle === 0) displayMin.value = stringValues[0] ?? "";
    if (handle === 1) displayMax.value = stringValues[1] ?? "";

    // Фильтруем массив: пропускаем только числа (без false)
    const rawValues = stringValues
      .map((val) => rangeDefaults.format.from(val))
      .filter((val): val is number => typeof val === "number");

    emit("update:modelValue", rawValues);
  });

  // Событие change срабатывает, только когда юзер ОТПУСТИЛ ползунок
  sliderInstance.on("change", (values: (string | number)[]) => {
    const stringValues = values as string[];

    // Фильтруем массив аналогичным образом
    const rawValues = stringValues
      .map((val) => rangeDefaults.format.from(val))
      .filter((val): val is number => typeof val === "number");

    emit("change", rawValues);
  });

  /* --- GSAP Анимация появления --- */
  gsap.fromTo(
    [inputsContainer.value, sliderContainer.value],
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.1 },
  );
});

// Ручной ввод чисел в инпуты
const onInputChange = (index: number, value: string) => {
  if (!sliderInstance) return;

  const currentValues = sliderInstance.get() as string[];
  currentValues[index] = value;

  // Метод .set() сам отформатирует ввод и подвинет ползунок
  sliderInstance.set(currentValues);
};

// Если v-model изменится извне (например, сброс фильтров)
watch(
  () => props.modelValue,
  (newVal) => {
    if (!sliderInstance) return;

    const currentSliderValues = (sliderInstance.get() as string[]).map((val) => rangeDefaults.format.from(val));

    // Предотвращаем зацикливание
    if (JSON.stringify(currentSliderValues) !== JSON.stringify(newVal)) {
      sliderInstance.set(newVal);
    }
  },
  { deep: true },
);

onUnmounted(() => {
  if (sliderInstance) {
    sliderInstance.destroy();
  }
});
</script>

<style scoped>
.ln-range {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.ln-range__inputs {
  display: flex;
  gap: 10px;
}

.ln-range__field {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 0 10px;
  flex: 1;
}

.ln-range__label {
  color: #999;
  font-size: 14px;
  margin-right: 5px;
  user-select: none;
}

.ln-range__input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 8px 0;
  font-size: 14px;
  font-weight: 500;
  outline: none;
}

.ln-range__slider {
  margin: 10px 0;
}

/* Стилизация noUiSlider под твою дизайн-систему */
:deep(.noUi-target) {
  background: #e0e0e0;
  border: none;
  box-shadow: none;
  height: 6px;
}

:deep(.noUi-connect) {
  background: #4f46e5;
}

:deep(.noUi-handle) {
  width: 18px;
  height: 18px;
  right: -9px;
  top: -6px;
  border-radius: 50%;
  background: #4f46e5;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
  cursor: grab;
}

:deep(.noUi-handle::before),
:deep(.noUi-handle::after) {
  display: none;
}
</style>
