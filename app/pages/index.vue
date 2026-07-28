<!-- app\pages\index.vue -->
<script setup>
useSeoMeta({
  title: 'О компании — Название бренда',
  description: 'Подробная информация о нашей команде и проектах.',
  
  ogTitle: 'Great Fit - Yoga Studio',
  ogDescription: 'Great Fit is our modern yoga studio, and all the rest is such a description.',
  ogImage: 'https://your-domain.com/og-about.jpg',
  ogUrl: 'https://your-domain.com/'
})
</script>

<template>
  <div>
<HomeHero />
<HomeServices />
<HomeClasses />
<HomeTeam />
<HomeMember />
  </div>
</template>

<style lang="scss" scoped></style>
