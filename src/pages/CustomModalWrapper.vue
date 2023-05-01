<template>
  <div class="content-wrapper">
    <el-button @click="visible = true">打开模态框</el-button>
    <custom-modal title="测试模态框" v-model:visible="visible">
      <div>这是自定义的模态框</div></custom-modal
    >
  </div>
</template>
<script lang="ts" setup>
import CustomModal from "@/components/CustomModal.vue";
import { ref } from "vue";
const visible = ref(false);
</script>
<style lang="less">
.content-wrapper {
  padding: 0 1rem;
}
</style>
