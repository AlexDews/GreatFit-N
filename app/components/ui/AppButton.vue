<!-- app\components\ui\AppButton.vue -->
<template>
  <component
    :is="to ? 'NuxtLink' : 'button'"
    :to="to"
    class="ui-btn"
  >
    <slot>Button</slot>
  </component>
</template>

<script setup>
defineProps({
  to: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "button", // По умолчанию 'button', чтобы форма случайно не отправлялась
  },
});
</script>

<style lang="scss" scoped>
:where(.ui-btn) {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  border: none;
  cursor: pointer;
  color: #fff;
  background-color: $colorAccent;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition:
    background-color 0.3s ease 0s,
    color 0.3s ease 0s;
  font-family: Inter, sans-serif;

  @media (any-hover: hover) {
    &:hover {
      background-color: $fontMainColor;
    }
  }
}
</style>

<!-- 
<AppButton to="/about">Learn More About Us</AppButton>
<AppButton type="submit" @click="doSomething">Отправить</AppButton> 
-->
