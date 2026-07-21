<!-- app\components\modules\burger\AppMobileMenu.vue -->
<script setup lang="ts">
import { computed, watch } from "vue";
import { useBurger } from "~/composables/useBurger";
import { burgerConfig } from "./config";
import { gsap } from "gsap";

const { isMenuOpen, toggleMenu, handleMenuClick } = useBurger();

const openSubmenu = ref<string | null>(null);

const toggleSubMenu = (menuName: string) => {
  openSubmenu.value = openSubmenu.value === menuName ? null : menuName;
};

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
watch(isMenuOpen, async (isOpen) => {
  const animType = burgerConfig.appearance.animationType;

  if (isOpen) {
    await nextTick();

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
    openSubmenu.value = null;

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

<template>
  <!-- Кнопка остается на своем месте в шапке -->
  <button
    class="burger-btn"
    :class="{ 'burger-btn--active': isMenuOpen }"
    aria-label="Открыть меню"
    @click="toggleMenu"
  >
    <span></span>
    <span></span>lazy 
    <span></span>
  </button>

  <!-- Телепортируем само меню и бэкдроп прямо в <body> -->
  <Teleport to="body">
    <div
      v-if="isMenuOpen"
      class="menu-backdrop"
    />

    <nav
      class="menu-body"
      :class="[`_dir-${burgerConfig.appearance.direction}`, { _active: isMenuOpen }]"
      :style="menuStyles"
    >
      <ul class="menu-list">
        <li class="menu-item js-menu-item">
          <NuxtLink
            to="/"
            @click="handleMenuClick"
          >
            Home
          </NuxtLink>
        </li>
        <li class="menu-item js-menu-item menu-item--submenu">
          <div class="menu-subbtn">
            <NuxtLink
              to="/services"
              @click="handleMenuClick"
            >
              Services
            </NuxtLink>
            <button
              type="button"
              class="menu-item__toggle"
              aria-label="Open submenu"
              :class="{ 'is-open': openSubmenu === 'services' }"
              @click.stop="toggleSubMenu('services')"
            >
              <svgo-arrow-nav class="nav__icon" />
            </button>
          </div>
          <AppAccordion :is-open="openSubmenu === 'services'">
            <AppAnimator>
              <ul class="mobile-submenu">
                <li class="mobile-submenu__item">
                  <NuxtLink to="/services/spa">Spa Area</NuxtLink>
                </li>
                <li class="mobile-submenu__item">
                  <NuxtLink
                    to="/services/changing-room"
                    @click="handleMenuClick"
                  >
                    Changing Room
                  </NuxtLink>
                </li>
                <li class="mobile-submenu__item">
                  <NuxtLink
                    to="/services/free-lessons"
                    @click="handleMenuClick"
                  >
                    Free Lessons
                  </NuxtLink>
                </li>
                <li class="mobile-submenu__item">
                  <NuxtLink
                    to="/services/free-rug"
                    @click="handleMenuClick"
                  >
                    Free Rug
                  </NuxtLink>
                </li>
              </ul>
            </AppAnimator>
          </AppAccordion>
        </li>
        <li class="menu-item js-menu-item menu-item--submenu">
          <div class="menu-subbtn">
            <NuxtLink
              to="/facility"
              @click="handleMenuClick"
            >
              Our Facility
            </NuxtLink>
            <button
              type="button"
              class="menu-item__toggle"
              aria-label="Open submenu"
              :class="{ 'is-open': openSubmenu === 'facility' }"
              @click.stop="toggleSubMenu('facility')"
            >
              <svgo-arrow-nav class="nav__icon" />
            </button>
          </div>
          <AppAccordion :is-open="openSubmenu === 'facility'">
            <AppAnimator>
              <ul class="mobile-submenu">
                <li class="mobile-submenu__item">
                  <NuxtLink to="/services/spa">Beginners Yoga</NuxtLink>
                </li>
                <li class="mobile-submenu__item">
                  <NuxtLink
                    to="/services/changing-room"
                    @click="handleMenuClick"
                  >
                    Stretching
                  </NuxtLink>
                </li>
                <li class="mobile-submenu__item">
                  <NuxtLink
                    to="/services/free-lessons"
                    @click="handleMenuClick"
                  >
                    Fly-Yoga
                  </NuxtLink>
                </li>
              </ul>
            </AppAnimator>
          </AppAccordion>
        </li>
        <li class="menu-item js-menu-item">
          <NuxtLink
            to="/about"
            @click="handleMenuClick"
          >
            About
          </NuxtLink>
        </li>
        <li class="menu-item js-menu-item">
          <NuxtLink
            to="/contact"
            @click="handleMenuClick"
          >
            Contact
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </Teleport>
</template>

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
  z-index: 61;
  padding: 0;

  span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: $fontColor;
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
  z-index: 40;
  background-color: #fff;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  outline: none;
  width: var(--menu-width);
  max-height: 100vh;
  height: var(--menu-height);
  display: flex;
  justify-content: center;
  overflow-y: auto; 
  -webkit-overflow-scrolling: touch;
  padding: 70px 0;

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
  justify-content: safe center;
  align-items: center;
  gap: 50px;
  font-size: 24px;
}
.menu-item {
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__toggle {
    .nav__icon {
      transition: transform 0.3s ease 0s;
      pointer-events: none;
    }
    &.is-open {
      .nav__icon {
        transform: rotate(180deg);
      }
    }
  }
}

.menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0 0 0 / 50%);
  z-index: 40;
}

.mobile-submenu {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: max-content;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 20px;

  // .mobile-submenu__item
  &__item {
    font-size: 18px;
    padding: 20px 0;
  }
}
:deep(.accordion__content) {
  width: 100%; // Списки внутри будут занимать всю ширину меню, а не раздувать ссылку
}
</style>
