export function transformSongsData(songs) {
    const uniqueArtists = new Map();
  
    songs.forEach(song => {
      const artist = song.artist.trim(); // Remove unwanted spaces
  
      if (!uniqueArtists.has(artist)) {
        uniqueArtists.set(artist, {
          id: uniqueArtists.size + 1, // Assign index-based ID
          photo_link: `images/${artist}/profile.jpg`, // Assuming a default profile image
          name: artist,
          search_count: Math.floor(Math.random() * 100), // Random number (0-99)
          type: "artist" // Modify if needed
        });
      }
    });
  
    return Array.from(uniqueArtists.values());
  }

export function generateMockSongs(songs, artists) {
    const majorKeys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const genres = ["Pop", "Rock", "Jazz", "Blues", "Hip-Hop", "Electronic", "Country", "Classical"];
    const albums = ["Timeless", "Eternal Echoes", "Golden Hits", "Rhythm & Soul", "Melodic Dreams"];
  
    return songs.map((song, index) => {
      const artistName = song.artist.trim();
  
      // 80% chance the writer is the main artist, 20% random artist
      const isArtistWriter = Math.random() < 0.8;
      const randomWriter = artists[Math.floor(Math.random() * artists.length)]?.name || "Unknown Writer";
      const writers = isArtistWriter ? [artistName] : [artistName, randomWriter];
  
      // 80% blank, 20% random artist for featuring
      const featuring = Math.random() < 0.8 ? [] : [artists[Math.floor(Math.random() * artists.length)]?.name || "Unknown Artist"];
  
      return {
        id: index + 1,
        lyric_link: `song-${index + 1}`,
        title: song.title,
        major_key: majorKeys[Math.floor(Math.random() * majorKeys.length)],
        view_count: Math.floor(Math.random() * 10000), // Random view count up to 9999
        album_name: albums[Math.floor(Math.random() * albums.length)],
        writer: writers,
        featuring: featuring,
        artist: [artistName],
        genre: [genres[Math.floor(Math.random() * genres.length)]]
      };
    });
  }