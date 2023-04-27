<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu :default-active="defaultActiveKey" @select="handleSelect">
          <el-menu-item
            v-for="(value, key) in menuMap"
            :index="key"
            :key="key"
            >{{ value }}</el-menu-item
          >
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-main>
        <el-scrollbar>
          <div class="content-wrapper">
            <el-row justify="space-between">
              <h3>{{ menuMap[selectMenuKey] }}</h3>
              <div>
                <el-input
                  v-model="searchValue"
                  placeholder="搜索..."
                  class="search-input"
                />
                <el-button type="primary" color="#43b539" style="color: white"
                  >Create SDK</el-button
                >
              </div>
            </el-row>
            <el-table :data="tableData">
              <el-table-column prop="client" label="Client name" />
              <el-table-column prop="board" label="Board name" />
              <el-table-column prop="tags" label="Tags" />
              <el-table-column prop="requestor" label="Requestor" />
              <el-table-column prop="script" label="SDK script" />
              <el-table-column prop="actions" label="Actions">
                <!-- <template #default="{ row }">
                  <el-button type="primary" @click="editRow(row)"
                    >编辑</el-button
                  >
                  <el-popconfirm
                    title="确定删除？"
                    placement="top-start"
                    @confirm="deleteRow(row)"
                  >
                    <el-button type="danger" icon="el-icon-delete"
                      >删除</el-button
                    >
                  </el-popconfirm>
                </template> -->
              </el-table-column>
            </el-table>
            <el-pagination
              v-model:current-page="currentPage"
              :page-sizes="[10, 20, 50]"
              :page-size="pageSize"
              :total="total"
            />
            <el-dialog v-model:visible="dialogVisible" title="编辑用户信息">
              <el-form :model="editForm" ref="ruleFormRef" label-width="80px">
              </el-form>
              <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveForm">保存</el-button>
              </template>
            </el-dialog>
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";

interface DataItem {
  client: string;
  board: string;
  tags: string;
  requestor: string;
  script: string;
  actions: string;
}

const defaultActiveKey = "sdk";

const menuMap = {
  [defaultActiveKey]: "SDK Management",
  testKey: "Test",
};

type MenuKey = keyof typeof menuMap;

const selectMenuKey = ref<MenuKey>(defaultActiveKey);

const handleSelect = (index: MenuKey) => {
  selectMenuKey.value = index;
};

const item: DataItem = {
  client: "2016-05-02",
  board: "",
  tags: "No. 189, Grove St, Los Angeles",
  requestor: "No. 189, Grove St, Los Angeles",
  script: "No. 189, Grove St, Los Angeles",
  actions: "No. 189, Grove St, Los Angeles",
};
const tableData = ref(Array.from({ length: 20 }).fill(item));

const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const searchValue = ref<string>("");

// eslint-disable-next-line @typescript-eslint/no-empty-function
const addNew = () => {};
const ruleFormRef = ref<FormInstance>();
const editForm = reactive<DataItem>({
  client: "",
  board: "",
  tags: "",
  requestor: "",
  script: "",
  actions: "",
});
const saveForm = async () => {
  if (ruleFormRef.value) {
    try {
      await ruleFormRef.value.validate();
      // TODO 执行保存逻辑
      ElMessage.success("保存成功");
      dialogVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  }
};
const dialogVisible = ref<boolean>(false);
// eslint-disable-next-line @typescript-eslint/no-empty-function
const editRow = (row: DataItem) => {
  dialogVisible.value = true;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const deleteRow = async (row: DataItem) => {
  await ElMessageBox.confirm("Confirm to delelte data?", "Confirm", {
    type: "warning",
  });
  console.log("todo delete");
};
</script>

<style scoped lang="less">
.layout-container {
  height: 100vh;
  .el-aside {
    user-select: none;
  }
  .el-main {
    margin: 2rem;
    border-radius: 4px;
    box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
  }

  .content-wrapper {
    padding: 0 1rem;
  }
}
</style>
