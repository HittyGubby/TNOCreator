import { ref } from "vue";

const DB_NAME = "CreativeTFR";
const STORE_NAME = "presets";
const DB_VERSION = 1; // Same version as useIndexedDB.js
export function usePresetDB() {
  const db = ref(null);
  const isInitialized = ref(false);

  const initDB = () => {
    return new Promise((resolve, reject) => {
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

        // Create presets store if it doesn't exist
        if (!db.objectStoreNames.contains("presets")) {
          const presetsStore = db.createObjectStore("presets", {
            keyPath: "id",
            autoIncrement: true,
          });
          presetsStore.createIndex("name", "name", { unique: false });
        }

        // Create customPics store if it doesn't exist
        if (!db.objectStoreNames.contains("customPics")) {
          const picsStore = db.createObjectStore("customPics", {
            keyPath: "id",
            autoIncrement: true,
          });
          picsStore.createIndex("type", "type", { unique: false });
          picsStore.createIndex("filename", "filename", { unique: false });
        }
      };
    });
  };

  const addPreset = async (preset) => {
    try {
      if (!isInitialized.value) {
        await initDB();
      }
      return new Promise((resolve, reject) => {
        const transaction = db.value.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(preset);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
          console.error("Add preset error:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Failed to add preset:", error);
      throw error;
    }
  };

  const deletePreset = async (id) => {
    try {
      if (!isInitialized.value) {
        await initDB();
      }
      return new Promise((resolve, reject) => {
        const transaction = db.value.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => {
          console.error("Delete preset error:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Failed to delete preset:", error);
      throw error;
    }
  };

  const updatePreset = async (preset) => {
    try {
      if (!isInitialized.value) {
        await initDB();
      }
      return new Promise((resolve, reject) => {
        const transaction = db.value.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(preset);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
          console.error("Update preset error:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Failed to update preset:", error);
      throw error;
    }
  };

  const getAllPresets = async () => {
    try {
      if (!isInitialized.value) {
        await initDB();
      }
      return new Promise((resolve, reject) => {
        const transaction = db.value.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
          console.error("Get all presets error:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Failed to get all presets:", error);
      throw error;
    }
  };

  return {
    db,
    addPreset,
    deletePreset,
    updatePreset,
    getAllPresets,
  };
}
