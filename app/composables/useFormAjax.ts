// app/composables/useFormAjax.ts

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export function useFormAjax() {
  const isSending = ref(false);

  const sendFormAjax = async (
    action: string,
    method: HttpMethod = "POST",
    rawData: FormData | Record<string, unknown>,
    errorPopupId: string | null = null,
  ) => {
    isSending.value = true;

    try {
      // Формируем FormData, если пришел обычный объект
      const bodyData =
        rawData instanceof FormData
          ? rawData
          : Object.entries(rawData).reduce((formData, [key, value]) => {
              if (value !== undefined && value !== null) {
                formData.append(key, value as string | Blob);
              }
              return formData;
            }, new FormData());

      // Юзаем встроенный Nuxt $fetch
      const result = await $fetch(action || "#", {
        method,
        body: bodyData,
      });

      // Безопасность SSR. document доступен ТОЛЬКО на клиенте
      if (import.meta.client) {
        document.dispatchEvent(
          new CustomEvent("modux:formSent", {
            detail: { result },
          }),
        );
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("ModuX AJAX Error:", error);

      // Безопасность SSR для ошибок
      if (import.meta.client) {
        document.dispatchEvent(
          new CustomEvent("formError", {
            detail: {
              popupId: errorPopupId,
              error,
            },
          }),
        );
      }

      return {
        success: false,
        error,
      };
    } finally {
      isSending.value = false;
    }
  };

  return {
    isSending,
    sendFormAjax,
  };
}
