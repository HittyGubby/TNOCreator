import { saveData } from "./onload.js";
import { state } from "./state.js";
import _ from 'lodash';
import { Howl } from "howler";

export function Edittext(el) {
  if (el.dataset.editing) return;
  new Howl({
    src: ["/sfx/click_province_01.wav"],
    volume: 1,
  }).play();
  el.dataset.editing = "true";
  const rawHTML = el.innerHTML;
  const editable = el.cloneNode(true);
  editable.textContent = el.innerHTML;
  editable.setAttribute("contenteditable", true);
  el.style.display = "none";
  el.parentNode.insertBefore(editable, el);
  editable.focus();
  editable.addEventListener("input", () => {
    if (editable.textContent.trim()) {
      el.innerHTML = editable.textContent;
      // el.innerHTML = el.innerHTML.replace('[[country]]', `<span style='color:yellow'>${document.getElementById('country').textContent}</span>`)
      //   .replace('[[leader]]', `<span style='color:yellow'>${document.getElementById('leader').textContent}</span>`)
      //   .replace('[[flag]]', `<img src='${document.getElementById('flagpic').src}' style='height: 10px'/>`);
    }
  });
  editable.addEventListener("blur", () => {
    if (!editable.innerHTML.trim()) {
      el.innerHTML = editable.innerHTML = rawHTML;
    }
    el.style.display = "";
    delete el.dataset.editing;
    editable.remove();
    new Howl({
      src: ["/sfx/click_ok.wav"],
      volume: 1,
    }).play();
    saveData();
  });
  editable.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      editable.blur();
    }
  });
}

export function GetData() {
  const data = {
    textElements: [],
    imageElements: [],
    pieChartData: JSON.parse(JSON.stringify(state.chartData)),
    windows: JSON.parse(JSON.stringify(state.windows)),
    spiritPictures: JSON.parse(JSON.stringify(state.spiritPictures)), //idb does not recognize vue reactive ref, so stringify and parse to turn to normal object
  };

  document.querySelectorAll(":root .text").forEach((element) => {
    data.textElements.push({
      id: element.id,
      text: element.innerHTML,
    });
  });

  document.querySelectorAll(":root .pic").forEach((element) => {
    data.imageElements.push({
      id: element.id,
      src: element.src,
      scale: element.style.scale,
    });
  });

  return data;
}

export function SetData(data) {
  if (data.textElements) {
    data.textElements.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        element.innerHTML = item.text;
      }
    });
  }

  if (data.imageElements) {
    data.imageElements.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        element.src = item.src;
        element.style.scale = item.scale || 1;
      }
    });
  }

  // Handle pictures data
  if (data.spiritPictures) {
    state.spiritPictures = _.merge([], state.spiritPictures, data.spiritPictures);
  }

  if (data.pieChartData) {
    state.chartData = _.merge({}, state.chartData, data.pieChartData);
  }

  if (data.windows) {
    state.windows = _.merge({}, state.windows, data.windows);
  }

}
