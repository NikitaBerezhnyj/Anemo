import { state } from "./state.js";

const singleSlider = document.getElementById("single-slider");
const sliderMin = document.getElementById("slider-min");
const sliderMax = document.getElementById("slider-max");
const dualFill = document.getElementById("dual-fill");

const singleContainer = document.getElementById("single-slider-container");
const rangeContainer = document.getElementById("range-slider-container");

function updateSingleSlider() {
  const unitText = state.unit === "letters" ? "letters" : "syllables";
  document.getElementById("single-label").textContent = singleSlider.value;
  document.getElementById("single-unit-label").textContent = unitText;
  document.getElementById("single-min-label").textContent = singleSlider.min;
  document.getElementById("single-max-label").textContent = singleSlider.max;
  state.fixed = parseInt(singleSlider.value);
}

function updateDualFill() {
  const min = parseInt(sliderMin.min);
  const max = parseInt(sliderMin.max);
  const lo = parseInt(sliderMin.value);
  const hi = parseInt(sliderMax.value);

  const loP = ((lo - min) / (max - min)) * 100;
  const hiP = ((hi - min) / (max - min)) * 100;

  dualFill.style.left = loP + "%";
  dualFill.style.width = hiP - loP + "%";
}

function updateRangeSliders() {
  let lo = parseInt(sliderMin.value);
  let hi = parseInt(sliderMax.value);

  if (lo >= hi) {
    lo = hi - 1;
    sliderMin.value = lo;
  }

  const unitText = state.unit === "letters" ? "letters" : "syllables";
  document.getElementById("range-label-from").textContent = lo;
  document.getElementById("range-label-to").textContent = hi;
  document.getElementById("range-unit-label").textContent = unitText;
  document.getElementById("range-min-label").textContent = sliderMin.min;
  document.getElementById("range-max-label").textContent = sliderMin.max;

  state.rangeMin = lo;
  state.rangeMax = hi;

  updateDualFill();
}

export function refreshSliders() {
  const isLetters = state.unit === "letters";
  const min = isLetters ? 3 : 1;
  const max = isLetters ? 10 : 5;

  for (const el of [singleSlider, sliderMin, sliderMax]) {
    el.min = min;
    el.max = max;
  }
  singleSlider.value = isLetters ? 5 : 3;
  sliderMin.value = min;
  sliderMax.value = Math.min(max - 1, isLetters ? 7 : 4);

  updateSingleSlider();
  updateRangeSliders();
}

export function toggleLengthMode() {
  if (state.lengthType === "fixed") {
    singleContainer.classList.remove("hidden");
    rangeContainer.classList.add("hidden");
  } else {
    singleContainer.classList.add("hidden");
    rangeContainer.classList.remove("hidden");
  }
}

singleSlider.addEventListener("input", updateSingleSlider);
sliderMin.addEventListener("input", updateRangeSliders);
sliderMax.addEventListener("input", updateRangeSliders);

function copyText(text, btn) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      btn.classList.add("copied");
      btn.setAttribute("aria-label", "Скопійовано");
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.setAttribute("aria-label", "Копіювати");
      }, 1800);
    })
    .catch(() => {});
}

const COPY_ICON = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M2 10V2.5A.5.5 0 0 1 2.5 2H10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`;
const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2.5 7.5L5.5 10.5L11.5 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export function renderResults(words) {
  const container = document.getElementById("results-container");
  const emptyState = document.getElementById("empty-state");

  if (emptyState) emptyState.remove();
  container.innerHTML = "";

  words.forEach((word, i) => {
    const item = document.createElement("div");
    item.className = "name-item";

    const slug = word.toLowerCase();
    item.innerHTML = `
      <div class="name-left">
        <span class="name-text">${word}</span>
        <span class="name-index">variant ${String(i + 1).padStart(2, "0")}</span>
      </div>
      <div class="name-actions">
        <button class="copy-btn" aria-label="Copy">${COPY_ICON}</button>
        <div class="domain-links">
          <a class="domain-link" href="https://www.godaddy.com/domainsearch/find?domain=${slug}.com" target="_blank" rel="noopener">.com ↗</a>
          <a class="domain-link" href="https://namecheap.com/domains/registration/results/?domain=${slug}.io" target="_blank" rel="noopener">.io ↗</a>
        </div>
      </div>`;

    const copyBtn = item.querySelector(".copy-btn");
    copyBtn.addEventListener("click", () => {
      copyText(word, copyBtn);
      copyBtn.innerHTML = CHECK_ICON;
      setTimeout(() => {
        copyBtn.innerHTML = COPY_ICON;
      }, 1800);
    });

    container.appendChild(item);
  });
}
