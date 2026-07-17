// app/components/modules/burger/config.ts

export interface BurgerConfig {
  menuOpenClass: string;
  appearance: {
    direction: "left" | "right" | "top" | "bottom";
    size: string;
    animationType: "stagger-slide" | "stagger-fade" | "scale-up";
  };
}

export const burgerConfig: BurgerConfig = {
  // Класс открытого меню на <html>
  menuOpenClass: "_menu-open",

  //~ --- Настройки визуализации ---
  appearance: {
    direction: "right", // Откуда вылетает меню
    size: "320px", // Ширина/высота (если пусто — по умолчанию 100vw/100vh)
    animationType: "scale-up", // Пресет анимации пунктов ("stagger-slide" | "stagger-fade" | "scale-up")
  },
};
