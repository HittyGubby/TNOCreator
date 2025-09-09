<template>
  <div class="editor-container">
    <div class="angle-control">
      <span class="angle-label">饼图角度（DEG）：</span>
      <InputNumber v-model="rotation" :min="0" :max="360" :step="1" @input="updateChartWithRotation"
        class="narrow-number" />
      <span class="angle-label">（0~360度，超过将对360度取余）</span>
    </div>
    <draggable v-model="localData" item-key="sequence" handle=".drag-handle" @end="updateChart">
      <template #item="{ element: item, index }">
        <div class="drag-item">
          <i class="pi pi-bars drag-handle"></i>
          <span class="sequence-number">{{ index + 1 }}</span>
          <div class="color-container">
            <div v-if="!item.editing" :style="{
              backgroundColor: item.backgroundColor,
              width: '20px',
              height: '20px',
              borderRadius: '4px',
            }"></div>
            <input v-else type="color" v-model="item.backgroundColor" @change="onColorChange(index)"
              class="color-picker" />
          </div>
          <div class="label-container">
            <span v-if="!item.editing" class="label-text">{{
              item.label
              }}</span>
            <InputText v-else v-model="item.label" @keyup.enter="saveEdit(index)" />
          </div>
          <div class="data-container">
            <span v-if="!item.editing">{{ item.data }}</span>
            <InputNumber v-else v-model="item.data" @keyup.enter="saveEdit(index)" />
          </div>
          <div class="actions-container">
            <Button v-if="!item.editing" icon="pi pi-pencil" @click="startEdit(index)" severity="help" />
            <template v-else>
              <Button icon="pi pi-check" @click="saveEdit(index)" severity="help" class="p-button-success" />
              <Button icon="pi pi-times" @click="cancelEdit(index)" severity="help" class="p-button-danger" />
            </template>
            <Button icon="pi pi-trash" @click="removeColor(index)" severity="danger" />
          </div>
        </div>
      </template>
    </draggable>
    <Button label="添加颜色" icon="pi pi-plus" @click="addColor" class="add-color-button" />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import draggable from "vuedraggable";
import "primeicons/primeicons.css";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "update:visible"]);

const rotation = ref(0);
const localData = ref([]);
const originalData = ref([]);

watch(
  () => props.modelValue,
  (newData) => {
    if (newData && newData.datasets && newData.datasets.length > 0) {
      localData.value = newData.datasets[0].data.map((value, i) => ({
        sequence: i + 1,
        backgroundColor: newData.datasets[0].backgroundColor[i],
        label: newData.labels[i],
        data: value,
        editing: false,
      }));
      originalData.value = JSON.parse(JSON.stringify(localData.value));
      rotation.value = newData.options?.rotation || 0;
    }
  },
  { immediate: true },
);

const updateChart = () => {
  const updatedData = {
    labels: localData.value.map((item) => item.label),
    datasets: [
      {
        data: localData.value.map((item) => item.data),
        backgroundColor: localData.value.map((item) => item.backgroundColor),
        borderWidth: 0,
        spacing: 0,
      },
    ],
    options: {
      rotation: rotation.value,
    },
  };
  emit("update:modelValue", updatedData);
};

const updateChartWithRotation = (event) => {
  rotation.value = event.value % 360;
  updateChart();
};

const startEdit = (index) => {
  localData.value.forEach((item, i) => {
    item.editing = i === index;
  });
};

const saveEdit = (index) => {
  localData.value[index].editing = false;
  updateChart();
};

const cancelEdit = (index) => {
  const original = originalData.value[index];
  localData.value[index] = {
    ...original,
    editing: false,
  };
};

const onColorChange = (index) => {
  updateChart();
};

const addColor = () => {
  localData.value.push({
    sequence: localData.value.length + 1,
    backgroundColor: "#000000",
    label: "<意识形态>",
    data: 10,
    editing: false,
  });
  updateChart();
};

const removeColor = (index) => {
  localData.value.splice(index, 1);
  updateChart();
};
</script>

<style scoped>
.editor-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.angle-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.angle-label {
  white-space: nowrap;
  color: var(--text-color);
}

.drag-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  margin-bottom: 0.5rem;
  transition:
    background-color 0.2s,
    border-color 0.2s;
}

.drag-item:hover {
  background: var(--surface-hover);
}

.drag-handle {
  cursor: move;
  color: #666;
  transition: color 0.2s;
  padding: 0.5rem;
}

.drag-handle:hover {
  color: var(--primary-color);
}

.sequence-number {
  min-width: 2rem;
  text-align: center;
  color: var(--text-color-secondary);
}

.color-container {
  display: flex;
  align-items: center;
  width: 20px;
  min-width: 20px;
}

.color-picker {
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.label-container {
  display: flex;
  align-items: center;
  min-width: 120px;
  flex: 1;
  max-width: 300px;
}

.label-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.data-container {
  display: flex;
  align-items: center;
  min-width: 60px;
  width: 80px;
}

.actions-container {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: auto;
}

:deep(.p-button.p-button-text) {
  padding: 0.5rem;
}

:deep(.p-button.p-button-text:enabled:hover) {
  background: rgba(var(--primary-color-rgb), 0.94);
}

:deep(.p-inputtext) {
  width: 100%;
  min-width: 60px;
  max-width: 200px;
}

:deep(.p-inputnumber .p-inputtext) {
  width: 100%;
}

:deep(.p-dialog-content) {
  padding: 1.5rem;
}
</style>
