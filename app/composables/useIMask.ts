// app/composables/useIMask.ts
import IMask from "imask";
import type { Directive } from "vue";
import { formConfig } from "~/components/modules/forms/config";
import { systemConfig } from "./system.config";

type MaskType = "phone" | "card" | "cardExpiry" | "cardCvc" | "date";

type MaskedElement = HTMLElement & {
  maskInstance?: ReturnType<typeof IMask>;
};

/**
 * Инициализация маски на элементе ввода
 */
const initMask = (el: MaskedElement, type: MaskType): void => {
  // Уничтожаем старый инстанс, если он каким-то образом остался
  if (el.maskInstance) {
    el.maskInstance.destroy();
    delete el.maskInstance;
  }

  // Безопасный поиск целевого input/textarea (если директиву повесили на компонент-обертку)
  const targetInput = el.tagName === "INPUT" || el.tagName === "TEXTAREA" ? (el as HTMLInputElement) : el.querySelector<HTMLInputElement>("input, textarea");

  if (!targetInput) return;

  const imask = formConfig.imask;
  let maskOptions: Record<string, unknown> | undefined;

  switch (type) {
    case "phone":
      if (imask.phone.enabled) {
        maskOptions = {
          mask: imask.phone.mask,
          lazy: imask.phone.lazy,
        };
      }
      break;

    case "card":
      if (imask.card.enabled) {
        maskOptions = {
          mask: imask.card.mask,
          lazy: imask.card.lazy,
        };
      }
      break;

    case "cardExpiry":
      if (imask.cardExpiry.enabled) {
        maskOptions = {
          mask: imask.cardExpiry.mask,
          lazy: imask.cardExpiry.lazy,
        };
      }
      break;

    case "cardCvc":
      if (imask.cardCvc.enabled) {
        maskOptions = {
          mask: imask.cardCvc.mask,
          lazy: imask.cardCvc.lazy,
        };
      }
      break;

    case "date":
      if (imask.date.enabled) {
        maskOptions = {
          mask: Date,
          pattern: imask.date.pattern,

          blocks: {
            DD: {
              mask: IMask.MaskedRange,
              from: imask.date.blocks.DD.from,
              to: imask.date.blocks.DD.to,
            },
            MM: {
              mask: IMask.MaskedRange,
              from: imask.date.blocks.MM.from,
              to: imask.date.blocks.MM.to,
            },
            YYYY: {
              mask: IMask.MaskedRange,
              from: imask.date.blocks.YYYY.from,
              to: imask.date.blocks.YYYY.to,
            },
          },

          format(date: Date): string {
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
          },

          parse(value: string): Date {
            const [day, month, year] = value.split(".");
            return new Date(Number(year), Number(month) - 1, Number(day));
          },

          lazy: imask.date.lazy,
        };
      }
      break;
  }

  if (maskOptions) {
    // Вешаем инстанс IMask на таргет-инпут, но ссылку храним на корневом el директивы для unmounted
    el.maskInstance = IMask(targetInput, maskOptions);
  }
};

export const vImask: Directive<MaskedElement, { type: MaskType }> = {
  mounted(el, binding) {
    if (!import.meta.client || !systemConfig.features.imaskEnabled) return;

    const type = binding.value?.type;
    if (!type) return;

    initMask(el, type);
  },

  updated(el, binding) {
    if (!import.meta.client || !systemConfig.features.imaskEnabled) return;

    const type = binding.value?.type;
    if (!type) {
      el.maskInstance?.destroy();
      delete el.maskInstance;
      return;
    }

    // Если тип изменился — пересоздаем маску
    initMask(el, type);
  },

  unmounted(el) {
    if (el.maskInstance) {
      el.maskInstance.destroy();
      delete el.maskInstance;
    }
  },
};
