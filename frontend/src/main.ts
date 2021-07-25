import { createApp } from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import setupLayout from "./layout";

import "./styles/global.scss";
import "ant-design-vue/dist/antd.css";

setupLayout();
createApp(App).use(Antd).mount("#app");
