import { ref } from "vue";

var windows = ref([
  { id: "Description", name: "人物介绍", visible: true },
  { id: "News", name: "新闻窗口", visible: true },
  { id: "Superevent", name: "超事件窗口", visible: true },
]);
var draggable = ref(false);

export function useWindows() {
  return { windows, draggable };
}
