<!-- app\components\modules\tabs\AppTabs.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { tabsConfig } from "~/components/modules/tabs/config";

interface TabItem {
  title: string;
  content?: string;
}

const props = withDefaults(
  defineProps<{
    items: readonly TabItem[];
    media?: string;
    id?: string;
    classTab?: string;
    classTitles?: string;
  }>(),
  {
    media: "768",
    id: "0",
    classTab: "",
    classTitles: "",
  },
);

const tabsRef = ref<HTMLElement | null>(null);
const activeIndex = ref<number | null>(0);
const isMobile = ref(false);

const { goToBlock } = useGoToBlock();
let mediaQueryList: MediaQueryList | null = null;

const selectTab = (index: number) => {
  if (isMobile.value && activeIndex.value === index) {
    activeIndex.value = null;

    if (tabsConfig.useHash) {
      window.location.hash = "";
    }

    return;
  }

  if (tabsRef.value) {
    const rect = tabsRef.value.getBoundingClientRect();

    if (rect.top < 0) {
      goToBlock(`#ln-tabs-${props.id}`, {
        speed: tabsConfig.speed,
        noHeader: true,
        offsetTop: 10,
        closeMenu: false,
      });
    }
  }

  activeIndex.value = index;

  if (tabsConfig.useHash) {
    window.location.hash = `tab-${props.id}-${index}`;
  }
};

const checkHash = () => {
  if (!import.meta.client) return;
  const hash = window.location.hash;
  if (hash && hash.startsWith(`#tab-${props.id}-`)) {
    const indexFromHash = parseInt(hash.replace(`#tab-${props.id}-`, ""), 10);
    if (!isNaN(indexFromHash) && indexFromHash < props.items.length) {
      activeIndex.value = indexFromHash;
    }
  }
};

const handleMediaChange = (e: MediaQueryListEvent) => {
  isMobile.value = e.matches;
};

onMounted(() => {
  checkHash();

  if (props.media && import.meta.client) {
    mediaQueryList = window.matchMedia(`(max-width: ${props.media}px)`);
    isMobile.value = mediaQueryList.matches;
    mediaQueryList.addEventListener("change", handleMediaChange);
  }
});

onUnmounted(() => {
  if (mediaQueryList) {
    mediaQueryList.removeEventListener("change", handleMediaChange);
  }
});
</script>

<template>
  <div
    :id="`ln-tabs-${id}`"
    ref="tabsRef"
    class="ln-tabs"
    :class="{ '_tab-spoller': isMobile }"
  >
    <div
      v-if="!isMobile"
      class="ln-tabs__titles"
      :class="classTitles"
    >
      <button
        v-for="(item, index) in items"
        :key="'title-' + index"
        type="button"
        class="ln-tabs__title"
        :class="[{ [tabsConfig.activeClass]: activeIndex === index }, classTab]"
        @click="selectTab(index)"
      >
        {{ item.title }}
      </button>
    </div>

    <div class="ln-tabs__body">
      <div
        v-for="(item, index) in items"
        :key="'block-' + index"
        class="ln-tabs__block"
      >
        <button
          v-if="isMobile"
          type="button"
          class="ln-tabs__title ln-tabs__title--mobile"
          :class="[{ [tabsConfig.activeClass]: activeIndex === index }, classTab]"
          @click="selectTab(index)"
        >
          {{ item.title }}
        </button>

        <div
          v-show="activeIndex === index"
          class="ln-tabs__content-wrapper"
        >
          <div class="ln-tabs__content">
            <slot
              :name="'content-' + index"
              :item="item"
              :active-index="activeIndex"
            >
              {{ item.content }}
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ln-tabs {
  width: 100%;
}
.ln-tabs__titles {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.ln-tabs__title {
  padding: 10px 20px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  color: #666;
  margin-bottom: -2px;
  transition: all 0.3s ease;
}
.ln-tabs__title._tab-active {
  // color: #000;
  // border-bottom-color: #000;
}
.ln-tabs__title--mobile {
  width: 100%;
  text-align: left;
  padding: 15px;
  margin-bottom: 5px;
  border-radius: 4px;
  background: #f9f9f9;
}
.ln-tabs__title--mobile._tab-active {
  background: #eee;
}
.ln-tabs__content {
  padding: 0 5px;
  line-height: 1.6;
}
</style>
