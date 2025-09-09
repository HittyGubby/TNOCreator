import { Edittext } from "./utilities.js";
import { GetData, SetData } from "./utilities.js";

export function saveData() {
  localStorage.setItem("data", JSON.stringify(GetData()));
}

export function initApp() {
  Array.from(document.getElementsByClassName("text")).forEach(
    (element) => {
      element.addEventListener("click", (event) => {
        Edittext(element);
        event.stopPropagation();
      });
    }
  );

  if (localStorage.getItem("data") != null) {
    SetData(JSON.parse(localStorage.getItem("data")));
  }
}
