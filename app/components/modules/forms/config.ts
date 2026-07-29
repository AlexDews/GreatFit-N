/**
 ** LuminaNexus ModuX Forms Configuration
 */

export const formConfig = {
  // Глобальные настройки полей ввода
  viewPass: true,             // Показ/скрытие пароля
  autoHeight: false,          // Автовысота для textarea
  formSubmitEnabled: true,    // Глобальное разрешение на отправку

  // Настройки кастомного селекта
  customSelectEnabled: true,  // Использовать AppSelect вместо нативного
  customSelect: {
    searchDelay: 600,         // Сброс буфера поиска (мс)
  },

  // Идентификаторы для попапов
  dataAttributes: {
    successPopup: "success-popup",
    errorPopup: "error-popup",
  },

  // CSS-классы под дизайн-систему
  classes: {
    focus: "_form-focus",         // Фокус на инпуте/обертке
    error: "_container-error",    // Ошибка на родителе
    errorInput: "_error",         // Ошибка на самом инпуте
    errorMessage: "_text-error",  // Текст ошибки
    sending: "_sending",          // Форма в процессе отправки
    viewPass: "_viewpass-active", // Активный показ пароля
    selectOpen: "_select-open",   // Открытый селект
    selectActive: "_select-active"// Выбранный пункт в списке
  },

  // Локализация ошибок
  messages: {
    required: "Required field to fill in",
    email: "Введите корректный Email",
    phone: "Error, incorrect phone number",
    number: "Только цифры",
    password: "Минимум 8 символов (буква + цифра)",
    date: "Формат: ДД.ММ.ГГГГ",
    datePast: "Дата не может быть в прошлом",
    card: "Номер карты неверен",
    cardExpiry: "Срок действия истек",
    cardCvc: "CVC/CVV (3 цифры)",
    checkbox: "Нужно согласие на обработку персональных данных",
    select: "Пожалуйста, выберите город",
    name: "Enter your name",
  },

  // Регулярные выражения
  validation: {
    email: {
      pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,8})+$/,
    },
    password: {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    },
    date: {
      pattern: /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d\d$/,
    },
  },

  // Конфигурация масок iMask
  imask: {
    phone: {
      enabled: true,
      mask: "+{1} (000) 000-00-00",
      lazy: true,
    },
    date: {
      enabled: true,
      pattern: "DD.MM.YYYY",
      minDateOffset: 0,
      blocks: {
        DD: { from: 1, to: 31 },
        MM: { from: 1, to: 12 },
        YYYY: { from: 1900, to: 2100 },
      },
      lazy: false,
    },
    card: {
      enabled: true,
      mask: "0000 0000 0000 0000",
      lazy: true,
      allowedCards: {
        visa: true,
        mastercard: true,
        mir: true,
      },
    },
    cardExpiry: {
      enabled: true,
      mask: "00/00",
      lazy: false,
    },
    cardCvc: {
      enabled: true,
      mask: "000",
      lazy: false,
    },
  },
};