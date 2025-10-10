// utils/transpose.js

// The 12 half-steps in music, ordered. Used to shift notes.
const NOTES = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
];

// Map of flat notes to their sharp equivalents for standardization.
const FLAT_TO_SHARP_MAP = {
  "Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#", "Bb": "A#",
  "db": "c#", "eb": "d#", "gb": "f#", "ab": "g#", "bb": "a#"
};

/**
 * Transposes a single chord string by a given number of half-steps.
 * @param {string} chord - The chord string (e.g., 'Am7', 'G#sus4', 'D').
 * @param {number} semitones - The number of half-steps to transpose (+ for up, - for down).
 * @returns {string} The transposed chord.
 */
export const transposeChord = (chord, semitones) => {
  if (!chord) return "";

  // 1. Separate the root note from the rest of the chord suffix.
  const match = chord.match(/^([A-G][#b]?)(.*)$/i);
  if (!match) return chord; // Return the original if it doesn't look like a valid chord root

  let root = match[1]; // e.g., 'Am' -> 'A'
  const suffix = match[2]; // e.g., 'Am7' -> 'm7'

  // 2. Standardize the root note to use sharps for transposition.
  let sharpRoot = root[0].toUpperCase() + root.slice(1).toLowerCase();
  sharpRoot = FLAT_TO_SHARP_MAP[sharpRoot] || sharpRoot;
  
  // 3. Find the index in the NOTES array.
  const rootIndex = NOTES.indexOf(sharpRoot);
  if (rootIndex === -1) return chord; // Should not happen with a valid root

  // 4. Calculate the new index.
  const newIndex = (rootIndex + semitones) % NOTES.length;
  // Ensure the index is positive (JS modulo can return negative results).
  const normalizedNewIndex = (newIndex < 0 ? newIndex + NOTES.length : newIndex);

  // 5. Get the new root note.
  const newRoot = NOTES[normalizedNewIndex];

  // 6. Reconstruct the chord.
  // The first character of the suffix (e.g., 'm' in 'm7') must retain its case.
  const formattedSuffix = suffix[0] ? suffix[0] + suffix.slice(1).toLowerCase() : suffix;

  return newRoot + formattedSuffix;
};

/**
 * Transposes a list of chords by a given number of half-steps.
 * @param {string[]} chords - Array of chord strings.
 * @param {number} semitones - The number of half-steps to transpose.
 * @returns {string[]} The array of transposed chords.
 */
export const transposeChords = (chords, semitones) => {
  return chords.map(chord => transposeChord(chord, semitones));
};