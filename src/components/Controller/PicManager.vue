<template>
    <Dialog :visible="visible" @update:visible="(value) => $emit('update:visible', value)" :modal="true"
        :style="{ width: '70%', maxWidth: '90%', fontFamily: 'Aldrich, FZRui' }" :header="'图片管理 - ' + type"
        class="pic-manager-dialog" :closable="true">
        <div class="pic-manager-container">
            <div v-if="!type" class="no-type-message">请先点击要修改的图片</div>
            <template v-else>
                <TabView>
                    <TabPanel header="内置图片">
                        <div class="search-container">
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="searchQuery" placeholder="搜索图片...（空格分割关键词）" class="search-input" />
                            </span>
                        </div>
                        <DataTable v-model:selection="selectedVanillaPic" :value="filteredVanillaPics"
                            :scrollable="true" scrollHeight="60vh" class="p-datatable-sm" :rowClass="rowClass"
                            @row-click="onVanillaRowClick" :paginator="true" :rows="10"
                            :rowsPerPageOptions="[10, 20, 50, 100]"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput RowsPerPageDropdown "
                            currentPageReportTemplate="显示 {first} 到 {last} 条，共 {totalRecords} 条">
                            <Column headerStyle="width: 4rem" field="preview" header="预览">
                                <template #body="slotProps">
                                    <img :src="getVanillaPicUrl(slotProps.data)" alt="预览"
                                        style="max-width: 48px; max-height: 48px; object-fit: contain;" />
                                </template>
                            </Column>
                            <Column field="filename" header="文件名"></Column>
                        </DataTable>
                    </TabPanel>
                    <TabPanel header="自定义图片">
                        <div class="search-container">
                            <div class="left-controls">
                                <span class="p-input-icon-left">
                                    <i class="pi pi-search" />
                                    <InputText v-model="searchQuery" placeholder="搜索图片...（空格分割关键词）"
                                        class="search-input" />
                                </span>
                            </div>
                            <div v-if="resizable" class="scale-control">
                                <span class="scale-label">图片缩放：</span>
                                <InputText v-model="scaleInput" class="scale-input" @input="handleScaleChange"
                                    @keyup.enter="handleScaleChange" @blur="handleScaleChange" />
                                <span class="scale-label">倍</span>
                            </div>
                        </div>
                        <div class="table-container">
                            <DataTable v-model:selection="selectedCustomPic" :value="filteredCustomPics"
                                :scrollable="true" scrollHeight="60vh" class="p-datatable-sm" :rowClass="rowClass"
                                @row-click="onCustomRowClick" :reorderableRows="!searchQuery" @rowReorder="onRowReorder"
                                :paginator="true" :rows="10" :rowsPerPageOptions="[10, 20, 50, 100]"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput RowsPerPageDropdown "
                                currentPageReportTemplate="显示 {first} 到 {last} 条，共 {totalRecords} 条">
                                <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                                <Column rowReorder style="width: 3rem" :reorderable="!searchQuery"></Column>
                                <Column headerStyle="width: 4rem" field="preview" header="预览">
                                    <template #body="slotProps">
                                        <img :src="slotProps.data.url" alt="预览"
                                            style="max-width: 48px; max-height: 48px; object-fit: contain;" />
                                    </template>
                                </Column>
                                <Column field="filename" header="文件名"></Column>
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
                            <div class="action-buttons">
                                <Button icon="pi pi-plus" label="添加" @click="showUploadDialog" />
                                <Button icon="pi pi-pencil" label="重命名" @click="showRenameDialog" :disabled="!selectedCustomPic || selectedCustomPic.length !== 1
                                    " />
                                <Button icon="pi pi-trash" label="删除" @click="removePic" :disabled="!selectedCustomPic || selectedCustomPic.length === 0
                                    " severity="danger" />
                            </div>
                        </div>
                        <div v-if="filteredCustomPics.length === 0" class="empty-message">
                            暂无自定义图片
                        </div>
                    </TabPanel>
                </TabView>
            </template>
        </div>
    </Dialog>

    <Dialog v-model:visible="uploadDialogVisible" header="上传图片" :modal="true"
        :style="{ width: '400px', fontFamily: 'Aldrich, FZRui' }">
        <div class="upload-container">
            <FileUpload mode="basic" :auto="true" accept="image/*" :maxFileSize="10000000" @select="onFileSelect"
                :chooseLabel="'选择图片'" multiple="multiple" />
        </div>
    </Dialog>

    <Dialog v-model:visible="renameDialogVisible" header="重命名图片" :modal="true"
        :style="{ width: '400px', fontFamily: 'Aldrich, FZRui' }">
        <div class="rename-container">
            <span class="p-float-label">
                <InputText v-model="newFilename" class="w-full" />
                <label>新文件名</label>
            </span>
        </div>
        <template #footer>
            <Button label="取消" icon="pi pi-times" @click="renameDialogVisible = false" class="p-button-text" />
            <Button label="确定" icon="pi pi-check" @click="renamePic" :disabled="!newFilename" />
        </template>
    </Dialog>
</template>

<script>
import { ref, onMounted, watch, computed } from "vue";
import Dialog from "primevue/dialog";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import FileUpload from "primevue/fileupload";
import { useIndexedDB } from "@/composables/useIndexedDB";
import { formatDate, formatFileSize } from "@/utils/format";

export default {
    name: "PicManager",
    components: {
        Dialog,
        TabView,
        TabPanel,
        DataTable,
        Column,
        InputText,
        Button,
        FileUpload,
    },
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            required: true,
        },
        targetId: {
            type: String,
            required: true,
        },
        resizable: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["update:visible", "update:pic"],
    setup(props, { emit }) {
        const { db, addPic, deletePic, updatePic, getAllPics } = useIndexedDB();
        const searchQuery = ref("");
        const selectedVanillaPic = ref(null);
        const selectedCustomPic = ref(null);
        const uploadDialogVisible = ref(false);
        const renameDialogVisible = ref(false);
        const newFilename = ref("");
        const vanillaPics = ref([]);
        const customPics = ref([]);
        const pictureScale = ref(1);
        const scaleInput = ref("1.0");

        const loadVanillaPics = async () => {
            if (!props.type) return;
            try {
                const response = await fetch("/data/index.json");
                const data = await response.json();
                if (data && data[props.type]) {
                    vanillaPics.value = data[props.type]
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
            if (!props.type) return;
            try {
                const pics = await getAllPics(props.type);
                customPics.value = pics.sort(
                    (a, b) => new Date(b.uploadTime) - new Date(a.uploadTime)
                );
            } catch (error) {
                console.error("Failed to load custom pics:", error);
            }
        };

        const filteredVanillaPics = computed(() => {
            if (!searchQuery.value) return vanillaPics.value;
            const keywords = searchQuery.value.toLowerCase().split(" ");
            return vanillaPics.value.filter((pic) =>
                keywords.every((keyword) =>
                    pic.filename.toLowerCase().includes(keyword)
                )
            );
        });

        const filteredCustomPics = computed(() => {
            if (!searchQuery.value) return customPics.value;
            const keywords = searchQuery.value.toLowerCase().split(" ");
            return customPics.value.filter((pic) =>
                keywords.every((keyword) =>
                    pic.filename.toLowerCase().includes(keyword)
                )
            );
        });

        //event handlers
        const onVanillaRowClick = (event) => {
            emit("update:pic", {
                id: props.targetId,
                url: getVanillaPicUrl(event.data),
                scale: props.resizable ? pictureScale.value : undefined,
            });
            //emit('update:visible', false)
        };

        const onCustomRowClick = (event) => {
            emit("update:pic", {
                id: props.targetId,
                url: event.data.url,
                scale: props.resizable ? pictureScale.value : undefined,
            });
        };

        const showUploadDialog = () => {
            uploadDialogVisible.value = true;
        };

        const showRenameDialog = () => {
            if (selectedCustomPic.value && selectedCustomPic.value.length === 1) {
                newFilename.value = selectedCustomPic.value[0].filename;
                renameDialogVisible.value = true;
            }
        };

        const onFileSelect = async (event) => {
            const files = event.files;
            if (!files || files.length === 0) return;

            try {
                const uploadPromises = Array.from(files).map((file) => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = async (e) => {
                            try {
                                const pic = {
                                    type: props.type,
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
            } catch (error) {
                console.error("Failed to upload files:", error);
            }
            uploadDialogVisible.value = false;
        };

        const renamePic = async () => {
            if (!selectedCustomPic.value || !newFilename.value) return;
            try {
                await updatePic({
                    ...selectedCustomPic.value[0],
                    filename: newFilename.value,
                });
                await loadCustomPics();
            } catch (error) {
                console.error("Failed to rename pic:", error);
            }
            renameDialogVisible.value = false;
        };

        const removePic = async () => {
            if (!selectedCustomPic.value || selectedCustomPic.value.length === 0)
                return;
            try {
                const deletePromises = selectedCustomPic.value.map((pic) =>
                    deletePic(pic.id)
                );
                await Promise.all(deletePromises);
                await loadCustomPics();
                selectedCustomPic.value = null;
            } catch (error) {
                console.error("Failed to delete pics:", error);
            }
        };

        const onRowReorder = async (event) => { customPics.value = event.data };

        const getVanillaPicUrl = (pic) => { return `/data/${props.type}/${pic.filename}.png` };

        const rowClass = (data) => { return { "cursor-pointer": true } };

        const handleScaleChange = (event) => {
            const value = event.target?.value || scaleInput.value;
            if (value === "") {
                scaleInput.value = "";
                return;
            }
            const num = parseFloat(value);
            if (isNaN(num)) { scaleInput.value = pictureScale.value.toFixed(1); return; }
            if (num < 0) {
                pictureScale.value = 0.1;
                scaleInput.value = "0.1";
            } else {
                pictureScale.value = num;
                scaleInput.value = value;
            }

            emit("update:pic", {
                id: props.targetId,
                scale: pictureScale.value,
            });
        };

        watch(
            () => props.visible,
            (newVisible) => {
                if (newVisible && props.resizable) {
                    const element = document.getElementById(props.targetId);
                    if (element) {
                        const scale = element.style.scale || element.style.transform?.match(/scale\(([\d.]+)\)/)?.[1] || 1;
                        pictureScale.value = parseFloat(scale);
                        scaleInput.value = pictureScale.value.toFixed(1);
                    }
                }
            }
        );
        watch(
            () => props.type,
            (newType) => {
                if (newType) {
                    loadVanillaPics();
                    loadCustomPics();
                } else {
                    vanillaPics.value = [];
                    customPics.value = [];
                }
            }
        );

        onMounted(async () => {
            await loadVanillaPics();
            await loadCustomPics();
        });

        return {
            searchQuery,
            selectedVanillaPic,
            selectedCustomPic,
            uploadDialogVisible,
            renameDialogVisible,
            newFilename,
            filteredVanillaPics,
            filteredCustomPics,
            onVanillaRowClick,
            onCustomRowClick,
            showUploadDialog,
            showRenameDialog,
            onFileSelect,
            renamePic,
            removePic,
            onRowReorder,
            getVanillaPicUrl,
            rowClass,
            formatDate,
            formatFileSize,
            scaleInput,
            handleScaleChange,
        };
    },
};
</script>

<style scoped>
.pic-manager-dialog {
    :deep(.p-dialog-content) {
        padding: 1.5rem;
    }
}

.pic-manager-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.search-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
}

.left-controls {
    display: flex;
    flex: 1;
}

.scale-control {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
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

.upload-container,
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

    .p-paginator .p-paginator-pages .p-paginator-page {
        min-width: 2.5rem;
        height: 2.5rem;
    }

    .p-paginator .p-dropdown {
        margin-left: 0.5rem;
    }
}

:deep(.p-tabview) {
    .p-tabview-nav {
        background: var(--surface-section);
        border: 1px solid var(--surface-border);
        border-radius: 6px 6px 0 0;
    }

    .p-tabview-panels {
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-top: none;
        border-radius: 0 0 6px 6px;
        padding: 1.5rem;
    }
}

:deep(.p-button) {
    &.p-button-text {
        padding: 0.5rem;
    }
}

.empty-message {
    text-align: center;
    padding: 2rem;
    color: var(--text-color-secondary);
    font-style: italic;
}

.no-type-message {
    text-align: center;
    padding: 2rem;
    color: var(--text-color-secondary);
    font-style: italic;
}

.scale-input {
    width: 80px;
    text-align: right;
}

:deep(.p-inputtext) {
    &.scale-input {
        text-align: right;
    }
}
</style>
