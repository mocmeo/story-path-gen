import { createApp } from "vue";
import App from "./App.vue";
import "./styles/global.scss";
import setupLayout from "./layout";

setupLayout();
createApp(App).mount("#app");
