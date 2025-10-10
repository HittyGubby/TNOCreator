<template>
    <Dialog v-model:visible="dialogVisible" :style="{ width: '90%', fontFamily: 'Aldrich, FZRui', opacity: 0.9 }"
        header="国家精神管理" class="spirit-manager-dialog" @hide="handleClose" @show="handleShow">
        <div class="spirit-manager-container">
            <div class="spirit-list-container">
                <DataTable :value="spirits" :scrollable="true" scrollHeight="flex" class="p-datatable-sm"
                    @rowReorder="onRowReorder" :reorderableRows="true" rowHover>
                    <Column rowReorder style="width: 3rem"></Column>
                    <Column header="预览" headerStyle="width: 5rem">
                        <template #body="slotProps">
                            <img :src="slotProps.data.url" :alt="slotProps.data.filename" class="spirit-preview" />
                        </template>
                    </Column>
                    <Column field="filename" header="文件名" :style="{ maxWidth: '30px', overflow: 'hidden' }">
                        <template #body="slotProps">
                            <span :title="slotProps.data.filename">{{ slotProps.data.filename }}</span>
                        </template>
                    </Column>
                    <Column field="scale" header="缩放" headerStyle="width: 6rem">
                        <template #body="slotProps">
                            <InputText v-model.number="slotProps.data.scale" class="scale-input"
                                @update:modelValue="updateSpiritScale(slotProps.data, slotProps.data.scale)"
                                size="small" />
                        </template>
                    </Column>
                    <Column header="操作" headerStyle="width: 5rem">
                        <template #body="slotProps">
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text"
                                @click="removeSpirit(slotProps.index)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
            <div class="add-spirit-container">
                <TabView>
                    <TabPanel header="内置图片">
                        <div class="search-container">
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="searchQuery" placeholder="搜索图片...（空格分割关键词）" class="search-input"
                                    size="small" />
                            </span>
                        </div>
                        <div class="table-wrapper">
                            <DataTable :value="filteredVanillaPics" :scrollable="true" scrollHeight="flex"
                                class="p-datatable-sm compact-table" @row-click="onVanillaRowClick" :paginator="true"
                                :rows="10" :rowsPerPageOptions="[10, 20, 50, 100]"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput RowsPerPageDropdown "
                                currentPageReportTemplate="显示 {first} 到 {last} 条，共 {totalRecords} 条" size="small"
                                rowHover>
                                <Column headerStyle="width: 4rem" field="preview" header="预览">
                                    <template #body="slotProps">
                                        <img :src="getVanillaPicUrl(slotProps.data)" alt="预览"
                                            style="max-width: 32px; max-height: 32px; object-fit: contain;" />
                                    </template>
                                </Column>
                                <Column field="filename" header="文件名">
                                    <template #body="slotProps">
                                        <span :title="slotProps.data.filename">{{ slotProps.data.filename }}</span>
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </TabPanel>
                    <TabPanel header="自定义图片">
                        <div class="search-container">
                            <div class="left-controls">
                                <span class="p-input-icon-left">
                                    <i class="pi pi-search" />
                                    <InputText v-model="searchQuery" placeholder="搜索图片...（空格分割关键词）" class="search-input"
                                        size="small" />
                                </span>
                            </div>
                        </div>
                        <div class="table-container">
                            <div class="table-wrapper">
                                <DataTable v-model:selection="selectedCustomPic" :value="filteredCustomPics"
                                    :scrollable="true" scrollHeight="flex" class="p-datatable-sm compact-table"
                                    @row-click="onCustomRowClick" :paginator="true" :rows="10"
                                    :rowsPerPageOptions="[10, 20, 50, 100]"
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput RowsPerPageDropdown "
                                    currentPageReportTemplate="显示 {first} 到 {last} 条，共 {totalRecords} 条" size="small"
                                    rowHover>
                                    <Column selectionMode="multiple" headerStyle="width: 2rem"></Column>
                                    <Column headerStyle="width: 4rem" field="preview" header="预览">
                                        <template #body="slotProps">
                                            <img :src="slotProps.data.url" alt="预览"
                                                style="max-width: 32px; max-height: 32px; object-fit: contain;" />
                                        </template>
                                    </Column>
                                    <Column field="filename" header="文件名">
                                        <template #body="slotProps">
                                            <span :title="slotProps.data.filename">{{ slotProps.data.filename }}</span>
                                        </template>
                                    </Column>
                                    <Column field="uploadTime" header="上传时间">
                                        <template #body="slotProps">
                                            {{ formatDate(slotProps.data.uploadTime) }}
                                        </template>
                                    </Column>
                                    <Column field="size" header="大小">
                                        <template #body="slotProps">
                                            {{ formatFileSize(slotProps.data.size) }}
                                        </template>
                                    </Column>
                                </DataTable>
                            </div>
                            <div class="action-buttons">
                                <FileUpload mode="basic" :auto="true" accept="image/*" @select="onFileSelect"
                                    :chooseLabel="'上传图片'" multiple="multiple" />
                                <Button icon="pi pi-pencil" label="重命名" @click="showRenameDialog" :disabled="!selectedCustomPic || selectedCustomPic.length !== 1
                                    " size="small" />
                                <Button icon="pi pi-trash" label="删除" @click="removePic" :disabled="!selectedCustomPic || selectedCustomPic.length === 0
                                    " severity="danger" size="small" />
                            </div>
                        </div>
                        <div v-if="filteredCustomPics.length === 0" class="empty-message">
                            暂无自定义图片
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </div>
    </Dialog>
    <Dialog v-model:visible="renameDialogVisible" header="重命名图片" :modal="true"
        :style="{ width: '400px', fontFamily: 'Aldrich, FZRui' }">
        <div class="rename-container">
            <span class="p-float-label">
                <InputText v-model="newFilename" class="w-full" size="small" />
            </span>
        </div>
        <template #footer>
            <Button label="取消" icon="pi pi-times" @click="renameDialogVisible = false" class="p-button-text"
                size="small" />
            <Button label="确定" icon="pi pi-check" @click="renamePic" :disabled="!newFilename" size="small" />
        </template>
    </Dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import InputText from 'primevue/inputtext';
import FileUpload from 'primevue/fileupload';
import { useIndexedDB } from '@/composables/useIndexedDB';
import { formatDate, formatFileSize } from "@/utils/format";
import { saveData } from '@/utils/onload';
import { Howl } from 'howler';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    spirits: {
        type: Array,
        default: () => [],
    }
});

const emit = defineEmits(['update:visible', 'update:spirits']);

const { addPic, deletePic, updatePic, getAllPics } = useIndexedDB();

const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value),
});

const spirits = computed({
    get: () => props.spirits,
    set: (value) => emit('update:spirits', value),
});

// Initialize scale for existing spirits
onMounted(() => {
    spirits.value.forEach(spirit => {
        if (spirit.scale === undefined) {
            spirit.scale = 1.0;
        }
    });
});

const searchQuery = ref('');
const vanillaPics = ref([]);
const customPics = ref([]);
const selectedCustomPic = ref(null);
const renameDialogVisible = ref(false);
const newFilename = ref("");

const filteredVanillaPics = computed(() => {
    if (!searchQuery.value) return vanillaPics.value;
    const keywords = searchQuery.value.toLowerCase().split(' ');
    return vanillaPics.value.filter((pic) =>
        keywords.every((keyword) => pic.filename.toLowerCase().includes(keyword))
    );
});

const filteredCustomPics = computed(() => {
    if (!searchQuery.value) return customPics.value;
    const keywords = searchQuery.value.toLowerCase().split(' ');
    return customPics.value.filter((pic) =>
        keywords.every((keyword) => pic.filename.toLowerCase().includes(keyword))
    );
});

const loadVanillaPics = async () => {
    try {
        const response = await fetch('/data/index.json');
        const data = await response.json();
        if (data && data.spirit) {
            vanillaPics.value = data.spirit
                .map((filename) => ({ filename }))
                .sort((a, b) => a.filename.localeCompare(b.filename));
        } else {
            vanillaPics.value = [];
        }
    } catch (error) {
        vanillaPics.value = [];
    }
};

const loadCustomPics = async () => {
    const pics = await getAllPics('spirit');
    customPics.value = pics.sort(
        (a, b) => new Date(b.uploadTime) - new Date(a.uploadTime)
    );
};

const getVanillaPicUrl = (pic) => {
    return `/data/spirit/${pic.filename}`;
};

const onVanillaRowClick = (event) => {
    const newSpirit = {
        id: spirits.value.length + 1,
        url: getVanillaPicUrl(event.data),
        filename: event.data.filename,
        scale: 1.0,
    };
    spirits.value.push(newSpirit);
    new Howl({
        src: ["/sfx/click_default.wav"],
        volume: 1,
    }).play();
};

const onCustomRowClick = (event) => {
    const newSpirit = {
        id: spirits.value.length + 1,
        url: event.data.url,
        filename: event.data.filename,
        scale: 1.0,
    };
    spirits.value.push(newSpirit);
    new Howl({
        src: ["/sfx/click_default.wav"],
        volume: 1,
    }).play();
};

const removeSpirit = (index) => {
    spirits.value.splice(index, 1);
};

const updateSpiritScale = (spirit, scale) => {
    if (spirit && scale !== undefined) {
        spirit.scale = scale;
        emit('update:spirits', [...spirits.value]);
    }
};

const onRowReorder = (event) => {
    spirits.value = event.value;
    emit('update:spirits', [...event.value]);
};


const onFileSelect = async (event) => {
    const files = event.files;
    if (!files || files.length === 0) return;

    const uploadPromises = Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const pic = {
                        type: 'spirit',
                        filename: file.name,
                        url: e.target.result,
                        uploadTime: new Date(),
                        size: file.size,
                    };
                    await addPic(pic);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(file);
        });
    });
    await Promise.all(uploadPromises);
    await loadCustomPics();
};

const showRenameDialog = () => {
    if (selectedCustomPic.value && selectedCustomPic.value.length === 1) {
        newFilename.value = selectedCustomPic.value[0].filename;
        renameDialogVisible.value = true;
    }
};

const renamePic = async () => {
    if (!selectedCustomPic.value || !newFilename.value) return;
    await updatePic({
        ...selectedCustomPic.value[0],
        filename: newFilename.value,
    });
    await loadCustomPics();
    renameDialogVisible.value = false;
};

const removePic = async () => {
    if (!selectedCustomPic.value || selectedCustomPic.value.length === 0) return;
    const deletePromises = selectedCustomPic.value.map((pic) =>
        deletePic(pic.id),
    );
    await Promise.all(deletePromises);
    await loadCustomPics();
    selectedCustomPic.value = null;
};

const handleClose = () => {
    new Howl({
        src: ["/sfx/click_window_close.wav"],
        volume: 1,
    }).play();
    saveData();
};

const handleShow = () => {
    new Howl({
        src: ["/sfx/click_window_open.wav"],
        volume: 1,
    }).play();
};

watch(() => props.visible, (newVal) => {
    if (newVal) {
        loadVanillaPics();
        loadCustomPics();
    }
});

onMounted(() => {
    loadVanillaPics();
    loadCustomPics();
})

</script>

<style scoped>
.spirit-manager-container {
    display: grid;
    grid-template-columns: 35% 65%;
    gap: 1rem;
    height: 70vh;
}

.spirit-list-container,
.add-spirit-container {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.spirit-list-container {
    overflow-y: auto;
}

.add-spirit-container {
    gap: 1rem;
}

.spirit-preview {
    max-width: 48px;
    max-height: 48px;
    object-fit: contain;
}

.search-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
}

.table-container {
    display: flex;
    gap: 1rem;
    flex: 1;
    min-height: 0;
}

.table-wrapper {
    flex: 1;
    min-height: 0;
    overflow: auto;
}

.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: fit-content;
}

.empty-message {
    text-align: center;
    color: var(--text-color-secondary);
    font-style: italic;
}

:deep(.p-datatable) {
    flex: 1;
    min-width: 0;
}

.compact-table :deep(.p-datatable-tbody>tr>td) {
    padding: 0.25rem 0.5rem;
}

.compact-table :deep(.p-datatable-thead>tr>th) {
    padding: 0.25rem 0.5rem;
}

.scale-input {
    width: 60px;
}

:deep(.p-datatable) {
    flex: 1;
    min-width: 0;

    .p-datatable-thead>tr>th {
        background: var(--surface-section);
        color: var(--text-color);
        font-weight: 600;
    }

    .p-datatable-tbody>tr {
        &:hover {
            background: var(--surface-hover);
        }
    }

    .p-paginator {
        background: var(--surface-section);
        border: 1px solid var(--surface-border);
        border-radius: 0 0 6px 6px;
    }

    .p-paginator .p-paginator-pages .p-paginator-page {
        min-width: 2.5rem;
        height: 2.5rem;
    }

    .p-paginator .p-dropdown {
        margin-left: 0.5rem;
    }
}
</style>