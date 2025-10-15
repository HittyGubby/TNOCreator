import { ref } from "vue";

const DB_NAME = "CreativeTFR";
const STORE_NAME = "autosave";
import { useDB } from "./useDB";

export function useAutosaveDB() {
  const { db, isInitialized, initDB } = useDB();

  const setAutoSave = async (data) => {
    try {
      if (!isInitialized.value) {
        await initDB();
      }
      return new Promise((resolve, reject) => {
        const transaction = db.value.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put({ id: 0, data: data });

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
          console.error("Set autosave error:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Failed to set autosave:", error);
      throw error;
    }
  };

  const getAutoSave = async () => {
    try {
      if (!isInitialized.value) {
        await initDB();
      }
      return new Promise((resolve, reject) => {
        const transaction = db.value.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(0);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => {
          console.error("Get autosave error:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Failed to get autosave:", error);
      throw error;
    }
  };

  const clearAutoSave = async () => {
    try {
      if (!isInitialized.value) {
        await initDB();
      }
      return new Promise((resolve, reject) => {
        const transaction = db.value.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put({ id: 0, data: {} }); // Clear data instead of deleting

        request.onsuccess = () => resolve();
        request.onerror = () => {
          console.error("Clear autosave error:", request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error("Failed to clear autosave:", error);
      throw error;
    }
  };

  return {
    setAutoSave,
    getAutoSave,
    clearAutoSave,
  };
}
