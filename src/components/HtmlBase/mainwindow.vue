<script>
import Pie from './piechart.vue';
import ChartEditor from '../Controller/ChartEditor.vue';
import { ref, onMounted } from 'vue';
import PicManager from '@/components/Controller/PicManager.vue';

export default {
  components: { Pie, ChartEditor, PicManager },
  setup() {
    const editorVisible = ref(false);
    const picManagerVisible = ref(false);
    const picManagerType = ref('');
    const picManagerTargetId = ref('');
    const picManagerResizable = ref(false);
    const chartData = ref({
      labels: ['秘传纳粹主义', '极端民族主义', '国家社会主义', '法西斯主义', '专制主义', '家长制民主', '保守主义', '自由保守主义', '自由主义', '进步主义', '社会主义', '共产主义'],
      datasets: [{
        data: [0, 5.6, 30.6, 41.7, 11.1, 8.3, 2.1, 0, 0, 2, 1.4, 0],
        backgroundColor: [
          '#341950',
          '#232323',
          '#503200',
          '#843200',
          '#4b4b4b',
          '#828282',
          '#000087',
          '#273195',
          '#4e61a3',
          '#a91b4f',
          '#9b0000',
          '#6e0000'
        ],
        borderWidth: 0,
        spacing: 0
      }],
      options: {
        rotation: 90
      }
    });

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

    onMounted(() => {
      document.addEventListener('click', handlePicClick);
    });

    return {
      chartData,
      editorVisible,
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
  <div id="main-container" style="position:absolute;z-index: 8; user-select: none;">
    <div>
      <img id="leader-overlay" src="/template/diplo_leader_frame.png" data-modifiable="true" data-type="leader"
        data-resizable="false" style="position: relative;z-index: 1;top:0px" data-target-id="leaderpic" />
      <div style="position:absolute; top: 13px; left: 22px; height: 55px; width: 85px; z-index: 0;">
        <img id="flag-overlay" src="/template/flag_overlay.png" data-modifiable="true" data-type="flag"
          data-resizable="false" data-target-id="flagpic"
          :style="{ position: 'absolute', top: '0', left: '0', height: 'inherit', width: 'inherit', scale: 1.3, zIndex: 1 }" />
        <img id="flagpic" class="pic" src="/preset/GER.png"
          style="position:absolute; top:0; left:0; height: inherit; width: inherit;">
      </div>
      <div style="position:absolute; top: 13px; left: 22px; height: 55px; width: 85px; z-index: 2;">
        <img id="flag-overlay" src="/template/flag_overlay.png" data-modifiable="true" data-type="flag"
          data-resizable="false" data-target-id="flagpic"
          :style="{ position: 'absolute', top: '0', left: '0', height: 'inherit', width: 'inherit', scale: 1.3, zIndex: 1, opacity: 0 }" />
      </div>
      <div style="position:absolute; top: 79px; left: 7px; height: 160px; width: 120px; z-index: 0;">
        <img id="leaderpic" class="portrait-overlay" src="/preset/Portrait_GER_Reichstag_Emergency_Council.png"
          style="position:absolute; top:0; left:0; height: inherit; width: inherit;">
      </div>
    </div>

    <div>
      <img src="/template/diplo_upper_win_bg.png" style="position: absolute;z-index: 2; left: 125px; top: 4px;">
      <div
        style="position:absolute; top: 42px; left: 177px; z-index: 3;display: flex; justify-content: center; align-items: center;">
        <img id="ideologypic" src="/preset/national_socialism_group.png" data-modifiable="true" data-type="ideology"
          data-resizable="true" data-initial-scale="1" :style="{ position: 'absolute', scale: 1 }"
          data-target-id="ideologypic" />
      </div>
      <div
        style="position:absolute; top: 43px; left: 485px; z-index: 3;display: flex; justify-content: center; align-items: center;">
        <img id="factionpic" src="/preset/Leader-Einheitspakt.png" data-modifiable="true" data-type="faction"
          data-resizable="true" data-initial-scale="0.8" :style="{ position: 'absolute', scale: 0.8 }"
          data-target-id="factionpic" />
      </div>
      <div
        style="position:absolute; top: 220px; left: 373px; z-index: 3;display: flex; justify-content: center; align-items: center;">
        <img src="/template/pol_goal_progress_frame.png" style="position:absolute;">
        <img src="/template/diplo_goal_button.png" style="position:absolute; top: -50px;">
      </div>
      <div style="position:absolute; top: 217px; left: 255px; z-index: 3;">
        <img id="progressbar" src="/template/pol_goal_progress.png" style="position:absolute; width: 0px;height: 6px;">
      </div>
      <div
        style="position:absolute; top: 202px; left: 179px; z-index: 5;display: flex; justify-content: center; align-items: center;">
        <img id="focuspic" src="/preset/goal_unknown.png" data-modifiable="true" data-type="focus" data-resizable="true"
          data-initial-scale="0.9" :style="{ position: 'absolute', scale: 0.9 }" data-target-id="focuspic" />
      </div>
      <div id="piechartparent"
        style="position:absolute; top: 72px; left: 129px; z-index: 3;display: flex; justify-content: center; align-items: center;">
        <img src="/template/bck_shadow.png" style="position:absolute;scale: 0.6;z-index: 0;">
        <Pie class="piechart"
          style="width: 100px;height: 100px; border-radius: 50%;background:none; scale: 0.6;z-index: 4;"
          v-model="chartData" />
        <img src="/template/pol_piechart_overlay_63x63.png" style="position:absolute;scale: 0.42;z-index: 5;"
          @click="editorVisible = true">
      </div>
      <div
        style="z-index: 3;position: absolute; left: 225px; top: 10px; color: #cccccc;text-shadow: 1px 1px 2px black;font-family:Bombard,FZWH; font-size: 16px; vertical-align:middle;">
        <p id="country" class="text" style="position: absolute; top: -11px;width:max-content;">大日耳曼国</p>
        <p id="factiontext" class="text" style="position: absolute; top: 8px;width:max-content;">团结协定</p>
        <p id="leader" class="text" style="position: absolute; top: 27px;width:max-content;">国会紧急委员会</p>
      </div>
      <div
        style="position: absolute; top:92px;left: 238px;font-family:Aldrich, FZRui;color: #cccccc; text-shadow: 1px 1px 2px black;font-size: 17px;z-index: 3; vertical-align: middle;">
        <p id="party" class="text" style="position: absolute; top: -9px;width:max-content;">纳粹党</p>
        <p id="ideologytext" class="text" style="position: absolute; top: 12px;width:max-content;">国家社会主义</p>
        <p id="election" class="text" style="position: absolute; top: 34px;width:max-content;">无选举</p>
        <div
          style="position:absolute; inline-size: 260px;display: flex; left: 6px; top:105px; justify-content: center; align-items: center;">
          <p id="focustext" class="text"
            style="position: absolute; text-align: center;width:max-content; font-size: 18px;">
            未知国策</p>
        </div>
      </div>
    </div>
  </div>
  <Dialog v-model:visible="editorVisible" modal header="饼图编辑" :style="{ width: '600px', fontFamily: 'Aldrich, FZRui' }">
    <ChartEditor v-model="chartData" />
  </Dialog>
  <PicManager v-model:visible="picManagerVisible" :type="picManagerType" :targetId="picManagerTargetId"
    :resizable="picManagerResizable" @update:pic="updatePicture" />
</template>
