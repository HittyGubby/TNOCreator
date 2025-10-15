import { ref } from "vue";

const DB_NAME = "CreativeTFR";
const STORE_NAME = "presets";
import { useDB } from "./useDB";

export function usePresetDB() {
  const { db, isInitialized, initDB } = useDB();

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
