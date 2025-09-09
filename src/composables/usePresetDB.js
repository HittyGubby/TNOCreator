import { ref } from "vue";

const DB_NAME = "CreativeTFR";
const STORE_NAME = "presets";
const DB_VERSION = 1;

export function usePresetDB() {
  const db = ref(null);
  const isInitialized = ref(false);

  const initDB = () => {
    return new Promise((resolve, reject) => {
      if (isInitialized.value) {
        resolve(db.value);
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        db.value = request.result;
        isInitialized.value = true;
        resolve(db.value);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("name", "name", { unique: false });
        }
      };
    });
  };

  const addPreset = async (preset) => {
    await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.value.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(preset);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const deletePreset = async (id) => {
    await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.value.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const updatePreset = async (preset) => {
    await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.value.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(preset);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const getAllPresets = async () => {
    await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.value.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  return {
    db,
    addPreset,
    deletePreset,
    updatePreset,
    getAllPresets,
  };
}
