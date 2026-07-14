<script setup lang="ts">
// Nuxt автоматически импортирует хуки из папки composables
const { isMenuOpen, toggleMenu } = useBurger();
</script>

<template>
  <ScrollHeader v-slot="{ isFixed, isShow, isAnimating }">
    <header
      class="header"
      :class="{
        '_is-fixed': isFixed,
        '_is-animating': isAnimating,
        '_is-show': isShow,
      }"
    >
      <div class="header__container">
        <div class="header__body">
          <div class="header__logo logo">
            <NuxtLink
              to="/"
              class="logo__link"
            >
              <img
                src="@/assets/images/logo/logo.svg"
                alt="Logo"
              />
            </NuxtLink>
          </div>

          <nav class="header__nav nav">
            <NuxtLink
              to="/"
              class="nav__link"
            >
              Home
            </NuxtLink>
            <NuxtLink
              to="/"
              class="nav__link"
            >
              Services
            </NuxtLink>
            <NuxtLink
              to="/"
              class="nav__link"
            >
              Our Facility
            </NuxtLink>
            <NuxtLink
              to="/"
              class="nav__link"
            >
              About
            </NuxtLink>
            <NuxtLink
              to="/"
              class="nav__link"
            >
              Contact
            </NuxtLink>
          </nav>

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
        </div>
      </div>
    </header>
  </ScrollHeader>
</template>

<style lang="scss" scoped>
/* Твои стили остаются без изменений */
.header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 150;
  background-color: transparent;
  transform: translateY(0);

  &._is-fixed {
    position: fixed;
    background-color: rgb(255 255 255 / 70%);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 20px rgb(0 0 0 / 5%);
    transform: translateY(-100%);
  }

  &._is-animating {
    transition:
      transform 0.4s ease,
      background-color 0.3s ease;
  }

  &._is-show {
    transform: translateY(0);
  }

  &__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    transition: padding 0.3s ease;
  }
}

.nav {
  &__link {
    position: relative;
    display: inline-flex;
    text-decoration: none;
    align-items: center;
    font-family: Inter, sans-serif;
    font-weight: 500;
    gap: 5px;
    color: #000;
    padding: 3px 0;
    transition: color 0.3s ease 0s;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      background-color: $fontMainColor;
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    @media (any-hover: hover) {
      &:hover {
        &::after {
          transform: scaleX(1);
        }

        color: $fontMainColor;
      }
    }
  }
}

.burger-btn {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 101;
  padding: 0;

  span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: #000;
    transition:
      transform 0.3s ease,
      opacity 0.3s ease;
  }

  &--active {
    span {
      &:nth-child(1) {
        transform: translateY(9px) rotate(45deg);
      }
      &:nth-child(2) {
        opacity: 0;
      }
      &:nth-child(3) {
        transform: translateY(-9px) rotate(-45deg);
      }
    }
  }
}

@media (width <= 991.98px) {
  .header__nav {
    display: none;
  }
  .burger-btn {
    display: flex;
  }
}
</style>
