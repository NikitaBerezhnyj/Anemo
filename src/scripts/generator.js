const VOWELS = ["a", "e", "i", "o", "u"];
const CONSONANTS = ["m", "v", "x", "z", "k", "n", "p", "b", "l", "r", "s", "t"];
const SUFFIXES = ["ax", "ox", "ix", "is", "um", "ia", "en", "as", "or", "on"];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildBase(targetLen, startChar = "") {
  let name = "";
  let wantConsonant = Math.random() > 0.5;

  if (startChar.length === 1) {
    name = startChar.toLowerCase();
    wantConsonant = !CONSONANTS.includes(name);
  }

  while (name.length < targetLen) {
    const next = wantConsonant ? pick(CONSONANTS) : pick(VOWELS);

    if (wantConsonant && name.length > 0 && name.slice(-1) === next) continue;
    name += next;
    wantConsonant = !wantConsonant;
  }

  return name.substring(0, targetLen);
}

function evolve(base, targetLen) {
  base = base.toLowerCase();
  let result = "";

  if (Math.random() < 0.4) {
    const cutBaseLen = Math.max(1, targetLen - 2);
    result = base.substring(0, cutBaseLen) + pick(SUFFIXES);
  } else {
    const cutBaseLen = Math.max(1, targetLen - 2);
    const root = base.substring(0, cutBaseLen);
    const endsVowel = VOWELS.includes(root.slice(-1));

    result =
      root + (endsVowel ? pick(CONSONANTS) : pick(VOWELS)) + pick(VOWELS);
  }

  if (result.length < targetLen) {
    result = buildBase(targetLen, result);
  } else if (result.length > targetLen) {
    result = result.substring(0, targetLen);
  }

  return result;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generateName({ unit, targetLength, seed }) {
  if (seed.length > 1) return capitalize(evolve(seed, targetLength));

  if (unit === "letters") {
    return capitalize(buildBase(targetLength, seed));
  }

  let word = "";
  let firstLetter = seed;
  for (let i = 0; i < targetLength; i++) {
    word += buildBase(2, firstLetter);
    firstLetter = "";
  }
  return capitalize(word);
}
