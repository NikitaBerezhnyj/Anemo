export const state = {
  unit: "letters", // 'letters' | 'syllables'
  lengthType: "fixed", // 'fixed' | 'range'
  fixed: 5,
  rangeMin: 4,
  rangeMax: 7,
};

export function resolveLength(s = state) {
  if (s.lengthType === "fixed") return s.fixed;
  return Math.floor(Math.random() * (s.rangeMax - s.rangeMin + 1)) + s.rangeMin;
}
