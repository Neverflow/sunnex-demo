import { sleep } from "@/utils";
import { nanoid } from "nanoid";
import type { App } from "vue";
import { StoreData } from "./API";
import generateDefaultData from "./defaultData";

type DataKey = keyof StoreData;
const STORE_KEY = "API_STORE";

/** localStorage模拟API   函数均使用模拟异步 */
export class ApiStore {
  private store: StoreData[];
  private filterKeys: DataKey[] = ["id", "script"];
  constructor() {
    const storageData = JSON.parse(localStorage.getItem(STORE_KEY) ?? "null");
    this.store = storageData ?? generateDefaultData();
    if (!storageData) {
      this.syncStorage();
    }
  }

  private syncStorage() {
    localStorage.setItem(STORE_KEY, JSON.stringify(this.store));
  }

  private searchStoreData(keyword: string) {
    const matchingItems = [];
    for (const item of this.store) {
      // 搜索所有属性是否包含关键字
      const isMatch = Object.keys(item)
        // 过滤不想被搜索出来的字段
        .filter((key) => !this.filterKeys.includes(key as DataKey))
        .some((key) =>
          String(item[key as keyof StoreData])
            .toLowerCase()
            .includes(keyword.toLowerCase())
        );
      if (isMatch) {
        matchingItems.push(item);
      }
    }
    return matchingItems;
  }

  public async getData(page: number, pageSize = 10, keyword = "") {
    await sleep(500);
    const filterData = keyword ? this.searchStoreData(keyword) : this.store;
    console.log("filterData", filterData);
    return {
      data: filterData.slice((page - 1) * pageSize, page * pageSize),
      currentPage: page,
      pageSize,
      total: filterData.length,
    };
  }

  public async delete(id: string) {
    const findIndex = this.store.findIndex((item) => item.id === id);
    if (findIndex >= 0) {
      this.store.splice(findIndex, 1);
      this.syncStorage();
      await sleep(500);
    } else {
      throw new Error("Can't find target id!");
    }
  }

  public async addNew(data: Omit<StoreData, "id">) {
    this.store.push({
      ...data,
      id: nanoid(),
    });
    this.syncStorage();
    await sleep(500);
  }

  public async update(data: StoreData) {
    const findIndex = this.store.findIndex((item) => item.id === data.id);
    if (findIndex >= 0) {
      this.store[findIndex] = data;
      this.syncStorage();
      await sleep(500);
    } else {
      throw new Error("Can't find target id!");
    }
  }
}

export default {
  install(app: App) {
    const store = new ApiStore();
    app.config.globalProperties.$api = store;
  },
};
