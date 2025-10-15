import { ref } from "vue";

const DB_NAME = "CreativeTFR";
const STORE_NAME = "customPics";
import { useDB } from "./useDB";

export function useIndexedDB() {
  const { db, isInitialized, initDB } = useDB();

  const addPic = async (pic) => {
    await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.value.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(pic);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const deletePic = async (id) => {
    await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.value.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const updatePic = async (pic) => {
    await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.value.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(pic);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const getAllPics = async (type) => {
    await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.value.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index("type");
      const request = index.getAll(type);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  return {
    db,
    addPic,
    deletePic,
    updatePic,
    getAllPics,
  };
}
