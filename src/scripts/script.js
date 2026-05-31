import { state, resolveLength } from "./state.js";
import { generateName } from "./generator.js";
import { refreshSliders, toggleLengthMode, renderResults } from "./ui.js";

const COUNT = 5;
const MAX_LEN = 12;

const sidebar = document.querySelector(".sidebar");
const backdrop = document.getElementById("drawer-backdrop");
const settingsBtn = document.getElementById("settings-toggle");

function openDrawer() {
  sidebar.classList.add("open");
  backdrop.classList.add("visible");
  settingsBtn?.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  sidebar.classList.remove("open");
  backdrop.classList.remove("visible");
  settingsBtn?.classList.remove("active");
  document.body.style.overflow = "";
}

settingsBtn?.addEventListener("click", () => {
  sidebar.classList.contains("open") ? closeDrawer() : openDrawer();
});

backdrop?.addEventListener("click", closeDrawer);

let touchStartY = 0;
sidebar?.addEventListener(
  "touchstart",
  (e) => {
    touchStartY = e.touches[0].clientY;
  },
  { passive: true },
);
sidebar?.addEventListener(
  "touchend",
  (e) => {
    if (e.changedTouches[0].clientY - touchStartY > 60) closeDrawer();
  },
  { passive: true },
);

document.querySelectorAll(".pill[data-unit]").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.unit = btn.dataset.unit;
    document
      .querySelectorAll(".pill[data-unit]")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    refreshSliders();
  });
});

document.querySelectorAll(".pill[data-type]").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.lengthType = btn.dataset.type;
    document
      .querySelectorAll(".pill[data-type]")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    toggleLengthMode();
  });
});

function doGenerate() {
  const seed = document.getElementById("start-letter").value.trim();
  const words = [];

  for (let i = 0; i < COUNT; i++) {
    let word = generateName({
      unit: state.unit,
      targetLength: resolveLength(),
      seed,
    });
    if (word.length > MAX_LEN) word = word.substring(0, MAX_LEN);
    words.push(word);
  }

  renderResults(words);
  closeDrawer();
}

document.getElementById("generate-btn").addEventListener("click", doGenerate);
document
  .getElementById("bottom-generate-btn")
  ?.addEventListener("click", doGenerate);

document.getElementById("start-letter").addEventListener("keydown", (e) => {
  if (e.key === "Enter") doGenerate();
});

refreshSliders();
