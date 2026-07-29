<!-- app\components\ThePopup.vue -->
<script setup>
const onSuccessSubmit = (data) => {
  console.log("Форма успешно улетела!", data);
};
</script>

<template>
  <AppPopup name="callback">
    <div class="popup-callback">
      <h3 class="popup-callback__title">call you back</h3>
      <AppForms
        v-slot="{ isSending, errors }"
        action="/api/callback"
        method="POST"
        @submit:success="onSuccessSubmit"
      >
        <div class="popup-callback__form">
          <div
            class="form-field"
            :class="{ '_has-error': errors.name }"
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              class="popup-callback__input"
              data-validate="name"
            />
            <span
              v-if="errors.name"
              class="form-field__error"
            >
              {{ errors.name }}
            </span>
          </div>

          <!-- Инпут Телефона -->
          <div
            class="form-field"
            :class="{ '_has-error': errors.tel }"
          >
            <input
              v-imask="{ type: 'phone' }"
              type="tel"
              name="tel"
              data-validate="phone required"
              placeholder="Your Phone Number"
              class="popup-callback__input"
            />
            <span
              v-if="errors.tel"
              class="form-field__error"
            >
              {{ errors.tel }}
            </span>
          </div>

          <AppButton
            type="submit"
            class="popup-callback__btn"
            :disabled="isSending"
          >
            <span>{{ isSending ? "Sending..." : "Send" }}</span>
          </AppButton>
        </div>
      </AppForms>
    </div>
  </AppPopup>

  <AppPopup name="video-modal">
    <h3>Презентация зала</h3>
    <div class="video-container"></div>
  </AppPopup>
</template>

<style lang="scss" scoped>
.popup-callback {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #f1efe5;
  border-radius: 4px 0 4px 4px;

  @include adaptiveValue("padding-top", 50, 30);
  @include adaptiveValue("padding-bottom", 50, 30);
  @include adaptiveValue("padding-right", 200, 30);
  @include adaptiveValue("padding-left", 200, 30);
  @include adaptiveValue("gap", 30, 20);

  // .popup-callback__title
  &__title {
    font-size: 18px;
    text-transform: uppercase;
  }

  // .popup-callback__form
  &__form {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;

    @include adaptiveValue("gap", 30, 20);
  }

  // .popup-callback__input
  &__input {
    padding: 15px;
    border-radius: 5px;
    outline: 2px solid #fff;
    transition: outline 0.3s ease 0s;

    @include adaptiveValue("width", 350, 225);
    &:focus {
      border: none;
      outline: 2px solid $colorAccent;
    }
  }

  // .popup-callback__btn
  &__btn {
    @include adaptiveValue("width", 350, 225);
  }
}

.form-field {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__error {
    color: red;
    position: absolute;
    display: flex;
    bottom: -17px;
    left: 0;

    @include adaptiveValue("font-size", 14, 12);
  }

  &._has-error {
    input {
      border-color: red;
    }
  }
}
</style>
