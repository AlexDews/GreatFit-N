<template>
  <div
    v-click-outside="closeCalendar"
    class="datepicker-wrapper"
  >
    <input
      type="text"
      :class="[config.inputClass, { [config.errorClass]: hasError }]"
      :value="inputValue"
      placeholder="ДД.ММ.ГГГГ"
      @input="onInput"
      @focus="openCalendar"
    />

    <Transition
      :css="false"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div
        v-if="isOpen"
        ref="calendarContainer"
        :class="[config.containerClass, config.activeClass]"
      >
        <div :class="config.headerClass">
          <button
            v-if="config.showNavButtons"
            type="button"
            :class="config.prevBtnClass"
            :disabled="isPrevMonthDisabled"
            :style="isPrevMonthDisabled ? { opacity: 0.3, pointerEvents: 'none' } : {}"
            @click="changeMonth(-1)"
          >
            ‹
          </button>

          <div
            v-if="config.useSelectFilters"
            :class="config.titleClass"
          >
            <select
              v-model="viewMonth"
              :class="config.monthSelectClass"
            >
              <option
                v-for="(name, idx) in config.monthNames"
                :key="idx"
                :value="idx"
              >
                {{ name }}
              </option>
            </select>

            <select
              v-model="viewYear"
              :class="config.yearSelectClass"
            >
              <option
                v-for="y in yearsRange"
                :key="y"
                :value="y"
              >
                {{ y }}
              </option>
            </select>
          </div>
          <span
            v-else
            :class="config.currentMonthClass"
          >
            {{ config.monthNames[viewMonth] }} {{ viewYear }}
          </span>

          <button
            v-if="config.showNavButtons"
            type="button"
            :class="config.nextBtnClass"
            :disabled="isNextMonthDisabled"
            :style="isNextMonthDisabled ? { opacity: 0.3, pointerEvents: 'none' } : {}"
            @click="changeMonth(1)"
          >
            ›
          </button>
        </div>

        <div :class="config.gridClass">
          <div
            v-for="day in config.weekDays"
            :key="day"
            :class="config.weekdayClass"
          >
            {{ day }}
          </div>

          <div
            v-for="day in prevMonthDays"
            :key="'prev-' + day"
            :class="['dp-day', config.disabledClass, { [config.adjacentClass]: config.showPrevMonths }]"
          >
            {{ config.showPrevMonths ? day : "" }}
          </div>

          <div
            v-for="day in currentMonthDays"
            :key="'curr-' + day.num"
            :class="[
              'dp-day',
              {
                [config.selectedClass]: day.isSelected,
                [config.disabledClass]: day.isDisabled,
              },
            ]"
            @click="!day.isDisabled && selectDate(day.num)"
          >
            {{ day.num }}
          </div>

          <div
            v-for="day in nextMonthDays"
            :key="'next-' + day"
            :class="['dp-day', config.disabledClass, { [config.adjacentClass]: config.showNextMonths }]"
          >
            {{ config.showNextMonths ? day : "" }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, type Directive } from "vue";
import { datepickerDefaults, type DatepickerConfig } from "./config";
import { gsap } from "gsap";

interface DayItem {
  num: number;
  isDisabled: boolean;
  isSelected: boolean;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    customConfig?: Partial<DatepickerConfig>;
  }>(),
  {
    modelValue: "",
    customConfig: () => ({}),
  },
);

const emit = defineEmits<{
  (_e: "update:modelValue", _value: string): void;
}>();

// Объединяем конфиги
const config = computed<DatepickerConfig>(() => ({
  ...datepickerDefaults,
  ...props.customConfig,
}));

// Состояния
const calendarContainer = ref<HTMLElement | null>(null);
const inputValue = ref<string>(props.modelValue);
const isOpen = ref<boolean>(false);
const hasError = ref<boolean>(false);

const selectedDate = ref<Date | null>(null);
const viewDate = ref<Date>(new Date());

const viewMonth = computed<number>({
  get: () => viewDate.value.getMonth(),
  set: (val) => {
    const d = new Date(viewDate.value);
    d.setMonth(val);
    viewDate.value = d;
  },
});

const viewYear = computed<number>({
  get: () => viewDate.value.getFullYear(),
  set: (val) => {
    const d = new Date(viewDate.value);
    d.setFullYear(val);
    viewDate.value = d;
  },
});

// Парсинг лимитов
const minDateParsed = computed<Date>(() => {
  if (config.value.minDate === "tomorrow") {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }
  const d = new Date(config.value.minDate);
  d.setHours(0, 0, 0, 0);
  return d;
});

const maxDateParsed = computed<Date | null>(() => {
  if (!config.value.maxDate) return null;
  const d = new Date(config.value.maxDate);
  d.setHours(23, 59, 59, 999);
  return d;
});

const yearsRange = computed<number[]>(() => {
  const minY = minDateParsed.value.getFullYear();
  const maxY = maxDateParsed.value ? maxDateParsed.value.getFullYear() : new Date().getFullYear() + 50;
  const list: number[] = [];
  for (let y = minY; y <= maxY; y++) list.push(y);
  return list;
});

// Наблюдение за внешним значением
watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal;
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(newVal)) validateManualInput(newVal);
  },
);

onMounted(() => {
  viewDate.value = new Date(minDateParsed.value);
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(inputValue.value)) {
    validateManualInput(inputValue.value);
  }
});

// Генерация дней
const prevMonthDays = computed<number[]>(() => {
  const year = viewDate.value.getFullYear();
  const month = viewDate.value.getMonth();
  let firstDayIndex = new Date(year, month, 1).getDay();
  firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const days: number[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(daysInPrevMonth - (firstDayIndex - 1 - i));
  }
  return days;
});

const currentMonthDays = computed<DayItem[]>(() => {
  const year = viewDate.value.getFullYear();
  const month = viewDate.value.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: DayItem[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);

    let isDisabled = date < minDateParsed.value || (maxDateParsed.value !== null && date > maxDateParsed.value);

    if (!isDisabled && config.value.enabledDays.length > 0) {
      if (!config.value.enabledDays.includes(date.getDay())) {
        isDisabled = true;
      }
    }

    const isSelected = selectedDate.value !== null && date.toDateString() === selectedDate.value.toDateString();

    days.push({ num: d, isDisabled, isSelected });
  }
  return days;
});

const nextMonthDays = computed<number[]>(() => {
  const totalRendered = prevMonthDays.value.length + currentMonthDays.value.length;
  const remaining = totalRendered % 7 === 0 ? 0 : 7 - (totalRendered % 7);
  const days: number[] = [];
  for (let d = 1; d <= remaining; d++) days.push(d);
  return days;
});

const isPrevMonthDisabled = computed<boolean>(() => {
  const prevMonth = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() - 1, 1);
  return prevMonth < new Date(minDateParsed.value.getFullYear(), minDateParsed.value.getMonth(), 1);
});

const isNextMonthDisabled = computed<boolean>(() => {
  if (!maxDateParsed.value) return false;
  const nextMonth = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + 1, 1);
  return nextMonth > new Date(maxDateParsed.value.getFullYear(), maxDateParsed.value.getMonth(), 1);
});

// Навигация и открытие
const openCalendar = () => {
  if (selectedDate.value) viewDate.value = new Date(selectedDate.value);
  isOpen.value = true;
};

const closeCalendar = () => {
  isOpen.value = false;
};

const changeMonth = (offset: number) => {
  const d = new Date(viewDate.value);
  d.setMonth(d.getMonth() + offset);
  viewDate.value = d;
};

const selectDate = (dayNum: number) => {
  const date = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth(), dayNum);
  selectedDate.value = date;
  const formatted = date.toLocaleDateString("ru-RU");
  inputValue.value = formatted;
  hasError.value = false;
  emit("update:modelValue", formatted);
  isOpen.value = false;
};

// Ввод и маска
const onInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (config.value.useInternalMask) {
    applyMask(target);
  } else {
    inputValue.value = target.value;
  }

  if (/^\d{2}\.\d{2}\.\d{4}$/.test(inputValue.value)) {
    validateManualInput(inputValue.value);
  } else {
    hasError.value = inputValue.value.length === 10;
  }
};

const applyMask = (target: HTMLInputElement) => {
  let value = target.value.replace(/\D/g, "");
  if (value.length > 8) value = value.slice(0, 8);

  let d = value.slice(0, 2);
  let m = value.slice(2, 4);
  let y = value.slice(4, 8);

  if (m.length === 2) {
    if (parseInt(m) > 12) m = "12";
    if (parseInt(m) === 0) m = "01";
  }

  if (d.length === 2) {
    const dayInt = parseInt(d);
    const monthInt = m.length === 2 ? parseInt(m) : null;
    const yearInt = y.length === 4 ? parseInt(y) : new Date().getFullYear();
    let maxDays = 31;
    if (monthInt) maxDays = new Date(yearInt, monthInt, 0).getDate();

    if (dayInt > maxDays) d = String(maxDays).padStart(2, "0");
    if (dayInt === 0) d = "01";
  }

  if (y.length === 4) {
    const yearInt = parseInt(y);
    const maxYear = maxDateParsed.value ? maxDateParsed.value.getFullYear() : 9999;
    const minYear = minDateParsed.value ? minDateParsed.value.getFullYear() : 0;
    if (yearInt > maxYear) y = String(maxYear);
    if (yearInt < minYear && yearInt > 1000) y = String(minYear);
  }

  let finalValue = d;
  if (value.length > 2) finalValue += "." + m;
  if (value.length > 4) finalValue += "." + y;

  target.value = finalValue;
  inputValue.value = finalValue;
};

const validateManualInput = (value: string) => {
  const [d, m, y] = value.split(".").map(Number);

  // Если хоть одно число не распарсилось или отсутствует в массиве — выходим с ошибкой
  if (d === undefined || m === undefined || y === undefined || isNaN(d) || isNaN(m) || isNaN(y)) {
    hasError.value = true;
    selectedDate.value = null;
    return;
  }
  const inputDate = new Date(y, m - 1, d);
  const isValidDate = !isNaN(inputDate.getTime()) && inputDate.getDate() === d;
  const isAllowed =
    isValidDate &&
    inputDate >= minDateParsed.value &&
    (maxDateParsed.value === null || inputDate <= maxDateParsed.value);

  if (isAllowed) {
    hasError.value = false;
    selectedDate.value = new Date(inputDate);
    viewDate.value = new Date(inputDate);
    emit("update:modelValue", value);
  } else {
    hasError.value = !isAllowed;
    if (!isAllowed) selectedDate.value = null;
  }
};

/* --- GSAP Анимации для календаря --- */
const onEnter = (el: Element, done: () => void) => {
  gsap.fromTo(
    el,
    {
      opacity: 0,
      y: -15,
      scaleY: 0.95,
      transformOrigin: "top center",
    },
    {
      opacity: 1,
      y: 0,
      scaleY: 1,
      duration: 0.3,
      ease: "power2.out",
      onComplete: done,
    },
  );
};

const onLeave = (el: Element, done: () => void) => {
  gsap.to(el, {
    opacity: 0,
    y: -10,
    scaleY: 0.95,
    duration: 0.25,
    ease: "power2.in",
    onComplete: done,
  });
};

// Директива клика вне элемента
const vClickOutside: Directive = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };
    document.addEventListener("mousedown", el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener("mousedown", el.clickOutsideEvent);
  },
};
</script>

<style scoped>
.datepicker-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}
</style>
