<script setup>
import { ref, onMounted, computed, nextTick, watch } from "vue";
import { mousePosition } from "../../composables/useMousePosition.js";

const picManagerVisible = ref(false);
const picManagerType = ref("");
const picManagerTargetId = ref("");
const picManagerResizable = ref(false);
let zIndexCounter = 10;

// Refs for dynamic sizing
const eventBodyRef = ref(null);
const tileCount = ref(3);
const tileHeight = 111;
const calculateTileCount = () => {
    nextTick(() => {
        if (eventBodyRef.value) {
            if (eventBodyRef.value.dataset.editing === "true") {
                return;
            }
            const computedStyle = window.getComputedStyle(eventBodyRef.value);
            const contentHeight = parseFloat(computedStyle.height.replace('px', ''));
            if (!isNaN(contentHeight) && contentHeight > 0) {
                const requiredTiles = Math.ceil(contentHeight / tileHeight);
                tileCount.value = Math.max(0, requiredTiles);
            }
        }
    });
};

// Create an array of tile indices for v-for
const tileIndices = computed(() => {
    return Array.from({ length: tileCount.value }, (_, i) => i);
});

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

const handleEditFinish = (event) => {
    if (eventBodyRef.value) {
        setTimeout(() => {
            calculateTileCount();
        }, 50);
    }
};

onMounted(() => {
    document.addEventListener("click", handlePicClick);
    const windowElement = document.getElementById("eventwindow");
    windowElement.addEventListener("mousedown", prioritizeWindow);

    document.addEventListener("blur", handleEditFinish, true);

    calculateTileCount();

    if (eventBodyRef.value) {
        const observer = new MutationObserver(() => {
            calculateTileCount();
        });
        observer.observe(eventBodyRef.value, {
            childList: true, // Watch for changes to child nodes (e.g., text)
            subtree: true, // Watch all descendants
            characterData: true, // Watch for text content changes
        });
    }
});
</script>

<template>
    <div class="draggable" id="eventwindow" style="position: absolute; z-index: 4">
        <img src="/template/news/event_report_top_win.png" style="position: relative; display: block;" />

        <img v-for="index in tileIndices" :key="index" src="/template/news/event_report_tileable_midsection.png"
            style="position: relative; display: block; width: 100%;" />

        <img src="/template/news/event_report_bottom_win.png" style="position: relative; display: block;" />

        <div :style="{
            position: 'absolute',
            top: `${295 + tileCount * tileHeight}px`,
            left: '97px',
            zIndex: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }">
            <img id="eventpic" class="pic" src="/preset/Reich_Germany_report_event_GER_riot.png" data-modifiable="true"
                data-type="event" data-resizable="true" data-initial-scale="1"
                :style="{ position: 'absolute', scale: 1 }" data-target-id="eventpic" />
        </div>

        <button id="eventbutton" class="button text" :style="{
            position: 'absolute',
            top: `${200 + tileCount * tileHeight}px`,
            left: '210px',
            transition: '0.2s',
            background: 'url(/template/news/event_option_entry.png) no-repeat', border: 'none', width: '352px',
            height: '52px', fontFamily: 'OldTypeNr, FZRui', fontSize: '16px', color: '#000000'
        }">
            血色将至。
        </button>

        <div style="
          position: absolute;
          display: flex;
          left: 40px;
          top: 135px;
          justify-content: center;
          align-items: center;
          inline-size: 500px;
        ">
            <p id="eventtitle" class="text" style="
            position: absolute;
            color: #000000;
            text-align: center;
            font-family: OldTypeNr, FZRui;
            font-size: 20px;
          ">内战打响！</p>
        </div>

        <span ref="eventBodyRef" id="eventbody" class="text"
            style="
              font-family: OldTypeNr, FZRui;
              position: absolute;
              left: 60px;
              top: 180px;
              color: #000000;
              inline-size: 460px;
              text-align: left;
              font-size: 15px;
              white-space: pre-line;
            ">多年以来，虽然国内各派系之间的紧张局势一直在加剧，但谁都没有想到，元首尸骨未寒，暴力冲突就爆发了。当然，人人都能看见，政客们躲回了自己的老巢，军队分发了装备并封锁了道路，警察则拿起了他们手头上最强大的武器，用路障封锁了他们的警察局，但谁能想到，将要降临的是一场彻底的内战呢？<br><br>然而，不管人们想没想到，战争就这样发生了。部队在日耳曼尼亚倾注了全部注意力，确保首都处于军方的控制之下，不过在其他地方，追求着德意志祖国无上权柄的觊觎者们已经武装起来，战斗一触即发。施佩尔、海德里希、鲍曼、戈林，没有人知道谁会获得最终胜利，不过这个国家的所有民众都知道，他们未来的日子一片黑暗。<br><br>德国正在崩溃，城市街头陷入无政府状态，饕餮列强们争论着如何行动。英国和日本都在寻找从这场混乱中渔利的最佳时机，伊比利亚与意大利迅速开始军事化，趁着这混乱将自身的彩响力撒播出去。表面上对祖国忠心耿耿的专员辖区们也陷入了争吵，领导人们争论着该支持谁，或者是否是时候乘机开始将自己的领地与故乡拉开距离、划清界线。</span>
    </div>
</template>
<style scoped></style>
