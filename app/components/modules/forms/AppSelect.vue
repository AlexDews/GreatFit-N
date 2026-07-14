<template>
  <div
    v-if="!formConfig.customSelectEnabled"
    class="form-select-wrapper _native"
    :class="{ '_has-value': modelValue }"
  >
    <select
      :name="name"
      :value="modelValue"
      class="native-select-field"
      :class="formConfig.classes.errorInput && hasError ? formConfig.classes.errorInput : ''"
      @change="selectNativeOption"
    >
      <option value="">{{ placeholder }}</option>
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>
  </div>

  <div
    v-else
    v-click-outside="closeSelect"
    class="form-select-wrapper"
    :class="{ '_has-value': modelValue, [formConfig.classes.selectOpen]: isOpen }"
  >
    <select
      style="display: none"
      :name="name"
      :value="modelValue"
      readonly
    >
      <option value="">{{ placeholder }}</option>
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>

    <div
      :class="formConfig.classes.errorInput && hasError ? formConfig.classes.errorInput : ''"
      class="custom-select-toggle"
      tabindex="0"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      @click="toggleSelect"
      @keydown="handleKeydown"
    >
      <span class="custom-select-value">
        {{ currentLabel }}
      </span>
    </div>

    <div
      v-show="isOpen"
      class="custom-select-options-list"
      role="listbox"
    >
      <div
        v-for="opt in options"
        :key="opt.value"
        ref="optionRefs"
        class="custom-select-option"
        :class="{ [formConfig.classes.selectActive]: opt.value === modelValue }"
        role="option"
        :aria-selected="opt.value === modelValue"
        @click="selectOption(opt)"
      >
        {{ opt.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { formConfig } from "~/components/modules/forms/config";

interface SelectOption {
  value: string;
  label: string;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    options: readonly SelectOption[];
    placeholder?: string;
    name?: string;
    hasError?: boolean;
  }>(),
  {
    modelValue: "",
    placeholder: "Выберите из списка",
    name: "",
    hasError: false,
  },
);

const emit = defineEmits<{
  (_e: "update:modelValue" | "change", _value: string): void;
}>();

const isOpen = ref(false);
const optionRefs = ref<HTMLElement[]>([]);
let searchBuffer = "";
let lastTypeTime = 0;

// Текст для текущего выбранного элемента
const currentLabel = computed(() => {
  const active = props.options.find((o) => o.value === props.modelValue);
  return active ? active.label : props.placeholder;
});

// Скролл списка до активного элемента
const scrollActiveIntoView = () => {
  const activeIdx = props.options.findIndex((o) => o.value === props.modelValue);
  const targetEl = optionRefs.value[activeIdx];
  if (activeIdx !== -1 && targetEl) {
    targetEl.scrollIntoView({ block: "nearest" });
  }
};

// Переключение видимости списка
const toggleSelect = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    nextTick(() => scrollActiveIntoView());
  }
};

// Закрытие списка
const closeSelect = () => {
  isOpen.value = false;
};

// Выбор опции в кастомном режиме
const selectOption = (option: SelectOption) => {
  emit("update:modelValue", option.value);
  emit("change", option.value);
  isOpen.value = false;
};

// Выбор опции в нативном режиме
const selectNativeOption = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  emit("update:modelValue", target.value);
  emit("change", target.value);
};

// Клавиатурная навигация и быстрый поиск
const handleKeydown = (e: KeyboardEvent) => {
  const activeIdx = props.options.findIndex((o) => o.value === props.modelValue);

  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    if (!isOpen.value) {
      isOpen.value = true;
      return;
    }
    const offset = e.key === "ArrowDown" ? 1 : -1;
    const len = props.options.length;
    if (len === 0) return;

    const nextIdx = (activeIdx + offset + len) % len;
    const targetOpt = props.options[nextIdx];
    if (targetOpt) {
      selectOption(targetOpt);
      nextTick(() => scrollActiveIntoView());
    }
  }

  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleSelect();
  }

  if (e.key === "Escape") {
    closeSelect();
  }

  const now = Date.now();
  if (now - lastTypeTime > formConfig.customSelect.searchDelay) {
    searchBuffer = "";
  }

  if (e.key.length === 1 && /\S/.test(e.key)) {
    searchBuffer += e.key.toLowerCase();
    const match = props.options.find((o) => o.label.toLowerCase().trim().startsWith(searchBuffer));
    if (match) {
      emit("update:modelValue", match.value);
      nextTick(() => scrollActiveIntoView());
    }
    lastTypeTime = now;
  }
};

// Директива клика вне элемента
const vClickOutside = {
  mounted(el: HTMLElement & { clickOutside?: (_: MouseEvent) => void }, binding: { value: (_: MouseEvent) => void }) {
    el.clickOutside = (e: MouseEvent) => {
      if (!(el === e.target || el.contains(e.target as Node))) {
        binding.value(e);
      }
    };
    document.addEventListener("mousedown", el.clickOutside);
  },
  unmounted(el: HTMLElement & { clickOutside?: (_: MouseEvent) => void }) {
    if (el.clickOutside) {
      document.removeEventListener("mousedown", el.clickOutside);
    }
  },
};
</script>
