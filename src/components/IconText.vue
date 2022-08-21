<template>
  <div class="flex align-items-baseline gap-2">
    <i v-if="icon" :class="icon" />
    <span v-if="label">{{ label }}</span>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string,
  label?: string,
}>()
</script>
