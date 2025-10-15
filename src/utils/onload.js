import { Edittext } from "./utilities.js";
import { GetData, SetData } from "./utilities.js";
import { useAutosaveDB } from "@/composables/useAutosaveDB.js";

const { getAutoSave, setAutoSave } = useAutosaveDB();

export function saveData() {
  setAutoSave(GetData());
}

export async function initApp() {
  Array.from(document.getElementsByClassName("text")).forEach(
    (element) => {
      element.addEventListener("click", (event) => {
        Edittext(element);
        event.stopPropagation();
      });
    }
  );

  const savedData = await getAutoSave();
  if (savedData) {
    SetData(savedData.data);
  }

  if (localStorage.getItem("data") != null) {
    SetData(JSON.parse(localStorage.getItem("data")));
    localStorage.removeItem("data");
  }
}
