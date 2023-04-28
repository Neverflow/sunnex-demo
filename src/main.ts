import { createApp } from "vue";
import App from "./App.vue";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./index.less";
import ApiStore from "./api";

createApp(App).use(ElementPlus).use(ApiStore).mount("#app");
