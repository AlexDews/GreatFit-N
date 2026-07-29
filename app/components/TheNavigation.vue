<!-- components/TheNavigation.vue -->
<script setup lang="ts">
const { menuItems } = useMenu();
</script>

<template>
  <ul class="nav__menu">
    <NavItem
      v-for="(item, index) in menuItems"
      :key="item.id"
      :item="item"
      :index="index"
    />
  </ul>
</template>

<style lang="scss" scoped>
.nav {
  &__menu {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
  }
}
</style>
