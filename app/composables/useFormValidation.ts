// app/composables/useFormValidation.ts
import { ref } from "vue";
import { formConfig } from "~/components/modules/forms/config";
import { systemConfig } from "./system.config";

export function useFormValidation() {
  const errors = ref<Record<string, string | undefined>>({}); // Хранилище ошибок

  // ==========================================================================
  // --- 1. ВАЛИДАЦИЯ И БЕЗОПАСНОСТЬ ---
  // ==========================================================================

  const containsPotentialXSS = (str: unknown): boolean => {
    if (typeof str !== "string") return false;
    const safeStr: string = str;
    const patterns = systemConfig.security.xssPatterns;
    return patterns.some((pattern: RegExp) => pattern.test(safeStr));
  };

  const luhnCheck = (n: string): boolean => {
    let s = 0;
    let a = false;
    for (let i = n.length - 1; i >= 0; i--) {
      const char = n[i] || ""; // Защита от undefined
      let d = parseInt(char, 10);
      if (a) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      s += d;
      a = !a;
    }
    return s % 10 === 0;
  };

  const checkExpiry = (val: string): boolean => {
    const parts = val.split("/");
    const m = Number(parts[0] || 0);
    const y = Number(parts[1] || 0);

    if (!m || !y || m < 1 || m > 12) return false;
    const now = new Date();
    const expiry = new Date(2000 + y, m, 0);
    return expiry > now;
  };

  const isValidMimeType = (file: File, allowedTypes: string[] = []): boolean => {
    const configTypes = systemConfig.security.allowedFileTypes;
    const types = allowedTypes.length ? allowedTypes : configTypes || [];
    if (!file || !types.length) return true;
    const fileType = file.type.toLowerCase();
    return types.some((type: string) => {
      if (type.endsWith("/*")) return fileType.startsWith(type.slice(0, -1));
      return fileType === type.toLowerCase();
    });
  };

  const validateField = (fieldName: string, value: unknown, type: string, isChecked = false): void => {
    let error: string | null = null;
    const val = typeof value === "string" ? value.trim() : "";
    const cleanVal = val.replace(/\D/g, "");

    if (systemConfig.security.enableSanitization && containsPotentialXSS(val)) {
      error = "Поле содержит недопустимые символы (XSS защита)";
    } else if (type === "checkbox") {
      if (!isChecked) error = formConfig.messages.checkbox;
    } else if (type === "select" && !value) {
      error = formConfig.messages.select;
    } else if (type === "name" && !val) {
      error = formConfig.messages.name;
    } else if (!val && type === "required") {
      error = formConfig.messages.required;
    } else if (val) {
      if (type === "email" && !(formConfig.validation.email.pattern as RegExp).test(val)) {
        error = formConfig.messages.email;
      } else if (type === "phone" && cleanVal.length < 11) {
        error = formConfig.messages.phone;
      } else if (type === "card") {
        if (cleanVal.length < 16) {
          error = "Номер карты должен содержать минимум 16 цифр";
        } else if (!luhnCheck(cleanVal)) {
          error = formConfig.messages.card;
        }
      } else if (type === "cardCvc" && cleanVal.length < 3) {
        error = formConfig.messages.cardCvc;
      } else if (type === "cardExpiry" && !checkExpiry(val)) {
        error = formConfig.messages.cardExpiry || "Срок действия карты истек";
      } else if (type === "date") {
        const dateParts = val.split(".");
        const d = Number(dateParts[0] || 0);
        const m = Number(dateParts[1] || 0);
        const y = Number(dateParts[2] || 0);

        const inputDate = new Date(y, m - 1, d);
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + (formConfig.imask.date.minDateOffset || 0));
        minDate.setHours(0, 0, 0, 0);
        inputDate.setHours(0, 0, 0, 0);

        if (!(formConfig.validation.date.pattern as RegExp).test(val)) {
          error = formConfig.messages.date;
        } else if (inputDate < minDate) {
          error = formConfig.messages.datePast;
        }
      }
    }

    if (error) {
      errors.value[fieldName] = error;
    } else {
      errors.value[fieldName] = undefined;;
    }
  };

  const validateFiles = (fieldName: string, files: FileList | null, allowedTypesStr = ""): boolean => {
    if (!files || files.length === 0) return true;
    const allowedTypes = allowedTypesStr ? allowedTypesStr.split(",").map((t) => t.trim()) : [];

    for (const file of Array.from(files)) {
      if (!isValidMimeType(file, allowedTypes)) {
        errors.value[fieldName] = `Недопустимый тип файла: ${file.name}`;
        return false;
      }
      if (file.size > systemConfig.security.maxFileSize) {
        errors.value[fieldName] = `Файл слишком большой (макс. 10МБ): ${file.name}`;
        return false;
      }
    }
    errors.value[fieldName] = undefined;
    return true;
  };

  const clearErrors = (): void => {
    errors.value = {};
  };

  // ==========================================================================
  // --- 2. UI УТИЛИТЫ ---
  // ==========================================================================

  const updateTextareaHeight = (e: Event, maxH = Infinity): void => {
    const el = e.target as HTMLTextAreaElement;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, maxH)}px`;
    el.style.overflowY = el.scrollHeight > maxH ? "auto" : "hidden";
  };

  const announceErrors = (): void => {
    if (!import.meta.client) return;
    const errorCount = Object.keys(errors.value).length;
    if (!errorCount) return;

    const alertDiv = document.createElement("div");
    alertDiv.setAttribute("aria-live", "assertive");
    alertDiv.className = "visually-hidden";
    alertDiv.textContent = `В форме найдено ${errorCount} ошибок. Пожалуйста, проверьте поля.`;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.remove();
    }, 1000);
  };

  return {
    errors,
    validateField,
    validateFiles,
    clearErrors,
    updateTextareaHeight,
    announceErrors,
  };
}
