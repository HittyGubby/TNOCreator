<script setup>
import { ref, onMounted } from "vue";
import { mousePosition } from "../../composables/useMousePosition.js";

const picManagerVisible = ref(false);
const picManagerType = ref("");
const picManagerTargetId = ref("");
const picManagerResizable = ref(false);
let zIndexCounter = 10;

const handlePicClick = (event) => {
    const distance = Math.sqrt(
        Math.pow(mousePosition.up.x - mousePosition.down.x, 2) +
        Math.pow(mousePosition.up.y - mousePosition.down.y, 2)
    );

    if (distance > 5) {
        return;
    }

    const target = event.target;
    if (target.dataset.modifiable === "true") {
        picManagerType.value = target.dataset.type;
        picManagerTargetId.value = target.dataset.targetId;
        picManagerResizable.value = target.dataset.resizable === "true";
        picManagerVisible.value = true;
    }
};

const prioritizeWindow = (event) => {
    const target = event.target.closest(".draggable");
    if (target) {
        zIndexCounter++;
        target.style.zIndex = zIndexCounter;
    }
};

onMounted(() => {
    document.addEventListener("click", handlePicClick);
    const windowElement = document.getElementById("economywindow");
    windowElement.addEventListener("mousedown", prioritizeWindow);
});
</script>

<template>
    <div class="draggable" id="economywindow" style="position: absolute; z-index: 4">
        <img src="/template/diplo_econ_bg.png" style="position: relative" />
        <div style="
          position: absolute;
          top: 35px;
          left: 145px;
          z-index: 3;
          display: flex;
          justify-content: center;
          align-items: center;
        ">
            <img id="econpic" class="pic" src="/preset/Gelenkte_Wirtschaft.png" data-modifiable="true" data-type="econ"
                data-resizable="true" data-initial-scale="1" :style="{ position: 'absolute', scale: 1 }"
                data-target-id="econpic" />
        </div>
        <div style="
          position: absolute;
          top: 35px;
          left: 210px;
          z-index: 3;
          display: flex;
          justify-content: center;
          align-items: center;
        ">
            <img id="econfactionpic" class="pic" src="/preset/EHP_GER.png" data-modifiable="true"
                data-type="econfaction" data-resizable="true" data-initial-scale="1"
                :style="{ position: 'absolute', scale: 1 }" data-target-id="econfactionpic" />
        </div>
        <div style="
          z-index: 3;
          position: absolute;
          left: 15px;
          top: 10px;
          color: #cccccc;
          text-shadow: 1px 1px 2px black;
          font-family: Bombard, FZWH;
          font-size: 16px;
          vertical-align: middle;
        ">
            <p style="position: absolute; top: -11px; width: max-content">
                经济
            </p>
        </div>
    </div>
</template>
<style scoped></style>