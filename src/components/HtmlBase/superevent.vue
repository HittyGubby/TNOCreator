<script>
import { ref, onMounted } from 'vue';
import PicManager from '@/components/Controller/PicManager.vue';

export default {
  components: { PicManager },
  setup() {
    const picManagerVisible = ref(false);
    const picManagerType = ref('');
    const picManagerTargetId = ref('');
    const picManagerResizable = ref(false);
    let zIndexCounter = 10;

    const updatePicture = ({ id, url, scale }) => {
      const element = document.getElementById(id);
      if (element) {
        element.src = url ? url : element.src;
        if (scale !== undefined) {
          element.style.scale = scale;
        }
      }
    };

    const handlePicClick = (event) => {
      const target = event.target;
      if (target.dataset.modifiable === 'true') {
        picManagerType.value = target.dataset.type;
        picManagerTargetId.value = target.dataset.targetId;
        picManagerResizable.value = target.dataset.resizable === 'true';
        picManagerVisible.value = true;
      }
    };

    const prioritizeWindow = (event) => {
      const target = event.target.closest('.draggable');
      if (target) {
        zIndexCounter++;
        target.style.zIndex = zIndexCounter;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handlePicClick);
      const windowElement = document.getElementById('superwindow');
      windowElement.addEventListener('mousedown', prioritizeWindow);
    });

    return {
      picManagerVisible,
      picManagerType,
      picManagerTargetId,
      picManagerResizable,
      updatePicture
    };
  }
}
</script>
<template>
  <div class="draggable" id="superwindow"
    style="position: absolute; z-index: 4; scale: 0.55; left: -235px; top: -200px;">
    <img src="/template/super_frame.png" style="position: relative;z-index: 1;" data-modifiable="true" data-type="super"
      data-resizable="false" data-target-id="superpic">
    <div style="position:absolute;position:absolute;top:90px;left: 5px; width: 1040px;height: 710px;">
      <img id="superpic" class="pic" src="/preset/german_civil_war.png"
        style="height: inherit; width: inherit;z-index: 0;">
    </div>
    <div style="position:absolute;position:absolute;top:570px;left: 60px; width: 980px;height: 230px;">
      <img class="pic" src="/template/superevent_text_underlay.png" style="height: inherit; width: inherit;z-index: 0;">
    </div>
    <button id="superbutton" class="button text"
      style="position:absolute; top: 820px; left: 350px;scale: 1.6; transition: 0.2s; background: url('/template/spacebar.png') no-repeat; border: none; width: 359px; height: 36px; font-family:FZWH, Bombard;font-size: 21px;color: #cccccc;z-index: 5;text-shadow: 1px 1px 2px black;">风云已起</button>
    <div
      style="position:absolute;display: flex; left: 230px; top:45px; justify-content: center; align-items: center; inline-size: 570px;">
      <p id="supertitle" class="text"
        style="color: white; position: absolute; text-align: center; font-family:Aldrich, FZRui; font-size: 32px;z-index: 5;text-shadow: 1px 1px 2px black;">
        德国内战</p>
    </div>
    <p id="supermotto" class="text"
      style="text-shadow: 1px 1px 2px black; position: absolute;left:120px; top:550px;z-index: 5; color: #ffffff;inline-size: 900px; font-family: Bombard,FZWH ; font-size: 35px; text-align: right;white-space: pre-line; letter-spacing: -2px;">
      因此，所有人都必须认识到这一点：<br>与国家的存在相比，他的自我毫无意义。
      <br>
      - 阿道夫·希特勒
    </p>
  </div>
</template>
