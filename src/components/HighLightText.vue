<template>
  <span v-html="highlightedText"></span>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  search: string;
  text: string;
  color?: string;
}>();

const highlightedText = computed(() => {
  const search = props.search.trim();
  if (!search) {
    return props.text;
  }
  const pattern = new RegExp(search, "gi");
  const match = props.text.match(pattern);
  if (!match) {
    return props.text;
  }
  const highlighted = props.text.replace(
    pattern,
    `<span style="background-color: ${props?.color ?? "yellow"}">${
      match[0]
    }</span>`
  );

  return highlighted;
});
</script>
