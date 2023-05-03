import { createApp } from "vue";
import App from "./App.vue";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./index.less";
import ApiStore from "./api";

import "@/assets"; // 导入图标资源
import SvgIcon from "@/components/SvgIcon.vue"; // svg component

const app = createApp(App);

app.component("svg-icon", SvgIcon).use(ElementPlus).use(ApiStore).mount("#app");
