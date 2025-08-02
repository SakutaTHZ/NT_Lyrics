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
  None: "None",
  Other: "Other",
  RocknRoll: "Rock N Roll"
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

const keyList = [
  "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#",
  "Ab", "Bb", "Db", "Eb", "Gb", "Am", "Bm", "Cm", "Dm", "Em", "Fm",
  "Gm", "Abm", "Bbm", "Dbm", "Ebm", "Gbm", "None"
];

export const keyOptions = keyList.map(key => ({
  name: key,
  value: key.replace(/#/g, '%23')
}));

// export const keyOptions = Object.values(keys).map((name) => ({ name }));
