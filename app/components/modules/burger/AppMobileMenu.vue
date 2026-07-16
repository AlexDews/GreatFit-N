<template>
  <button
    class="burger-btn"
    :class="{ _active: isMenuOpen }"
    @click="toggleMenu"
  >
    <span></span>
  </button>

  <div
    v-if="isMenuOpen"
    class="menu-backdrop"
    @click="handleMenuClick"
  />

  <nav
    class="menu-body"
    :class="[`_dir-${burgerConfig.appearance.direction}`, { _active: isMenuOpen }]"
    :style="menuStyles"
    @click="handleMenuClick"
  >
    <ul class="menu-list">
      <li class="menu-item js-menu-item">
        <NuxtLink to="/">Главная</NuxtLink>
      </li>
      <li class="menu-item js-menu-item">
        <NuxtLink to="/services">Услуги</NuxtLink>
      </li>
      <li class="menu-item js-menu-item">
        <NuxtLink to="/portfolio">Портфолио</NuxtLink>
      </li>
      <li class="menu-item js-menu-item">
        <a href="#contacts">Контакты</a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useBurger } from "~/composables/useBurger";
import { burgerConfig } from "./config";
import { gsap } from "gsap";

const { isMenuOpen, toggleMenu, handleMenuClick } = useBurger();

//~--- Динамические стили для размеров меню (с дефолтами 100vw/vh) ---
const menuStyles = computed(() => {
  const { direction, size } = burgerConfig.appearance;
  const isHorizontal = direction === "left" || direction === "right";

  const defaultSize = isHorizontal ? "100vw" : "100vh";
  const finalSize = size && size.trim() !== "" ? size : defaultSize;

  return {
    "--menu-width": isHorizontal ? finalSize : "100vw",
    "--menu-height": isHorizontal ? "100vh" : finalSize,
  };
});

//~--- Пресеты анимации GSAP Stagger ---
watch(isMenuOpen, (isOpen) => {
  const animType = burgerConfig.appearance.animationType;

  if (isOpen) {
    if (animType === "stagger-slide") {
      // Вариант 1: Сдвиг сбоку
      gsap.fromTo(
        ".js-menu-item",
        {
          opacity: 0,
          x: burgerConfig.appearance.direction === "left" ? -30 : 30,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.15,
        },
      );
    } else if (animType === "stagger-fade") {
      // Вариант 2: Мягкое всплытие снизу
      gsap.fromTo(
        ".js-menu-item",
        {
          opacity: 0,
          y: 15,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.15,
        },
      );
    } else if (animType === "scale-up") {
      // Вариант 3: Пружинящее увеличение масштаба
      gsap.fromTo(
        ".js-menu-item",
        {
          opacity: 0,
          scale: 0.9,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.06,
          ease: "back.out(1.5)",
          delay: 0.15,
        },
      );
    }
  } else {
    // Анимация быстрого скрытия при закрытии меню
    const exitY = animType === "stagger-fade" ? -10 : 0;
    const exitX = animType === "stagger-slide" ? (burgerConfig.appearance.direction === "left" ? -15 : 15) : 0;

    gsap.to(".js-menu-item", {
      opacity: 0,
      y: exitY,
      x: exitX,
      duration: 0.2,
      ease: "power2.in",
    });
  }
});
</script>

<style lang="scss" scoped>
.menu-body {
  position: fixed;
  z-index: 50;
  background-color: #1a1a1a;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  outline: none;

  // Размеры подтягиваются из JS-переменных
  width: var(--menu-width);
  height: var(--menu-height);

  // Стили для разных направлений вылета
  &._dir-left {
    top: 0;
    left: 0;
    transform: translateX(-100%);
    &._active {
      transform: translateX(0);
    }
  }

  &._dir-right {
    top: 0;
    right: 0;
    transform: translateX(100%);
    &._active {
      transform: translateX(0);
    }
  }

  &._dir-top {
    top: 0;
    left: 0;
    transform: translateY(-100%);
    &._active {
      transform: translateY(0);
    }
  }

  &._dir-bottom {
    bottom: 0;
    left: 0;
    transform: translateY(100%);
    &._active {
      transform: translateY(0);
    }
  }
}

// Теневая подложка бэкграунда
.menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0 0 0 / 50%);
  z-index: 40;
}
</style>
