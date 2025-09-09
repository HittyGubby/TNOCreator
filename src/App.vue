<script setup>
import { ref, onMounted } from "vue";
import DraggableResizableVue from "vue-draggable-resizable";
import MainWindow from "./components/HtmlBase/mainwindow.vue";
import Description from "./components/HtmlBase/description.vue";
import News from "./components/HtmlBase/news.vue";
import Superevent from "./components/HtmlBase/superevent.vue";
import Generic from "./components/Controller/Generic.vue";
import Sfx from "./components/HtmlBase/sfx.vue";
import { initApp } from "./utils/onload.js";
import { mousePosition } from "./composables/useMousePosition.js";
import Economy from "./components/HtmlBase/economy.vue";
import { state } from "@/utils/state.js";

onMounted(() => {
  document.addEventListener("mousedown", (e) => {
    mousePosition.down.x = e.clientX;
    mousePosition.down.y = e.clientY;
  });
  document.addEventListener("mouseup", (e) => {
    mousePosition.up.x = e.clientX;
    mousePosition.up.y = e.clientY;
  });
  initApp();
});

const settingsVisible = ref(false);
const draggable = ref(false);

let maxZIndex = ref(1);

function bringToFront(windowName) {
  maxZIndex.value++;
  state.windows[windowName].zIndex = maxZIndex.value;
}

function openSettings() {
  settingsVisible.value = true;
}
</script>

<template>
  <div id="app-container" @click.self="openSettings" style="width: 100vw; height: 100vh;">
    <DraggableResizableVue v-show="state.windows.main.visible" v-model:active="state.windows.main.active"
      :z="state.windows.main.zIndex" @activated="bringToFront('main')" class="window" :draggable=false>
      <MainWindow />
    </DraggableResizableVue>
    <DraggableResizableVue v-show="state.windows.description.visible" v-model:x="state.windows.description.x"
      v-model:y="state.windows.description.y" v-model:w="state.windows.description.w"
      v-model:h="state.windows.description.h" v-model:active="state.windows.description.active"
      :z="state.windows.description.zIndex" @activated="bringToFront('description')" class="window"
      :draggable="draggable" :drag-cancel="'.non-draggable'">
      <Description />
    </DraggableResizableVue>

    <DraggableResizableVue v-show="state.windows.news.visible" v-model:x="state.windows.news.x"
      v-model:y="state.windows.news.y" v-model:w="state.windows.news.w" v-model:h="state.windows.news.h"
      v-model:active="state.windows.news.active" :z="state.windows.news.zIndex" @activated="bringToFront('news')"
      class="window" :draggable="draggable" :drag-cancel="'.non-draggable'">
      <News />
    </DraggableResizableVue>

    <DraggableResizableVue v-show="state.windows.superevent.visible" v-model:x="state.windows.superevent.x"
      v-model:y="state.windows.superevent.y" v-model:w="state.windows.superevent.w"
      v-model:h="state.windows.superevent.h" v-model:active="state.windows.superevent.active"
      :z="state.windows.superevent.zIndex" @activated="bringToFront('superevent')" class="window" :draggable="draggable"
      :drag-cancel="'.non-draggable'">
      <Superevent />
    </DraggableResizableVue>

    <DraggableResizableVue v-show="state.windows.economy.visible" v-model:x="state.windows.economy.x"
      v-model:y="state.windows.economy.y" v-model:w="state.windows.economy.w" v-model:h="state.windows.economy.h"
      v-model:active="state.windows.economy.active" :z="state.windows.economy.zIndex"
      @activated="bringToFront('economy')" class="window" :draggable="draggable" :drag-cancel="'.non-draggable'">
      <Economy />
    </DraggableResizableVue>

    <DraggableResizableVue v-show="state.windows.event.visible" v-model:x="state.windows.event.x"
      v-model:y="state.windows.event.y" v-model:w="state.windows.event.w" v-model:h="state.windows.event.h"
      v-model:active="state.windows.event.active" :z="state.windows.event.zIndex" @activated="bringToFront('event')"
      class="window" :draggable="draggable" :drag-cancel="'.non-draggable'">
      <Event />
    </DraggableResizableVue>

    <Dialog v-model:visible="settingsVisible" :style="{ minHeight: '60%', fontFamily: 'Aldrich, FZRui' }" :modal="true"
      header="控制面板" id="control-panel">
      <Generic :windows="state.windows" v-model:draggable="draggable" />
    </Dialog>

    <Sfx />
  </div>
</template>

<style>
.window {
  position: absolute;
}
</style>