import { reactive, watch } from 'vue';
import { saveData } from "@/utils/onload.js";

export const state = reactive({
  chartData: {
    labels: [
      "秘传纳粹主义",
      "极端民族主义",
      "国家社会主义",
      "法西斯主义",
      "专制主义",
      "家长制民主",
      "保守主义",
      "自由保守主义",
      "自由主义",
      "进步主义",
      "社会主义",
      "共产主义",
    ],
    datasets: [
      {
        data: [0, 5.6, 30.6, 41.7, 11.1, 8.3, 2.1, 0, 0, 2, 1.4, 0],
        backgroundColor: [
          "#341950",
          "#232323",
          "#503200",
          "#843200",
          "#4b4b4b",
          "#828282",
          "#000087",
          "#273195",
          "#4e61a3",
          "#a91b4f",
          "#9b0000",
          "#6e0000",
        ],
        borderWidth: 0,
        spacing: 0,
      },
    ],
    options: {
      rotation: 90,
    },
  },
  windows: {
    main: {
      name: "主窗口",
      x: 0,
      y: 0,
      w: 1,
      h: 1,
      zIndex: 1,
      visible: true,
      active: false,
    },
    description: {
      name: "人物介绍",
      x: 6,
      y: 250,
      w: 320,
      h: 400,
      zIndex: 1,
      visible: true,
      active: false,
    },
    news: {
      name: "新闻",
      x: 900,
      y: 150,
      w: 1,
      h: 1,
      zIndex: 1,
      visible: true,
      active: false,
    },
    superevent: {
      name: "超事件",
      x: 330,
      y: 240,
      w: 1,
      h: 1,
      zIndex: 1,
      visible: true,
      active: false,
    },
    economy: {
      name: "经济",
      x: 525,
      y: 5,
      w: 1,
      h: 1,
      zIndex: 1,
      visible: true,
      active: false,
    },
    event: {
      name: "事件",
      x: 1410,
      y: 0,
      w: 1,
      h: 1,
      zIndex: 1,
      visible: true,
      active: false,
    },
  }
});

watch(state, () => {
  saveData();
}, { deep: true });
