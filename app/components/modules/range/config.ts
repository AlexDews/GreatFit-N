/**
 ** LuminaNexus ModuX Range Configuration
 */

// Интерфейс форматтера для noUiSlider (исправили тип возвращаемого значения с boolean на false)
interface SliderFormatter {
  to(value: number): string | number;
  from(value: string): number | false;
}

// Интерфейс конфига компонента AppRange
export interface RangeConfig {
  start: [number, number]; // Стартовые позиции ползунков
  connect: boolean; // Заливка полосы между ползунками
  step: number; // Шаг изменения значений
  range: {
    min: number;
    max: number;
  };
  format: SliderFormatter; // Форматирование чисел
}

// Дефолтные настройки слайдера
export const rangeDefaults: RangeConfig = {
  start: [0, 200000],
  connect: true,
  step: 100,
  range: {
    min: 0,
    max: 200000,
  },
  format: {
    // Число в строку с пробелами (150000 -> "150 000")
    to: (value: number): string => Math.round(value).toLocaleString("ru-RU"),
    // Строка обратно в число, возвращает false если не распарсилось
    from: (value: string): number | false => {
      const parsed = Number(value.replace(/[^0-9.-]+/g, ""));
      return isNaN(parsed) ? false : parsed;
    },
  },
};
