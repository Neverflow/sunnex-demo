import type { App } from "vue";
import generateDefaultData from "./defaultData";
import { StoreData } from "./API";
import { nanoid } from "nanoid";

const STORE_KEY = "API_STORE";

/** localStorage模拟API   函数均使用模拟异步 */
export class ApiStore {
  private store: StoreData[];

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

  public async getData(page: number, pageSize = 10) {
    return {
      data: this.store.slice((page - 1) * pageSize, page * pageSize),
      currentPage: page,
      pageSize,
      total: this.store.length,
    };
  }

  public async delete(id: string) {
    const findIndex = this.store.findIndex((item) => item.id === id);
    if (findIndex >= 0) {
      this.store.splice(findIndex, 1);
      this.syncStorage();
    }
  }

  public async addNew(data: Omit<StoreData, "id">) {
    this.store.push({
      ...data,
      id: nanoid(),
    });
    this.syncStorage();
  }

  public async update(data: StoreData) {
    const findIndex = this.store.findIndex((item) => item.id === data.id);
    if (findIndex >= 0) {
      this.store[findIndex] = data;
      this.syncStorage();
    }
  }
}

export default {
  install(app: App) {
    const store = new ApiStore();
    app.config.globalProperties.$api = store;
  },
};
