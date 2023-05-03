<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu default-active="sdk" @select="handleSelect">
          <el-menu-item v-for="(value, key) in menuMap" :index="key" :key="key">
            <template #title>
              <svg-icon
                :name="value.icon"
                :color="selectMenuKey === key ? '#409EFF' : '#303133'"
                size="16"
              ></svg-icon>
              <span>{{ value.title }}</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-main>
        <el-scrollbar>
          <s-d-k-manage v-if="selectMenuKey === 'sdk'" />
          <custom-modal-wrapper v-if="selectMenuKey === 'testCustomModal'" />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import SDKManage from "./pages/SDKManage.vue";
import CustomModalWrapper from "./pages/CustomModalWrapper.vue";

const menuMap = {
  sdk: {
    title: "SDK Management",
    icon: "ICON2_API",
  },
  testCustomModal: { title: "Test Custom Modal", icon: "open_in_new" },
};

type MenuKey = keyof typeof menuMap;

const selectMenuKey = ref<MenuKey>("sdk");

const handleSelect = (index: MenuKey) => {
  selectMenuKey.value = index;
};
</script>

<style scoped lang="less">
.layout-container {
  height: 100vh;
  .el-aside {
    user-select: none;
  }
}
</style>
