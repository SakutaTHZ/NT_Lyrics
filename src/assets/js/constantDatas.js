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
  { name: "C#", value: "C%23" },
  { name: "D", value: "D" },
  { name: "D#", value: "D%23" },
  { name: "E", value: "E" },
  { name: "F", value: "F" },
  { name: "F#", value: "F%23" },
  { name: "G", value: "G" },
  { name: "G#", value: "G%23" },
  { name: "A", value: "A" },
  { name: "A#", value: "A%23" },
  { name: "B", value: "B" },
];

export const keyOptions = Object.values(majorkeys).map((name) => ({ name }));
