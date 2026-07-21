// app/plugins/imask.client.ts
import { vImask } from "~/composables/useIMask";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("imask", vImask);
});