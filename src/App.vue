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
              <el-row class="operation-wrapper" justify="end" align="middle">
                <el-input
                  v-model="searchValue"
                  placeholder="Search"
                  :prefix-icon="Search"
                  class="search-input"
                />
                <el-button
                  type="primary"
                  color="#43b539"
                  style="color: white"
                  @click="dialogVisible = true"
                  >Create SDK</el-button
                >
              </el-row>
            </el-row>
            <el-table :data="tableData" v-loading="loading" stripe>
              <el-table-column prop="client" label="Client name">
                <template #default="{ row }">
                  <high-light-text
                    :search="debounceSearch"
                    :text="row.client"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="board" label="Board name">
                <template #default="{ row }">
                  <high-light-text :search="debounceSearch" :text="row.board" />
                </template>
              </el-table-column>
              <el-table-column prop="tags" label="Tags">
                <template #default="{ row }">
                  <high-light-text :search="debounceSearch" :text="row.tags" />
                </template>
              </el-table-column>
              <el-table-column prop="requestor" label="Requestor"
                ><template #default="{ row }">
                  <high-light-text
                    :search="debounceSearch"
                    :text="row.requestor"
                  /> </template
              ></el-table-column>
              <el-table-column prop="script" label="SDK script" />
              <el-table-column prop="actions" label="Actions">
                <template #default="{ row }">
                  <el-button type="primary" @click="editRow(row)"
                    >编辑</el-button
                  >
                  <el-button type="danger" @click="deleteRow(row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              v-model:current-page="pagination.currentPage"
              v-model:page-size="pagination.pageSize"
              :page-sizes="[10, 20, 50]"
              :total="pagination.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              layout="sizes, prev, pager, next, total"
              class="pagination"
            />
            <el-dialog v-model="dialogVisible" title="编辑用户信息">
              <el-form
                :label-width="120"
                :model="editForm"
                ref="ruleFormRef"
                v-loading="formLoading"
                :rules="rules"
              >
                <el-form-item label="Client name" prop="client">
                  <el-input v-model="editForm.client" />
                </el-form-item>
                <el-form-item label="Board name" prop="board">
                  <el-input v-model="editForm.board" />
                </el-form-item>
                <el-form-item label="Tags" prop="tags">
                  <el-input v-model="editForm.tags" />
                </el-form-item>
                <el-form-item label="Requestor" prop="requestor">
                  <el-input v-model="editForm.requestor" />
                </el-form-item>
                <el-form-item label="SDK script" prop="script">
                  <el-input v-model="editForm.script" />
                </el-form-item>
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
import { Search } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus";
import { computed, getCurrentInstance, reactive, ref, watch } from "vue";
import type { ApiStore } from "./api";
import { StoreData } from "./api/API";
import { useDebounceRef } from "./hooks/useDebounceRef";
import { usePagination } from "./hooks/usePagination";
import HighLightText from "./components/HighLightText.vue";

const defaultActiveKey = "sdk";

const menuMap = {
  [defaultActiveKey]: "SDK Management",
  testKey: "Test",
};

type MenuKey = keyof typeof menuMap;

type FormData = Omit<StoreData, "id">;

const selectMenuKey = ref<MenuKey>(defaultActiveKey);

const handleSelect = (index: MenuKey) => {
  selectMenuKey.value = index;
};

/** 获取install的api实例 */
const instance = getCurrentInstance()!;
const $api: ApiStore = instance.appContext.config.globalProperties.$api;

/** 搜索 */
const searchValue = ref<string>("");
/** 节流 */
const debounceSearch = useDebounceRef(searchValue, 500);

/** 表格数据及分页hook */
const {
  data: tableData,
  pagination,
  handleSizeChange,
  handleCurrentChange,
  loading: dataLoading,
  refresh,
} = usePagination<StoreData>(
  async (page, size) => {
    const res = await $api.getData(page, size, debounceSearch.value);
    return {
      data: res.data,
      page: res.currentPage,
      pageSize: res.pageSize,
      total: res.total,
    };
  },
  {
    refreshDeps: [debounceSearch],
  }
);

const operationLoading = ref(false);

const loading = computed(() => dataLoading.value || operationLoading.value);

const dialogVisible = ref<boolean>(false);

const ruleFormRef = ref<FormInstance>();
const editForm = reactive<FormData>({
  client: "",
  board: "",
  tags: "",
  requestor: "",
  script: "",
});
const changeForm = (data: FormData) => {
  Object.keys(editForm).forEach((key) => {
    const formKey = key as keyof FormData;
    editForm[formKey] = data[formKey];
  });
};

const rules: FormRules = {
  client: [{ required: true, trigger: "blur" }],
  board: [{ required: true, trigger: "blur" }],
  tags: [],
  requestor: [{ required: true, trigger: "blur" }],
  script: [{ required: true, trigger: "blur" }],
};

const editId = ref("");
/** reset form effect */
watch(dialogVisible, (newVal) => {
  if (!newVal) {
    changeForm({
      client: "",
      board: "",
      tags: "",
      requestor: "",
      script: "",
    });
  }
});
const formLoading = ref(false);
const saveForm = async () => {
  if (ruleFormRef.value) {
    try {
      formLoading.value = true;
      await ruleFormRef.value.validate();
      if (editId.value) {
        await $api.update({
          ...editForm,
          id: editId.value,
        });
      } else {
        await $api.addNew(editForm);
      }

      ElMessage.success("保存成功");
      formLoading.value = false;
      dialogVisible.value = false;
      editId.value = "";
      refresh();
    } catch (error) {
      console.log(error);
    }
  }
};

const editRow = (row: StoreData) => {
  dialogVisible.value = true;
  editId.value = row.id;
  changeForm(row);
};

const deleteRow = async (row: StoreData) => {
  try {
    await ElMessageBox.confirm("Confirm to delelte data?", "Confirm", {
      type: "warning",
    });
    operationLoading.value = true;
    await $api.delete(row.id);
    refresh();
  } catch (error) {
    console.log(error);
  } finally {
    operationLoading.value = false;
  }
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

  .operation-wrapper {
    width: 60%;

    .search-input {
      margin-right: 20px;
      width: 200px;
    }
  }

  .pagination {
    margin-top: 10px;
  }
}
</style>
