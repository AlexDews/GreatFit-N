<template>
  <!-- Кнопка остается на своем месте в шапке -->
  <button
    class="burger-btn"
    :class="{ 'burger-btn--active': isMenuOpen }"
    aria-label="Открыть меню"
    @click="toggleMenu"
  >
    <span></span>
    <span></span>
    <span></span>
  </button>

  <!-- Телепортируем само меню и бэкдроп прямо в <body> -->
  <Teleport to="body">
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
          <NuxtLink to="/">Home</NuxtLink>
        </li>
        <li class="menu-item js-menu-item">
          <NuxtLink to="/services">Services <svgo-arrow-nav class="nav__icon" /></NuxtLink>
        </li>
        <li class="menu-item js-menu-item">
          <NuxtLink to="/facility">Our Facility <svgo-arrow-nav class="nav__icon" /></NuxtLink>
        </li>
        <li class="menu-item js-menu-item">
          <a to="/about">About</a>
        </li>
        <li class="menu-item js-menu-item">
          <a to="/contact">Contact</a>
        </li>
      </ul>
    </nav>
  </Teleport>
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
      gsap.fromTo(
        ".js-menu-item",
        {
          opacity: 0,
          scale: 0.4,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.2,
          ease: "back.out(1.5)",
          delay: 0.25,
        },
      );
    }
  } else {
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
// Стили для кнопки бургера и красивой CSS-анимации ее превращения в крестик
.burger-btn {
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 61; // Должен быть выше, чем .menu-body (50)
  padding: 0;

  span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: #000; // Цвет линий (под кастомный дизайн можно менять)
    transition:
      transform 0.3s ease,
      opacity 0.3s ease;
    transform-origin: left center;
  }

  @media (min-width: $tablet) {
    display: none;
  }

  @media (max-width: $tablet) {
    display: flex;
}

  // Анимация превращения трех полосок в крестик
  &--active {
    span {
      &:nth-child(1) {
        transform: rotate(45deg) translate(2px, -2px);
      }
      &:nth-child(2) {
        opacity: 0;
        transform: scale(0);
      }
      &:nth-child(3) {
        transform: rotate(-45deg) translate(2px, 2px);
      }
    }
  }
}

.menu-body {
  position: fixed;
  z-index: 50;
  background-color: #fff;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  outline: none;
  width: var(--menu-width);
  height: var(--menu-height);
  display: flex;
  justify-content: center;

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

.menu-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  font-size: 24px;


}
.menu-item {}

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
