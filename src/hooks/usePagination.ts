import { onMounted, reactive, ref, watch } from "vue";
import type { Ref } from "vue";

interface PaginationInfo {
  total: number;
  pageSize: number;
  currentPage: number;
}

type Request = (
  page: number,
  pageSize: number
) => Promise<{
  data: any[];
  page: number;
  pageSize: number;
  total: number;
}>;

interface Options {
  pageSize?: number;
  refreshDeps?: any[];
}

export function usePagination<TData>(
  request: Request,
  options?: Options
): {
  data: Ref<TData[]>;
  pagination: PaginationInfo;
  handleSizeChange: (newPageSize: number) => void;
  handleCurrentChange: (newPage: number) => void;
  refresh: () => void;
  loading: Ref<boolean>;
} {
  const data = ref([]) as Ref<TData[]>;
  const loading = ref(false);
  const pagination = reactive<PaginationInfo>({
    total: 0,
    pageSize: options?.pageSize ?? 10,
    currentPage: 1,
  });

  async function fetchData() {
    try {
      loading.value = true;
      const res = await request(pagination.currentPage, pagination.pageSize);

      data.value = res.data as TData[];
      pagination.total = res.total;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  }

  function handleSizeChange(newPageSize: number) {
    pagination.pageSize = newPageSize;
    fetchData();
  }

  function handleCurrentChange(newPage: number) {
    pagination.currentPage = newPage;
    fetchData();
  }

  function refresh() {
    data.value = [];
    pagination.currentPage = 1;
    fetchData();
  }

  onMounted(() => {
    fetchData();
  });

  if (options?.refreshDeps) {
    watch(options.refreshDeps, () => refresh(), { deep: true });
  }

  return {
    data,
    pagination,
    handleSizeChange,
    handleCurrentChange,
    refresh,
    loading,
  };
}
