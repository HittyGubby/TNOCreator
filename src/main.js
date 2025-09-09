import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";

import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import {
  Button,
  Dialog,
  ToggleSwitch,
  TabView,
  TabPanel,
  DataTable,
  Column,
  InputText,
  FileUpload,
} from "primevue";

const app = createApp(App);
app.component("Button", Button);
app.component("Dialog", Dialog);
app.component("ToggleSwitch", ToggleSwitch);
app.component("TabView", TabView);
app.component("TabPanel", TabPanel);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("InputText", InputText);
app.component("FileUpload", FileUpload);
app.use(PrimeVue, { theme: { preset: Aura } });

app.mount("#app");
