// chordLoader.js
const chordImages = import.meta.glob("/src/assets/images/Chord Picture/*/*.png", { eager: true });

export function getChordData() {
  const chordMap = {};

  for (const path in chordImages) {
    // path looks like: "/src/assets/images/Chord Picture/01 - C/01 - C-1.png"
    const parts = path.split("/");
    const folderName = parts[parts.length - 2]; // e.g. "01 - C"
    const fileName = parts[parts.length - 1];   // e.g. "01 - C-1.png"

    // strip "01 - " prefix
    const chordName = folderName.replace(/^\d+\s*-\s*/, ""); // "C"
    const chordVariant = fileName.replace(/^\d+\s*-\s*/, "").replace(".png", ""); // "C-1"

    if (!chordMap[chordName]) {
      chordMap[chordName] = [];
    }

    chordMap[chordName].push({ name: chordVariant, src: chordImages[path].default || chordImages[path] });
  }

  return chordMap;
}
