import { state, saveState } from "./state.js";

const singleSlider = document.getElementById("single-slider");
const sliderMin = document.getElementById("slider-min");
const sliderMax = document.getElementById("slider-max");
const dualFill = document.getElementById("dual-fill");
const singleContainer = document.getElementById("single-slider-container");
const rangeContainer = document.getElementById("range-slider-container");

function updateSingleSliderUI() {
  const unitText = state.unit === "letters" ? "letters" : "syllables";
  document.getElementById("single-label").textContent = singleSlider.value;
  document.getElementById("single-unit-label").textContent = unitText;
  document.getElementById("single-min-label").textContent = singleSlider.min;
  document.getElementById("single-max-label").textContent = singleSlider.max;
}

function updateDualFill() {
  const min = parseInt(sliderMin.min) || 1;
  const max = parseInt(sliderMin.max) || 10;
  const lo = parseInt(sliderMin.value);
  const hi = parseInt(sliderMax.value);

  const loP = ((lo - min) / (max - min)) * 100;
  const hiP = ((hi - min) / (max - min)) * 100;

  dualFill.style.left = loP + "%";
  dualFill.style.width = hiP - loP + "%";
}

function updateRangeSlidersUI() {
  const unitText = state.unit === "letters" ? "letters" : "syllables";
  document.getElementById("range-label-from").textContent = sliderMin.value;
  document.getElementById("range-label-to").textContent = sliderMax.value;
  document.getElementById("range-unit-label").textContent = unitText;
  document.getElementById("range-min-label").textContent = sliderMin.min;
  document.getElementById("range-max-label").textContent = sliderMax.max;
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

  if (state.fixed > max) state.fixed = max;
  if (state.fixed < min) state.fixed = min;

  if (state.rangeMax > max) state.rangeMax = max;
  if (state.rangeMin < min) state.rangeMin = min;
  if (state.rangeMin >= state.rangeMax) state.rangeMin = state.rangeMax - 1;

  singleSlider.value = state.fixed;
  sliderMin.value = state.rangeMin;
  sliderMax.value = state.rangeMax;

  updateSingleSliderUI();
  updateRangeSlidersUI();
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

singleSlider.addEventListener("input", () => {
  state.fixed = parseInt(singleSlider.value);
  updateSingleSliderUI();
  saveState();
});

sliderMin.addEventListener("input", () => {
  let lo = parseInt(sliderMin.value);
  let hi = parseInt(sliderMax.value);

  if (lo >= hi) {
    lo = hi - 1;
    sliderMin.value = lo;
  }

  state.rangeMin = lo;
  updateRangeSlidersUI();
  saveState();
});

sliderMax.addEventListener("input", () => {
  let lo = parseInt(sliderMin.value);
  let hi = parseInt(sliderMax.value);

  if (hi <= lo) {
    hi = lo + 1;
    sliderMax.value = hi;
  }

  state.rangeMax = hi;
  updateRangeSlidersUI();
  saveState();
});

function copyText(text, btn) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      btn.classList.add("copied");
      btn.setAttribute("aria-label", "Збережено");
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
    const domainLinksHtml = `
      <a class="domain-link" href="https://www.namecheap.com/domains/registration/results/?domain=${slug}.${state.domain}" target="_blank" rel="noopener">
        .${state.domain} ↗
      </a>`;

    item.innerHTML = `
      <div class="name-left">
        <span class="name-text">${word}</span>
        <span class="name-index">variant ${String(i + 1).padStart(2, "0")}</span>
      </div>
      <div class="name-actions">
        <button class="copy-btn" aria-label="Копіювати">${COPY_ICON}</button>
        <div class="domain-links">${domainLinksHtml}</div>
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

export function initDomainSection() {
  const PRESETS = ["com", "io", "co", "app", "dev", "ai", "xyz", "me"];
  const chipsContainer = document.getElementById("domain-chips");
  const customInput = document.getElementById("domain-custom-input");

  function setDomain(val) {
    state.domain = val;
    saveState();
    renderChips();
    customInput.value = PRESETS.includes(val) ? "" : val;
  }

  function renderChips() {
    chipsContainer.innerHTML = "";
    PRESETS.forEach((tld) => {
      const chip = document.createElement("button");
      chip.className = "domain-chip" + (state.domain === tld ? " active" : "");
      chip.textContent = "." + tld;
      chip.addEventListener("click", () => setDomain(tld));
      chipsContainer.appendChild(chip);
    });
  }

  customInput.addEventListener("input", () => {
    const val = customInput.value.trim().toLowerCase().replace(/^\./, "");
    if (val) setDomain(val);
  });

  renderChips();
}
