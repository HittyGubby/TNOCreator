import { reactive } from 'vue';

export const mousePosition = reactive({
  down: { x: 0, y: 0 },
  up: { x: 0, y: 0 },
});
