<template>
  <div
    ref="sliderRef"
    class="swiper"
  >
    <div class="swiper-wrapper">
      <slot></slot>
    </div>

    <template v-if="navigation">
      <div
        ref="prevRef"
        class="swiper-button-prev"
      ></div>
      <div
        ref="nextRef"
        class="swiper-button-next"
      ></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import Swiper from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
import type { SwiperOptions } from "swiper/types";
import { swiperConfig } from "~/components/modules/swiper/config";

// Подключаем стили Swiper
import "swiper/css";
import "swiper/css/navigation";

const props = defineProps({
  options: { type: Object as () => SwiperOptions, default: () => ({}) }, // Возможность перебить любые параметры Swiper на лету
  enabled: { type: Boolean, default: () => swiperConfig.controls.enabled },
  disableOnDesktop: { type: Boolean, default: () => swiperConfig.controls.disableOnDesktop },
  breakpoint: { type: Number, default: () => swiperConfig.controls.desktopBreakpoint },
  navigation: { type: Boolean, default: true },
});

const sliderRef = ref<HTMLElement | null>(null);
const prevRef = ref<HTMLElement | null>(null);
const nextRef = ref<HTMLElement | null>(null);
let instance: Swiper | null = null;
let mediaQueryList: MediaQueryList | null = null;

// Инициализация экземпляра Swiper
const initSlider = () => {
  if (instance || !sliderRef.value) return;

  const baseNavigation = props.navigation ? { prevEl: prevRef.value, nextEl: nextRef.value } : false;

  const config: SwiperOptions = {
    modules: [Navigation, Autoplay],
    ...swiperConfig.defaults,
    navigation: baseNavigation,
    ...props.options,
  };

  instance = new Swiper(sliderRef.value, config);
};

// Полное уничтожение слайдера и очистка памяти
const destroySlider = () => {
  if (instance) {
    instance.destroy(true, true);
    instance = null;
  }
};

// Функция отслеживания брейкпоинта десктопа
const handleResponsiveCheck = (e: MediaQueryListEvent | MediaQueryList) => {
  if (props.disableOnDesktop && e.matches) {
    destroySlider(); // Экран стал большим — тушим слайдер
  } else if (props.enabled) {
    nextTick(initSlider); // Вернулись на мобилку — заводим заново
  }
};

onMounted(() => {
  if (!props.enabled) return;

  if (props.disableOnDesktop) {
    // Вешаем слушатель на медиа-запрос десктопа
    mediaQueryList = window.matchMedia(`(min-width: ${props.breakpoint}px)`);
    mediaQueryList.addEventListener("change", handleResponsiveCheck);

    // Первичная проверка при инициализации блока
    if (mediaQueryList.matches) {
      destroySlider();
    } else {
      nextTick(initSlider);
    }
  } else {
    // Если отключение на десктопе не требуется — просто запускаем везде
    nextTick(initSlider);
  }
});

onUnmounted(() => {
  if (mediaQueryList) {
    mediaQueryList.removeEventListener("change", handleResponsiveCheck);
  }
  destroySlider();
});

// Следим за динамическим изменением флага enabled из родительских компонентов
watch(
  () => props.enabled,
  (newValue) => {
    if (newValue) {
      if (mediaQueryList && mediaQueryList.matches && props.disableOnDesktop) return;
      nextTick(initSlider);
    } else {
      destroySlider();
    }
  },
);
</script>

<style scoped>
.swiper {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
