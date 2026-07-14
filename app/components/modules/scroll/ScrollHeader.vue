<script setup lang="ts">
const { isFixed, isShow, isAnimating } = useScrollHeader();

defineExpose({ isFixed, isShow, isAnimating });
</script>

<template>
  <slot
    :is-fixed="isFixed"
    :is-show="isShow"
    :is-animating="isAnimating"
  />
</template>
