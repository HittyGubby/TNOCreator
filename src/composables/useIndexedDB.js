import { ref } from "vue";

const DB_NAME = "CreativeTFR";
const STORE_NAME = "customPics";
const DB_VERSION = 1; // Increment to create the presets store

export function useIndexedDB() {
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

        // Create customPics store if it doesn't exist
        if (!db.objectStoreNames.contains("customPics")) {
          const picsStore = db.createObjectStore("customPics", {
            keyPath: "id",
            autoIncrement: true,
          });
          picsStore.createIndex("type", "type", { unique: false });
          picsStore.createIndex("filename", "filename", { unique: false });
        }

        // Create presets store if it doesn't exist
        if (!db.objectStoreNames.contains("presets")) {
          const presetsStore = db.createObjectStore("presets", {
            keyPath: "id",
            autoIncrement: true,
          });
          presetsStore.createIndex("name", "name", { unique: false });
        }
      };
    });
  };

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
