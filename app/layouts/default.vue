<script setup></script>

<template>
  <div class="app-layout">
    <TheHeader />

    <main class="main-content">
      <!-- Сюда Nuxt будет автоматически подставлять контент твоих страниц -->
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

<style lang="scss" scoped></style>
