<script setup>
import { onMounted, ref } from 'vue';
import { initApp } from './components/onload.vue';
import MainWindow from './components/HtmlBase/mainwindow.vue';
import Description from './components/HtmlBase/description.vue';
import News from './components/HtmlBase/news.vue';
import Sfx from './components/HtmlBase/sfx.vue';
import Superevent from './components/HtmlBase/superevent.vue';
import Generic from './components/Controller/Generic.vue';
onMounted(() => { window.onload = initApp; });
import { useWindows } from '@/composables/useWindows';
var { draggable } = useWindows();
var visible = ref(false);
let isDragging = false;

onMounted(() => {
  document.getElementById('app').addEventListener('mousedown', (event) => {
    if (event.target === document.getElementById('app')) {
      visible.value = true;
    }
  });

});
</script>

<template>
  <MainWindow></MainWindow>

  <vue-draggable-resizable id="Description" :draggable="draggable" style="position: absolute; height: min-content;"
    :w="320" :x="6" :y="250">
    <Description class="window"></Description>
  </vue-draggable-resizable>

  <vue-draggable-resizable id="News" :draggable="draggable" :w="520" :x="900" :y="160" :h="590">
    <News class="window"></News>
  </vue-draggable-resizable>

  <vue-draggable-resizable id="Superevent" :draggable="draggable" :w="580" :x="330" :y="-340" :h="500">
    <Superevent class="window"></Superevent>
  </vue-draggable-resizable>

  <Dialog v-model:visible="visible" :style="{ width: '450px', fontFamily: 'Aldrich, FZRui' }" header="控制面板"
    id="control-panel">
    <Generic class="window"></Generic>
  </Dialog>

  <Sfx></Sfx>
</template>