<template>
  <ScrollHeader v-slot="{ isFixed, isShow, isAnimating }">
    <header
      data-lp
      class="header"
      :class="{
        '_is-fixed': isFixed,
        '_is-animating': isAnimating,
        '_is-show': isShow,
      }"
    >
      <div class="header__container">
        <div class="header__wrapper">
          <div class="logo header__logo">
            <RouterLink
              to="/"
              class="logo__link"
            >
              <img
                src="/images/logo/logo.svg"
                alt="Логотип Название"
              />
              <div class="logo__text">
                <strong>
                  Great
                  <span class="logo__accent">Fit</span>
                </strong>
                <span class="logo__subtext">Yoga Studio</span>
              </div>
            </RouterLink>
          </div>

          <nav class="header__nav nav">
            <ul class="nav__menu">
              <li class="nav__item">
                <NuxtLink
                  to="/"
                  class="nav__link"
                >
                  Home
                </NuxtLink>
              </li>
              <li class="nav__item">
                <NuxtLink
                  to="/services"
                  class="nav__link"
                >
                  Services
                  <svgo-arrow-nav class="nav__icon" />
                </NuxtLink>
              </li>
              <li class="nav__item">
                <NuxtLink
                  to="/facility"
                  class="nav__link"
                >
                  Our Facility
                  <svgo-arrow-nav class="nav__icon" />
                </NuxtLink>
              </li>
              <li class="nav__item">
                <NuxtLink
                  to="/about"
                  class="nav__link"
                >
                  About
                </NuxtLink>
              </li>
              <li class="nav__item">
                <NuxtLink
                  to="/contact"
                  class="nav__link"
                >
                  Contact
                </NuxtLink>
              </li>
            </ul>
          </nav>
          <div class="header__burger">
            <AppMobileMenu />
          </div>

          <AppButton
            to="/"
            class="header__btn"
          >
            <svgo-cart class="header__cart" />
            <span>Shop Now</span>
          </AppButton>
        </div>
      </div>
    </header>
  </ScrollHeader>
</template>

<script setup>
import AppButton from "@/components/ui/AppButton.vue";
import AppMobileMenu from "~/components/modules/burger/AppMobileMenu.vue";
// import ScrollHeader from "@modules/scroll/ScrollHeader.vue";
</script>

<style lang="scss" scoped>
.header {
  // БАЗОВОЕ СОСТОЯНИЕ (0 - 150px)
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 150;
  background-color: transparent;
  transform: translateY(0);

  // РЕЖИМ ФИКСАЦИИ (Ниже 150px, заряжена в -100%)
  &._is-fixed {
    position: fixed;
    background-color: rgb(255 255 255 / 70%);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 20px rgb(0 0 0 / 5%);
    transform: translateY(-100%);

    .header__wrapper {
      padding: 10px 0;
    }
  }

  // РАЗРЕШЕНИЕ АНИМАЦИИ
  &._is-animating {
    transition:
      transform 0.4s ease,
      background-color 0.3s ease;
  }

  // ВЫЕЗД ШАПКИ
  &._is-show {
    transform: translateY(0);
  }

  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    transition: padding 0.3s ease;
    position: relative;
  }

  &__logo {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__nav {
  }

  &__btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
  }

  &__cart {
    width: 15px;
    height: 16px;
  }
  &__burger {
  }
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;

  &__link {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      margin-right: 5px;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    align-items: end;
    font-family: Montserrat, sans-serif;
    strong {
      font-size: 24px;
      font-weight: 700;
    }
  }

  &__accent {
    font-size: 24px;
    color: $colorAccent;
    font-weight: 700;
  }

  &__subtext {
    display: flex;
    font-size: 12px;
    font-weight: 500;
    margin-top: -5px;
  }
}

.nav {
  &__menu {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
  }
  &__item {
    gap: 15px;
  }
  &__link {
    position: relative;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: Inter, sans-serif;
    font-weight: 500;
    gap: 5px;
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
      transform-origin: center;
      transition: transform 0.3s ease;
    }

    @media (any-hover: hover) {
      &:hover {
        .nav__icon {
          transform: rotate(180deg);
        }
        &::after {
          transform: scaleX(1);
        }

        color: $fontMainColor;
      }
    }
  }

  &__icon {
    display: flex;
    transition: transform 0.3s ease;
    width: 16px;
    height: 16px;
  }
}

@media (max-width: $tablet) {
  .header__nav,
  .header__btn {
    display: none;
  }
}
</style>
