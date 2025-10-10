<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { state } from "@/utils/state";
import SpiritManager from "@/components/Controller/SpiritManager.vue";

const spiritManagerVisible = ref(false);
const backgroundHeight = ref(0);

const calculateBackgroundHeight = () => {
  nextTick(() => {
    backgroundHeight.value = Math.max(1, parseFloat(window.getComputedStyle(document.querySelector('.spirit-icons-container')).height.replace('px', '')) - 15);
  });
};

const openSpiritManager = () => {
  spiritManagerVisible.value = true;
};

const pictures = computed({
  get: () => state.spiritPictures,
  set: (value) => {
    state.spiritPictures = value;
  }
});

watch(() => state.spiritPictures.length, () => {
  calculateBackgroundHeight();
});

onMounted(() => {
  calculateBackgroundHeight();

  const container = document.querySelector('.spirit-icons-container');
  const resizeObserver = new ResizeObserver(() => {
    calculateBackgroundHeight();
  });
  resizeObserver.observe(container);
  return () => {
    resizeObserver.disconnect();
  };
});

const onImageLoad = (spirit, event) => {
  const img = event.target;
  spirit.naturalWidth = img.naturalWidth;
  spirit.naturalHeight = img.naturalHeight;
}
</script>

<template>
  <div class="draggable" id="spiritwindow" style="position: absolute; z-index: 4">
    <img src="/template/diplo_nat_spirits_bg_top.png" style="position: relative; display: block;" />

    <div v-if="backgroundHeight > 0" :style="{
      backgroundImage: 'url(/template/diplo_nat_spirits_bg_tileable.png)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
      width: '100%',
      height: backgroundHeight + 'px'
    }">
    </div>

    <img src="/template/diplo_nat_spirits_bg_bottom.png" style="position: relative; display: block;" />

    <div class="spirit-icons-container" @click="openSpiritManager" style="
        position: absolute;
        top: 23px;
        left: 15px;
        right: 15px;
        z-index: 3;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        align-content: flex-start;
        cursor: pointer;
      ">
      <img v-for="(spirit, index) in pictures" :key="spirit.id || index" :src="spirit.url" :title="spirit.filename"
        :style="{
          alignSelf: 'center',
          height: spirit.naturalHeight * (spirit.scale || 1) + 'px',
          width: spirit.naturalWidth * (spirit.scale || 1) + 'px',
          margin: '0px',
          padding: '0px',
        }" @load="onImageLoad(spirit, $event)" />
    </div>
    <div style="
        z-index: 3;
        position: absolute;
        left: 15px;
        top: 2px;
        color: #cccccc;
        text-shadow: 1px 1px 2px black;
        font-family: Bombard, FZWH;
        font-size: 16px;
        vertical-align: middle;
      ">
      <p style="position: absolute; top: -11px; width: max-content">
        国家精神
      </p>
    </div>
  </div>
  <SpiritManager v-model:visible="spiritManagerVisible" v-model:spirits="pictures" />
</template>
<style scoped>
.spirit-icons-container:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>