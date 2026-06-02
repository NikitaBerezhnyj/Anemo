const STORAGE_KEY = "generator-state";

export const state = {
  unit: "letters", // 'letters' | 'syllables'
  lengthType: "fixed", // 'fixed' | 'range'
  fixed: 5,
  rangeMin: 4,
  rangeMax: 7,
  domain: "com",
};

export function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    Object.assign(state, JSON.parse(saved));
  } catch (error) {
    console.error("Failed to load state:", error);
  }
}

export function resolveLength(s = state) {
  if (s.lengthType === "fixed") return s.fixed;
  return Math.floor(Math.random() * (s.rangeMax - s.rangeMin + 1)) + s.rangeMin;
}
