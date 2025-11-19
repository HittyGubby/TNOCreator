<script setup>
import { onMounted, nextTick } from "vue";
let zIndexCounter = 10;
const prioritizeWindow = (event) => {
  const target = event.target.closest(".draggable");
  if (target) {
    zIndexCounter++;
    target.style.zIndex = zIndexCounter;
  }
};

const adjustContainerSize = async () => {
  await nextTick(); // Wait for DOM updates to complete
  const container = document.getElementById("descwindow");
  const content = document.getElementById("desc");

  if (container && content) {
    // Get the content dimensions
    const contentRect = content.getBoundingClientRect();

    container.style.width = contentRect.width + 2 + "px"; // Add padding (7px each side)
    container.style.height = contentRect.height + 2 + "px"; // Add padding (7px each side)
  }
};

onMounted(async () => {
  const windowElement = document.getElementById("descwindow");
  windowElement.addEventListener("mousedown", prioritizeWindow);
  await nextTick();
  setTimeout(adjustContainerSize, 0);
});

onMounted(() => {
  const content = document.getElementById("desc");
  if (content) {
    const observer = new MutationObserver(() => {
      setTimeout(adjustContainerSize, 50);
    });
    observer.observe(content, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }
});

</script>
<template>
  <div class="draggable resizable" id="descwindow"
    style="position: absolute; z-index: 4; display: inline-block; background-color: #000c13; border: 1px solid; border-color: #7caaaa;">
    <span id="desc" class="text" style="
    position: absolute;
      font-family: Aldrich, FZRui;
      font-size: 13px;
      line-height: 16px;
      background-color: #000c13;
      width: 315px;
      padding: 7px;
      min-height: min-content;
      color: #c2ac89;
      white-space: pre-line;">
      <span style="color: #cccc00">国会紧急委员会</span>
      <br />
      -----------
      <br />
      元首已不幸病故，举国震惊。毕竟，谁能想到这位不可战胜之人会这样死去呢？
      但国会对此早有准备。
      <br />
      <br />
      尽管元首早已点出他的继承者，但政府内部依然各执一词。改革派、保守派、强硬派、狂热派互相撕咬，和平有序进行权力交接的幌子顷刻间烟消云散。斗争的结果是，一群中间派、无名官僚和不受其他派系欢迎的国会议员们联合起来，遵循着三十年来为众人所忽视的宪法，宣布成立过渡行政机关，直至新任元首宣誓就职。
      <br />
      <br />
      元首之位的主要竞争者都对紧急委员会漠不关心，对他们而言，委员会充其量只是群坐冷板凳的家伙；若以冷眼观之，那么他们就是桀骜不驯的叛徒。唯一值得欣慰的是，他们的存在给日耳曼尼亚带来了一丝脆弱的稳定，防止这座城市陷入混乱，如此便可能会有一位更有能力的领导人出来重掌大局，希望如此。他们或许可以保住罗马不在烈火中化为废墟，却无法阻止帝国的其他部分被烈焰所吞噬。
    </span>
  </div>
</template>