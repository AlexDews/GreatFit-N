<script setup>
import AppPicture from "@/components/ui/AppPicture.vue";
import AppButton from "@/components/ui/AppButton.vue";
import { popupStore } from "@/components/modules/popup/popupStore";
</script>

<template>
  <section class="main__member member">
    <div class="member__content">
      <div class="member__bg -ibg">
        <AppPicture
          class="member__img"
          desktop-src="/images/home/member.jpg"
          alt="Yoga"
          loading="lazy"
        />
      </div>

      <div class="member__body">
        <Animated
          type="fade-up"
          :stagger="0.1"
        >
          <h2 class="member__title">Free 30 Day MemberShip</h2>
          <p class="member__text">
            Enjoy a complimentary 30-day free trial of our yoga and fitness classes. Experience our serene studio,
            expert trainers, and diverse class offerings without any commitment. Discover the benefits of yoga and
            transform your well-being with us
          </p>
          <div class="member__btn">
            <AppButton
              to="/"
              class="member__btn-link"
              aria-label="Book A Session"
            >
              Book A Session
            </AppButton>
            <AppButton
              to="/"
              class="member__btn-contacts"
              aria-label="Contact Us"
              @click="popupStore.open('callback')"
            >
              <span>Contact Us</span>
              <svgo-arrow-nav class="member__arrow" />
            </AppButton>
          </div>
        </Animated>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.main {
  // .main__member
  &__member {
    position: relative;
    z-index: 2;
    background-color: #fff;
  }
}

.member {
  &__content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
    overflow: hidden;

    @media (max-width: $mobile) {
      grid-template-columns: 1fr;
      gap: 20px;
      padding: 20px;
    }
  }

  &__bg {
    z-index: 1;
    width: 100%;
    height: 100%;
    grid-column: 1 / 3;
    grid-row: 1;

    @media (max-width: $mobile) {
      grid-column: 1;
      grid-row: 1;
      height: 250px;
      border-radius: 20px;
      overflow: hidden;
    }
  }

  // .member__img
  :deep(.member__img) {
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  // Наш контент (плашка с текстом)
  &__body {
    z-index: 2;
    background-color: #fff;
    border-radius: 25px;
    grid-column: 2;
    grid-row: 1;

    @include adaptiveValue("padding", 48, 24);
    @include adaptiveValue("margin-top", 90, 45);
    @include adaptiveValue("margin-bottom", 90, 45);
    @include adaptiveValue("margin-right", 48, 24);

    @media (max-width: $mobile) {
      grid-column: 1;
      grid-row: 2;
      box-shadow: 0 4px 20px rgb(0 0 0 / 5%);
      margin-right: 0;
      background-color: #f1efe5;
    }
  }

  // .member__title
  &__title {
    font-weight: 700;
    margin-bottom: 25px;

    @include adaptiveValue("margin-bottom", 25, 15);
    @include adaptiveValue("font-size", 52, 24);
  }

  // .member__text
  &__text {
    line-height: math.div(28, 16);

    @include adaptiveValue("font-size", 16, 14);
  }

  // .member__btn
  &__btn {
    @include adaptiveValue("margin-top", 35, 20);

    display: flex;
    gap: 10px;

    @media (max-width: $mobileSmall) {
      flex-direction: column;
    }
  }

  // .member__btn-link
  &__btn-link {
    @media (max-width: $mobileSmall) {
      font-size: 14px;
      padding: 15px 10px;
      width: 100%;
    }
  }

  // .member__btn-contacts
  &__btn-contacts {
    display: flex;
    color: $fontMainColor;
    fill: $fontMainColor;
    font-weight: 600;
    gap: 5px;
    justify-content: center;
    align-items: center;
    background-color: transparent;

    @media (any-hover: hover) {
      &:hover {
        background-color: transparent;
        .member__arrow {
          transform: translateX(5px) rotate(90deg);
        }
      }
    }

    @media (max-width: $mobileSmall) {
      font-size: 14px;
      padding: 15px 10px;
      width: 100%;
    }
  }

  // .member__arrow
  &__arrow {
    transition: transform 0.3s ease 0s;
    width: 16px;
    height: 18px;
    transform: rotate(-90deg);
    position: relative;
    top: 1px;
  }
}
</style>
