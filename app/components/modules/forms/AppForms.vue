<!-- app\components\modules\forms\AppForms.vue -->

<template>
  <form
    :class="{ [formConfig.classes.sending]: isSending }"
    class="app-form"
    @submit.prevent="handleSubmit"
    @input="handleInputClear"
    @change="handleInputClear"
  >
    <slot
      :is-sending="isSending"
      :errors="errors"
    />
  </form>
</template>

<script setup lang="ts">
import { formConfig } from "./config";

const props = withDefaults(
  defineProps<{
    action?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  }>(),
  {
    action: "",
    method: "POST",
  },
);

const emit = defineEmits<{
  (_e: "submit:success" | "submit:error", _data: unknown): void;
}>();

// Подключаем твои готовые автоимпортируемые композаблы
const { errors, validateField, clearErrors, announceErrors } = useFormValidation();
const { isSending, sendFormAjax } = useFormAjax();

/**
 * Валидация всех полей формы перед отправкой
 */
const validateAllFields = (formElement: HTMLFormElement): boolean => {
  clearErrors();

  // Ищем все элементы ввода, включая скрытые поля от кастомных селектов
  const inputs = formElement.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    "input, select, textarea",
  );

  inputs.forEach((input) => {
    const name = input.getAttribute("name");
    if (!name) return;

    const validateType = input.getAttribute("data-validate") || input.getAttribute("type") || "required";

    if (input instanceof HTMLInputElement && input.type === "checkbox") {
      validateField(name, input.checked, "checkbox", input.checked);
    } else {
      validateField(name, input.value, validateType);
    }
  });

  announceErrors();

  return Object.keys(errors.value).length === 0;
};

/**
 * Очистка ошибки конкретного поля при вводе/изменении (Пункт 5)
 */
const handleInputClear = (e: Event) => {
  const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  const name = target.getAttribute("name");
  
  if (name && errors.value[name]) {
    // Безопасно исключаем свойство из реактивного объекта без использования delete
    const { [name]: _, ...rest } = errors.value;
    errors.value = rest;
  }
};

/**
 * Отправка формы
 */
const handleSubmit = async (e: Event) => {
  if (!formConfig.formSubmitEnabled || isSending.value) return;

  const formElement = e.target as HTMLFormElement;

  const isValid = validateAllFields(formElement);
  if (!isValid) return;

  const formData = new FormData(formElement);

  const result = await sendFormAjax(
    props.action,
    props.method,
    formData,
    formConfig.dataAttributes.errorPopup,
  );

  if (result.success) {
    emit("submit:success", result.data);
    formElement.reset();
  } else {
    emit("submit:error", result.error);
  }
};
</script>