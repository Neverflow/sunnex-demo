<template>
  <svg :style="{ width: size + 'px', height: size + 'px' }" aria-hidden="true">
    <use :xlink:href="`#icon-${name}`" :fill="color" />
  </svg>
</template>

<script lang="ts" setup>
defineProps<{
  name: string;
  size: string;
  color?: string;
}>();
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
