<template>
  <template v-if="og">
    <a class="no-decoration" :href="og.url">
      <Card class="og-card my-2">
        <template #content>
          <div class="grid">
            <div
              v-if="og.image"
              class="col-12 md:col-4 xl:col-3 bg-image"
            >
              <img
                :src="og.image"
                style="width: 100%; height: 100%; max-height: 20vh; object-fit: contain"
              >
            </div>

            <div
              class="col-12 flex flex-column gap-1 en-break-word"
              :class="{ 'md:col-8 xl:col-9': og.image }"
            >
              <div class="font-bold">
                {{ og.title }}
              </div>

              <div class="overflow-hidden">
                {{ og.description }}
              </div>

              <div class="underline">
                <span>
                  <i class="pi pi-link px-1" />
                </span>
                {{ og.url }}
              </div>
            </div>
          </div>
        </template>
      </Card>
    </a>
  </template>

  <template v-else>
    <span>
      <span>
        <i class="pi pi-link px-1" />
      </span>
      <a :href="url">{{ url }}</a>
    </span>
  </template>
</template>

<script setup lang="ts">
import Card from 'primevue/card'

import { onMounted, ref } from 'vue'
import { OgParam, useOgParser } from '../composables/useOgParser'

const props = defineProps<{ url?: string }>()

const ogParser = useOgParser()
const og = ref<OgParam>()

onMounted(async () => {
  og.value = await ogParser.get(props.url)
})
</script>

<style scoped lang="scss">
.p-card.og-card {
  border: 2px solid var(--surface-border);

  :hover {
    background-color: var(--surface-ground);
  }
  ::v-deep(.p-card-body) {
    padding: 0.5rem;
  }
  ::v-deep(.p-card-content) {
    padding: 0;
  }
}
</style>
