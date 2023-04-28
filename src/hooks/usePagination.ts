import { onMounted, reactive, ref } from "vue";
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

export function usePagination<TData>(request: Request): {
  data: Ref<TData[]>;
  pagination: PaginationInfo;
  handleSizeChange: (newPageSize: number) => void;
  handleCurrentChange: (newPage: number) => void;
} {
  const data = ref([]) as Ref<TData[]>;
  const pagination = reactive<PaginationInfo>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
  });

  async function fetchData() {
    const res = await request(pagination.currentPage, pagination.pageSize);

    data.value = res.data as TData[];
    pagination.total = res.total;
  }

  function handleSizeChange(newPageSize: number) {
    pagination.pageSize = newPageSize;
    fetchData();
  }

  function handleCurrentChange(newPage: number) {
    pagination.currentPage = newPage;
    fetchData();
  }

  onMounted(() => {
    fetchData();
  });

  return { data, pagination, handleSizeChange, handleCurrentChange };
}
