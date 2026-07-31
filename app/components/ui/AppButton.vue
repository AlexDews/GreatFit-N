<!-- app/components/ui/AppButton.vue -->
<script setup lang="ts">
defineProps<{
  to?: string | object
  ariaLabel?: string
  type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
  <!-- Если есть to — рендерим NuxtLink, иначе button -->
  <NuxtLink
    v-if="to"
    :to="to"
    :aria-label="ariaLabel || undefined"
    class="ui-btn"
  >
    <slot>Button</slot>
  </NuxtLink>

  <button
    v-else
    :type="type || 'button'"
    :aria-label="ariaLabel || undefined"
    class="ui-btn"
  >
    <slot>Button</slot>
  </button>
</template>

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
