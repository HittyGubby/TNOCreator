<template>

  <div class="control-panel-container">

    <div class="right-panel">
      <div class="window-controls">
        <h3>窗口控制</h3>
        <div class="windowtoggle">
          <div v-for="window in windows" :key="window.id" class="toggle-item">
            <span>{{ window.name }}</span>
            <ToggleSwitch v-model="window.visible" @click="toggleWindowVisibility(window)" />
          </div>
        </div>
        <div class="toggle-item">
          <span>窗口是否可拖拽</span>
          <ToggleSwitch v-model="draggable" />
        </div>
        <div class="toggle-item">
          <span>背景色：</span>
          <InputText type="color" v-model="backgroundColor" @input="updateBackground"
            style="height: 40px; width: 100px;" />
        </div>
        <div class="toggle-item">
          <Button label="截图" @click="capture" />
          <Button label="清除缓存" @click="clearSessionStorage" severity="danger" />
        </div>
      </div>
      <!--
      <div class="priority-management">
        <h3>窗口优先级管理</h3>
        <DataTable :value="windows" :scrollable="true" scrollHeight="150px" class="p-datatable-sm">
          <Column field="name" header="窗口名称"></Column>
          <Column header="操作">
            <template #body="slotProps">
              <Button label="提升优先级" @click="increaseZIndex(slotProps.data.id)" />
            </template>
</Column>
</DataTable>
</div>-->
    </div>
    <div class="left-panel">
      <div class="preset-management">
        <h3>预设管理</h3>
        <div class="search-container">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="searchQuery" placeholder="搜索预设..." class="search-input" />
          </span>
        </div>
        <div class="table-container">
          <DataTable v-model:selection="selectedPresets" :value="filteredPresets" :scrollable="true"
            scrollHeight="300px" class="p-datatable-sm" :rowClass="rowClass" @row-click="onPresetRowClick"
            :reorderableRows="!searchQuery" @rowReorder="onRowReorder" :paginator="true" :rows="5"
            :rowsPerPageOptions="[5, 10, 20]">
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column rowReorder style="width: 3rem" :reorderable="!searchQuery"></Column>
            <Column field="name" header="预设名称"></Column>
            <Column field="saveTime" header="保存时间">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.saveTime) }}
              </template>
            </Column>
          </DataTable>
          <div class="action-buttons">
            <Button icon="pi pi-plus" label="保存" @click="savePreset" />
            <Button icon="pi pi-pencil" label="重命名" @click="showRenameDialog"
              :disabled="!selectedPresets || selectedPresets.length !== 1" />
            <Button icon="pi pi-trash" label="删除" @click="deletePresetv"
              :disabled="!selectedPresets || selectedPresets.length === 0" severity="danger" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <Dialog v-model:visible="renameDialogVisible" header="重命名预设" :modal="true"
    :style="{ width: '400px', fontFamily: 'Aldrich, FZRui' }">
    <div class="rename-container">
      <span class="p-float-label">
        <InputText v-model="newPresetName" class="w-full" />
        <label>新预设名称</label>
      </span>
    </div>
    <template #footer>
      <Button label="取消" icon="pi pi-times" @click="renameDialogVisible = false" class="p-button-text" />
      <Button label="确定" icon="pi pi-check" @click="renamePreset" :disabled="!newPresetName" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import ToggleSwitch from 'primevue/toggleswitch';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useWindows } from '@/composables/useWindows';
import { usePresetDB } from '@/composables/usePresetDB';
import { formatDate } from '@/utils/format';
import { GetData, SetData } from '@/components/index.vue';

const { windows, draggable } = useWindows();
const { getAllPresets, addPreset, deletePreset, updatePreset } = usePresetDB();

const backgroundColor = ref('#0b0012');
const searchQuery = ref('');
const presets = ref([]);
const selectedPresets = ref(null);
const renameDialogVisible = ref(false);
const newPresetName = ref('');
let zIndexCounter = 1000;

const updateBackground = () => {
  document.body.style.backgroundColor = backgroundColor.value;
};

const toggleWindowVisibility = (window) => {
  window.visible = !window.visible;
  const element = document.getElementById(window.id);
  element.style.display = window.visible ? '' : 'none';
};

const clearSessionStorage = () => {
  if (window.confirm('是否清除缓存？')) {
    sessionStorage.clear();
    alert('缓存已清除');
    location.reload();
  }
};

async function capture() {
  try {
    document.getElementById('control-panel').style.display = 'none';
    setTimeout(async function () {
      alert('只能截取当前窗口的内容，请点击“确定”后选择要截取的窗口。\n手机端大概率无法使用此功能。');
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const track = stream.getVideoTracks()[0];
      const bitmap = await new ImageCapture(track).grabFrame();
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      canvas.getContext('2d').drawImage(bitmap, 0, 0);
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${new Date().toLocaleString("zh-CN")}.png`;
        a.click();
        URL.revokeObjectURL(url);
        track.stop();
        document.getElementById('control-panel').style.display = '';
      }, 'image/png');
    }, 500);
  } catch (err) {
    console.log(err);
    document.getElementById('control-panel').style.display = '';
  }
}

const filteredPresets = computed(() => {
  if (!searchQuery.value) return presets.value;
  const keywords = searchQuery.value.toLowerCase().split(' ');
  return presets.value.filter(preset =>
    keywords.every(keyword => preset.name.toLowerCase().includes(keyword))
  );
});

const savePreset = async () => {
  const presetName = prompt('请输入预设名称:');
  if (!presetName) return;

  const presetData = {
    name: presetName,
    data: GetData(),
    saveTime: new Date()
  };
  const id = await addPreset(presetData);
  presets.value.push({ id, ...presetData });
};

const loadPreset = async (presetId) => {
  const preset = presets.value.find(p => p.id === presetId);
  if (preset) {
    SetData(preset.data);
    alert('注意：预设功能尚施工中，现只能加载文字');
  }
};

const onPresetRowClick = (event) => {
  loadPreset(event.data.id);
};

const renamePreset = async () => {
  if (!selectedPresets.value || !newPresetName.value) return;
  const preset = selectedPresets.value[0];
  preset.name = newPresetName.value;
  await updatePreset(preset);
  presets.value = presets.value.map(p =>
    p.id === preset.id ? { ...p, name: newPresetName.value } : p
  );
  renameDialogVisible.value = false;
  newPresetName.value = '';
};

const deletePresetv = async () => {
  if (!selectedPresets.value || selectedPresets.value.length === 0) return;
  for (const preset of selectedPresets.value) {
    await deletePreset(preset.id);
  }
  presets.value = presets.value.filter(p => !selectedPresets.value.some(sp => sp.id === p.id));
  selectedPresets.value = null;
};

const increaseZIndex = (windowId) => {
  const element = document.getElementById(windowId);
  if (element) {
    zIndexCounter++;
    element.style.zIndex = zIndexCounter;
  }
};

const showRenameDialog = () => {
  if (selectedPresets.value && selectedPresets.value.length === 1) {
    newPresetName.value = selectedPresets.value[0].name;
    renameDialogVisible.value = true;
  }
};

onMounted(async () => {
  presets.value = await getAllPresets();
});
</script>

<style scoped>
.control-panel-dialog {
  :deep(.p-dialog-content) {
    padding: 1.5rem;
  }
}

.control-panel-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.left-panel,
.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preset-management,
.window-controls,
.priority-management {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-container {
  margin-bottom: 1rem;
}

.table-container {
  display: flex;
  gap: 1rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: fit-content;
}

.rename-container {
  padding: 1rem 0;
}

:deep(.p-datatable) {
  flex: 1;
  min-width: 0;

  .p-datatable-thead>tr>th {
    background: var(--surface-section);
    color: var(--text-color);
    font-weight: 600;
    padding: 0.75rem;
  }

  .p-datatable-tbody>tr {
    &:hover {
      background: var(--surface-hover);
    }
  }

  .p-datatable-tbody>tr>td {
    padding: 0.75rem;
  }

  .p-paginator {
    background: var(--surface-section);
    border: 1px solid var(--surface-border);
    border-radius: 0 0 6px 6px;
    padding: 0.5rem;
  }
}

:deep(.p-button) {
  &.p-button-text {
    padding: 0.5rem;
  }
}

.toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.windowtoggle {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--text-color);
}
</style>