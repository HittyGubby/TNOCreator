import { ref } from "vue";

const DB_NAME = "CreativeTFR";
const DB_VERSION = 2;

const db = ref(null);
const isInitialized = ref(false);

export function useDB() {
  const initDB = () => {
    return new Promise((resolve, reject) => {
      if (isInitialized.value) {
        resolve(db.value);
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error("Database error:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        db.value = request.result;
        isInitialized.value = true;
        resolve(db.value);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains("presets")) {
          const presetsStore = db.createObjectStore("presets", {
            keyPath: "id",
            autoIncrement: true,
          });
          presetsStore.createIndex("name", "name", { unique: false });
        }

        if (!db.objectStoreNames.contains("customPics")) {
          const picsStore = db.createObjectStore("customPics", {
            keyPath: "id",
            autoIncrement: true,
          });
          picsStore.createIndex("type", "type", { unique: false });
          picsStore.createIndex("filename", "filename", { unique: false });
        }

        if (!db.objectStoreNames.contains("autosave")) {
          const autoSaveStore = db.createObjectStore("autosave", {
            keyPath: "id",
          });
          autoSaveStore.transaction.oncomplete = () => {
            const autoSaveObjectStore = db.transaction("autosave", "readwrite").objectStore("autosave");
            autoSaveObjectStore.add({ id: 0, data: {} });
          };
        }
      };
    });
  };

  return {
    db,
    isInitialized,
    initDB,
  };
}
