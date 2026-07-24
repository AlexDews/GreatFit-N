<!-- components/TheNavigation.vue -->
<script setup lang="ts">
const { menuItems} = useMenu();
</script>

<template>
  <ul class="nav__menu">
    <Animated
      v-for="(item, index) in menuItems"
      :key="item.id"
      type="fade-down"
      :delay="0.3 + index * 0.2"
      :trigger="false"
    >
      <NavItem
        :item="item"
      />
    </Animated>
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
