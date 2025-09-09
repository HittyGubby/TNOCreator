import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import VueDraggableResizable from "vue-draggable-resizable";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { Button, Dialog, ToggleSwitch } from "primevue";

const app = createApp(App);
app.component("Button", Button);
app.component("Dialog", Dialog);
app.component("ToggleSwitch", ToggleSwitch);
app.use(PrimeVue, { theme: { preset: Aura } });
app.component("vue-draggable-resizable", VueDraggableResizable);
app.mount("#app");
