export const GenreEnum = {
  Pop: "Pop",
  Rock: "Rock",
  HipHop: "Hip-Hop",
  RnB: "R&B",
  Jazz: "Jazz",
  Classical: "Classical",
  Country: "Country",
  Reggae: "Reggae",
  Electronic: "Electronic",
  Blues: "Blues",
};

export const genreOptions = Object.values(GenreEnum).map((name) => ({ name }));

export const majorkeys = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export const minorkeys = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export const keys = [
  { name: "C", value: "C" },
  { name: "C#", value: "C#" },
  { name: "D", value: "D" },
  { name: "D#", value: "D#" },
  { name: "E", value: "E" },
  { name: "F", value: "F" },
  { name: "F#", value: "F#" },
  { name: "G", value: "G" },
  { name: "G#", value: "G#" },
  { name: "A", value: "A" },
  { name: "A#", value: "A#" },
  { name: "B", value: "B" },
];

export const keyOptions = Object.values(majorkeys).map((name) => ({ name }));
